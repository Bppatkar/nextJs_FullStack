import { authOptions, CustomSession } from '../api/auth/[...nextauth]/options';
import React from 'react';
import { fetchClashs } from '../fetch/clashFetch';
import ClashCard from '@/components/clash/ClashCard';
import AddClash from '@/components/clash/AddClash';
import { getServerSession } from 'next-auth';

export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);
  let clashes: Array<ClashType> | [] = [];

  try {
    if (session?.user?.token) {
      clashes = await fetchClashs(session.user.token);
    }
  } catch (error) {
    console.error('Error fetching clashes:', error);
    clashes = [];
  }

  console.log('Dashboard clashes:', clashes);

  return (
    <div className="container">
      <div className="text-end mt-4">
        <AddClash user={session?.user!} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clashes.length > 0 ? (
          clashes.map((item, index) => (
            <ClashCard clash={item} key={index} token={session?.user?.token!} />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500">
              No clashes found. Create your first clash!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
