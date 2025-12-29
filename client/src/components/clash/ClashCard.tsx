// components/clash/ClashCard.tsx
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
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (clash.image) {
      const url = getImageUrl(clash.image);
      setImageUrl(url);
      console.log('Generated image URL:', url);
    }
  }, [clash.image]);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-row">
        <CardTitle>{clash.title}</CardTitle>
        <ClashMenuBar clash={clash} token={token} />
      </CardHeader>
      <CardContent className="h-[300px]">
        {imageUrl && !imageError && (
          <div className="relative w-full h-[220px]">
            <Image
              src={imageUrl}
              alt={clash.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md object-contain"
              loading="eager"
              unoptimized={true}
              onError={() => {
                console.error('Image failed to load:', imageUrl);
                setImageError(true);
              }}
              onLoad={() => console.log('Image loaded successfully:', imageUrl)}
            />
          </div>
        )}
        {imageError && (
          <div className="w-full h-[220px] flex items-center justify-center bg-gray-100 rounded-md">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
        <p className="mt-4">{clash?.description}</p>
        <p className="mt-2">
          <strong>Expire At:</strong>{' '}
          {new Date(clash?.expire_at!).toDateString()}
        </p>
      </CardContent>
      <CardFooter className="space-x-4">
        <Link href={`/clash/items/${clash.id}`}>
          <Button>Items</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
