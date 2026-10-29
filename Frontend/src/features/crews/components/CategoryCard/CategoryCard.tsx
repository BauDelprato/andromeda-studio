import type { CrewCategory } from "../../types/crew";
import styles from "./CategoryCard.module.css";

interface CategoryCardProps {
  category: CrewCategory;
  onClick: (id: number) => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
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
      
      
    </button>
  );
}