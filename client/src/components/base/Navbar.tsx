'use client';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from './UserAvatar';
import LogoutModal from '../auth/LogoutModal';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  // Show loading state
  if (status === 'loading') {
    return (
      <nav className="flex justify-between items-center h-14 px-4 w-screen border-b border-gray-200 relative left-1/2 right-1/2 -ml-screen">
        <h1 className="text-3xl font-extrabold bg-linear-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          Clash
        </h1>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
        </div>
      </nav>
    );
  }

  return (
    <>
      <LogoutModal open={open} setOpen={setOpen} />
      <nav className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex justify-between items-center h-16 px-4 border-b border-gray-200 bg-white top-0 z-40">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <h1 className="text-3xl font-extrabold bg-linear-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Clash
          </h1>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {session?.user ? (
            <>
              {/* Dashboard Button - only show for logged in users */}
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none hover:opacity-80 transition-opacity">
                    <UserAvatar />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-semibold">{session.user.name}</span>
                    <span className="text-xs text-gray-500">
                      {session.user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Login/Register Buttons - only show for non-authenticated users */}
              <Link href="/login" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}