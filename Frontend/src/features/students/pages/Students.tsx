import { SearchBar } from "@/components/searchbar/Searchbar";
import { StatCard } from "@/components/statcard/Statcard";
import { Table } from "@/components/table/Table";
import type { Student } from "@/features/students/types/student";
import { useStudentSearch } from "@/features/students/hooks/useStudentSearch";
import { useStudents } from "@/features/students/hooks/useStudents";
import { studentTableColumns } from "@/features/students/constants/studentTableColumns";
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

  const handleAddStudent = () => {
    navigate("/students/add");
  };

  return (
    <section className={styles.screen}>
      <div className={styles.content}>

        <div>
          <h2>Gestión de Alumnos</h2>

          <p>
            Administra los alumnos registrados en Andrómeda Studio.
          </p>
        </div>

        <StatCard
          label="Total de Alumnos"
          value={students.length}
        />

        <div className={styles.addStudentContainer}>
          <button
            className={styles.addButton}
            onClick={handleAddStudent}
            type="button"
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