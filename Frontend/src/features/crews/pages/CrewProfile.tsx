import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type CrewLevel, getCrewMaxCapacity, CREW_LEVEL_NAMES } from "../types/crew";
import { useCrewProfile } from "../hooks/useCrewProfile";
import { CrewSearchSelect } from "../components/CrewSearchSelect/CrewSearchSelect";
import { Button } from "@/components/Button/Button";
import styles from "./CrewProfile.module.css";

export default function CrewProfile() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const levelEnum = Number(categoryId) as CrewLevel;
  const categoryName = CREW_LEVEL_NAMES[levelEnum] || "Categoría Desconocida";

  const { 
    categoryCrews, selectedCrew, setSelectedCrew, crewStudents, 
    isLoading, handleRemoveStudent 
  } = useCrewProfile(levelEnum);

  const [studentSearchTerm, setStudentSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return crewStudents.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(studentSearchTerm.toLowerCase()) || student.dni.includes(studentSearchTerm);
    });
  }, [crewStudents, studentSearchTerm]);

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
          <button className={styles.editButton} onClick={() => console.log("Editar:", selectedCrew.id)}>
            Editar Crew <span></span>
          </button>
        )}
      </header>

      {!selectedCrew ? (
        <div className={styles.emptyState}>Selecciona una crew en el buscador para ver sus detalles.</div>
      ) : (
        <>
          <div className={styles.statsCard}>
            <p className={styles.statsText}>
              Alumnos totales: {crewStudents.length}/{getCrewMaxCapacity(selectedCrew.size)}
            </p>
          </div>

          <div className={styles.toolbar}>
            <input
              type="search"
              placeholder="Buscar alumno..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <Button className={styles.addButton} onClick={() => navigate(`/crews/add-student/${selectedCrew.id}`)}>
              + Añadir
            </Button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nombre</th>
                <th className={styles.th}>DNI</th>
                <th className={styles.th}>Estado</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.tdEmpty}>
                    {studentSearchTerm ? "No se encontraron alumnos con esa búsqueda." : "No hay alumnos inscriptos."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className={styles.tr}>
                    <td className={styles.tdName}>{student.firstName} {student.lastName}</td>
                    <td className={styles.td}>{student.dni}</td>
                    <td className={styles.td}>{student.isActive ? "Activo" : "Inactivo"}</td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionWrapper}>
                        <Button className={styles.historyButton} onClick={() => console.log("Ver historial")}>
                          Historial
                        </Button>
                        <Button 
                          className={styles.deleteButton}
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}