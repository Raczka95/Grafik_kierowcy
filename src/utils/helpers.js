// utils/helpers.js - Funkcje pomocnicze

const namesMatch = (name1, name2) => {
  const normalizeStr = (str) => str.toLowerCase().trim().replace(/\s+/g, ' ');
  const n1 = normalizeStr(name1);
  const n2 = normalizeStr(name2);
  const parts1 = n1.split(' ');
  const parts2 = n2.split(' ');
  
  if (n1 === n2) return true;
  if (parts1.length >= 2 && parts2.length >= 2) {
    const first1Last1 = `${parts1[0]} ${parts1[parts1.length - 1]}`;
    const last1First1 = `${parts1[parts1.length - 1]} ${parts1[0]}`;
    const first2Last2 = `${parts2[0]} ${parts2[parts2.length - 1]}`;
    const last2First2 = `${parts2[parts2.length - 1]} ${parts2[0]}`;
    return first1Last1 === first2Last2 || first1Last1 === last2First2 || 
           last1First1 === first2Last2 || last1First1 === last2First2;
  }
  return false;
};

export const getAllPeriods = (data) => {
  const periods = [];
  
  if (data.dostepny_od && data.koniec_systemu) {
    periods.push({
      start: data.dostepny_od,
      end: data.koniec_systemu,
      predicted: false
    });
  }
  
  if (data.historia && Array.isArray(data.historia)) {
    data.historia.forEach(entry => {
      if (entry.dostepny_od && entry.koniec_systemu) {
        periods.push({
          start: entry.dostepny_od,
          end: entry.koniec_systemu,
          predicted: false
        });
      }
    });
  }
  
  return periods;
};

export const generatePredictedPeriods = (lastEndDate) => {
  if (!lastEndDate) return [];
  
  const predicted = [];
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  
  let currentDate = new Date(lastEndDate);
  const baseTime = new Date(lastEndDate);
  const hours = baseTime.getHours();
  const minutes = baseTime.getMinutes();
  
  while (currentDate < threeMonthsFromNow) {
    currentDate.setDate(currentDate.getDate() + 7);
    
    const workStart = new Date(currentDate);
    workStart.setHours(hours, minutes, 0, 0);
    
    const workEnd = new Date(currentDate);
    workEnd.setDate(workEnd.getDate() + 13);
    workEnd.setHours(hours, minutes, 0, 0);
    
    if (workStart < threeMonthsFromNow) {
      predicted.push({
        start: workStart.toISOString(),
        end: workEnd.toISOString(),
        predicted: true
      });
    }
    
    currentDate = new Date(workEnd);
  }
  
  return predicted;
};

export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
    days.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
};

