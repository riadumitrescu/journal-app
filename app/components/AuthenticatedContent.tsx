'use client';

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface AuthenticatedContentProps {
  className?: string;
}

export default function AuthenticatedContent({ className }: AuthenticatedContentProps) {
  const { isSignedIn } = useAuth();

  return (
    <div className={className}>
      {isSignedIn ? (
        <Link href="/journal">
          <button className="bg-[#2C1D0E] text-[#F5F0E5] px-12 py-4 rounded-lg hover:bg-[#4A3F35] transition-colors font-medium text-lg border border-[#2C1D0E]/10 shadow-lg hover:shadow-xl">
            Go to My Journal
          </button>
        </Link>
      ) : (
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="bg-[#F5F0E5] text-[#2C1D0E] border-2 border-[#2C1D0E]/20 px-8 py-3 rounded-lg hover:bg-[#E6D5C1] transition-colors font-medium">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-[#2C1D0E] text-[#F5F0E5] px-8 py-3 rounded-lg hover:bg-[#4A3F35] transition-colors font-medium border border-[#2C1D0E]/10">
              Start Journaling
            </button>
          </SignUpButton>
        </div>
      )}
    </div>
  );
} 