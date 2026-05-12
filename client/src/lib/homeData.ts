import banner1 from "../assets/home/banner1.jpeg"
import banner2 from "../assets/home/banner2.jpeg"
import banner3 from "../assets/home/banner3.jpeg"
import banner4 from "../assets/home/banner4.jpeg"
import type { Page } from "./navData"


/* ─── DATA ─────────────────────────────────────────────── */

const heroSlides = [
    {
        img: banner1,
        thumb: banner1,
        eyebrow: "Wonders of the world",
        h1Parts: ["Taj Mahal", "A Classic", " Travel Angle"],
        emWord: "Taj Mahal",
        desc: "Discover India’s breathtaking destinations, vibrant cultures, luxury experiences, scenic escapes, and unforgettable travel adventures worldwide.",
        btn1: { label: "View Packages →", page: "/tourism" as Page },
        btn2: { label: "Get Free Quote ", page: "contact" as Page },
    },
    {
        img: banner2,
        thumb: banner2,
        eyebrow: "Domestic Heritage",
        h1Parts: ["Explore the", "Land of", "Royal Wonders"],
        emWord: "Royal Wonders",
        desc: "Witness grand forts, golden deserts, and unforgettable cultural experiences.",
        btn1: { label: "Book Now →", page: "/tourism" as Page },
        btn2: { label: "View Itinerary", page: "/tourism" as Page },
    },
    {
        img: banner3,
        thumb: banner3,
        eyebrow: "Medical Tourism",
        h1Parts: ["Healing", "Beyond,", "Borders"],
        emWord: "Borders",
        desc: "Experience affordable medical care, trusted hospitals, and dedicated assistance throughout your treatment journey.",
        btn1: { label: " Explore  →", page: "/tourism" as Page },
        btn2: { label: "Visa Help", page: "/travel" as Page },
    },
    {
        img: banner4,
        thumb: banner4,
        eyebrow: "Iconic Landmarks",
        h1Parts: ["The World is", "Yours to", "Explore"],
        emWord: "Explore",
        desc: " From the romance of the Eiffel Tower to the majesty of Eastern temples, we curate seamless journeys to the globe’s most iconic landmarks.",
        btn1: { label: "Know More →", page: "/medical" as Page },
        btn2: { label: "Free Consultation", page: "contact" as Page },
    },
]

// const searchTabs = [
//   "🌍 Tours & Packages",
//   "✈️ Flights & Visa",
//   "🏥 Medical Tourism",
//   "🎓 Foreign Education",
//   "💼 Recruitment",
// ]

const services = [
    {
        icon: "🌍",
        num: "01",
        title: "Tourism",
        desc: "Domestic & international packages for every kind of traveller — adventure, leisure, heritage, and honeymoon.",
        cta: "Explore packages →",
        page: "/tourism" as Page,
    },
    {
        icon: "🏥",
        num: "02",
        title: "Medical Tourism",
        desc: "World-class treatments at JCI-accredited hospitals abroad with full end-to-end coordination and care.",
        cta: "Learn more →",
        page: "/medical" as Page,
    },
    {
        icon: "✈️",
        num: "03",
        title: "Travel Services",
        desc: "Flight booking, visa assistance, documentation guidance — everything for smooth and stress-free travel.",
        cta: "View services →",
        page: "/travel" as Page,
    },
    {
        icon: "📦",
        num: "04",
        title: "Trade",
        desc: "Import and export facilitation across multiple industry categories with documentation and logistics support.",
        cta: "Get in touch →",
        page: "/trade" as Page,
    },
    {
        icon: "🎓",
        num: "05",
        title: "Foreign Education",
        desc: "Study abroad guidance, admissions support, and student visa assistance for your global academic journey.",
        cta: "Explore destinations →",
        page: "/education" as Page,
    },
    {
        icon: "💼",
        num: "06",
        title: "Recruitment",
        desc: "Domestic and international placement connecting skilled talent with the right opportunities worldwide.",
        cta: "Register now →",
        page: "/recruitment" as Page,
    },
]

const catPills = [
    // "🌟 All",
    // "🏔️ Adventure",
    // "🏖️ Beach",
    // "🏰 Heritage",
    // "💑 Honeymoon",
    // "👨‍👩‍👧 Family",
    " All",
    " Adventure",
    " Beach",
    " Heritage",
    " Honeymoon",
    " Family",
]

