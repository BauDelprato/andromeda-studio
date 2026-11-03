interface PeriodSelectProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  years: number[]; // AHORA LOS AÑOS NO ESTÁN HARDCODEADOS
  className?: string;
}

export function PeriodSelect({ selectedMonth, onMonthChange, selectedYear, onYearChange, years, className }: PeriodSelectProps) {
  const months = [
    { label: "Todos los Meses", value: "all" },
    { label: "Enero", value: "0" },
    { label: "Febrero", value: "1" },
    { label: "Marzo", value: "2" },
    { label: "Abril", value: "3" },
    { label: "Mayo", value: "4" },
    { label: "Junio", value: "5" },
    { label: "Julio", value: "6" },
    { label: "Agosto", value: "7" },
    { label: "Septiembre", value: "8" },
    { label: "Octubre", value: "9" },
    { label: "Noviembre", value: "10" },
    { label: "Diciembre", value: "11" },
  ];

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <select 
        className={className} 
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
      >
        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      
      <select 
        className={className}
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
      >
        <option value="all">Todos los Años</option>
        {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
      </select>
    </div>
  );
}