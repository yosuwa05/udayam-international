import { Elysia } from "elysia"
import {
    createTouristPlace,
    updateTouristPlace,
    deleteTouristPlace,
    getAllTouristPlaces,
    getTouristPlaceById,
    getTourismDashboardStats,
    toggleFeaturedTouristPlace,
    getFeaturedTouristPlaces,
} from "./toursim.service"
import {
    createTourismDto,
    updateTourismDto,
    getTourismDto,
    tourismParamDto,
} from "./tourism.schema"
import { adminOnly } from "@lib/authGuard"

export const tourismRouter = new Elysia({
    prefix: "/tourism",
    detail: { tags: ["Tourism"] },
})
    .get("/dashboard", getTourismDashboardStats, {
        beforeHandle: adminOnly,
        detail: {
            summary: "Get Tourism Dashboard Stats",
            description: "Admin: Get counts for domestic, international, etc.",
        }
    })
    .post("/", createTouristPlace, { ...createTourismDto, beforeHandle: adminOnly })
    .get("/", getAllTouristPlaces, getTourismDto)
    .get("/featured", getFeaturedTouristPlaces)
    .get("/:id", getTouristPlaceById, tourismParamDto)
    .patch("/:id", updateTouristPlace, {
        ...updateTourismDto,
        beforeHandle: adminOnly,
    })
    .patch("/:id/toggle-featured", toggleFeaturedTouristPlace, {
        ...tourismParamDto,
        beforeHandle: adminOnly,
    })
    .delete("/:id", deleteTouristPlace, {
        ...tourismParamDto,
        beforeHandle: adminOnly,
    })