// import {
//   authOptions,
//   CustomSession,
// } from '@/app/api/auth/[...nextauth]/options';
// import { fetchClash } from '@/app/fetch/clashFetch';
// import Navbar from '@/components/base/Navbar';
// import { getServerSession } from 'next-auth';

// export default async function clashItems({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   const session: CustomSession | null = await getServerSession(authOptions);
//   const clash: ClashType | null = await fetchClash(parseInt(id));
  
//   if (!clash) {
//     return (
//       <div className="container text-center py-10">
//         <h1 className="text-2xl font-bold text-red-600">Clash not found</h1>
//       </div>
//     );
//   }

//   console.log('Fetched clash:', clash);
//   return (
//     <div className="container">
//       {session && <Navbar />}
//       {clash ? (
//         <div>
//           <h1 className="text-2xl font-bold mb-4">{clash.title}</h1>
//           <p>{clash.description}</p>
//           {/* Display clash items here */}
//         </div>
//       ) : (
//         <p>Clash not found</p>
//       )}
//     </div>
//   );
// }


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
import Navbar from '@/components/base/Navbar';

export default async function clashDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session: CustomSession | null = await getServerSession(authOptions);

  const clashId = parseInt(id);
  if (isNaN(clashId)) {
    return (
      <div className="container py-10">
        <Navbar show={!!session?.user} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid clash ID</h1>
        </div>
      </div>
    );
  }

  const clash: ClashType | null = await fetchClash(clashId);

  if (!clash) {
    return (
      <div className="container py-10">
        <Navbar show={!!session?.user} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Clash not found</h1>
          <p className="mt-2 text-gray-600">
            The clash you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const clashItems = clash.ClashItem || [];
  const clashComments = clash.ClashComments || [];
  const imageUrl = clash.image ? getImageUrl(clash.image) : '';
  const isOwner = session?.user?.id?.toString() === clash.user_id?.toString();

  return (
    <div className="container mx-auto px-4">
      <Navbar show={!!session?.user} />
      
      {/* Clash Header with Image */}
      <div className="mt-8 mb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Clash Image */}
          <div className="lg:w-1/3">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100 shadow-md">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={clash.title}
                  fill
                  className="object-cover"
                  unoptimized={true}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:w-2/3">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              {clash.title}
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              {clash.description || 'No description provided'}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 font-medium">Created</p>
                <p className="font-semibold text-lg mt-1">
                  {new Date(clash.created_at).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                <p className="text-sm text-gray-600 font-medium">Expires</p>
                <p className="font-semibold text-lg mt-1">
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

            {/* Items Count Status */}
            <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
              <div
                className={`w-4 h-4 rounded-full ${
                  clashItems.length >= 2 ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
              <p className="font-medium">
                {clashItems.length} {clashItems.length === 1 ? 'item' : 'items'}{' '}
                added
                {clashItems.length < 2 && ' (needs at least 2 to vote)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clash Items / Voting Section */}
      <div className="border-t pt-12 mb-12">
        <h2 className="text-3xl font-bold mb-8">Battle Arena</h2>

        {clashItems.length >= 2 ? (
          <ViewClashItems clash={clash} />
        ) : (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">
              ⚠️ Not ready for voting yet
            </h3>
            <p className="text-blue-800 mb-6">
              This clash needs at least 2 items to start voting. Currently:
              <span className="font-bold ml-1">{clashItems.length}/2</span>
            </p>

            {isOwner && session?.user?.token && (
              <AddClashItems token={session.user.token} clashId={id} />
            )}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="border-t pt-12 pb-12">
        <h3 className="text-2xl font-bold mb-6">Community Feedback</h3>
        {clashComments && clashComments.length > 0 ? (
          <div className="space-y-4">
            {clashComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow"
              >
                <p className="text-gray-800 mb-3">{comment.comment}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No comments yet. Be the first to share your thoughts! 💬
          </p>
        )}
      </div>
    </div>
  );
}