export default function Legend({ onFileUpload, vacationsCount }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded shadow"></div>
            <span className="font-medium text-gray-700">Pracuje</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded shadow"></div>
            <span className="font-medium text-gray-700">Przewidywane</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
            <div className="w-3 h-3 bg-orange-400 rounded shadow"></div>
            <span className="font-medium text-gray-700">Urlop</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <div className="w-3 h-3 bg-gray-300 rounded shadow"></div>
            <span className="font-medium text-gray-700">Wolne (W)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm">
            📁 Import urlopów z Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={onFileUpload}
              className="hidden"
            />
          </label>
          {vacationsCount > 0 && (
            <span className="text-xs text-green-600 font-semibold">
              ✓ {vacationsCount} osób
            </span>
          )}
        </div>
      </div>
    </div>
  );
}