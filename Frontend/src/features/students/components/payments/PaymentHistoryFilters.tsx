import { SearchBar } from "@/components/searchbar/Searchbar";
import { PeriodSelect } from "@/components/periodselect/PeriodSelect";
import styles from "./PaymentHistory.module.css";

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  years: number[]; 
}

export function PaymentHistoryFilters({ 
  searchTerm, onSearchChange, 
  selectedMonth, onMonthChange, 
  selectedYear, onYearChange,
  years
}: FiltersProps) {
  
  return (
    <div className={styles.filters}>
      <PeriodSelect 
        className={styles.dropdown}
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        years={years}
      />
      
      <div className={styles.searchWrapper}>
        <SearchBar 
          value={searchTerm} 
          onChange={onSearchChange} 
          placeholder="Buscar de grupo/monto" 
        />
      </div>
    </div>
  );
}