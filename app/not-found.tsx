import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <div className="w-24 h-1 bg-white/30 mx-auto mb-6 rounded-full"></div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h3 className="text-white font-semibold mb-3 flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            Quick Links
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/app/email" className="text-white/80 hover:text-white text-sm transition-colors">
              Email Helper
            </Link>
            <span className="text-white/40">•</span>
            <Link href="/app/planner" className="text-white/80 hover:text-white text-sm transition-colors">
              Planner
            </Link>
            <span className="text-white/40">•</span>
            <Link href="/app/ask-flowai" className="text-white/80 hover:text-white text-sm transition-colors">
              Ask FlowAI
            </Link>
            <span className="text-white/40">•</span>
            <Link href="/pricing" className="text-white/80 hover:text-white text-sm transition-colors">
              Pricing
            </Link>
            <span className="text-white/40">•</span>
            <Link href="/app/settings" className="text-white/80 hover:text-white text-sm transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
