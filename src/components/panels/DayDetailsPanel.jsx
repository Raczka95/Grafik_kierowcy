import { formatDayWithMonth, dayNames } from '../../utils/helpers';

export default function DayDetailsPanel({ selectedDay, dayData, onClose, onExport }) {
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
        <div className="p-5">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {formatDayWithMonth(selectedDay)}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Dzień {dayNames[(selectedDay.getDay() + 6) % 7]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <button
            onClick={onExport}
            className="w-full mb-5 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
            📥 Eksportuj dzień do Excel
          </button>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <h4 className="font-bold text-base text-gray-800">
                  Pracuje ({dayData.working.length})
                </h4>
              </div>
              <div className="space-y-2">
                {dayData.working.length === 0 ? (
                  <p className="text-gray-500 text-xs">Brak kierowców pracujących</p>
                ) : (
                  dayData.working.map(driver => (
                    <div
                      key={driver.id}
                      className="p-2.5 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="font-semibold text-gray-800 text-sm">{driver.imie}</div>
                      <div className="text-xs text-gray-600 mt-0.5">System: {driver.system}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <h4 className="font-bold text-base text-gray-800">
                  Urlop ({dayData.onVacation.length})
                </h4>
              </div>
              <div className="space-y-2">
                {dayData.onVacation.length === 0 ? (
                  <p className="text-gray-500 text-xs">Nikt nie ma urlopu</p>
                ) : (
                  dayData.onVacation.map(driver => (
                    <div
                      key={driver.id}
                      className="p-2.5 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                      <div className="font-semibold text-gray-800 text-sm">{driver.imie}</div>
                      <div className="text-xs text-gray-600 mt-0.5">System: {driver.system}</div>
                      {driver.reason && (
                        <div className="text-xs text-orange-700 font-semibold mt-1">
                          Powód: {driver.reason}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                <h4 className="font-bold text-base text-gray-800">
                  Wolne ({dayData.free.length})
                </h4>
              </div>
              <div className="space-y-2">
                {dayData.free.length === 0 ? (
                  <p className="text-gray-500 text-xs">Wszyscy pracują lub mają urlop</p>
                ) : (
                  dayData.free.map(driver => (
                    <div
                      key={driver.id}
                      className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="font-semibold text-gray-800 text-sm">{driver.imie}</div>
                      <div className="text-xs text-gray-600 mt-0.5">System: {driver.system}</div>
                      {driver.reason && (
                        <div className="text-xs text-gray-700 font-semibold mt-1">
                          {driver.reason}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}