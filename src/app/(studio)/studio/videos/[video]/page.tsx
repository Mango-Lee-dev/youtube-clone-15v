import { VideoView } from "@/modules/studio/ui/view/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface VideoPageProps {
  params: Promise<{ video: string }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { video } = await params;
  void trpc.studio.getOne.prefetch({ id: video });
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <VideoView videoId={video} />
    </HydrateClient>
  );
}
