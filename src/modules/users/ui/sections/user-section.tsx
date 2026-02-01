import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserPageBanner } from "../components/user-page-banner";

interface UserSectionSuspenseProps {
  userId: string;
}

export const UserSection = ({ userId }: UserSectionSuspenseProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <UserSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  )
};



const UserSectionSuspense = ({ userId }: UserSectionSuspenseProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });
  return (
    <div className="flex flex-col">
      <UserPageBanner user={user} />
      
    </div>
  )
};