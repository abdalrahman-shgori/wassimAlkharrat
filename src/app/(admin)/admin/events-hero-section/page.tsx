import EventsPageSettingsForm from "@/components/admin/EventsPageSettingsForm";
import adminStyles from "@/components/admin/admin.module.scss";

export const dynamic = "force-dynamic";

export default function EventsHeroSectionPage() {
  return (
    <div className={adminStyles.container}>
      <div className={adminStyles.header}>
        <div>
          <h1 className={adminStyles.title}>Events Page Hero Section</h1>
          <p className={adminStyles.description}>
            Upload and save the events page hero background image.
          </p>
        </div>
      </div>

      <EventsPageSettingsForm />
    </div>
  );
}

