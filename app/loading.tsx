export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="bg-white border-b border-gray-100 h-[60px]" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-8 w-52 bg-gray-200 rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-80 bg-gray-100 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-4 flex gap-4 shadow-card">
                <div className="h-24 w-24 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-3 pt-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-5 w-1/4 bg-gray-100 rounded-lg animate-pulse mt-3" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-card space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded-lg animate-pulse" />
              ))}
              <div className="h-12 bg-gray-200 rounded-2xl animate-pulse mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
