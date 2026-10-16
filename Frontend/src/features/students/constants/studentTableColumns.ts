// constants/studentTableColumns.ts

import { createElement } from "react";
import StatusBadge from "@/components/statusbadge/StatusBadge";
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
      createElement(StatusBadge, {
        variant: student.isActive ? "positive" : "negative",
        children: student.isActive ? "Activo" : "Inactivo",
      }),
  },
];