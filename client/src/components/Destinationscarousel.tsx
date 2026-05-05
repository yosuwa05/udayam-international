import React, { useState, useCallback } from "react"
import type { Page } from "./Navbar"

interface Destination {
  img: string
  name: string
  specialties: string
  badge: string
  count: string
}

interface DestinationsCarouselProps {
  onNavigate: (page: Page) => void
}

const destinations: Destination[] = [
  {
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=85",
    name: "Tokyo",
    specialties: "Culture, Technology, Cuisine, Temples, Shopping",
    badge: "International",
    count: "240+ experiences",
  },
  {
    img: "https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=85",
    name: "Dubai",
    specialties: "Luxury, Adventure, Shopping, Skyline, Desert Safari",
    badge: "International",
    count: "380+ experiences",
  },
  {
    img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=85",
    name: "Paris",
    specialties: "Art, Fashion, Cuisine, Romance, Architecture",
    badge: "International",
    count: "520+ experiences",
  },
  {
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=85",
    name: "Rajasthan",
    specialties: "Heritage, Palaces, Desert, Culture, Cuisine",
    badge: "Domestic",
    count: "180+ experiences",
  },
  {
    img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=85",
    name: "Maldives",
    specialties: "Beaches, Water Villas, Diving, Honeymoon, Luxury",
    badge: "International",
    count: "150+ experiences",
  },
  {
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85",
    name: "Switzerland",
    specialties: "Alps, Skiing, Lakes, Chocolate, Train Journeys",
    badge: "International",
    count: "290+ experiences",
  },
  {
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=85",
    name: "Thailand",
    specialties: "Temples, Beaches, Street Food, Nightlife, Elephants",
    badge: "International",
    count: "410+ experiences",
  },
]

const poppins = "'Poppins', sans-serif"

