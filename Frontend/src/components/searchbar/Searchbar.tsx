import {
  LuSearch as Search
} from "react-icons/lu";
import styles from "./Searchbar.module.css";

export interface SearchOption<T extends string> {
  value: T;
  label: string;
}

interface SearchBarProps<T extends string> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sortBy?: T;
  sortOptions?: SearchOption<T>[];
  onSortChange?: (value: T) => void;
  onSubmit?: () => void;
}

export function SearchBar<T extends string>({
  value,
  onChange,
  placeholder = "Buscar",
  sortBy,
  sortOptions = [],
  onSortChange,
  onSubmit,
}: SearchBarProps<T>) {
  return (
    <div className={styles.row}>
      <form
        className={styles.searchField}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        role="search"
      >
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={placeholder}
        />

        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Buscar"
        >
          <Search size={18} strokeWidth={2} />
        </button>
      </form>

      {sortOptions.length > 0 && onSortChange && (
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as T)}
          aria-label="Ordenar por"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
