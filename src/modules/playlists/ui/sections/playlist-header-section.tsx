"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

export const PlaylistHeaderSection = ({ playlistId }: PlaylistHeaderSectionProps) => {
  return (
    <Suspense>
      <ErrorBoundary fallback={<PlaylistHeaderSectionSkeleton />}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-5 w-[90%]" />
      <Skeleton className="h-5 w-[70%]" />
      <Skeleton className="h-5 w-[50%]" />
    </div>
  )
}

const PlaylistHeaderSectionSuspense = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });
  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist deleted successfully");
      utils.playlists.getOne.invalidate({ id: playlistId });
      router.push("/playlists");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="flex justify-between items-center">
      <div>
      <h1 className="text-2xl font-bold">{playlist.name}</h1>
      <p className="text-xs text-muted-foreground">
        {playlist.description}
      </p>

      </div>
      <Button variant="outline" size="icon" className="rounded-full" onClick={() => remove.mutate({ id: playlistId })} disabled={remove.isPending}>
        <Trash2Icon />
      </Button>
    </div>
  );
};