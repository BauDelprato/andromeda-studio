import { useState } from "react";
import { LuPlus, LuSearch } from "react-icons/lu";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import styles from "./Registrations.module.css";

interface RegistrationItem {
  id: number;
  studentName: string;
  crewName: string;
  enrollmentDate: string;
}

const SAMPLE_REGISTRATIONS: RegistrationItem[] = [
  {
    id: 1,
    studentName: "Mora Wessels",
    crewName: "Maneuver",
    enrollmentDate: "18/5/2025",
  },
];

const TABS = [
  "Inscripciones recientes",
  "Historial por alumno",
  "Historial por grupo",
];

function Registrations() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("mayo");

  const registrationColumns: TableColumn<RegistrationItem>[] = [
    {
      header: "Nombre",
      render: (item) => item.studentName,
    },
    {
      header: "Crew",
      render: (item) => item.crewName,
    },
    {
      header: "Fecha inscripción",
      render: (item) => item.enrollmentDate,
    },
  ];

  const filtered = SAMPLE_REGISTRATIONS.filter((item) => {
    const s = search.toLowerCase().trim();
    if (!s) return true;
    return (
      item.studentName.toLowerCase().includes(s) ||
      item.crewName.toLowerCase().includes(s)
    );
  });

  return (
    <div className={styles.container}>
      {/* Tab Navigation */}
      <div className={styles.tabBar}>
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tab} ${activeTab === idx ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Header with Actions */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Inscripciones recientes</h2>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => console.log("Dar de baja")}
          >
            Dar de baja
          </button>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => console.log("Nueva inscripción")}
          >
            <LuPlus size={16} />
            <span>Nueva inscripción</span>
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className={styles.filtersRow}>
        <div className={styles.searchInputWrapper}>
          <LuSearch size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por nombre de estudiante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.monthSelect}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="mayo">mayo</option>
          <option value="junio">junio</option>
          <option value="julio">julio</option>
          <option value="agosto">agosto</option>
          <option value="septiembre">septiembre</option>
          <option value="octubre">octubre</option>
        </select>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <Table<RegistrationItem>
          data={filtered}
          columns={registrationColumns}
          emptyMessage="No se encontraron inscripciones."
        />
      </div>
    </div>
  );
}

export default Registrations;