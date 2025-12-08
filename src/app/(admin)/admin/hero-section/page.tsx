import HomepageSettingsForm from "@/components/admin/HomepageSettingsForm";
import adminStyles from "@/components/admin/admin.module.scss";

export const dynamic = "force-dynamic";

export default function HeroSectionPage() {
  return (
    <div className={adminStyles.container}>
      <div className={adminStyles.header}>
        <div>
          <h1 className={adminStyles.title}>Hero Section</h1>
          <p className={adminStyles.description}>
            Upload and save the homepage hero background image.
          </p>
        </div>
      </div>

      <HomepageSettingsForm />
    </div>
  );
}


