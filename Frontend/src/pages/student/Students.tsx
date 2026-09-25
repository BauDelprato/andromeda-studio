import { SearchBar } from "@/components/searchbar/Searchbar";
import { StatCard } from "@/components/statcard/Statcard";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import type { Student } from "@/types/student/student";
import { useStudents } from "@/hooks/useStudents";

import { useState } from "react";

function Students() {
  const {
    students,
    isLoading,
    error,
    reload,
  } = useStudents();

  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    const fullName =
      `${student.firstName} ${student.lastName}`.toLowerCase();

    return (
      fullName.includes(searchValue) ||
      student.dni.includes(searchValue)
    );
  });

  const handleSelectStudent = (student: Student) => {
    console.log("Alumno seleccionado:", student);
  };

  const studentColumns: TableColumn<Student>[] = [
    {
      header: "Nombre",
      render: (student) =>
        `${student.firstName} ${student.lastName}`,
    },
    {
      header: "DNI",
      render: (student) => student.dni,
    },
    {
      header: "Teléfono",
      render: (student) => student.phone,
    },
    {
      header: "Estado",
      render: (student) =>
        student.isActive ? "Activo" : "Inactivo",
    },
  ];

  return (
    <section>
      <h2>Gestión de Alumnos</h2>

      <p>
        Administra los alumnos registrados en Andrómeda Studio.
      </p>

      <StatCard
        label="Total de Alumnos"
        value={students.length}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar alumno"
      />

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
    </section>
  );
}

export default Students;