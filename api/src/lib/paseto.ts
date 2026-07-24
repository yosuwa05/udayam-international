import { APP_CONSTANTS } from "constant";
import { V3 as PS } from "paseto";

export const generatePasetoSecret = async () => {
    const key = await PS.generateKey("local", {
        format: "paserk"
    })
    return key
}


const PASETO_ADMIN_KEY: string | undefined = APP_CONSTANTS.PASETO_ADMIN_SECRET_KEY

export const EncodePaseto = async (payload: Record<string, string>) => {
    try {
        if (PASETO_ADMIN_KEY) {
            return await PS.encrypt(payload, PASETO_ADMIN_KEY);
        } else {
            throw new Error("PASETO_ADMIN_KEY is not defined");
        }
    } catch (error: any) {
        console.error("Failed to encode admin Paseto token:", error);
        return null;
    }
};

export const DecodePaseto = async (token: string) => {
    try {
        if (PASETO_ADMIN_KEY) {
            return await PS.decrypt(token, PASETO_ADMIN_KEY);
        } else {
            throw new Error("PASETO_ADMIN_KEY is not defined");
        }
    } catch (error) {
        console.error("Failed to decode admin Paseto token:", error);
        return null;
    }
};

// ── User token helpers ───────────────────────────────────────────────────────
const PASETO_USER_KEY: string | undefined = APP_CONSTANTS.PASETO_SECRET_KEY

export const EncodeUserPaseto = async (payload: Record<string, string>) => {
    try {
        if (PASETO_USER_KEY) {
            return await PS.encrypt(payload, PASETO_USER_KEY);
        } else {
            throw new Error("PASETO_USER_KEY is not defined");
        }
    } catch (error: any) {
        console.error("Failed to encode user Paseto token:", error);
        return null;
    }
};

export const DecodeUserPaseto = async (token: string) => {
    try {
        if (PASETO_USER_KEY) {
            return await PS.decrypt(token, PASETO_USER_KEY);
        } else {
            throw new Error("PASETO_USER_KEY is not defined");
        }
    } catch (error) {
        console.error("Failed to decode user Paseto token:", error);
        return null;
    }
};