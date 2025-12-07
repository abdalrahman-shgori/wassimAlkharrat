import styles from "./page.module.scss";
export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.description}>Configure your settings here (coming soon)</p>
      </div>
    </div>
  );
}

