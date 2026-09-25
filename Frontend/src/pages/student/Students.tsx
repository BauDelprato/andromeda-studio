import { SearchBar } from "@/components/searchbar/Searchbar";
import { StatCard } from "@/components/statcard/Statcard";
import { useState } from "react";

function Students() {
  const [search, setSearch] = useState("");

  return (
    <section>
      <h2>Gestión de Alumnos</h2>
      <p>Administra los alumnos registrados en Andrómeda Studio.</p>

      <StatCard
        label="Total de Alumnos"
        value={null}/* Aca debería obtener el total de alumnos desde la API */
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar alumno"
      />
    </section>
  );
}

export default Students;

