"use client";

export default function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-white shadow-sm fixed top-0 z-50">
      <div className="text-2xl font-bold text-blue-600">Refraim AI</div>
      <div className="flex gap-6 text-gray-700 font-medium">
        <a href="#features" className="hover:text-blue-600">Features</a>
        <a href="#pricing" className="hover:text-blue-600">Pricing</a>
        <a href="/app" className="hover:text-blue-600">Login</a>
      </div>
    </nav>
  );
}
