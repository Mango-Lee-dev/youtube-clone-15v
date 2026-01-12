import { z } from "zod";
import { and, desc, eq, getTableColumns, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  playlists,
  playlistVideos,
  users,
  videoReactions,
  videos,
  videoViews,
} from "@/db/schema";
import { TRPCError } from "@trpc/server";

export const playlistRouter = createTRPCRouter({
  getManyForVideo: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit, videoId } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select({
          ...getTableColumns(playlists),
          playlistVideoCount: db.$count(
            playlistVideos,
            eq(playlistVideos.playlistId, playlists.id)
          ),
          user: users,
          containsVideo: videoId
            ? sql<boolean>`(
            SELECT EXISTS (
            SELECT 1 FROM ${playlistVideos} pv WHERE pv.playlist_id = ${playlists.id} AND pv.video_id = ${videoId}
            )
          )`
            : sql<boolean>`false`,
        })
        .from(playlists)
        .innerJoin(users, eq(playlists.userId, users.id))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      const { id: userId } = ctx.user;

      const [createdPlaylist] = await db
        .insert(playlists)
        .values({ name, userId })
        .returning();
      if (!createdPlaylist) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return createdPlaylist;
    }),
  getHistory: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
            viewedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const viewerVideoViews = db.$with("viewer_video_views").as(
        db
          .select({
            videoId: videoViews.videoId,
            viewedAt: videoViews.updatedAt,
          })
          .from(videoViews)
          .where(eq(videoViews.userId, userId))
      );

      const data = await db
        .with(viewerVideoViews)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewedAt: viewerVideoViews.viewedAt,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(viewerVideoViews, eq(viewerVideoViews.videoId, videos.id))
        .where(
          and(
            eq(videos.visibility, "public"),
            userId ? eq(videos.userId, userId) : undefined,
            cursor
              ? or(
                  lt(viewerVideoViews.viewedAt, cursor.viewedAt),
                  and(
                    eq(viewerVideoViews.viewedAt, cursor.viewedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewerVideoViews.viewedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
            viewedAt: lastItem.viewedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select({
          ...getTableColumns(playlists),
          playlistVideoCount: db.$count(
            playlistVideos,
            eq(playlistVideos.playlistId, playlists.id)
          ),
          user: users,
        })
        .from(playlists)
        .innerJoin(users, eq(playlists.userId, users.id))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),

  getLiked: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            likedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const viewerVideoReactions = db.$with("viewer_video_reactions").as(
        db
          .select({
            videoId: videoReactions.videoId,
            likedAt: videoReactions.createdAt,
          })
          .from(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "like")
            )
          )
      );

      const data = await db
        .with(viewerVideoReactions)
        .select({
          ...getTableColumns(videos),
          user: users,
          likedAt: viewerVideoReactions.likedAt,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(
          viewerVideoReactions,
          eq(viewerVideoReactions.videoId, videos.id)
        )
        .where(
          and(
            eq(videos.visibility, "public"),
            userId ? eq(videos.userId, userId) : undefined,
            cursor
              ? or(
                  lt(viewerVideoReactions.likedAt, cursor.likedAt),
                  and(
                    eq(viewerVideoReactions.likedAt, cursor.likedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewerVideoReactions.likedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
            likedAt: lastItem.likedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
