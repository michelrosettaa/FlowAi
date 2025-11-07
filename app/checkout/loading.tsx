export default function LoadingCheckout() {
  return (
    <main className="min-h-[60vh] grid place-items-center">
      <div className="animate-pulse text-center">
        <div className="h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Preparing secure checkout…</p>
      </div>
    </main>
  );
}
