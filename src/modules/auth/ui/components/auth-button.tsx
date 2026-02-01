"use client";
import { UserButton, SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon, UserIcon } from "lucide-react";

export const AuthButton = () => {
  //  TODO: add different button for logged in and logged out users

  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="My Profile"
              href="/users/current"
              labelIcon={<UserIcon className="size-4" />}
            />
            <UserButton.Link
              label="Studio"
              href="/studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
        {/* Add Menu for logged in users */}
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
          >
            <UserCircleIcon className="size-4" />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
