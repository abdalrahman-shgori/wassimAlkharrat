export const dynamic = "force-dynamic";

import styles from "./page.module.scss";

export default function EventsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Events Management</h1>
        <p className={styles.description}>Manage your events here (coming soon)</p>
      </div>
    </div>
  );
}

