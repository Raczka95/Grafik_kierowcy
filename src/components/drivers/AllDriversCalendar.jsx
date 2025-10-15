import { CalendarView } from '../calendar/CalendarViews';

export default function AllDriversCalendar({ showAll, setShowAll, currentDate, setSelectedDay, drivers, vacations }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full px-5 py-4 flex justify-between items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xl transition-transform duration-200 ${showAll ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <div className="text-left">
            <div className="font-bold text-lg text-gray-800">Wszyscy kierowcy</div>
            <div className="text-xs text-gray-600 mt-0.5">Zbiorczy widok kalendarza - kliknij dzień aby zobaczyć szczegóły</div>
          </div>
        </div>
      </button>
      
      {showAll && (
        <div className="p-5 border-t bg-gradient-to-br from-gray-50 to-blue-50">
          <CalendarView 
            driver={null} 
            showStats={true} 
            showTimes={false}
            currentDate={currentDate}
            setSelectedDay={setSelectedDay}
            drivers={drivers}
            vacations={vacations}
          />
        </div>
      )}
    </div>
  );
}