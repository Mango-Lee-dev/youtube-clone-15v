"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/trpc/routers/_app";

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("비디오가 생성되었습니다.");
      utils.studio.getMany.invalidate();
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message);
    },
  });
  return (
    <>
      <ResponsiveModal
        open={!!create.data}
        onOpenChange={() => create.reset()}
        title="Upload Video"
      >
        <p>Uploader</p>
        {create.data?.url ? (
          <StudioUploader
            endpoint={create.data.url}
            onSuccess={() => create.reset()}
          />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};
