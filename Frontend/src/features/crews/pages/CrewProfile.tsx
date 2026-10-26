import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type CrewLevel, getCrewMaxCapacity, CREW_LEVEL_NAMES } from "../types/crew";
import { useCrewProfile } from "../hooks/useCrewProfile";
import { CrewSearchSelect } from "../components/CrewSearchSelect/CrewSearchSelect";
import { Button } from "@/components/Button/Button";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import type { Student } from "@/features/students/types/student";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { LuPencil } from "react-icons/lu"; 
import styles from "./CrewProfile.module.css";

export default function CrewProfile() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const levelEnum = Number(categoryId) as CrewLevel;
  const categoryName = CREW_LEVEL_NAMES[levelEnum] || "Categoría Desconocida";

  const { 
    categoryCrews, selectedCrew, setSelectedCrew, crewStudents, 
    isLoading, handleRemoveStudent,
    isLoadingStudents, studentsError, reloadStudents
  } = useCrewProfile(levelEnum);

  const [studentSearchTerm, setStudentSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return crewStudents.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(studentSearchTerm.toLowerCase()) || student.dni.includes(studentSearchTerm);
    });
  }, [crewStudents, studentSearchTerm]);

  const tableColumns: TableColumn<Student>[] = [
    {
      header: "Nombre",
      className: styles.tdName,
      render: (student) => `${student.firstName} ${student.lastName}`,
    },
    {
      header: "DNI",
      render: (student) => student.dni,
    },
    {
      header: "Estado",
      render: (student) => (
        <span className={student.isActive ? styles.statusActive : styles.statusInactive}>
          {student.isActive ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "", 
      render: (student) => (
        <div className={styles.actionWrapper}>
          <Button 
            className={styles.historyButton} 
            disabled
            title="Próximamente"
          >
            Historial de pagos
          </Button>
          <Button 
            className={styles.deleteButton}
            onClick={() => handleRemoveStudent(student.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className={styles.loading}>Cargando...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{categoryName}</h1>
          <div className={styles.searchSelectWrapper}>
            <CrewSearchSelect 
              crews={categoryCrews} 
              selectedCrew={selectedCrew} 
              onSelect={setSelectedCrew} 
            />
          </div>
        </div>
        
        {selectedCrew && (
          <button 
            className={styles.editButton} 
            title="Editar Crew"
            onClick={() => navigate(`/crews/${selectedCrew.id}/edit`)}
          >
            Editar Crew <LuPencil size={18} />
          </button>
        )}
      </header>

      {!selectedCrew ? (
        <div className={styles.emptyState}>Selecciona una crew en el buscador para ver sus detalles.</div>
      ) : (
        <>
          {/* Nueva Tarjeta de Estadísticas Visual */}
          <div className={styles.statsCard}>
            <span className={styles.statsTitle}>Alumnos totales:</span>
            <div className={styles.progressRow}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${Math.min((crewStudents.length / getCrewMaxCapacity(selectedCrew.size)) * 100, 100)}%` }}
                ></div>
              </div>
              <span className={styles.statsCount}>
                {crewStudents.length}/{getCrewMaxCapacity(selectedCrew.size)}
              </span>
            </div>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <SearchBar
                value={studentSearchTerm}
                onChange={setStudentSearchTerm}
                placeholder="Buscar alumno..."
              />
            </div>
            <Button className={styles.addButton} onClick={() => navigate(`/crews/add-student/${selectedCrew.id}`)}>
              + Añadir
            </Button>
          </div>

          <Table 
            data={filteredStudents}
            columns={tableColumns}
            isLoading={isLoadingStudents} 
            error={studentsError} 
            onRetry={reloadStudents}
            emptyMessage={studentSearchTerm ? "No se encontraron alumnos con esa búsqueda." : "No hay alumnos inscriptos."}
            getRowKey={(student) => student.id}
          />
        </>
      )}
    </div>
  );
}