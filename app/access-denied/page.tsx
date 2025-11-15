"use client";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg">
            F
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Private Beta
          </h1>
          
          <p className="text-gray-600 mb-6">
            Refraim AI is currently in private beta testing with family and friends. 
            Access is restricted to invited users only.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Interested in early access?</strong><br />
              We'll be opening up to more users soon! Stay tuned for our public launch.
            </p>
          </div>
          
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
