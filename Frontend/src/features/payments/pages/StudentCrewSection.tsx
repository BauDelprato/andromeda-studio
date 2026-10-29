import { StudentSearchSelect } from "@/features/crews/components/StudentSearchSelect/StudentSearchSelect";
import type { Crew } from "@/features/crews/types/crew";
import type { StudentCrewResponse } from "@/features/crews/types/studentCrew";
import type { Student } from "@/features/students/types/student";
import styles from "./PaymentRegisterPage.module.css";

interface StudentCrewSelection {
  relation: StudentCrewResponse;
  crew: Crew;
}

interface StudentCrewSectionProps {
  students: Student[];
  student: Student | null;
  availableCrews: StudentCrewSelection[];
  selectedCrews: StudentCrewSelection[];
  isLoadingCharges: boolean;
  chargesError: string | null;
  hasGeneralCharges: boolean;
  onSelectStudent: (student: Student) => void;
  onAddCrew: (studentCrewId: number) => void;
}

export function StudentCrewSection({
  students,
  student,
  availableCrews,
  selectedCrews,
  isLoadingCharges,
  chargesError,
  hasGeneralCharges,
  onSelectStudent,
  onAddCrew,
}: StudentCrewSectionProps) {
  const availableCrewsToAdd = availableCrews.filter(
    ({ relation }) => !selectedCrews.some((item) => item.relation.id === relation.id),
  );

  return (
    <section className={styles.group}>
      <div className={styles.sectionHeading}>
        <div><h2>Alumno y crews</h2><p>Buscá por nombre o DNI para ver sus crews asociadas</p></div>
      </div>
      <label className={styles.field}>
        <span>Alumno</span>
        <StudentSearchSelect
          students={students}
          selectedStudent={student}
          onSelect={onSelectStudent}
        />
      </label>
      {student && (
        <label className={styles.field}>
          <span>Crew asociada</span>
          <div className={styles.selectWrap}>
            <select
              value=""
              onChange={(event) => {
                const studentCrewId = Number(event.target.value);
                if (studentCrewId) onAddCrew(studentCrewId);
              }}
              disabled={!availableCrewsToAdd.length}
            >
              <option value="">Seleccionar crew</option>
              {availableCrewsToAdd.map(({ relation, crew }) => (
                <option key={relation.id} value={relation.id}>{crew.name}</option>
              ))}
            </select>
          </div>
        </label>
      )}
      {!student && <p className={styles.hint}>Los cargos se mostrarán después de seleccionar un alumno.</p>}
      {isLoadingCharges && <p className={styles.hint}>Cargando cargos pendientes...</p>}
      {chargesError && <p className={styles.error} role="alert">{chargesError}</p>}
      {student && !isLoadingCharges && availableCrews.length === 0 && !hasGeneralCharges && (
        <div className={styles.emptyNotice}>Este alumno no tiene crews asociadas ni cargos pendientes.</div>
      )}
    </section>
  );
}
