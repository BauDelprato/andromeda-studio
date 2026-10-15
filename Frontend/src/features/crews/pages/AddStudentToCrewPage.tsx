import { useParams, useNavigate } from "react-router-dom";
import { getCrewMaxCapacity } from "../types/crew";
import { useAddStudentToCrew } from "../hooks/useAddStudentToCrew";
import { StudentSearchSelect } from "../components/StudentSearchSelect/StudentSearchSelect";
import { Button } from "@/components/Button/Button";

export default function AddStudentToCrewPage() {
  const { crewId } = useParams<{ crewId: string }>();
  const navigate = useNavigate();
  
  const { 
    crew, currentStudentsCount, allStudents, 
    selectedStudent, setSelectedStudent, 
    handleAddStudent, isSubmitting, successMsg, errorMsg, isLoading 
  } = useAddStudentToCrew(Number(crewId));

  if (isLoading) return <div style={{ padding: "24px" }}>Cargando datos...</div>;
  if (!crew) return <div style={{ padding: "24px", color: "red" }}>No se encontró la crew.</div>;

  const maxCapacity = getCrewMaxCapacity(crew.size);
  const isFull = currentStudentsCount >= maxCapacity;

  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ margin: 0, fontSize: "28px" }}>Añadir Alumno</h1>
        <Button onClick={() => navigate(-1)} style={{ width: "auto", backgroundColor: "#999" }}>
          Volver
        </Button>
      </header>

      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", border: "1px solid #eee", marginBottom: "32px" }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#333" }}>{crew.name}</h2>
        <div style={{ display: "flex", gap: "24px", color: "#666" }}>
          <p style={{ margin: 0 }}>Nivel: <strong>{crew.level === 0 ? "Recreativo" : crew.level === 1 ? "Competencia" : "Elite"}</strong></p>
          <p style={{ margin: 0, color: isFull ? "red" : "#666" }}>
            Cupo: <strong>{currentStudentsCount} / {maxCapacity}</strong>
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Seleccionar Alumno</label>
        <StudentSearchSelect 
          students={allStudents} 
          selectedStudent={selectedStudent} 
          onSelect={setSelectedStudent} 
        />
        <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
          *Solo aparecen alumnos activos que no están en esta crew.
        </p>
      </div>

      {successMsg && <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "8px", marginBottom: "24px" }}>{successMsg}</div>}
      {errorMsg && <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "12px", borderRadius: "8px", marginBottom: "24px" }}>{errorMsg}</div>}

      <Button 
        onClick={handleAddStudent} 
        disabled={!selectedStudent || isSubmitting || isFull}
        style={{ width: "100%", padding: "14px", opacity: (!selectedStudent || isFull) ? 0.5 : 1 }}
      >
        {isSubmitting ? "Agregando..." : isFull ? "La crew está llena" : "Vincular Alumno"}
      </Button>
    </div>
  );
}