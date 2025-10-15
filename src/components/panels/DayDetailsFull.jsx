import { formatDayWithMonth, dayNames } from '../../utils/helpers';

export default function DayDetailsFull({ selectedDay, dayData, onExport }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {formatDayWithMonth(selectedDay)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Dzień {dayNames[(selectedDay.getDay() + 6) % 7]}
            </p>
          </div>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
            📥 Eksportuj dzień
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <h4 className="font-bold text-lg text-gray-800">
                Pracuje ({dayData.working.length})
              </h4>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {dayData.working.length === 0 ? (
                <p className="text-gray-500 text-sm">Brak pracujących</p>
              ) : (
                dayData.working.map((person) => (
                  <div
                    key={person.id}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="font-semibold text-gray-800">{person.imie}</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      System: {person.system}
                      {person.source === 'excel' && (
                        <span className="ml-2 text-purple-600">(z Excela)</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <h4 className="font-bold text-lg text-gray-800">
                Urlop ({dayData.onVacation.length})
              </h4>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {dayData.onVacation.length === 0 ? (
                <p className="text-gray-500 text-sm">Nikt nie ma urlopu</p>
              ) : (
                dayData.onVacation.map((person) => (
                  <div
                    key={person.id}
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="font-semibold text-gray-800">{person.imie}</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      System: {person.system}
                    </div>
                    {person.reason && (
                      <div className="text-xs text-orange-700 font-semibold mt-1">
                        Powód: {person.reason}
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
  );
}