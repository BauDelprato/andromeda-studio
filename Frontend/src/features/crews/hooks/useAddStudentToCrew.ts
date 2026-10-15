import { useState, useEffect } from "react";
import { getCrews } from "@/api/crewApi";
import { getStudents } from "@/api/studentApi";
import { getStudentCrewsByCrew, addStudentToCrewApi } from "@/api/studentCrewApi";
import type { Crew } from "../types/crew";
import type { Student } from "@/features/students/types/student";

export function useAddStudentToCrew(crewId: number) {
  const [crew, setCrew] = useState<Crew | null>(null);
  const [currentStudentsCount, setCurrentStudentsCount] = useState(0);
  
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [crewsData, studentsData, studentCrewsData] = await Promise.all([
          getCrews(),
          getStudents(),
          getStudentCrewsByCrew(crewId)
        ]);

        const foundCrew = crewsData.find(c => c.id === crewId) || null;
        setCrew(foundCrew);
        setCurrentStudentsCount(studentCrewsData.length);
        
        const availableStudents = studentsData.filter(s => 
          !studentCrewsData.some(sc => sc.studentId === s.id)
        );
        setAllStudents(availableStudents);
      } catch (error) {
        setErrorMsg("Error al cargar la información.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [crewId]);

  const handleAddStudent = async () => {
    if (!selectedStudent || !crew) return;
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await addStudentToCrewApi(selectedStudent.id, crew.id);
      setSuccessMsg(`Agregado correctamente a "${crew.name}"`);
      setCurrentStudentsCount(prev => prev + 1);
      setAllStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      setSelectedStudent(null);
    } catch (error) {
      setErrorMsg("Error al conectar el alumno a la crew. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    crew, 
    currentStudentsCount, 
    allStudents, 
    selectedStudent, 
    setSelectedStudent, 
    handleAddStudent, 
    isSubmitting, 
    successMsg, 
    errorMsg, 
    isLoading 
  };
}