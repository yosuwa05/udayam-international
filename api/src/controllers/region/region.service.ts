import { Context } from "elysia";
import { RegionModel } from "@models/region.model";
import { recordStaffActivity } from "@helper/staffLogger";

const parseBool = (val?: string) => {
  if (val === "true") return true;
  if (val === "false") return false;
  return undefined;
};

// ─── CREATE ──────────────────────────────────────────────────────────────────
export const createRegion = async (ctx: Context<{ body: any }>) => {
  const { body, set }: any = ctx;

  try {
    const name = (body.name ?? "").trim();
    if (!name) {
      set.status = 400;
      return { error: "Name is required", status: false };
    }

    const existing = await RegionModel.findOne({ name, isDeleted: false });
    if (existing) {
      set.status = 400;
      return { error: "Region name already exists", status: false };
    }

    const region = await RegionModel.create({
      name,
      isActive: body.isActive !== undefined ? body.isActive : true,
      isDeleted: false,
      order: body.order !== undefined && body.order !== "" ? Number(body.order) : 0,
    });

    await recordStaffActivity(ctx, {
      action: "CREATE",
      module: "Regions",
      route: "/regions",
      recordId: region._id.toString(),
      recordTitle: region.name,
      updatedData: region.toObject ? region.toObject() : region,
      details: `Created new Region: "${region.name}"`,
    });

    set.status = 201;
    return {
      message: "Region created successfully",
      data: region,
      status: true,
    };
  } catch (error: any) {
    console.error("Create Region Error", error);
    set.status = 500;
    return { error: "Failed to create region", status: false };
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────────────────
export const updateRegion = async (
  ctx: Context<{ body: any; params: { id: string } }>,
) => {
  const { body, params, set }: any = ctx;

  try {
    const existing = await RegionModel.findOne({ _id: params.id, isDeleted: false });
    if (!existing) {
      set.status = 404;
      return { error: "Region not found", status: false };
    }

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) {
      const name = body.name.trim();
      if (!name) {
        set.status = 400;
        return { error: "Name cannot be empty", status: false };
      }

      const dup = await RegionModel.findOne({
        name,
        _id: { $ne: params.id },
        isDeleted: false,
      });
      if (dup) {
        set.status = 400;
        return { error: "Region name already exists", status: false };
      }
      updateData.name = name;
    }

    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    if (body.order !== undefined) {
      updateData.order = body.order !== "" ? Number(body.order) : 0;
    }

    const updated = await RegionModel.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    await recordStaffActivity(ctx, {
      action: "UPDATE",
      module: "Regions",
      route: "/regions",
      recordId: params.id,
      recordTitle: updated?.name || existing.name,
      previousData: existing.toObject ? existing.toObject() : existing,
      updatedData: updated?.toObject ? updated.toObject() : updated,
      details: `Updated Region: "${updated?.name || existing.name}"`,
    });

    return {
      message: "Region updated successfully",
      data: updated,
      status: true,
    };
  } catch (error: any) {
    console.error("Update Region Error", error);
    set.status = 500;
    return { error: "Failed to update region", status: false };
  }
};

// ─── TOGGLE ACTIVE ───────────────────────────────────────────────────────────
export const toggleActiveRegion = async (
  ctx: Context<{ params: { id: string } }>,
) => {
  const { params, set }: any = ctx;

  try {
    const existing = await RegionModel.findOne({ _id: params.id, isDeleted: false });
    if (!existing) {
      set.status = 404;
      return { error: "Region not found", status: false };
    }

    existing.isActive = !existing.isActive;
    await existing.save();

    await recordStaffActivity(ctx, {
      action: "UPDATE",
      module: "Regions",
      route: "/regions",
      recordId: params.id,
      recordTitle: existing.name,
      previousData: { isActive: !existing.isActive },
      updatedData: { isActive: existing.isActive },
      details: `Changed status to ${existing.isActive ? "active" : "inactive"} for Region: "${existing.name}"`,
    });

    return {
      message: `Region status updated to ${existing.isActive ? "active" : "inactive"}`,
      data: existing,
      status: true,
    };
  } catch (error: any) {
    console.error("Toggle Active Region Error", error);
    set.status = 500;
    return { error: "Failed to update status", status: false };
  }
};

// ─── DELETE (Soft Delete) ────────────────────────────────────────────────────
export const deleteRegion = async (
  ctx: Context<{ params: { id: string } }>,
) => {
  const { params, set }: any = ctx;

  try {
    const existing = await RegionModel.findOne({ _id: params.id, isDeleted: false });
    if (!existing) {
      set.status = 404;
      return { error: "Region not found", status: false };
    }

    existing.isDeleted = true;
    await existing.save();

    await recordStaffActivity(ctx, {
      action: "DELETE",
      module: "Regions",
      route: "/regions",
      recordId: params.id,
      recordTitle: existing.name,
      previousData: existing.toObject ? existing.toObject() : existing,
      details: `Deleted Region: "${existing.name}"`,
    });

    return {
      message: "Region deleted successfully",
      status: true,
    };
  } catch (error: any) {
    console.error("Delete Region Error", error);
    set.status = 500;
    return { error: "Failed to delete region", status: false };
  }
};

// ─── GET ALL (Public / No role restriction) ───────────────────────────────────
export const getAllRegions = async (ctx: Context<{ query: any }>) => {
  const { query, set }: any = ctx;

  try {
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
        RegionModel.find(filter)
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        RegionModel.countDocuments(filter),
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
      const data = await RegionModel.find(filter)
        .select("name order")
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return {
        status: true,
        data,
      };
    }
  } catch (error: any) {
    console.error("Get Regions Error", error);
    set.status = 500;
    return { error: "Failed to fetch regions", status: false };
  }
};
