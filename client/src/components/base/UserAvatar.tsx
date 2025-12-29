import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useSession } from "next-auth/react";

export default function UserAvatar() {
  const { data: session } = useSession();
  
  const getInitials = () => {
    if (!session?.user?.name) return "User";
    return session.user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar>
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
}