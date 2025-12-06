import { redirect } from "next/navigation";
import { getCurrentAdmin } from "../../../../lib/auth";
import styles from "./page.module.scss";

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.welcome}>Welcome back, {admin.name}!</p>
      </div>
      
      {/* Stats Grid */}
      <div className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>Quick Stats</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.icon}>🎉</div>
            <h3 className={styles.label}>Total Events</h3>
            <p className={styles.value}>0</p>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.icon}>📅</div>
            <h3 className={styles.label}>Upcoming Events</h3>
            <p className={styles.value}>0</p>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.icon}>🎫</div>
            <h3 className={styles.label}>Total Bookings</h3>
            <p className={styles.value}>0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

