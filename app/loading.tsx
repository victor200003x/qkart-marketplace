export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="h-96 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/20 shadow-2xl mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-80 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
