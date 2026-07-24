export type Page =
    | "home"
    | "about"
    | "tourism"
    | "medical"
    | "travel"
    | "trade"
    | "education"
    | "recruitment"
    | "contact"
    | "profile"
    | "my-bookings"

const pageToPath: Record<Page, string> = {
    home: "/",
    about: "/about",
    tourism: "/tourism",
    medical: "/medical",
    travel: "/travel",
    trade: "/trade",
    education: "/education",
    recruitment: "/recruitment",
    contact: "/contact",
    profile: "/profile",
    "my-bookings": "/my-bookings",
}

const navItems: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "About Us", page: "about" },
    { label: "Tourism", page: "tourism" },
    { label: "Medical Tourism", page: "medical" },
    { label: "Travel Services", page: "travel" },
    { label: "Trade", page: "trade" },
    { label: "Foreign Education", page: "education" },
    { label: "Recruitment", page: "recruitment" },
]

const promoItems = [
    "Flat 20% OFF on International Packages",
    "Free Visa Assistance on Select Tours",
    "Medical Tourism — JCI Accredited Hospitals",
    "Group Discounts: 5+ Travellers Save More",
    "EMI Starting ₹3,999/month — No Cost",
]

export { pageToPath, navItems, promoItems }