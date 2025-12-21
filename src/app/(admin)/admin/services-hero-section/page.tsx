import ServicesPageSettingsForm from "@/components/admin/ServicesPageSettingsForm";
import adminStyles from "@/components/admin/admin.module.scss";

export const dynamic = "force-dynamic";

export default function ServicesHeroSectionPage() {
  return (
    <div className={adminStyles.container}>
      <div className={adminStyles.header}>
        <div>
          <h1 className={adminStyles.title}>Services Page Hero Section</h1>
          <p className={adminStyles.description}>
            Upload and save the services page hero background image.
          </p>
        </div>
      </div>

      <ServicesPageSettingsForm />
    </div>
  );
}

