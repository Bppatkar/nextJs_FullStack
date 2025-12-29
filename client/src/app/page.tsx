import HeroSection from '@/components/base/HeroSection';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/options';

async function page() {
  console.log('=== PAGE SERVER SIDE ===');
  const session = await getServerSession(authOptions);

  console.log('Session exists?', !!session);
  console.log('Session user:', session?.user);
  console.log('Session expires:', session?.expires);

  if (session?.user) {
    console.log('REDIRECTING to /dashboard');
    redirect('/dashboard');
  }

  console.log('SHOWING HERO SECTION');
  return (
    <div>
      <HeroSection />
    </div>
  );
}

export default page;
