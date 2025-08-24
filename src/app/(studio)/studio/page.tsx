export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import { StudioViews } from "@/modules/studio/ui/view/studio-views";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async () => {
  await trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <StudioViews />
    </HydrateClient>
  );
};

export default Page;