export const isDateInAnyPeriod = (date, periods) => {
  if (!periods || periods.length === 0) return false;
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  return periods.some(period => {
    const start = new Date(period.start);
    const end = new Date(period.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return d >= start && d <= end;
  });
};

export const isOnVacation = (date, driverName, vacations) => {
  if (!vacations || !driverName) return false;
  
  const normalizeString = (str) => str.toLowerCase().trim().replace(/\s+/g, ' ');
  const normalizedDriverName = normalizeString(driverName);
  const driverParts = normalizedDriverName.split(' ');
  
  const driverVacations = Object.keys(vacations).find(excelName => {
    const normalizedExcelName = normalizeString(excelName);
    const excelParts = normalizedExcelName.split(' ');
    
    if (normalizedExcelName === normalizedDriverName) {
      return true;
    }
    
    if (driverParts.length >= 2 && excelParts.length >= 2) {
      const driverFirstLast = `${driverParts[0]} ${driverParts[driverParts.length - 1]}`;
      const driverLastFirst = `${driverParts[driverParts.length - 1]} ${driverParts[0]}`;
      const excelFirstLast = `${excelParts[0]} ${excelParts[excelParts.length - 1]}`;
      const excelLastFirst = `${excelParts[excelParts.length - 1]} ${excelParts[0]}`;
      
      if (driverFirstLast === excelFirstLast || 
          driverFirstLast === excelLastFirst ||
          driverLastFirst === excelFirstLast ||
          driverLastFirst === excelLastFirst) {
        return true;
      }
    }
    
    return false;
  });
  
  if (!driverVacations || !vacations[driverVacations]) return false;
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  return vacations[driverVacations].dates.some(vacEntry => {
    const vacDate = typeof vacEntry === 'string' ? vacEntry : vacEntry.date;
    const v = new Date(vacDate);
    v.setHours(0, 0, 0, 0);
    return d.getTime() === v.getTime();
  });
};

export const getVacationReason = (date, driverName, vacations, drivers) => {
  if (!vacations || !driverName) return null;
  
  const normalizeString = (str) => str.toLowerCase().trim().replace(/\s+/g, ' ');
  const normalizedDriverName = normalizeString(driverName);
  const driverParts = normalizedDriverName.split(' ');
  
  const driverVacations = Object.keys(vacations).find(excelName => {
    const normalizedExcelName = normalizeString(excelName);
    const excelParts = normalizedExcelName.split(' ');
    
    if (normalizedExcelName === normalizedDriverName) {
      return true;
    }
    
    if (driverParts.length >= 2 && excelParts.length >= 2) {
      const driverFirstLast = `${driverParts[0]} ${driverParts[driverParts.length - 1]}`;
      const driverLastFirst = `${driverParts[driverParts.length - 1]} ${driverParts[0]}`;
      const excelFirstLast = `${excelParts[0]} ${excelParts[excelParts.length - 1]}`;
      const excelLastFirst = `${excelParts[excelParts.length - 1]} ${excelParts[0]}`;
      
      if (driverFirstLast === excelFirstLast || 
          driverFirstLast === excelLastFirst ||
          driverLastFirst === excelFirstLast ||
          driverLastFirst === excelLastFirst) {
        return true;
      }
    }
    
    return false;
  });
  
  if (!driverVacations || !vacations[driverVacations]) {
    const driver = drivers?.find(d => namesMatch(d.imie, driverName));
    if (driver && !isDateInAnyPeriod(date, driver.allPeriods)) {
      return "Przerwa w systemie";
    }
    return null;
  }
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  const vacEntry = vacations[driverVacations].dates.find(entry => {
    const vacDate = typeof entry === 'string' ? entry : entry.date;
    const v = new Date(vacDate);
    v.setHours(0, 0, 0, 0);
    return d.getTime() === v.getTime();
  });
  
  if (vacEntry) {
    if (typeof vacEntry === 'object' && vacEntry.value) {
      return vacEntry.value;
    }
  }
  
  const driver = drivers?.find(d => namesMatch(d.imie, driverName));
  if (driver && !isDateInAnyPeriod(date, driver.allPeriods)) {
    return "Przerwa w systemie";
  }
  
  return null;
};

export const getDateInfo = (date, periods, driverName = null, vacations = null) => {
  if (driverName && vacations && isOnVacation(date, driverName, vacations)) {
    return { 
      isWorking: false, 
      isVacation: true 
    };
  }
  
  if (!periods || periods.length === 0) return { isWorking: false };
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  for (const period of periods) {
    const start = new Date(period.start);
    const end = new Date(period.end);
    const startDay = new Date(start);
    const endDay = new Date(end);
    startDay.setHours(0, 0, 0, 0);
    endDay.setHours(0, 0, 0, 0);
    
    if (d >= startDay && d <= endDay) {
      const isStart = d.getTime() === startDay.getTime();
      const isEnd = d.getTime() === endDay.getTime();
      const startTime = start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      const endTime = end.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      
      return {
        isWorking: true,
        isPredicted: period.predicted || false,
        isStart,
        isEnd,
        startTime,
        endTime
      };
    }
  }
  
  return { isWorking: false };
};

export const getStatsForDay = (date, drivers, vacations) => {
  let working = 0;
  let free = 0;
  
  drivers.forEach(driver => {
    if (isOnVacation(date, driver.imie, vacations)) {
      free++;
    } else if (isDateInAnyPeriod(date, driver.allPeriods)) {
      working++;
    } else {
      free++;
    }
  });
  
  return { working, free };
};

export const getDriversForDay = (date, drivers, vacations) => {
  const working = [];
  const free = [];
  const onVacation = [];
  
  drivers.forEach(driver => {
    if (isOnVacation(date, driver.imie, vacations)) {
      const reason = getVacationReason(date, driver.imie, vacations, drivers);
      onVacation.push({ ...driver, reason });
    } else if (isDateInAnyPeriod(date, driver.allPeriods)) {
      working.push(driver);
    } else {
      const reason = "Przerwa w systemie";
      free.push({ ...driver, reason });
    }
  });
  
  return { working, free, onVacation };
};

export const getFullStatsForDay = (date, drivers, vacations) => {
  if (!vacations || Object.keys(vacations).length === 0) {
    return { onVacation: 0, working: 0, total: 0 };
  }
  
  const uniquePeople = new Map();
  
  Object.keys(vacations).forEach(excelName => {
    const matchingDriver = drivers.find(d => namesMatch(d.imie, excelName));
    const key = matchingDriver ? matchingDriver.imie : excelName;
    
    if (!uniquePeople.has(key)) {
      uniquePeople.set(key, {
        name: key,
        driver: matchingDriver,
        inExcel: true,
        excelSystem: vacations[excelName].system
      });
    }
  });
  
  drivers.forEach(driver => {
    const alreadyAdded = Array.from(uniquePeople.values()).some(p => 
      p.driver && p.driver.id === driver.id
    );
    
    if (!alreadyAdded) {
      uniquePeople.set(driver.imie, {
        name: driver.imie,
        driver: driver,
        inExcel: false
      });
    }
  });
  
  let onVacation = 0;
  let working = 0;
  
  uniquePeople.forEach(person => {
    const hasExcelVacation = isOnVacation(date, person.name, vacations);
    const isWorking = person.driver && isDateInAnyPeriod(date, person.driver.allPeriods);
    
    if (hasExcelVacation) {
      onVacation++;
    } else if (isWorking) {
      working++;
    } else if (person.driver) {
      onVacation++;
    } else if (person.inExcel) {
      working++;
    }
  });
  
  return { onVacation, working, total: uniquePeople.size };
};

export const getFullDriversForDay = (date, drivers, vacations) => {
  if (!vacations || Object.keys(vacations).length === 0) {
    return { onVacation: [], working: [] };
  }
  
  const uniquePeople = new Map();
  
  Object.keys(vacations).forEach(excelName => {
    const matchingDriver = drivers.find(d => namesMatch(d.imie, excelName));
    const key = matchingDriver ? matchingDriver.imie : excelName;
    
    if (!uniquePeople.has(key)) {
      uniquePeople.set(key, {
        name: key,
        driver: matchingDriver,
        inExcel: true,
        excelSystem: vacations[excelName].system
      });
    }
  });
  
  drivers.forEach(driver => {
    const alreadyAdded = Array.from(uniquePeople.values()).some(p => 
      p.driver && p.driver.id === driver.id
    );
    
    if (!alreadyAdded) {
      uniquePeople.set(driver.imie, {
        name: driver.imie,
        driver: driver,
        inExcel: false
      });
    }
  });
  
  const onVacation = [];
  const working = [];
  
  uniquePeople.forEach(person => {
    const personData = {
      imie: person.name,
      system: person.driver?.system || person.excelSystem || '-',
      id: person.driver?.id || person.name
    };
    
    const hasExcelVacation = isOnVacation(date, person.name, vacations);
    const isWorking = person.driver && isDateInAnyPeriod(date, person.driver.allPeriods);
    
    if (hasExcelVacation) {
      const reason = getVacationReason(date, person.name, vacations, drivers);
      onVacation.push({ ...personData, reason });
    } else if (isWorking) {
      working.push({ ...personData, source: 'system' });
    } else if (person.driver) {
      onVacation.push({ ...personData, reason: 'Przerwa w systemie' });
    } else if (person.inExcel) {
      working.push({ ...personData, source: 'excel' });
    }
  });
  
  return { onVacation, working };
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const formatDayWithMonth = (date) => {
  return date.toLocaleDateString('pl-PL', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const monthNames = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

export const dayNames = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];