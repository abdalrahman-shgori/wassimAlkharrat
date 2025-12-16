import { NextRequest, NextResponse } from "next/server";
import { getServicesCollection } from "../../../../../../lib/db";
import { getPreferredLocale, pickLocalizedString } from "../../../../../../lib/i18n/serverLocale";

// GET /api/services/slug/[slug] - Get a single service by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const locale = getPreferredLocale(request);

    if (!slug) {
      return NextResponse.json(
        { error: "Service slug is required" },
        { status: 400 }
      );
    }

    const servicesCollection = await getServicesCollection();
    const service = await servicesCollection.findOne({ slug, isActive: true });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const nameEn = service.nameEn ?? service.name ?? "";
    const descriptionEn = service.descriptionEn ?? service.description ?? "";
    const nameAr = service.nameAr ?? null;
    const descriptionAr = service.descriptionAr ?? null;
    const titleEn = service.titleEn ?? service.title ?? null;
    const titleAr = service.titleAr ?? null;
    const detailsEn = service.detailsEn ?? service.details ?? null;
    const detailsAr = service.detailsAr ?? null;

    // Strip legacy "order" field if present
    const { order: _order, ...safeService } = service as any;

    // Localize whatWeDo array if present
    const whatWeDo = safeService.whatWeDo && Array.isArray(safeService.whatWeDo)
      ? safeService.whatWeDo.map((item: any) => ({
          title: item.titleEn || item.titleAr
            ? pickLocalizedString(locale, { en: item.titleEn ?? item.title, ar: item.titleAr })
            : null,
          description: item.descriptionEn || item.descriptionAr
            ? pickLocalizedString(locale, { en: item.descriptionEn ?? item.description, ar: item.descriptionAr })
            : null,
          image: item.image || null,
          titleEn: item.titleEn ?? item.title ?? "",
          titleAr: item.titleAr ?? "",
          descriptionEn: item.descriptionEn ?? item.description ?? "",
          descriptionAr: item.descriptionAr ?? "",
        }))
      : null;

    return NextResponse.json({
      success: true,
      data: {
        ...safeService,
        _id: safeService._id?.toString() || safeService._id,
        name: pickLocalizedString(locale, { en: nameEn, ar: nameAr }),
        description: pickLocalizedString(locale, { en: descriptionEn, ar: descriptionAr }),
        title: titleEn || titleAr ? pickLocalizedString(locale, { en: titleEn, ar: titleAr }) : null,
        details: detailsEn || detailsAr ? pickLocalizedString(locale, { en: detailsEn, ar: detailsAr }) : null,
        whatWeDo,
        nameEn,
        nameAr: nameAr ?? "",
        descriptionEn,
        descriptionAr: descriptionAr ?? "",
        titleEn: titleEn ?? "",
        titleAr: titleAr ?? "",
        detailsEn: detailsEn ?? "",
        detailsAr: detailsAr ?? "",
      },
    });
  } catch (error) {
    console.error("Error fetching service by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

