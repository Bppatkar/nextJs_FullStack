'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import ClashMenuBar from './ClashMenuBar';
import Image from 'next/image';

export default function ClashCard({
  clash,
  token,
}: {
  clash: ClashType;
  token: string;
}) {
  const [imageError, setImageError] = useState(false);
  // const [imageUrl, setImageUrl] = useState('');

  // useEffect(() => {
  //   if (clash.image) {
  //     const url = getImageUrl(clash.image);
  //     setImageUrl(url);
  //     console.log('Generated image URL:', url);
  //   }
  // }, [clash.image]);

  const imageUrl = clash.image ? getImageUrl(clash.image) : '';

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="flex justify-between items-center flex-row pb-3">
        <CardTitle className="truncate flex-1">{clash.title}</CardTitle>
        <div className="flex-shrink-0">
          <ClashMenuBar clash={clash} token={token} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-3">
        {imageUrl && !imageError ? (
          <div className="relative w-full h-[220px] rounded-md overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={clash.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              unoptimized={true}
              loading="eager"
              onError={() => setImageError(true)}
              onLoad={() => console.log('Image loaded successfully:', imageUrl)}
            />
          </div>
        ) : (
          <div className="w-full h-[220px] flex items-center justify-center bg-gray-200 rounded-md">
            <span className="text-gray-500 text-sm">Image unavailable</span>
          </div>
        )}

        <p className="text-sm text-gray-700 line-clamp-2 flex-grow">
          {clash.description || 'No description'}
        </p>

        {/* Expiry */}
        <p className="text-xs text-gray-600">
          <strong>Expires:</strong>{' '}
          {clash.expire_at
            ? new Date(clash.expire_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'N/A'}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/clash/items/${clash.id}`} className="w-full">
          <Button className="w-full">View Items</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
