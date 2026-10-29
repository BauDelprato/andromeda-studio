import { LuReceipt } from "react-icons/lu";
import { PaymentCrewCard } from "@/features/payments/components/PaymentCrewCard";
import type { Crew } from "@/features/crews/types/crew";
import type { StudentCrewResponse } from "@/features/crews/types/studentCrew";
import type { PaymentCharge, PaymentChargeSelection } from "@/features/payments/types/payment";
import styles from "./PaymentRegisterPage.module.css";

interface CrewSelection {
  relation: StudentCrewResponse;
  crew: Crew;
}

interface PaymentChargesSectionProps {
  hasStudent: boolean;
  isLoadingCharges: boolean;
  chargesError: string | null;
  availableCrews: CrewSelection[];
  selectedCrews: CrewSelection[];
  generalCharges: PaymentCharge[];
  selectedChargeIds: number[];
  getSelectionsForCrew: (relation: StudentCrewResponse, crew: Crew) => PaymentChargeSelection[];
  onToggleCharge: (chargeId: number) => void;
  onRemoveCrew: (studentCrewId: number) => void;
  onSelectPeriods: (relation: StudentCrewResponse, crew: Crew) => void;
  onGenerateCharges: () => void;
}

export function PaymentChargesSection({
  hasStudent,
  isLoadingCharges,
  chargesError,
  availableCrews,
  selectedCrews,
  generalCharges,
  selectedChargeIds,
  getSelectionsForCrew,
  onToggleCharge,
  onRemoveCrew,
  onSelectPeriods,
  onGenerateCharges,
}: PaymentChargesSectionProps) {
  const generalChargeSelections: PaymentChargeSelection[] = generalCharges.map((charge) => ({
    charge,
    crewName: "Cargos generales",
  }));

  return (
    <section className={styles.group}>
      <div className={styles.sectionHeading}>
        <div><h2>Cargos a pagar</h2><p>Solo se muestran cargos pendientes de este alumno</p></div>
      </div>
      {hasStudent && !isLoadingCharges && (
        <>
          {selectedCrews.length > 0 && (
            <div className={styles.crewList}>
              {selectedCrews.map(({ relation, crew }) => (
                <PaymentCrewCard
                  key={relation.id}
                  crewName={crew.name}
                  selections={getSelectionsForCrew(relation, crew)}
                  selectedChargeIds={selectedChargeIds}
                  onToggleCharge={onToggleCharge}
                  onRemove={() => onRemoveCrew(relation.id)}
                  onSelectPeriods={() => onSelectPeriods(relation, crew)}
                  onGenerateCharges={onGenerateCharges}
                />
              ))}
            </div>
          )}
          {generalChargeSelections.length > 0 && (
            <div className={styles.crewList}>
              <PaymentCrewCard
                crewName="Cargos generales"
                selections={generalChargeSelections}
                selectedChargeIds={selectedChargeIds}
                onToggleCharge={onToggleCharge}
                onSelectPeriods={() => undefined}
                onGenerateCharges={() => undefined}
                showActions={false}
              />
            </div>
          )}
          {selectedCrews.length === 0 && generalChargeSelections.length === 0 && !chargesError && (
            <div className={styles.emptyCrew}>
              <span className={styles.emptyIcon}><LuReceipt size={20} /></span>
              <div>
                <strong>
                  {availableCrews.length ? "Agregá una crew para comenzar" : "Este alumno no tiene cargos pendientes"}
                </strong>
                <p>
                  {availableCrews.length
                    ? "Al agregar una crew vas a ver sus cargos pendientes."
                    : "Los cargos pendientes se mostrarán aquí cuando existan."}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
