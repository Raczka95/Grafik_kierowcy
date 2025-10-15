export const exportDayToExcel = async (date, working, onVacation, free = []) => {
  try {
    const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs');
    
    // Przygotuj dane
    const excelData = [];
    
    // Dodaj osoby pracujące
    working.forEach(person => {
      excelData.push({
        'Imię': person.imie,
        'Status': 'Pracuje',
        'System': person.system || '',
        'Powód': ''
      });
    });
    
    // Dodaj osoby na urlopie
    onVacation.forEach(person => {
      excelData.push({
        'Imię': person.imie,
        'Status': 'Urlop',
        'System': person.system || '',
        'Powód': person.reason || ''
      });
    });
    
    // Dodaj osoby wolne
    free.forEach(person => {
      excelData.push({
        'Imię': person.imie,
        'Status': 'Wolne',
        'System': person.system || '',
        'Powód': person.reason || ''
      });
    });
    
    // Sortuj alfabetycznie po imieniu
    excelData.sort((a, b) => a['Imię'].localeCompare(b['Imię'], 'pl'));
    
    // Stwórz worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Ustaw szerokości kolumn
    worksheet['!cols'] = [
      { wch: 30 }, // Imię
      { wch: 15 }, // Status
      { wch: 10 }, // System
      { wch: 30 }  // Powód
    ];
    
    // Stwórz workbook
    const workbook = XLSX.utils.book_new();
    
    // Formatuj datę dla nazwy arkusza
    const dateStr = date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).replace(/\./g, '-');
    
    XLSX.utils.book_append_sheet(workbook, worksheet, `Grafik ${dateStr}`);
    
    // Zapisz plik
    const fileName = `Grafik_${dateStr}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Błąd eksportu:', error);
    return { success: false, error: error.message };
  }
};

export const exportMonthToExcel = async (currentDate, drivers, vacations, getFullDriversForDay) => {
  try {
    const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs');
    
    // Pobierz wszystkie dni w miesiącu
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const excelData = [];
    
    // Dla każdego dnia w miesiącu
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayData = getFullDriversForDay(date, drivers, vacations);
      
      const dateStr = date.toLocaleDateString('pl-PL', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      // Dodaj osoby pracujące
      dayData.working.forEach(person => {
        excelData.push({
          'Data': dateStr,
          'Imię': person.imie,
          'System': person.system,
          'Status': 'Pracuje',
          'Powód': ''
        });
      });
      
      // Dodaj osoby na urlopie/wolne
      dayData.onVacation.forEach(person => {
        excelData.push({
          'Data': dateStr,
          'Imię': person.imie,
          'System': person.system,
          'Status': 'Wolne',
          'Powód': person.reason || ''
        });
      });
    }
    
    // Stwórz worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Ustaw szerokości kolumn
    worksheet['!cols'] = [
      { wch: 10 }, // Data
      { wch: 30 }, // Imię
      { wch: 10 }, // System
      { wch: 10 }, // Status
      { wch: 30 }  // Powód
    ];
    
    // Stwórz workbook
    const workbook = XLSX.utils.book_new();
    
    const monthName = currentDate.toLocaleDateString('pl-PL', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    XLSX.utils.book_append_sheet(workbook, worksheet, monthName);
    
    // Zapisz plik
    const fileName = `Grafik_${monthName.replace(' ', '_')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Błąd eksportu:', error);
    return { success: false, error: error.message };
  }
};