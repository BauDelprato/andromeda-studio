import { useState } from "react";
import { LuPlus, LuTriangleAlert, LuUsers } from "react-icons/lu";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { StatCard } from "@/components/statcard/Statcard";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import type { Student } from "@/types/student/student";
import { useStudents } from "@/hooks/useStudents";
import styles from "./Students.module.css";

function getInitials(firstName: string, lastName: string): string {
  const f = firstName?.trim().charAt(0) || "";
  const l = lastName?.trim().charAt(0) || "";
  return `${f}${l}`.toUpperCase() || "—";
}

function formatDni(dni: string): string {
  if (!dni) return "—";
  const clean = dni.replace(/\D/g, "");
  if (clean.length === 8) {
    return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
  }
  if (clean.length === 7) {
    return `${clean.slice(0, 1)}.${clean.slice(1, 4)}.${clean.slice(4)}`;
  }
  return dni;
}

function Students() {
  const { students, isLoading, error, reload } = useStudents();
  const [search, setSearch] = useState("");

  const pendingFitnessCount = students.filter((s) => !s.fitnessCertificate).length;

  const filteredStudents = students.filter((student) => {
    const searchValue = search.toLowerCase().trim();
    if (!searchValue) return true;

    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return (
      fullName.includes(searchValue) ||
      student.dni.includes(searchValue) ||
      (student.phone && student.phone.includes(searchValue))
    );
  });

  const handleSelectStudent = (student: Student) => {
    console.log("Alumno seleccionado:", student);
  };

  const studentColumns: TableColumn<Student>[] = [
    {
      header: "Alumno",
      render: (student) => (
        <div className={styles.studentCell}>
          <div className={styles.studentAvatar}>
            {getInitials(student.firstName, student.lastName)}
          </div>
          <span className={styles.studentName}>
            {student.firstName} {student.lastName}
          </span>
        </div>
      ),
    },
    {
      header: "DNI",
      render: (student) => formatDni(student.dni),
    },
    {
      header: "Teléfono",
      render: (student) => student.phone || "—",
    },
    {
      header: "Estado",
      render: (student) =>
        student.isActive ? (
          <span className={styles.badgeActive}>Activo</span>
        ) : (
          <span className={styles.badgeInactive}>Inactivo</span>
        ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Top Bar: Metric + Add Student Action */}
      <div className={styles.topBar}>
        <StatCard
          label="Alumnos totales"
          value={students.length}
          isLoading={isLoading}
          icon={<LuUsers size={22} />}
        />

        <button
          type="button"
          className={styles.addButton}
          onClick={() => console.log("Añadir alumno")}
        >
          <LuPlus size={18} />
          <span>Añadir alumno</span>
        </button>
      </div>

      {/* Alert Banner for pending fitness certificate */}
      {pendingFitnessCount > 0 && (
        <div className={styles.alert}>
          <LuTriangleAlert size={18} className={styles.alertIcon} />
          <span>
            {pendingFitnessCount} alumno(s) con apto físico pendiente o vencido.
            Revisá su documentación.
          </span>
        </div>
      )}

      {/* Students List Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableCardHeader}>
          <h2 className={styles.tableCardTitle}>Listado de alumnos</h2>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar alumno..."
          />
        </div>

        <Table<Student>
          data={filteredStudents}
          columns={studentColumns}
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
    </div>
  );
}

export default Students;