import { Context } from "elysia";
import { TripTypeModel } from "@models/triptypes.model";
import { recordStaffActivity } from "@helper/staffLogger";

const parseBool = (val?: string) => {
  if (val === "true") return true;
  if (val === "false") return false;
  return undefined;
};

// ─── CREATE ──────────────────────────────────────────────────────────────────
export const createTripType = async (ctx: Context<{ body: any }>) => {
  const { body, set }: any = ctx;

  try {
    const name = (body.name ?? "").trim();
    if (!name) {
      set.status = 400;
      return { error: "Name is required", status: false };
    }

    const existing = await TripTypeModel.findOne({ name, isDeleted: false });
    if (existing) {
      set.status = 400;
      return { error: "Trip type name already exists", status: false };
    }

    const tripType = await TripTypeModel.create({
      name,
      isActive: body.isActive !== undefined ? body.isActive : true,
      isDeleted: false,
      order: body.order !== undefined && body.order !== "" ? Number(body.order) : 0,
    });

    await recordStaffActivity(ctx, {
      action: "CREATE",
      module: "Trip Types",
      route: "/trip-types",
      recordId: tripType._id.toString(),
      recordTitle: tripType.name,
      updatedData: tripType.toObject ? tripType.toObject() : tripType,
      details: `Created new Trip Type: "${tripType.name}"`,
    });

    set.status = 201;
    return {
      message: "Trip type created successfully",
      data: tripType,
      status: true,
    };
  } catch (error: any) {
    console.error("Create Trip Type Error", error);
    set.status = 500;
    return { error: "Failed to create trip type", status: false };
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────────────────
export const updateTripType = async (
  ctx: Context<{ body: any; params: { id: string } }>,
) => {
  const { body, params, set }: any = ctx;

  try {
    const existing = await TripTypeModel.findOne({ _id: params.id, isDeleted: false });
    if (!existing) {
      set.status = 404;
      return { error: "Trip type not found", status: false };
    }

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) {
      const name = body.name.trim();
      if (!name) {
        set.status = 400;
        return { error: "Name cannot be empty", status: false };
      }

      const dup = await TripTypeModel.findOne({
        name,
        _id: { $ne: params.id },
        isDeleted: false,
      });
      if (dup) {
        set.status = 400;
        return { error: "Trip type name already exists", status: false };
      }
      updateData.name = name;
    }

    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    if (body.order !== undefined) {
      updateData.order = body.order !== "" ? Number(body.order) : 0;
    }

    const updated = await TripTypeModel.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    await recordStaffActivity(ctx, {
      action: "UPDATE",
      module: "Trip Types",
      route: "/trip-types",
      recordId: params.id,
      recordTitle: updated?.name || existing.name,
      previousData: existing.toObject ? existing.toObject() : existing,
      updatedData: updated?.toObject ? updated.toObject() : updated,
      details: `Updated Trip Type: "${updated?.name || existing.name}"`,
    });

    return {
      message: "Trip type updated successfully",
      data: updated,
      status: true,
    };
  } catch (error: any) {
    console.error("Update Trip Type Error", error);
    set.status = 500;
    return { error: "Failed to update trip type", status: false };
  }
};

// ─── TOGGLE ACTIVE ───────────────────────────────────────────────────────────
export const toggleActiveTripType = async (
  ctx: Context<{ params: { id: string } }>,
) => {
  const { params, set }: any = ctx;

  try {
    const existing = await TripTypeModel.findOne({ _id: params.id, isDeleted: false });
    if (!existing) {
      set.status = 404;
      return { error: "Trip type not found", status: false };
    }

    existing.isActive = !existing.isActive;
    await existing.save();

    await recordStaffActivity(ctx, {
      action: "UPDATE",
      module: "Trip Types",
      route: "/trip-types",
      recordId: params.id,
      recordTitle: existing.name,
      previousData: { isActive: !existing.isActive },
      updatedData: { isActive: existing.isActive },
      details: `Changed status to ${existing.isActive ? "active" : "inactive"} for Trip Type: "${existing.name}"`,
    });

    return {
      message: `Trip type status updated to ${existing.isActive ? "active" : "inactive"}`,
      data: existing,
      status: true,
    };
  } catch (error: any) {
    console.error("Toggle Active Trip Type Error", error);
    set.status = 500;
    return { error: "Failed to update status", status: false };
  }
};

// ─── DELETE (Soft Delete) ────────────────────────────────────────────────────
export const deleteTripType = async (
  ctx: Context<{ params: { id: string } }>,
) => {
  const { params, set }: any = ctx;

  try {
    const existing = await TripTypeModel.findOne({ _id: params.id, isDeleted: false });
    if (!existing) {
      set.status = 404;
      return { error: "Trip type not found", status: false };
    }

    existing.isDeleted = true;
    await existing.save();

    await recordStaffActivity(ctx, {
      action: "DELETE",
      module: "Trip Types",
      route: "/trip-types",
      recordId: params.id,
      recordTitle: existing.name,
      previousData: existing.toObject ? existing.toObject() : existing,
      details: `Deleted Trip Type: "${existing.name}"`,
    });

    return {
      message: "Trip type deleted successfully",
      status: true,
    };
  } catch (error: any) {
    console.error("Delete Trip Type Error", error);
    set.status = 500;
    return { error: "Failed to delete trip type", status: false };
  }
};

export const DEFAULT_TRIP_TYPES = [
  { name: "Family", order: 1, isActive: true, isDeleted: false },
  { name: "Honeymoon", order: 2, isActive: true, isDeleted: false },
  { name: "Adventure", order: 3, isActive: true, isDeleted: false },
  { name: "Solo Travel", order: 4, isActive: true, isDeleted: false },
  { name: "Group", order: 5, isActive: true, isDeleted: false },
  { name: "Pilgrimage", order: 6, isActive: true, isDeleted: false },
];

// ─── GET ALL (Public / No role restriction) ───────────────────────────────────
export const getAllTripTypes = async (ctx: Context<{ query: any }>) => {
  const { query, set }: any = ctx;

  try {
    const totalCount = await TripTypeModel.countDocuments();
    if (totalCount === 0) {
      await TripTypeModel.insertMany(DEFAULT_TRIP_TYPES);
    }

    const filter: Record<string, any> = { isDeleted: false };

    const isActive = parseBool(query.isActive);
    if (isActive !== undefined) filter.isActive = isActive;

    if (query.search?.trim()) {
      filter.name = { $regex: query.search.trim(), $options: "i" };
    }

    // Check if pagination parameters are passed
    if (query.page || query.limit) {
      const page = Math.max(1, parseInt(query.page ?? "1"));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "10")));
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        TripTypeModel.find(filter)
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        TripTypeModel.countDocuments(filter),
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
    } else {
      // Return list without pagination
      const data = await TripTypeModel.find(filter)
        .select("name order")
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return {
        status: true,
        data,
      };
    }
  } catch (error: any) {
    console.error("Get Trip Types Error", error);
    set.status = 500;
    return { error: "Failed to fetch trip types", status: false };
  }
};
