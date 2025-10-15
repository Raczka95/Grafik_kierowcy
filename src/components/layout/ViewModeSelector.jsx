export default function ViewModeSelector({ viewMode, setViewMode, setSelectedDay, vacationsCount }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border border-gray-100">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setViewMode('drivers');
            setSelectedDay(null);
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            viewMode === 'drivers'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📋 Kierowcy z bazy
        </button>
        <button
          onClick={() => {
            setViewMode('full');
            setSelectedDay(null);
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            viewMode === 'full'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={vacationsCount === 0}
        >
          📊 Pełny Grafik
          {vacationsCount === 0 && (
            <span className="text-xs ml-1">(załaduj Excel)</span>
          )}
        </button>
      </div>
    </div>
  );
}