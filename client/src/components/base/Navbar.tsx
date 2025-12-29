// components/base/Navbar.tsx - Alternative with better hydration handling
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

interface NavbarProps {
  show?: boolean;
}

export default function Navbar({ show = true }: NavbarProps) {
  if (!show) return null;

  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  // Show loading state
  if (status === 'loading') {
    return (
      <nav className="flex justify-between items-center h-14 p-2 w-full">
        <h1 className="text-4xl font-extrabold bg-linear-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
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
      <nav className="flex justify-between items-center h-14 p-2 w-full">
        <Link href="/">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
            Clash
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user && (
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          )}

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserAvatar />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}