const tourCards = [
    {
        img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
        badge: { label: "Bestseller", color: "#FEF2F2", text: "#E53935" },
        dur: "7 Days",
        loc: "Jaipur · Jodhpur · Udaipur",
        title: "Royal Rajasthan Heritage Circuit — Palaces, Forts & Desert Safari",
        rating: "4.9",
        reviews: "312 reviews",
        tag: "Domestic",
        tagColor: "#E8ECFA",
        tagText: "#1B2B6B",
        price: "₹28,500",
    },
    {
        img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
        badge: { label: "Top Rated", color: "#E8F5E9", text: "#2E7D32" },
        dur: "5 Days",
        loc: "Alleppey · Munnar · Thekkady",
        title: "Kerala Backwaters & Misty Hills — Houseboat & Tea Estate Retreat",
        rating: "4.8",
        reviews: "247 reviews",
        tag: "Domestic",
        tagColor: "#E8ECFA",
        tagText: "#1B2B6B",
        // price: "₹22,000",
    },
    {
        img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
        badge: { label: "Hot Deal", color: "#FEF2F2", text: "#E53935" },
        dur: "6 Days",
        loc: "Bangkok · Pattaya · Phuket",
        title: "Thailand Paradise — Temples, Islands & Culture",
        rating: "4.9",
        reviews: "589 reviews",
        tag: "International",
        tagColor: "#FFFBEB",
        tagText: "#92400E",
        price: "₹55,000",
    },
    {
        img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
        badge: { label: "Premium", color: "#E8ECFA", text: "#1B2B6B" },
        dur: "8 Days",
        loc: "Zurich · Interlaken · Geneva",
        title: "Swiss Alps Splendour — Jungfraujoch & Lake Geneva",
        rating: "5.0",
        reviews: "198 reviews",
        tag: "International",
        tagColor: "#FFFBEB",
        tagText: "#92400E",
        price: "₹1,85,000",
    },
]

const stats = [
    { num: "12K", sup: "+", label: "Happy Travellers" },
    { num: "80", sup: "+", label: "Destinations" },
    { num: "500", sup: "+", label: "Tour Packages" },
    { num: "98", sup: "%", label: "Satisfaction Rate" },
]

const deals = [
    {
        img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
        tag: "25% OFF",
        title: "Cherry Blossom Japan Tour",
        sub: "Tokyo · Kyoto · Osaka · Nara",
        price: "Starting from ₹1,45,000/person",
        big: true,
    },
    {
        img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
        tag: "HONEYMOON",
        title: "Maldives Water Villa",
        sub: "Overwater Paradise · 5 Nights",
        price: "From ₹95,000/person",
        big: false,
    },
    {
        img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&q=80",
        tag: "LAST MINUTE",
        title: "Goa Beach Escape",
        sub: "North & South Goa · 4 Nights",
        price: "From ₹12,500/person",
        big: false,
    },
]

const whyUs = [
    {
        icon: "🏅",
        title: "15+ Years of Trust",
        desc: "Over a decade of crafting journeys for thousands of happy travellers across India and globally.",
    },
    {
        icon: "💰",
        title: "Best Price Guarantee",
        desc: "Transparent pricing with zero hidden surprises. Found it cheaper? We'll match the price.",
    },
    {
        icon: "🛡️",
        title: "Safe & Insured Travel",
        desc: "Fully insured packages, verified vendors, and 24/7 emergency support while you travel.",
    },
    {
        icon: "✈️",
        title: "End-to-End Service",
        desc: "Flights, hotels, visa, transfers, sightseeing — we handle everything so you just enjoy.",
    },
]

const testimonials = [
    {
        av: "P",
        stars: "★★★★★",
        text: '"The Rajasthan tour was absolutely magical. Every detail was taken care of — the hotels, transport, guides. Udayam made it feel completely effortless and truly royal!"',
        name: "Priya Menon",
        trip: "📍 Rajasthan Heritage Tour · 2025",
    },
    {
        av: "A",
        stars: "★★★★★",
        text: '"Our Maldives honeymoon was beyond our dreams. The water villa, sunset dinners, snorkelling — every moment was perfect. The team coordinated everything seamlessly!"',
        name: "Arjun & Sneha Pillai",
        trip: "📍 Maldives Honeymoon · 2025",
    },
    {
        av: "R",
        stars: "★★★★★",
        text: '"Switzerland with the family was the best decision we made. The Jungfraujoch ride, the team handled our visa and arrangements impeccably. Truly world-class service!"',
        name: "Rajesh Krishnamurthy",
        trip: "📍 Swiss Alps Family Tour · 2025",
    },
]

const footerServices: { label: string; page: Page }[] = [
    { label: "Tourism", page: "tourism" },
    { label: "Medical Tourism", page: "medical" },
    { label: "Travel Services", page: "travel" },
    { label: "Trade", page: "trade" },
    { label: "Foreign Education", page: "education" },
    { label: "Recruitment", page: "recruitment" },
]

export {
    services,
    stats,
    deals,
    whyUs,
    testimonials,
    footerServices,
    tourCards,
    catPills,
    heroSlides
}