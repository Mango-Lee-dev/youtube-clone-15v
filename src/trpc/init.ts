import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { ratelimit } from "@/lib/ratelimit";

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  console.log("[TRPC CONTEXT] userId:", userId); // 로그 추가

  return { clerkUserId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;

  console.log("[TRPC PROTECTED] clerkUserId:", ctx.clerkUserId); // 로그 추가

  if (!ctx.clerkUserId) {
    console.log("[TRPC PROTECTED] UNAUTHORIZED: No clerkUserId");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.clerkUserId))
    .limit(1);

  console.log("[TRPC PROTECTED] user from DB:", user); // 로그 추가

  if (!user) {
    console.log("[TRPC PROTECTED] UNAUTHORIZED: No user in DB");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { success } = await ratelimit.limit(user.id);

  console.log("[TRPC PROTECTED] ratelimit success:", success); // 로그 추가

  if (!success) {
    console.log("[TRPC PROTECTED] TOO_MANY_REQUESTS");
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
