import { SearchBar } from "@/components/searchbar/Searchbar";
import { StatCard } from "@/components/statcard/Statcard";
import { Table } from "@/components/table/Table";
import type { Student } from "@/types/student/student";
import { useStudentSearch } from "@/hooks/student/useStudentSearch";
import { useStudents } from "@/hooks/student/useStudents";
import { studentTableColumns } from "@/constants/studentTableColumns";
import { useNavigate } from "react-router-dom";

import styles from "./Students.module.css";

function Students() {
const navigate = useNavigate();
const {
students,
isLoading,
error,
reload,
} = useStudents();

const {
    search,
    setSearch,
    filteredStudents,
} = useStudentSearch(students);


const handleSelectStudent = (student: Student) => {
  navigate(`/students/${student.id}`);
};


return ( <section className={styles.screen}> <div className={styles.content}> <div> <h2>Gestión de Alumnos</h2>


      <p>
        Administra los alumnos registrados en Andrómeda Studio.
      </p>
    </div>

    <StatCard
      label="Total de Alumnos"
      value={students.length}
    />

      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: "16px" }}>
      <button 
        onClick={() => navigate("/students/add")}
        style={{
          backgroundColor: "#6b5b95",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "14px",
          cursor: "pointer"
        }}
      >
        + Añadir Alumno
      </button>
    </div>

    <div className={styles.topRow}>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar alumno"
      />
    </div>

    <Table<Student>
      data={filteredStudents}
      columns={studentTableColumns}
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      onRowClick={handleSelectStudent}
      emptyMessage={
        search
          ? "No se encontraron alumnos."
          : "No hay alumnos para mostrar."
      }
    />
  </div>
</section>


);
}

export default Students;