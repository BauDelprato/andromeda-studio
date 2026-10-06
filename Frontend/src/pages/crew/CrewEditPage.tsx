import { useState, type FormEvent } from "react";
import { LuPlus } from "react-icons/lu";
import StatusBadge from "../../components/statusbadge/StatusBadge";
import "./CrewEditPage.css";

type Level = "Recreativo" | "Competitivo" | "Elite";
type CrewStatus = "Activo" | "Inactivo";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const TIMES = Array.from({ length: 31 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
});

export default function CrewEditPage() {
  const [level, setLevel] = useState<Level>("Recreativo");
  const [status, setStatus] = useState<CrewStatus>("Activo");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Lunes", "Miércoles"]);

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="crew-edit" onSubmit={handleSubmit}>
        <div className="crew-edit__heading">
          <div>
            <p className="crew-edit__eyebrow">Grupos</p>
            <h2 className="crew-edit__title">Editar grupo</h2>
          </div>
          <StatusBadge variant={status === "Activo" ? "positive" : "negative"}>
            {status}
          </StatusBadge>
        </div>

        <section className="crew-edit__panel" aria-label="Datos del grupo">
          <div className="crew-edit__top-row">
            <label className="crew-edit__field crew-edit__level">
              <span>Nivel</span>
              <select value={level} onChange={(event) => setLevel(event.target.value as Level)}>
                <option>Recreativo</option>
                <option>Competitivo</option>
                <option>Elite</option>
              </select>
            </label>
            <label className="crew-edit__field crew-edit__level">
              <span>Estado</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as CrewStatus)}>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </label>
          </div>

          <div className="crew-edit__fields">
            <label className="crew-edit__field">
              <span>Nombre grupo</span>
              <input name="name" placeholder="Ej: Hip Hop Kids" />
            </label>
            <label className="crew-edit__field">
              <span>Profe</span>
              <input name="teacherName" placeholder="Nombre del profe" />
            </label>
            <label className="crew-edit__field">
              <span>Cuota</span>
              <span className="crew-edit__currency">
                <span aria-hidden="true">$</span>
                <input name="fee" inputMode="decimal" placeholder="0" />
              </span>
            </label>

            <fieldset className="crew-edit__field crew-edit__days">
              <legend>Días</legend>
              <div className="crew-edit__day-list">
                {selectedDays.map((day) => (
                  <button key={day} type="button" className="crew-edit__day is-selected" onClick={() => toggleDay(day)}>
                    {day}<span aria-hidden="true">×</span>
                  </button>
                ))}
                <div className="crew-edit__add-day">
                  <button
                    type="button"
                    className="crew-edit__add-button"
                    aria-label="Agregar día"
                    onClick={() => {
                      const next = DAYS.find((day) => !selectedDays.includes(day));
                      if (next) toggleDay(next);
                    }}
                  >
                    <LuPlus size={16} aria-hidden="true" />
                  </button>
                  <span className="crew-edit__add-hint">Agregar día</span>
                </div>
              </div>
            </fieldset>

            <div className="crew-edit__schedule">
              <label className="crew-edit__field">
                <span>Desde</span>
                <select name="startTime" defaultValue="19:00">
                  {TIMES.map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>
              <label className="crew-edit__field">
                <span>Hasta</span>
                <select name="endTime" defaultValue="20:30">
                  {TIMES.map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>
            </div>
          </div>

          <footer className="crew-edit__footer">
            <button type="submit" className="crew-edit__save">Guardar</button>
          </footer>
        </section>
    </form>
  );
}
