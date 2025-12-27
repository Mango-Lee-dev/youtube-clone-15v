import { PlaylistView } from "@/modules/playlists/ui/views/playlist-view";
import { HydrateClient } from "@/trpc/server";

const Page = () => {
  return (
    <HydrateClient>
      <PlaylistView />
    </HydrateClient>
  );
};

export default Page;
