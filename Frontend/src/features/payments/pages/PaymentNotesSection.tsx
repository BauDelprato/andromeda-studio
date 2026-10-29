import styles from "./PaymentRegisterPage.module.css";

interface PaymentNotesSectionProps {
  notes: string;
  onChange: (notes: string) => void;
}

export function PaymentNotesSection({ notes, onChange }: PaymentNotesSectionProps) {
  return (
    <label className={styles.field}>
      <span>Notas <small>(opcional)</small></span>
      <textarea
        className={styles.control}
        value={notes}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Agregar una nota"
        rows={2}
      />
    </label>
  );
}
