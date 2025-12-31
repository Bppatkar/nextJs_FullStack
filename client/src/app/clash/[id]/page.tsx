import {
  authOptions,
  CustomSession,
} from '@/app/api/auth/[...nextauth]/options';
import { fetchClash } from '@/app/fetch/clashFetch';
import Navbar from '@/components/base/Navbar';
import { getServerSession } from 'next-auth';

export default async function clashItems({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session: CustomSession | null = await getServerSession(authOptions);
  const clash: ClashType | null = await fetchClash(parseInt(id));
  
  if (!clash) {
    return (
      <div className="container text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">Clash not found</h1>
      </div>
    );
  }

  console.log('Fetched clash:', clash);
  return (
    <div className="container">
      {session && <Navbar />}
      {clash ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{clash.title}</h1>
          <p>{clash.description}</p>
          {/* Display clash items here */}
        </div>
      ) : (
        <p>Clash not found</p>
      )}
    </div>
  );
}
