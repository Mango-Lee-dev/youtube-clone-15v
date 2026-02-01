"use client";

import { UserSection } from "../sections/user-section";

export const UserView = ({ userId }: { userId: string }) => {
  return (
    <div className="flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10 gap-y-6">
      <UserSection userId={userId} />
    </div>
  );
};