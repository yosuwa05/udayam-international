import top1 from "../assets/home/toptour1.jpeg"
import top2 from "../assets/home/toptour2.jpeg"
import top3 from "../assets/home/toptour3.jpeg"

interface Destination {
  id: string
  title: string
  region: string
  description: string
  date: string
  price: number
  image: string
}

const destinations: Destination[] = [
  {
    id: "kerala",
    title: "Kerala",
    region: "INDIA",
    description:
      "Houseboats in Kerala offer a peaceful backwater experience surrounded by lush greenery, scenic canals, traditional villages, and relaxing luxury stays amidst nature.",
    date: "NOV 10, 2025",
    price: 300,
    image: top1,
  },
  {
    id: "jaipur",
    title: "Jaipur  ",
    region: "INDIA",
    description:
      "Amber Fort is a magnificent royal fortress known for its grand architecture, historic palaces, elephant rides, and breathtaking views of Rajasthan’s heritage landscape.",
    date: "NOV 15, 2025",
    price: 450,
    image: top2,
  },
  {
    id: "taj",
    title: "Taj  Palace",
    region: "INDIA",
    description:
      "Taj  Palace offers luxurious hospitality, elegant heritage architecture, premium comfort, and unforgettable experiences in the heart of Mumbai.",
    date: "NOV 22, 2025",
    price: 600,
    image: top3,
  },
]

export default function TravelCards() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden sm:h-56 lg:h-64">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {/* Region Badge */}
                <div className="absolute top-4 right-4">
                  <span className="rounded-lg bg-orange-500 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-orange-600 sm:text-base">
                    {destination.region}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="flex flex-grow flex-col p-5 sm:p-6">
                {/* Title */}
                <h2 className="mb-3 text-2xl font-bold text-pretty text-slate-900 sm:text-3xl">
                  {destination.title}
                </h2>

                {/* Description */}
                <p className="mb-5 flex-grow text-sm leading-relaxed text-slate-600 sm:text-base">
                  {destination.description}
                </p>

                {/* Footer: Date and Price */}
                <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    className="w-full rounded-full py-3 font-inter text-[13px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #388E3C, #43A047)",
                      boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
                    }}
                  >
                    Enquiry Now ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
