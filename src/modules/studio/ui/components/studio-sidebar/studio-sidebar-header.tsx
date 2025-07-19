import {
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();
  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-[100px] h-4 mt-1" />
        </div>
      </SidebarHeader>
    );
  }

  if (state === "collapsed") {
    return (
      <SidebarHeader className="flex items-center justify-center">
        <SidebarMenuButton tooltip="Your Profile" asChild>
          <Link href="/users/current">
            <UserAvatar
              imageUrl={user?.imageUrl ?? ""}
              name={user?.fullName ?? "User"}
              size="xs"
            />
            <span className="text-sm">Your Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
    );
  }
  return (
    <SidebarHeader className="flex items-center justify-center">
      <Link href="/users/current">
        <UserAvatar
          imageUrl={user?.imageUrl ?? ""}
          name={user?.fullName ?? "User"}
          size="lg"
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-1">
        <p className="text-sm font-medium">Your Profile</p>
        <p className="text-xs text-muted-foreground">{user?.fullName}</p>
      </div>
    </SidebarHeader>
  );
};
