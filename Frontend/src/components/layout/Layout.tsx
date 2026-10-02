import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import styles from "./Layout.module.css";

function Layout() {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.layout__body}>
        <Sidebar />

        <main className={styles.layout__main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;