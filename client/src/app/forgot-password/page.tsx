import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ForgotPasswordPage() {
  return (
    <div className="w-full h-screen bg-linear-to-r from-pink-300 to-purple-300 flex justify-center items-center">
      <div className="w-[550px] py-10 bg-white/20 backdrop-blur-md rounded-2xl px-10 shadow-2xl border border-white/30">
        <h1 className="text-4xl text-center mb-2 font-extrabold bg-linear-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Forgot Password
        </h1>
        <p className="text-slate-600 mb-8">
          Enter your email to reset your password
        </p>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                type="email"
                placeholder="Enter your registered email"
                id="email"
                className="border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all rounded-lg"
              />
            </div>

            <p className="text-sm text-gray-600 pt-2">
              We'll send you a link to reset your password to this email
              address.
            </p>
          </div>

          {/* Reset Button */}
          <Button
            type="submit"
            className="w-full py-6 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Send Reset Link
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
