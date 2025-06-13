'use client';

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Book } from "@phosphor-icons/react";

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed w-full z-50 bg-[#F5F0E5] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-[#2C1D0E]" weight="duotone" />
            <Link href={isSignedIn ? "/journal" : "/"} className="text-[#2C1D0E] text-xl font-serif">
              Your Inner Library
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {isSignedIn && (
            <Link 
              href="/journal" 
                className="text-[#2C1D0E] hover:text-[#4A3F35] transition-colors flex items-center gap-2"
            >
              My Journal
            </Link>
            )}
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
} 