export const dynamic = "force-dynamic";

import styles from "./page.module.scss";

export default function BookingsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bookings Management</h1>
        <p className={styles.description}>Manage bookings here (coming soon)</p>
      </div>
    </div>
  );
}

