// hooks/useStudentSearch.ts
import { useMemo, useState } from "react";
import type { Student } from "@/features/students/types/student";

export function useStudentSearch(students: Student[]) {
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return students;
    }

    return students.filter((student) => {
      const fullName =
        `${student.firstName} ${student.lastName}`.toLowerCase();

      return (
        fullName.includes(searchValue) ||
        student.dni.includes(searchValue)
      );
    });
  }, [students, search]);

  return {
    search,
    setSearch,
    filteredStudents,
  };
}