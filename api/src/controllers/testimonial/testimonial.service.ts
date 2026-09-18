import { Context } from "elysia";
import { TestimonialModel } from "@models/testimonial.model";

const parseBool = (val?: string) => {
  if (val === "true") return true;
  if (val === "false") return false;
  return undefined;
};

// ─── CREATE ──────────────────────────────────────────────────────────────────
export const createTestimonial = async (ctx: Context<{ body: any }>) => {
  const { body, set }: any = ctx;

  try {
    const rawType = body.type !== undefined ? body.type : body.types;
    let typeArr: string[] = ["home"];
    if (Array.isArray(rawType) && rawType.length > 0) {
      typeArr = rawType.map((t: string) => String(t).toLowerCase().trim());
    } else if (typeof rawType === "string" && rawType.trim()) {
      typeArr = [rawType.toLowerCase().trim()];
    }

    const testimonial = await TestimonialModel.create({
      name: body.name,
      avatarInitial: body.avatarInitial || body.name.charAt(0).toUpperCase(),
      rating: body.rating ?? 5,
      text: body.text,
      trip: body.trip,
      isActive: body.isActive !== undefined ? body.isActive : true,
      type: typeArr,
      order:
        body.order !== undefined && body.order !== "" ? Number(body.order) : 0,
    });

    set.status = 201;
    return {
      message: "Testimonial created successfully",
      data: testimonial,
      status: true,
    };
  } catch (error: any) {
    console.error("Create Testimonial Error", error);
    set.status = 500;
    return { error: "Failed to create testimonial", status: false };
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────────────────
export const updateTestimonial = async (
  ctx: Context<{ body: any; params: { id: string } }>,
) => {
  const { body, params, set }: any = ctx;

  try {
    const existing = await TestimonialModel.findById(params.id);
    if (!existing) {
      set.status = 404;
      return { error: "Testimonial not found", status: false };
    }

    const updateData = { ...body };
    if (body.type !== undefined || body.types !== undefined) {
      const rawType = body.type !== undefined ? body.type : body.types;
      let typeArr: string[] = ["home"];
      if (Array.isArray(rawType) && rawType.length > 0) {
        typeArr = rawType.map((t: string) => String(t).toLowerCase().trim());
      } else if (typeof rawType === "string" && rawType.trim()) {
        typeArr = [rawType.toLowerCase().trim()];
      }
      updateData.type = typeArr;
      delete updateData.types;
    }

    if (body.name && !body.avatarInitial) {
      updateData.avatarInitial = body.name.charAt(0).toUpperCase();
    }

    if (body.order !== undefined) {
      updateData.order = body.order !== "" ? Number(body.order) : 0;
    }

    const updated = await TestimonialModel.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return {
      message: "Testimonial updated successfully",
      data: updated,
      status: true,
    };
  } catch (error: any) {
    console.error("Update Testimonial Error", error);
    set.status = 500;
    return { error: "Failed to update testimonial", status: false };
  }
};

// ─── TOGGLE ACTIVE ───────────────────────────────────────────────────────────
export const toggleActiveTestimonial = async (
  ctx: Context<{ params: { id: string } }>,
) => {
  const { params, set }: any = ctx;

  try {
    const existing = await TestimonialModel.findById(params.id);
    if (!existing) {
      set.status = 404;
      return { error: "Testimonial not found", status: false };
    }

    existing.isActive = !existing.isActive;
    await existing.save();

    return {
      message: `Testimonial status updated to ${existing.isActive ? "active" : "inactive"}`,
      data: existing,
      status: true,
    };
  } catch (error: any) {
    console.error("Toggle Active Testimonial Error", error);
    set.status = 500;
    return { error: "Failed to update status", status: false };
  }
};

// ─── GET ALL ACTIVE (Public) ──────────────────────────────────────────────────
export const getActiveTestimonials = async (ctx: Context<{ query: any }>) => {
  const { query, set }: any = ctx;

  try {
    const page = Math.max(1, parseInt(query.page ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? "12")));
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (query.type && query.type.trim() && query.type !== "all") {
      const targetType = query.type.toLowerCase().trim();
      if (targetType === "home") {
        filter.$or = [
          { type: targetType },
          { type: { $exists: false } },
          { type: { $size: 0 } },
        ];
      } else {
        filter.type = targetType;
      }
    }

    const [data, total] = await Promise.all([
      TestimonialModel.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TestimonialModel.countDocuments(filter),
    ]);

    return {
      status: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  } catch (error: any) {
    console.error("Get Active Testimonials Error", error);
    set.status = 500;
    return { error: "Failed to fetch testimonials", status: false };
  }
};

// ─── GET ALL (Admin) ─────────────────────────────────────────────────────────
export const getAdminTestimonials = async (ctx: Context<{ query: any }>) => {
  const { query, set }: any = ctx;

  try {
    const page = Math.max(1, parseInt(query.page ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? "10")));
    const skip = (page - 1) * limit;

    const filter: any = {};
    const isActive = parseBool(query.isActive);
    if (isActive !== undefined) filter.isActive = isActive;
    if (query.type && query.type.trim() && query.type !== "all") {
      filter.type = query.type.toLowerCase().trim();
    }

    const [data, total] = await Promise.all([
      TestimonialModel.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TestimonialModel.countDocuments(filter),
    ]);

    return {
      status: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  } catch (error: any) {
    console.error("Get Admin Testimonials Error", error);
    set.status = 500;
    return { error: "Failed to fetch testimonials", status: false };
  }
};

// ─── GET SINGLE BY ID ────────────────────────────────────────────────────────
export const getTestimonialById = async (
  ctx: Context<{ params: { id: string } }>,
) => {
  const { params, set }: any = ctx;

  try {
    const testimonial = await TestimonialModel.findById(params.id).lean();
    if (!testimonial) {
      set.status = 404;
      return { error: "Testimonial not found", status: false };
    }
    return { status: true, data: testimonial };
  } catch (error: any) {
    console.error("Get Testimonial By ID Error", error);
    set.status = 500;
    return { error: "Failed to fetch testimonial", status: false };
  }
};
