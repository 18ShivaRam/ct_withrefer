import Link from 'next/link';
import { FaShieldAlt, FaBuilding } from 'react-icons/fa';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <FaShieldAlt className="text-4xl text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          This portal is restricted to office network access only.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <FaBuilding className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Security Policy</p>
              <p className="text-xs text-gray-500 mt-1">
                To ensure data security, the employee portal can only be accessed from authorized office IP addresses.
              </p>
            </div>
          </div>
        </div>

        <Link 
          href="/"
          className="inline-block w-full bg-[#006666] text-white font-medium py-2 px-4 rounded hover:bg-[#005555] transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
