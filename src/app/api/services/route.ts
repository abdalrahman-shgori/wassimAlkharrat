import { NextRequest, NextResponse } from "next/server";
import { getServicesCollection } from "../../../../lib/db";
import { CreateServiceInput } from "../../../../lib/models/Service";
import { requireAdmin } from "../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../lib/i18n/serverLocale";

// GET /api/services - Get all services
export async function GET(request: NextRequest) {
  try {
    const servicesCollection = await getServicesCollection();
    const locale = getPreferredLocale(request);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const filterKey = searchParams.get("filterKey");
    
    // Build query
    const query: any = activeOnly ? { isActive: true } : {};
    
    // Add filterKey to query if provided
    if (filterKey) {
      query.filterKey = filterKey;
    }
    
    // Fetch services sorted by newest first
    const services = await servicesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const localized = services.map((service) => {
      const nameEn = service.nameEn ?? service.name ?? "";
      const descriptionEn = service.descriptionEn ?? service.description ?? "";
      const nameAr = service.nameAr ?? null;
      const descriptionAr = service.descriptionAr ?? null;
      const titleEn = service.titleEn ?? service.title ?? null;
      const titleAr = service.titleAr ?? null;
      const detailsEn = service.detailsEn ?? service.details ?? null;
      const detailsAr = service.detailsAr ?? null;

      // Strip legacy "order" field if it exists
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { order: _order, ...safeService } = service as any;

      return {
        _id: safeService._id?.toString() || safeService._id,
        slug: safeService.slug,
        icon: safeService.icon || "🎉",
        image: safeService.image,
        filterKey: safeService.filterKey,
        isActive: safeService.isActive ?? true,
        whatWeDo: safeService.whatWeDo || null,
        name: pickLocalizedString(locale, { en: nameEn, ar: nameAr }),
        description: pickLocalizedString(locale, { en: descriptionEn, ar: descriptionAr }),
        title: titleEn || titleAr ? pickLocalizedString(locale, { en: titleEn, ar: titleAr }) : null,
        details: detailsEn || detailsAr ? pickLocalizedString(locale, { en: detailsEn, ar: detailsAr }) : null,
        nameEn,
        nameAr: nameAr ?? "",
        descriptionEn,
        descriptionAr: descriptionAr ?? "",
        titleEn: titleEn ?? "",
        titleAr: titleAr ?? "",
        detailsEn: detailsEn ?? "",
        detailsAr: detailsAr ?? "",
      };
    });

    return NextResponse.json({
      success: true,
      data: localized,
      count: localized.length,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/services - Create a new service (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body: CreateServiceInput = await request.json();
    const nameEn = body.nameEn ?? body.name;
    const descriptionEn = body.descriptionEn ?? body.description;
    
    // Validate required fields
    if (!nameEn || !body.slug || !descriptionEn || !body.nameAr || !body.descriptionAr) {
      return NextResponse.json(
        { error: "English name/description, Arabic name/description and slug are required" },
        { status: 400 }
      );
    }

    const servicesCollection = await getServicesCollection();
    
    // Check if slug already exists
    const existingService = await servicesCollection.findOne({ slug: body.slug });
    if (existingService) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 409 }
      );
    }

    // Create new service
    const newService: any = {
      name: nameEn,
      nameEn,
      nameAr: body.nameAr,
      slug: body.slug,
      description: descriptionEn,
      descriptionEn,
      descriptionAr: body.descriptionAr,
      icon: body.icon || "🎉",
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add title fields if provided
    if (body.titleEn) {
      newService.title = body.titleEn;
      newService.titleEn = body.titleEn;
    }
    if (body.titleAr) {
      newService.titleAr = body.titleAr;
    }

    // Add details fields if provided
    if (body.detailsEn) {
      newService.details = body.detailsEn;
      newService.detailsEn = body.detailsEn;
    }
    if (body.detailsAr) {
      newService.detailsAr = body.detailsAr;
    }

    // Add image if provided
    if (body.image) {
      newService.image = body.image;
    }

    // Add filterKey if provided
    if (body.filterKey) {
      newService.filterKey = body.filterKey;
    }

    // Add whatWeDo array if provided
    if (body.whatWeDo && Array.isArray(body.whatWeDo) && body.whatWeDo.length > 0) {
      newService.whatWeDo = body.whatWeDo;
    }

    const result = await servicesCollection.insertOne(newService);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newService },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

