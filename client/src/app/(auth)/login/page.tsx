import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Page() {
  return (
    <div className="w-full h-screen bg-linear-to-r from-pink-300 to-purple-300 flex justify-center items-center">
      <div className="w-[550px] py-10 bg-white/20 backdrop-blur-md rounded-2xl px-10 shadow-2xl border border-white/30">
        <h1 className="text-4xl text-center mb-2 font-extrabold bg-linear-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Login</h1>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                id="email"
                className="border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                id="password"
                className="border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all rounded-lg"
              />
            </div>
            <div className="pt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full py-6 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Login
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;
