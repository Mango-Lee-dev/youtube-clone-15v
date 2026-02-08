"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user-avatar";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SubscriptionsSection = () => {
  const pathname = usePathname();
  const { data } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data?.pages
            .flatMap((page) => page.items)
            .map((subscriptions) => (
              <SidebarMenuItem
                key={`${subscriptions.creatorId}-${subscriptions.viewerId}`}
              >
                <SidebarMenuButton
                  tooltip={subscriptions.user.name}
                  asChild
                  isActive={pathname === `/users/${subscriptions.creatorId}`}
                >
                  <Link
                    href={`/users/${subscriptions.creatorId}`}
                    className="flex items-center gap-4"
                  >
                    <UserAvatar
                      imageUrl={subscriptions.user.imageUrl}
                      name={subscriptions.user.name}
                    />
                    <span className="text-sm">{subscriptions.user.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
