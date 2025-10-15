import { useState, useEffect } from 'react';
import { auth, db } from './firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import LoginForm from './components/auth/LoginForm';
import Header from './components/layout/Header';
import ViewModeSelector from './components/layout/ViewModeSelector';
import MonthNavigation from './components/layout/MonthNavigation';
import Legend from './components/layout/Legend';
import AllDriversCalendar from './components/drivers/AllDriversCalendar';
import DriversList from './components/drivers/DriversList';
import DayDetailsPanel from './components/panels/DayDetailsPanel';
import DayDetailsFull from './components/panels/DayDetailsFull';
import { FullCalendarView } from './components/calendar/CalendarViews';
import { getAllPeriods, generatePredictedPeriods, getDriversForDay, getFullDriversForDay } from './utils/helpers';
import { exportDayToExcel, exportMonthToExcel } from './utils/excelExport';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedDrivers, setExpandedDrivers] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [vacations, setVacations] = useState({});
  const [viewMode, setViewMode] = useState('drivers');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadDrivers();
    }
  }, [user]);

  const loadDrivers = async () => {
    setLoadingDrivers(true);
    setError('');
    
    try {
      const driversCollection = collection(db, 'kierowcy');
      const driversSnapshot = await getDocs(driversCollection);
      
      const driversData = driversSnapshot.docs.map(doc => {
        const data = doc.data();
        const realPeriods = getAllPeriods(data);
        
        let lastEndDate = null;
        if (realPeriods.length > 0) {
          realPeriods.forEach(period => {
            const endDate = new Date(period.end);
            if (!lastEndDate || endDate > lastEndDate) {
              lastEndDate = endDate;
            }
          });
        }
        
        const predictedPeriods = lastEndDate ? generatePredictedPeriods(lastEndDate) : [];
        
        return {
          id: doc.id,
          ...data,
          allPeriods: [...realPeriods, ...predictedPeriods]
        };
      });
      
      const filteredDrivers = driversData.filter(driver => driver.dostepny_od);
      setDrivers(filteredDrivers);
    } catch (err) {
      setError('Błąd pobierania danych: ' + err.message);
      console.error('Błąd:', err);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDrivers([]);
      setVacations({});
    } catch (err) {
      setError('Błąd wylogowania');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs');
      
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

      if (jsonData.length < 2) {
        setError('Plik Excel jest pusty lub ma nieprawidłowy format');
        return;
      }

      const dateRow = jsonData[0];
      const dates = [];
      
      // Daty zaczynają się od kolumny C (index 2)
      for (let i = 2; i < dateRow.length; i++) {
        if (dateRow[i]) {
          try {
            const dateStr = dateRow[i].trim();
            let parsedDate;
            
            if (dateStr.includes('.')) {
              const parts = dateStr.split('.');
              if (parts.length === 3) {
                parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
              }
            } else {
              const excelDate = parseFloat(dateStr);
              if (!isNaN(excelDate)) {
                parsedDate = XLSX.SSF.parse_date_code(excelDate);
                parsedDate = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d);
              }
            }
            
            if (parsedDate && !isNaN(parsedDate.getTime())) {
              dates.push(parsedDate);
            } else {
              dates.push(null);
            }
          } catch {
            dates.push(null);
          }
        } else {
          dates.push(null);
        }
      }

      const vacationData = {};
      
      for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
        const row = jsonData[rowIndex];
        const name = row[0];
        const system = row[1] || '-';
        
        if (!name || typeof name !== 'string') continue;
        
        const cleanName = name.trim();
        vacationData[cleanName] = {
          system: system.toString().trim(),
          dates: []
        };
        
        // Daty zaczynają się od kolumny C (index 2)
        for (let colIndex = 2; colIndex < row.length && colIndex - 2 < dates.length; colIndex++) {
          const cell = row[colIndex];
          const date = dates[colIndex - 2];
          
          if (cell && cell.toString().trim() !== '' && date) {
            vacationData[cleanName].dates.push({
              date: date.toISOString(),
              value: cell.toString().trim()
            });
          }
        }
      }

      setVacations(vacationData);
      setError('');
      console.log('Zaimportowano urlopy:', vacationData);
      
      e.target.value = '';
    } catch (err) {
      setError('Błąd podczas wczytywania pliku: ' + err.message);
      console.error('Błąd importu:', err);
    }
  };

  const handleExportDay = async (date, dayData) => {
    const result = await exportDayToExcel(
      date, 
      dayData.working, 
      dayData.onVacation,
      dayData.free || []
    );
    if (result.success) {
      alert(`✓ Wyeksportowano plik: ${result.fileName}`);
    } else {
      alert(`✗ Błąd eksportu: ${result.error}`);
    }
  };

  const handleExportMonth = async () => {
    const result = await exportMonthToExcel(currentDate, drivers, vacations, getFullDriversForDay);
    if (result.success) {
      alert(`✓ Wyeksportowano plik: ${result.fileName}`);
    } else {
      alert(`✗ Błąd eksportu: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl font-semibold text-gray-700">Ładowanie...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm setError={setError} />;
  }

  const dayData = selectedDay ? (viewMode === 'full' ? getFullDriversForDay(selectedDay, drivers, vacations) : getDriversForDay(selectedDay, drivers, vacations)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Header user={user} onLogout={handleLogout} />
        
        <ViewModeSelector 
          viewMode={viewMode}
          setViewMode={setViewMode}
          setSelectedDay={setSelectedDay}
          vacationsCount={Object.keys(vacations).length}
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 mb-4 shadow-md">
            <p className="text-red-800 font-medium text-sm">{error}</p>
          </div>
        )}

        <MonthNavigation 
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          viewMode={viewMode}
          onExportMonth={handleExportMonth}
        />

        <Legend 
          onFileUpload={handleFileUpload}
          vacationsCount={Object.keys(vacations).length}
        />

        {loadingDrivers ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600 text-lg">Pobieranie danych...</p>
          </div>
        ) : viewMode === 'full' ? (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <h3 className="text-lg font-bold">Pełny Grafik</h3>
                <p className="text-sm mt-1 opacity-90">Kierowcy z bazy + wszyscy z Excela - kliknij dzień aby zobaczyć szczegóły</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-50 to-purple-50">
                <FullCalendarView 
                  currentDate={currentDate} 
                  setSelectedDay={setSelectedDay}
                  drivers={drivers}
                  vacations={vacations}
                />
              </div>
            </div>

            {selectedDay && (
              <DayDetailsFull 
                selectedDay={selectedDay}
                dayData={dayData}
                onExport={() => handleExportDay(selectedDay, dayData)}
              />
            )}
          </div>
        ) : drivers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600">Brak kierowców z wypełnionym "dostępny od"</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AllDriversCalendar 
              showAll={showAll}
              setShowAll={setShowAll}
              currentDate={currentDate}
              setSelectedDay={setSelectedDay}
              drivers={drivers}
              vacations={vacations}
            />

            <DriversList 
              drivers={drivers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              expandedDrivers={expandedDrivers}
              setExpandedDrivers={setExpandedDrivers}
              currentDate={currentDate}
              setSelectedDay={setSelectedDay}
              vacations={vacations}
            />
          </div>
        )}
      </div>

      {selectedDay && viewMode === 'drivers' && dayData && 'free' in dayData && (
        <DayDetailsPanel 
          selectedDay={selectedDay}
          dayData={dayData}
          onClose={() => setSelectedDay(null)}
          onExport={() => handleExportDay(selectedDay, dayData)}
        />
      )}
    </div>
  );
}