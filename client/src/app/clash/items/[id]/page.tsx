import {
  authOptions,
  CustomSession,
} from '@/app/api/auth/[...nextauth]/options';
import { fetchClash } from '@/app/fetch/clashFetch';

import AddClashItems from '@/components/clash/AddClashItems';
import ViewClashItems from '@/components/clash/ViewClashItems';
import { getServerSession } from 'next-auth';
import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

export default async function clashItems({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session: CustomSession | null = await getServerSession(authOptions);

  const clashId = parseInt(id);
  const clash: ClashType | null = await fetchClash(clashId);

  if (!clash) {
    return (
      <div className="container">
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Clash not found</h1>
          <p className="mt-2">The clash you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const clashItems = clash.ClashItem || [];
  const clashComments = clash.ClashComments || [];
  const hasImage = !!clash.image;

  
  return (
    <div className="container">
      {/* Clash Header with Image */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Clash Image */}
          <div className="md:w-1/3">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
              {hasImage ? (
                <Image
                  src={getImageUrl(clash.image!)}
                  alt={clash.title}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Clash Info */}
          <div className="md:w-2/3">
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4">
              {clash.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{clash.description || 'No description'}</p>
            
            {/* Clash Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {new Date(clash.created_at).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Expires</p>
                <p className="font-medium">
                  {new Date(clash.expire_at).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            
            {/* Clash Items Count */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${clashItems.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <p className="font-medium">
                  {clashItems.length} {clashItems.length === 1 ? 'item' : 'items'} added
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Add or View Items */}
      <div className="mt-12">
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Clash Items</h2>
          
          {clashItems.length > 0 ? (
            <ViewClashItems clash={clash} />
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                No items added yet
              </h3>
              <p className="text-blue-700 mb-4">
                Add at least 2 images to start your clash!
              </p>
              <AddClashItems token={session?.user?.token!} clashId={id} />
            </div>
          )}
          
          {/* Comments Section */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            {clashComments.length > 0 ? (
              <div className="space-y-4">
                {clashComments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{comment.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
