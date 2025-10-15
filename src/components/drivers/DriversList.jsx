import { CalendarView } from '../calendar/CalendarViews';
import { formatDate } from '../../utils/helpers';

export default function DriversList({ drivers, searchTerm, setSearchTerm, expandedDrivers, setExpandedDrivers, currentDate, setSelectedDay, vacations }) {
  const filteredDriversList = drivers.filter(driver => 
    driver.imie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDriver = (driverId) => {
    setExpandedDrivers(prev => ({
      ...prev,
      [driverId]: !prev[driverId]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Wyszukaj kierowcę po imieniu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        {searchTerm && (
          <p className="text-xs text-gray-600 mt-2">
            Znaleziono: <strong>{filteredDriversList.length}</strong> kierowców
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <th className="text-left p-3 font-semibold w-12 text-sm"></th>
              <th className="text-left p-3 font-semibold text-sm">Imię</th>
              <th className="text-left p-3 font-semibold text-sm">Dostępny od</th>
              <th className="text-left p-3 font-semibold text-sm">Dostępny do</th>
              <th className="text-left p-3 font-semibold text-sm">System</th>
              <th className="text-left p-3 font-semibold text-sm">Kalendarz</th>
            </tr>
          </thead>
          <tbody>
            {filteredDriversList.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  Nie znaleziono kierowców
                </td>
              </tr>
            ) : (
              filteredDriversList.map((driver, idx) => (
                <tr 
                  key={driver.id}
                  className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="p-3">
                    <button
                      onClick={() => toggleDriver(driver.id)}
                      className="hover:scale-110 transition-transform"
                    >
                      <span className={`text-lg transition-transform duration-200 inline-block ${
                        expandedDrivers[driver.id] ? 'rotate-90' : ''
                      }`}>
                        ▶
                      </span>
                    </button>
                  </td>
                  <td className="p-3 font-semibold text-gray-800 text-sm">{driver.imie}</td>
                  <td className="p-3 text-gray-700 text-sm">{formatDate(driver.dostepny_od)}</td>
                  <td className="p-3 text-gray-700 text-sm">{formatDate(driver.koniec_systemu)}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {driver.system}
                    </span>
                  </td>
                  <td className="p-3">
                    {expandedDrivers[driver.id] ? (
                      <div className="max-w-md">
                        <CalendarView 
                          driver={driver} 
                          showStats={false} 
                          showTimes={true}
                          currentDate={currentDate}
                          setSelectedDay={setSelectedDay}
                          drivers={drivers}
                          vacations={vacations}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Kliknij strzałkę →</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}