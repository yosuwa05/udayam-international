/**
 * Official Indian GST State and Union Territory 2-digit codes.
 */
export const GST_STATE_CODES: Record<string, string> = {
    "jammu and kashmir": "01",
    "jammu & kashmir": "01",
    "himachal pradesh": "02",
    "punjab": "03",
    "chandigarh": "04",
    "uttarakhand": "05",
    "uttaranchal": "05",
    "haryana": "06",
    "delhi": "07",
    "nct of delhi": "07",
    "rajasthan": "08",
    "uttar pradesh": "09",
    "bihar": "10",
    "sikkim": "11",
    "arunachal pradesh": "12",
    "nagaland": "13",
    "manipur": "14",
    "mizoram": "15",
    "tripura": "16",
    "meghalaya": "17",
    "assam": "18",
    "west bengal": "19",
    "jharkhand": "20",
    "odisha": "21",
    "orissa": "21",
    "chhattisgarh": "22",
    "madhya pradesh": "23",
    "gujarat": "24",
    "daman and diu": "25",
    "daman & diu": "25",
    "dadra and nagar haveli": "26",
    "dadra & nagar haveli": "26",
    "dadra and nagar haveli and daman and diu": "26",
    "dadra & nagar haveli and daman & diu": "26",
    "maharashtra": "27",
    "andhra pradesh": "37",
    "karnataka": "29",
    "goa": "30",
    "lakshadweep": "31",
    "kerala": "32",
    "tamil nadu": "33",
    "tamilnadu": "33",
    "puducherry": "34",
    "pondicherry": "34",
    "andaman and nicobar islands": "35",
    "andaman & nicobar islands": "35",
    "telangana": "36",
    "ladakh": "38",
    "other territory": "97",
}

/**
 * Returns the 2-digit GST state code for a given Indian state name or GSTIN.
 * Defaults to "33" (Tamil Nadu) if state is Tamil Nadu or if no other state is specified.
 */
export function getGstStateCode(stateName?: string, gstNumber?: string): string {
    if (gstNumber && /^[0-9]{2}/.test(gstNumber.trim())) {
        return gstNumber.trim().slice(0, 2)
    }
    if (stateName && typeof stateName === "string") {
        const normalized = stateName.trim().toLowerCase()
        if (GST_STATE_CODES[normalized]) {
            return GST_STATE_CODES[normalized]
        }
        // Partial fallback matches
        if (normalized.includes("tamil")) return "33"
        if (normalized.includes("kashmir") || normalized.includes("jammu")) return "01"
        if (normalized.includes("delhi")) return "07"
        if (normalized.includes("bengal")) return "19"
        if (normalized.includes("kerala")) return "32"
        if (normalized.includes("karnataka")) return "29"
        if (normalized.includes("maharashtra")) return "27"
    }
    return ""
}

