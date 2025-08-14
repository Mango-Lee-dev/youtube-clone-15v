"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/trpc/client";
import { MoreVertical, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { z } from "zod";
import { videoFormSchema } from "@/db/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const form = useForm<z.infer<typeof videoFormSchema>>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: video.title,
      description: video.description || "",
      visibility: video.visibility,
    },
  });

  const onSubmit = (data: z.infer<typeof videoFormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Video Details</h1>
            <p className="text-xs text-muted-foreground">
              Manage your video details
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button type="submit" variant="default">
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="left">
                <DropdownMenuItem>
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-8 lg:col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title
                    {/** TODO: AI generate button */}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Add a title for your video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
