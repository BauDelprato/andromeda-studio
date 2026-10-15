import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type CrewLevel, getCrewMaxCapacity } from "../types/crew";
import { useCrewProfile } from "../hooks/useCrewProfile";
import { CrewSearchSelect } from "../components/CrewSearchSelect/CrewSearchSelect";
import { Button } from "@/components/Button/Button";

export default function CrewProfile() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const levelEnum = Number(categoryId) as CrewLevel;
  const navigate = useNavigate();

  const { 
    categoryCrews, selectedCrew, setSelectedCrew, crewStudents, 
    isLoading, handleRemoveStudent 
  } = useCrewProfile(levelEnum);

  const [studentSearchTerm, setStudentSearchTerm] = useState("");

  const categoryName = levelEnum === 0 ? "Recreativo" : levelEnum === 1 ? "Competencia" : "Elite";

  if (isLoading) return <div style={{ padding: "24px" }}>Cargando...</div>;

  const filteredStudents = crewStudents.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(studentSearchTerm.toLowerCase()) || student.dni.includes(studentSearchTerm);
  });

  return (
    <div style={{ padding: "24px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>{categoryName}</h1>
          <div style={{ width: "350px" }}>
            <CrewSearchSelect 
              crews={categoryCrews} 
              selectedCrew={selectedCrew} 
              onSelect={setSelectedCrew} 
            />
          </div>
        </div>
        
        {selectedCrew && (
          <button 
            style={{ background: "none", border: "none", color: "#6b5b95", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}
            onClick={() => console.log("A futuro: Navegar a editar la crew ID:", selectedCrew.id)}
          >
            Editar Crew <span></span>
          </button>
        )}
      </header>

      {!selectedCrew ? (
        <div style={{ color: "#666" }}>Selecciona una crew en el buscador para ver sus detalles.</div>
      ) : (
        <div>
          <div style={{ backgroundColor: "#dcd6e3", padding: "16px", borderRadius: "8px", marginBottom: "48px", width: "fit-content" }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>
              Alumnos totales: {crewStudents.length}/{getCrewMaxCapacity(selectedCrew.size)}
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "center" }}>
            <input
              type="search"
              placeholder="Buscar alumno..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              style={{ flex: 1, padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", fontSize: "14px" }}
            />
            <Button 
              style={{ padding: "10px 24px", width: "auto", flexShrink: 0 }}
              onClick={() => navigate(`/crews/add-student/${selectedCrew.id}`)}
            >
              + Añadir
            </Button>
          </div>

          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", color: "#666" }}>
                <th style={{ padding: "12px 8px" }}>Nombre</th>
                <th style={{ padding: "12px 8px" }}>DNI</th>
                <th style={{ padding: "12px 8px" }}>Estado</th>
                <th style={{ padding: "12px 8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "16px 8px", textAlign: "center", color: "#666" }}>
                    {studentSearchTerm ? "No se encontraron alumnos con esa búsqueda." : "No hay alumnos inscriptos en esta crew."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "16px 8px", fontWeight: "500" }}>{student.firstName} {student.lastName}</td>
                    <td style={{ padding: "16px 8px" }}>{student.dni}</td>
                    <td style={{ padding: "16px 8px" }}>{student.isActive ? "Activo" : "Inactivo"}</td>
                    <td style={{ padding: "16px 8px", textAlign: "right" }}>
                      
                      {/* Contenedor Flex para alinear los botones a la derecha */}
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <Button 
                          style={{ padding: "8px 16px", fontSize: "12px", backgroundColor: "#7b6b9e", width: "auto" }}
                          onClick={() => console.log("A futuro: Ver historial de pagos del alumno ID:", student.id)}
                        >
                          historial de pagos
                        </Button>
                        <Button 
                          style={{ padding: "8px 16px", fontSize: "12px", backgroundColor: "#dc3545", width: "auto" }}
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
        </div>
      )}
    </div>
  );
}