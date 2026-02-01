import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
    <div>
      {JSON.stringify(user)}
    </div>
  )
};