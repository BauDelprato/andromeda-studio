import type { CrewCategory } from "../../types/crew";
import styles from "./CategoryCard.module.css";

interface CategoryCardProps {
  category: CrewCategory;
  onEdit: (id: number) => void;
  onClick: (id: number) => void;
}

export function CategoryCard({ category, onEdit, onClick }: CategoryCardProps) {
  const isMain = category.type === "main";

  return (
    <button 
      className={`${styles.card} ${isMain ? styles.mainVariant : styles.otherVariant}`}
      onClick={() => onClick(category.id)}
      type="button"
    >
      <h3 className={styles.title}>{category.name}</h3>
      <p className={styles.subtitle}>
        {category.groupCount} {category.groupCount === 1 ? "grupo" : "grupos"}
      </p>
      
      <div 
        className={styles.editIcon} 
        onClick={(e) => {
          e.stopPropagation();
          onEdit(category.id);
        }}
        role="button"
        aria-label="Editar categoría"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </div>
    </button>
  );
}