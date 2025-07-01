import { trpc } from "@/trpc/server";

export default async function Home() {
  const data = await trpc.hello({ text: "lee" });
  return <div>{data.greeting}</div>;
}
