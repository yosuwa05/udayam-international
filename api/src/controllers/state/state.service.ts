import { Context } from "elysia";
import rawCountryData from "../../data/country.json";
import { getStatesSchema } from "./state.schema";

interface State {
    id: number;
    name: string;
}

interface Country {
    id: number;
    name: string;
    state?: State[];
}

const countryData = rawCountryData as unknown as Country[];

export const getIndianStates = async (ctx: Context<{ query: getStatesSchema }>) => {
    const { query, set }: any = ctx;

    try {
        const { q: stateQuery } = query;

        const india = countryData.find(
            (c) => c.name === "India"
        );

        if (!india || !india.state) {
            set.status = 500;
            return {
                status: false,
                message: "India data not found",
            };
        }

        let states = india.state;

        if (stateQuery) {
            states = states.filter((s) =>
                s.name.toLowerCase().includes(stateQuery.toLowerCase())
            );
        }

        const sortedStates = [...states].sort((a, b) => a.name.localeCompare(b.name));

        set.status = 200;
        return {
            status: true,
            message: "States fetched successfully",
            states: sortedStates.map((s) => ({
                name: s.name,
                iso2: String(s.id),
            })),
        };
    } catch (error: any) {
        console.error("State fetch error:", error);
        set.status = 500;
        return {
            status: false,
            message: error.message || "Error fetching states",
        }
    }
};