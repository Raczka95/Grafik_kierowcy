import { monthNames } from '../../utils/helpers';

export default function MonthNavigation({ currentDate, setCurrentDate, viewMode, onExportMonth }) {
  const changeMonth = (delta) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
        >
          ← Poprzedni
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
        >
          Następny →
        </button>
      </div>

      {viewMode === 'full' && (
        <div className="flex justify-center">
          <button
            onClick={onExportMonth}
            className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
            📥 Eksportuj miesiąc do Excel
          </button>
        </div>
      )}
    </div>
  );
}