const DestinationsCarousel: React.FC<DestinationsCarouselProps> = ({
  onNavigate,
}) => {
  const [active, setActive] = useState(2)
  const total = destinations.length

  const prev = useCallback(
    () => setActive((a) => (a - 1 + total) % total),
    [total]
  )
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total])

  // Returns position relative to active: -2,-1,0,1,2 (clamped for display)
  const getRelPos = (i: number) => {
    let diff = i - active
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return diff
  }

  return (
    <section
      style={{
        background: "#0A0D14",
        padding: "90px 0 100px",
        overflow: "hidden",
        fontFamily: poppins,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#43A047",
              marginBottom: 12,
              fontFamily: poppins,
            }}
          >
            <span
              style={{
                width: 20,
                height: 2,
                background: "#43A047",
                borderRadius: 2,
                display: "inline-block",
              }}
            />
            Top Picks
          </div>
          <h2
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
              marginBottom: 14,
            }}
          >
            Explore Popular{" "}
            <span style={{ color: "#F59E0B" }}>Destinations</span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              fontFamily: poppins,
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Experience world-class destinations and discover the beauty of the
            world.
          </p>
        </div>

        {/* Carousel track */}
        <div style={{ position: "relative", height: 500 }}>
          {destinations.map((d, i) => {
            const rel = getRelPos(i)
            const isActive = rel === 0
            const isVisible = Math.abs(rel) <= 2

            if (!isVisible) return null

            // Layout values per position
            const configs: Record<
              number,
              {
                left: string
                zIndex: number
                scale: number
                opacity: number
                width: number
                height: number
                translateY: number
              }
            > = {
              "-2": {
                left: "0%",
                zIndex: 1,
                scale: 0.75,
                opacity: 0.35,
                width: 280,
                height: 360,
                translateY: 40,
              },
              "-1": {
                left: "12%",
                zIndex: 2,
                scale: 0.88,
                opacity: 0.65,
                width: 320,
                height: 420,
                translateY: 20,
              },
              "0": {
                left: "50%",
                zIndex: 5,
                scale: 1,
                opacity: 1,
                width: 400,
                height: 480,
                translateY: 0,
              },
              "1": {
                left: "88%",
                zIndex: 2,
                scale: 0.88,
                opacity: 0.65,
                width: 320,
                height: 420,
                translateY: 20,
              },
              "2": {
                left: "100%",
                zIndex: 1,
                scale: 0.75,
                opacity: 0.35,
                width: 280,
                height: 360,
                translateY: 40,
              },
            }
            //@ts-ignore
            const cfg = configs[String(rel)]
            if (!cfg) return null

            const translateX = rel === 0 ? "-50%" : rel < 0 ? "0%" : "-100%"

            return (
              <div
                key={d.name}
                onClick={() => !isActive && setActive(i)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: cfg.left,
                  width: cfg.width,
                  height: cfg.height,
                  transform: `translate(${translateX}, calc(-50% + ${cfg.translateY}px)) scale(${cfg.scale})`,
                  zIndex: cfg.zIndex,
                  opacity: cfg.opacity,
                  transition: "all 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: isActive ? "default" : "pointer",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: isActive
                    ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 2px rgba(245,158,11,0.3)"
                    : "0 12px 40px rgba(0,0,0,0.5)",
                }}
              >
                {/* Image */}
                <img
                  src={d.img}
                  alt={d.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.55s ease",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                />

                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isActive
                      ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.15) 100%)",
                    transition: "background 0.4s ease",
                  }}
                />

                {/* Badge top-right */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: d.badge === "Domestic" ? "#2E7D32" : "#1B2B6B",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: 999,
                    fontFamily: poppins,
                  }}
                >
                  {d.badge}
                </div>

                {/* Bottom content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: isActive ? "28px 24px 24px" : "20px 18px 18px",
                    transition: "padding 0.4s ease",
                  }}
                >
                  {/* City name */}
                  <div
                    style={{
                      fontFamily: poppins,
                      fontSize: isActive ? 32 : 22,
                      fontWeight: 800,
                      color: "#ffffff",
                      letterSpacing: "-0.5px",
                      lineHeight: 1.1,
                      marginBottom: isActive ? 8 : 4,
                      transition: "font-size 0.4s ease",
                      textTransform: "uppercase",
                    }}
                  >
                    {d.name}
                  </div>

                  {/* Specialties */}
                  <div
                    style={{
                      fontSize: isActive ? 13 : 11,
                      color: "rgba(255,255,255,0.75)",
                      fontFamily: poppins,
                      lineHeight: 1.5,
                      marginBottom: isActive ? 18 : 0,
                      transition: "all 0.4s ease",
                      maxHeight: isActive ? 60 : 0,
                      overflow: "hidden",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    {d.specialties}
                  </div>

                  {/* CTA */}
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onNavigate("tourism")
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        background: "#F59E0B",
                        color: "#0A0D14",
                        border: "none",
                        borderRadius: 999,
                        padding: "10px 22px",
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: poppins,
                        transition: "background 0.2s ease, transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#D97706"
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.transform = "scale(1.04)"
                      }}
                      onMouseLeave={(e) => {
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#F59E0B"
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.transform = "scale(1)"
                      }}
                    >
                      Explore {d.name} →
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {/* Prev Arrow */}
          <button
            onClick={prev}
            style={{
              position: "absolute",
              left: "calc(12% + 300px)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              fontFamily: poppins,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "rgba(245,158,11,0.8)"
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                "#F59E0B"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.12)"
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.2)"
            }}
          >
            ‹
          </button>

          {/* Next Arrow */}
          <button
            onClick={next}
            style={{
              position: "absolute",
              right: "calc(12% + 300px)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              fontFamily: poppins,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "rgba(245,158,11,0.8)"
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                "#F59E0B"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.12)"
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.2)"
            }}
          >
            ›
          </button>
        </div>

        {/* Dot indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 40,
          }}
        >
          {destinations.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 32 : 8,
                height: 8,
                borderRadius: 999,
                background: i === active ? "#F59E0B" : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.35s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Count label */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              fontFamily: poppins,
            }}
          >
            {active + 1} / {total}
          </span>
        </div>
      </div>
    </section>
  )
}

export default DestinationsCarousel
