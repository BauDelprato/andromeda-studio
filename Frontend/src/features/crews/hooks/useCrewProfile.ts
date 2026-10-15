import { useState, useEffect, useCallback } from "react";
import { getCrews } from "@/api/crewApi";
import { getStudentCrewsByCrew, removeStudentFromCrewApi } from "@/api/studentCrewApi";
import { getStudents } from "@/api/studentApi"; 
import type { Crew, CrewLevel } from "../types/crew";
import type { Student } from "@/features/students/types/student";

export function useCrewProfile(categoryId: CrewLevel) {
  const [categoryCrews, setCategoryCrews] = useState<Crew[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [crewStudents, setCrewStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedCrew) return;
    if (!window.confirm("¿Seguro que deseas eliminar a este alumno de la crew?")) return;
    try {
      await removeStudentFromCrewApi(studentId, selectedCrew.id);
      setCrewStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (error) {
      console.error("Error al eliminar alumno", error);
      alert("Hubo un error al intentar eliminar al alumno.");
    }
  };

  useEffect(() => {
    const loadCrews = async () => {
      try {
        const allCrews = await getCrews();
        const filtered = allCrews.filter((c) => c.level === categoryId);
        setCategoryCrews(filtered);
      } catch (error) {
        console.error("Error al cargar crews", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCrews();
  }, [categoryId]);

  const loadStudentsData = useCallback(async () => {
    if (!selectedCrew) {
      setCrewStudents([]);
      return;
    }

    setIsLoadingStudents(true);
    setStudentsError(null);

    try {
      const studentCrews = await getStudentCrewsByCrew(selectedCrew.id);
      const allStudents = await getStudents(); 
      const joinedStudents = allStudents.filter((student) => 
        studentCrews.some((sc) => sc.studentId === student.id)
      );
      setCrewStudents(joinedStudents);
    } catch (error) {
      console.error("Error al cruzar datos", error);
      setStudentsError("Ocurrió un error al cargar la lista de alumnos.");
    } finally {
      setIsLoadingStudents(false);
    }
  }, [selectedCrew]);

  useEffect(() => {
    loadStudentsData();
  }, [loadStudentsData]);

  return { 
    categoryCrews, selectedCrew, setSelectedCrew, crewStudents, 
    isLoading, handleRemoveStudent, 
    isLoadingStudents, studentsError, reloadStudents: loadStudentsData
  };
}