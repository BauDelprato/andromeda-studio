// constants/studentTableColumns.ts

import type { TableColumn } from "@/components/table/types";
import type { Student } from "@/features/students/types/student";

export const studentTableColumns: TableColumn<Student>[] = [
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