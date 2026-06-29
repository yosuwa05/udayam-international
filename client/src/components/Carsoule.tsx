import { heroSlides } from "@/lib/homeData"
import React, { useRef, useCallback, useState, useEffect } from "react"

const Carsoule = () => {
  const [slide, setSlide] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const gSlide = useCallback((n: number) => {
    setSlide((n + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => gSlide(slide + 1), 5000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slide, gSlide])

  // Manage video playback based on active slide
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (vid) {
        if (i === slide) {
          vid.play().catch(() => {})
        } else {
          vid.pause()
        }
      }
    })
  }, [slide])

  return (
    <section
      className="hero-sect relative flex flex-col justify-end overflow-hidden"
      style={{
        height: "calc(100vh - 108px)",
        minHeight: 580,
        maxHeight: 820,
        // height: "100vh",
        // minHeight: 560,
        padding: "0 64px 80px",
      }}
    >
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-[900ms] ease-in-out"
          style={{
            opacity: i === slide ? 1 : 0,
            transform: i === slide ? "scale(1)" : "scale(1.05)",
            pointerEvents: i === slide ? "auto" : "none",
          }}
        >
          {/* @ts-ignore - video might not be present on all slide objects */}
          {(s as any).video ? (
            <video
              ref={(el) => {
                videoRefs.current[i] = el
              }}
              src={(s as any).video}
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img src={s.img} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      ))}

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,26,66,.25) 0%, rgba(15,26,66,.15) 30%, rgba(15,26,66,.7) 70%, rgba(15,26,66,.92) 100%)",
        }}
      />

      <div
        style={{ position: "relative", zIndex: 2 }}
        className="pointer-events-none"
      >
        <div
          className="t-eye-anim pointer-events-auto"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "Inter, sans-serif",
            fontSize: ".72rem",
            fontWeight: 600,
            color: "rgba(255,255,255,.5)",
            letterSpacing: ".16em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 30,
              height: 1,
              background: "rgba(255,255,255,.35)",
            }}
          />
          Explore · Discover · Experience
        </div>
        <h1
          className="t-h1-anim pointer-events-auto"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(2.4rem,5.5vw,5rem)",
            fontWeight: 700,
            lineHeight: 1.02,
            color: "#fff",
            marginBottom: 28,
          }}
        >
          Explore the World with
          <br />
          <em
            className="mt-[15px]"
            style={{
              fontStyle: "italic",
              color: "#7ed88a",
              paddingTop: "10px",
            }}
          >
            UV Holidays
          </em>
        </h1>
        <p className="h-desc pointer-events-auto max-w-[460px] text-base leading-[1.8] text-white/60">
          Discover unforgettable journeys with expertly crafted holiday packages
          and seamless travel experiences worldwide.
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => gSlide(slide - 1)}
        className="absolute top-1/2 left-4 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40 md:left-8"
        aria-label="Previous Slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={() => gSlide(slide + 1)}
        className="absolute top-1/2 right-4 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40 md:right-8"
        aria-label="Next Slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => gSlide(i)}
            className="cursor-pointer rounded-full border-none transition-all duration-300"
            style={{
              width: i === slide ? 28 : 8,
              height: 8,
              background: i === slide ? "#fff" : "rgba(255,255,255,0.38)",
            }}
          />
        ))}
      </div>

      <div
        className="absolute right-10 bottom-7 z-10 text-[13px] font-semibold"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        <span className="text-[18px] font-bold text-white">{slide + 1}</span>/
        {heroSlides.length}
      </div>

      {/* <div className="absolute top-1/2 right-7 z-10 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex">
        {heroSlides.map((s, i) => (
          <button
            key={i}
            onClick={() => gSlide(i)}
            className="h-14 w-14 cursor-pointer overflow-hidden rounded-[10px] border-none p-0 transition-all duration-300"
            style={{
              opacity: i === slide ? 1 : 0.4,
              border: i === slide ? "2px solid #fff" : "2px solid transparent",
              boxShadow: i === slide ? "0 4px 16px rgba(0,0,0,0.4)" : "none",
            }}
          >
            <img src={s.thumb} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div> */}
    </section>
  )
}

export default Carsoule
