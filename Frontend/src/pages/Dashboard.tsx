import styles from "./Dashboard.module.css";
function Dashboard() {
    return (
        <section className={styles.welcomeCard}>
            <h2 className={styles.title}>Panel Principal (Dashboard)</h2>
            <p className={styles.subtitle}>
                Bienvenido a Andrómeda Studio. Selecciona una opción del menú lateral para comenzar.
            </p>
        </section>
    );
}

export default Dashboard;
