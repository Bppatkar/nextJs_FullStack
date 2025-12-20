import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function SignupPage() {
  return (
    <div className="w-full h-screen bg-linear-to-r from-pink-300 to-purple-300 flex justify-center items-center">
      <div className="w-[550px] py-10 bg-white/20 backdrop-blur-md rounded-2xl px-10 shadow-2xl border border-white/30">
        <h1 className="text-4xl text-center mb-2 font-extrabold bg-linear-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Create Account
        </h1>
        <p className="text-slate-600 mb-8">Join our community today!</p>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                name="name"
                type="text"
                placeholder="Enter your full name"
                id="name"
                className="border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all rounded-lg"
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Create password"
                  id="password"
                  className="border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-medium"
                >
                  Confirm Password
                </Label>
                <Input
                  name="confirm_password"
                  type="password"
                  placeholder="Confirm password"
                  id="confirmPassword"
                  className="border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-purple-600 hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-purple-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            className="w-full py-6 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Create Account
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
