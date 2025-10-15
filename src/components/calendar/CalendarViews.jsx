// components/calendar/CalendarViews.jsx - Komponenty kalendarzy

import { getDaysInMonth, getDateInfo, getStatsForDay, getFullStatsForDay, dayNames } from '../../utils/helpers';

export const CalendarView = ({ driver, showStats = false, showTimes = true, currentDate, setSelectedDay, drivers, vacations }) => {
  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-lg p-3">
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-xs py-1 text-gray-600">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`}></div>;
          }
          
          const dateInfo = driver ? getDateInfo(day, driver.allPeriods, driver.imie, vacations) : { isWorking: false };
          const isWorking = dateInfo.isWorking;
          const isPredicted = dateInfo.isPredicted;
          const isVacation = dateInfo.isVacation;
          const stats = showStats ? getStatsForDay(day, drivers, vacations) : null;
          const isToday = day.toDateString() === new Date().toDateString();
          
          let bgColor = '';
          if (isVacation) {
            bgColor = 'bg-orange-400 text-white hover:bg-orange-500';
          } else if (isWorking) {
            if (showStats || !isPredicted) {
              bgColor = 'bg-green-500 text-white hover:bg-green-600';
            } else {
              bgColor = 'bg-blue-500 text-white hover:bg-blue-600';
            }
          } else {
            bgColor = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
          }
          
          return (
            <div
              key={index}
              onClick={() => showStats && setSelectedDay(day)}
              className={`relative h-14 flex flex-col items-center justify-center rounded text-xs font-medium transition-all duration-200 ${
                isToday ? 'ring-2 ring-blue-500' : ''
              } ${bgColor} ${showStats ? 'cursor-pointer hover:scale-105' : ''}`}
            >
              <div className="text-sm font-bold">{day.getDate()}</div>
              
              {isVacation ? (
                <div className="text-[9px] font-semibold mt-0.5">URLOP</div>
              ) : (
                <>
                  {showTimes && dateInfo.isStart && !isPredicted && (
                    <div className="text-[9px] font-semibold mt-0.5">↓ {dateInfo.startTime}</div>
                  )}
                  
                  {showTimes && dateInfo.isEnd && !isPredicted && (
                    <div className="text-[9px] font-semibold mt-0.5">↑ {dateInfo.endTime}</div>
                  )}
                  
                  {showTimes && isPredicted && dateInfo.isStart && (
                    <div className="text-[9px] font-semibold mt-0.5">↓ Przewidywane</div>
                  )}
                  
                  {showStats && stats ? (
                    <div className="text-[10px] mt-0.5 flex gap-1">
                      <span className="text-green-800 bg-green-200 px-1 rounded font-bold">{stats.working}</span>
                      <span className="text-gray-600 bg-white px-1 rounded font-bold">{stats.free}</span>
                    </div>
                  ) : !isWorking && !(showTimes && (dateInfo.isStart || dateInfo.isEnd)) && (
                    <div className="text-[9px] leading-none mt-0.5">W</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FullCalendarView = ({ currentDate, setSelectedDay, drivers, vacations }) => {
  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-lg p-3">
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-xs py-1 text-gray-600">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`}></div>;
          }
          
          const stats = getFullStatsForDay(day, drivers, vacations);
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              onClick={() => setSelectedDay(day)}
              className={`relative h-16 flex flex-col items-center justify-center rounded text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-gray-200 ${
                isToday ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="text-sm font-bold text-gray-800">{day.getDate()}</div>
              
              {stats.total > 0 && (
                <div className="text-[10px] mt-1 flex flex-col gap-0.5">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-green-700 bg-green-200 px-1.5 py-0.5 rounded font-bold">
                      ✓ {stats.working}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-orange-700 bg-orange-200 px-1.5 py-0.5 rounded font-bold">
                      U {stats.onVacation}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};