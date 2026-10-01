import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import styles from "./Layout.module.css";

function Layout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;