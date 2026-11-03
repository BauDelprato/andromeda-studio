import { createElement } from "react";
import StatusBadge from "@/components/statusbadge/StatusBadge";
import { Button } from "@/components/Button/Button";
import type { TableColumn } from "@/components/table/types";
import type { Student } from "@/features/students/types/student";

export const getStudentTableColumns = (onNavigate: (path: string) => void): TableColumn<Student>[] => [
  {
    header: "Nombre",
    render: (student) => `${student.firstName} ${student.lastName}`,
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
  {
    header: "",
    render: (student) =>
      createElement(Button, {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onNavigate(`/students/${student.id}/payments`);
        },
        children: "Pagos"
      }),
  }
];