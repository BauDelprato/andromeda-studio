import { useCallback, useEffect, useState } from "react";
import { getCharges } from "@/api/chargeApi";
import { getCrews } from "@/api/crewApi";
import { getStudentCrews } from "@/api/studentCrewApi";
import { getStudents } from "@/api/studentApi";
import type { Charge } from "@/features/payments/types/charge";
import type { Crew } from "@/features/crews/types/crew";
import type { StudentCrewResponse } from "@/features/crews/types/studentCrew";
import type { Student } from "@/features/students/types/student";

export function usePaymentDashboard() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [studentCrews, setStudentCrews] = useState<StudentCrewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [chargeData, studentData, crewData, studentCrewData] = await Promise.all([
        getCharges(),
        getStudents(),
        getCrews(),
        getStudentCrews(),
      ]);
      setCharges(chargeData);
      setStudents(studentData);
      setCrews(crewData);
      setStudentCrews(studentCrewData);
    } catch {
      setError("No se pudo cargar la información de pagos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { charges, students, crews, studentCrews, isLoading, error, reload };
}
