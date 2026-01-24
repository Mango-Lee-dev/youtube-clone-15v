import { VideoView } from "@/modules/studio/ui/view/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface VideoPageProps {
  params: Promise<{ video: string }>;
}

export const dynamic = "force-dynamic";

export default async function VideoPage({ params }: VideoPageProps) {
  const { video } = await params;
  await trpc.studio.getOne.prefetch({ id: video });
  await trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <VideoView videoId={video} />
    </HydrateClient>
  );
}
