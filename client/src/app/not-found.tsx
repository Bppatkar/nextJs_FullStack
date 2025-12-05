import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        <h1 className="text-9xl font-black bg-linear-to-r from-pink-400 via-purple-500 to-indigo-600 text-transparent bg-clip-text">
          404
        </h1>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-800">Page Not Found</h2>

          <p className="text-xl text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
           
            <Link
              href="/"
              className="px-8 py-4 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center"
            >
              Go Home
            </Link>

            <a
              href="/"
              className="px-8 py-4 border border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg text-center"
            >
              Go Back
            </a>
          </div>

          <div className="pt-10">
            <p className="text-gray-600">
              Need help?{' '}
              <Link
                href="/contact"
                className="text-purple-600 hover:underline font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}