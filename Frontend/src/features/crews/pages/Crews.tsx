import { useState } from "react";
import { useCrewCategories } from "../hooks/useCrewCategories";
import { CategoryCard } from "../components/CategoryCard/CategoryCard";
import styles from "./Crews.module.css";
import { Button } from "@/components/Button/Button";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/searchbar/Searchbar"; 

export default function Crews() {
  const { categories, isLoading, error } = useCrewCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    console.log("Navegar a edición de categoría:", id);
  };

  const handleOpenCategory = (id: number) => {
    navigate(`/crews/${id}`);
  };

  const filteredCategories = categories.filter((c) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mainCategories = filteredCategories.filter((c) => c.type === "main");
  const otherCategories = filteredCategories.filter((c) => c.type === "other");

  if (isLoading) return <div className={styles.stateMessage}>Cargando clases...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.container}>
      <section className={styles.content}>
        
        <header className={styles.header}>
          <h2 className={styles.sectionTitle}>Categorías</h2>
        </header>
        
        <section className={styles.searchSection}>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar crews..." 
          />
        </section>

        {mainCategories.length > 0 && (
          <div className={styles.grid}>
            {mainCategories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onEdit={handleEdit}
                onClick={handleOpenCategory}
              />
            ))}
          </div>
        )}

        {otherCategories.length > 0 && (
          <>
            <h2 className={`${styles.sectionTitle} ${styles.otherTitle}`}>Otros</h2>
            <div className={styles.grid}>
              {otherCategories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  onEdit={handleEdit}
                  onClick={handleOpenCategory}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <aside className={styles.sidebar}>
        <h2>Accesos rápidos</h2>
        
        <div className={styles.quickActions}>
          <Button onClick={() => console.log("Actualizar cuotas")}>Actualizar cuotas</Button>
          <Button onClick={() => console.log("Establecer cupos")}>Establecer cupos</Button>
          <Button onClick={() => navigate("/crews/create")}>+ Crear Crew</Button>
        </div>
        
      </aside>
    </div>
  );
}
