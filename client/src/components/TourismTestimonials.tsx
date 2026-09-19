import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { _axios } from "@/lib/axios"

interface TestimonialItem {
  _id: string
  name: string
  avatarInitial?: string
  rating: number
  text: string
  trip: string
  isActive: boolean
  type?: string[]
}

export const TourismTestimonials: React.FC = () => {
  const { data: testimonialsResponse, isLoading } = useQuery({
    queryKey: ["testimonials", "tourism"],
    queryFn: async () => {
      const res = await _axios.get("/testimonials", {
        params: { type: "tourism" },
      })
      return res.data as { status: boolean; data: TestimonialItem[] }
    },
    staleTime: 60_000,
  })

  const activeTestimonials = testimonialsResponse?.data ?? []
  const [testiIndex, setTestiIndex] = useState(1)
  const [transitionEnabled, setTransitionEnabled] = useState(true)

  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  useEffect(() => {
    const fn = () => setVw(window.innerWidth)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  const cardWidth = vw >= 1024 ? 33.333 : vw >= 768 ? 55 : 100

  // Display list with cloned boundary elements for seamless looping
  const displayList =
    activeTestimonials.length > 1
      ? [
          activeTestimonials[activeTestimonials.length - 1],
          ...activeTestimonials,
          activeTestimonials[0],
        ]
      : activeTestimonials

  useEffect(() => {
    if (activeTestimonials.length > 1) {
      setTestiIndex(1)
    } else {
      setTestiIndex(0)
    }
  }, [activeTestimonials.length])

  useEffect(() => {
    if (!transitionEnabled) {
      const _reflow = document.body.offsetHeight
      setTransitionEnabled(true)
    }
  }, [transitionEnabled])

  const handlePrevTesti = () => {
    if (displayList.length <= 1) return
    setTestiIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextTesti = () => {
    if (displayList.length <= 1) return
    setTestiIndex((prev) => Math.min(displayList.length - 1, prev + 1))
  }

  const handleTransitionEnd = () => {
    if (activeTestimonials.length <= 1) return
    if (testiIndex === displayList.length - 1) {
      setTransitionEnabled(false)
      setTestiIndex(1)
    } else if (testiIndex === 0) {
      setTransitionEnabled(false)
      setTestiIndex(displayList.length - 2)
    }
  }

  if (!isLoading && activeTestimonials.length === 0) {
    return null
  }

  return (
    <section
      className="border-t border-[#E8E4DC] py-16 md:py-20"
      style={{
        background: "linear-gradient(180deg, #FAF8F4 0%, #F5F2EB 100%)",
      }}
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-10">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-[620px] text-center md:mb-12">
          <p className="mb-3 inline-flex items-center gap-2 font-inter text-[0.75rem] font-bold tracking-[0.2em] text-[#2E7D32] uppercase">
            <span className="h-[1.5px] w-5 bg-[#2E7D32]" />
            Traveler Stories
            <span className="h-[1.5px] w-5 bg-[#2E7D32]" />
          </p>
          <h2
            className="text-3xl leading-tight font-bold md:text-4xl lg:text-[2.6rem]"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              color: "#1B2B6B",
            }}
          >
            What Our Travellers Say
          </h2>
          <p className="mt-3 text-sm text-[#6B7280] md:text-base">
            Real memories and authentic stories from travelers who explored the
            world with UV Holidays.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center gap-5 overflow-hidden py-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 w-full max-w-[380px] animate-pulse rounded-2xl border border-[#E8E4DC] bg-white/70 p-8"
              />
            ))}
          </div>
        ) : activeTestimonials.length > 0 ? (
          <div className="relative mt-4 px-3 sm:px-8">
            {/* Slider track area */}
            <div className="w-full overflow-hidden py-6">
              <div
                className="flex items-stretch"
                style={{
                  transition: transitionEnabled
                    ? "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)"
                    : "none",
                  transform: `translateX(calc(${(100 - cardWidth) / 2}% - ${testiIndex * cardWidth}%))`,
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {displayList.map((t, i) => {
                  const isActive = i === testiIndex
                  return (
                    <div
                      key={i}
                      className="flex flex-shrink-0 justify-center px-2.5 transition-all duration-500 md:px-3.5"
                      style={{
                        width: `${cardWidth}%`,
                        opacity: isActive ? 1 : 0.65,
                        transform: isActive ? "scale(1.02)" : "scale(0.96)",
                      }}
                    >
                      <div
                        className="relative flex w-full flex-col rounded-2xl p-7 transition-all duration-300 md:p-8"
                        style={{
                          background: "#ffffff",
                          border: `1.5px solid ${isActive ? "#1B2B6B" : "#E8E4DC"}`,
                          boxShadow: isActive
                            ? "0 20px 48px rgba(27, 43, 107, 0.12)"
                            : "0 4px 16px rgba(27, 43, 107, 0.04)",
                          minHeight: "270px",
                        }}
                      >
                        {/* Rating Stars */}
                        <div className="mb-4 flex items-center gap-1 text-[15px] text-[#F59E0B]">
                          {"★".repeat(t.rating) + "☆".repeat(5 - t.rating)}
                        </div>

                        {/* Testimonial Quote */}
                        <p
                          className="mb-6 text-left text-[14.5px] leading-[1.75] break-words text-[#374151]"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          "{t.text}"
                        </p>

                        {/* Traveler info pinned to bottom */}
                        <div className="mt-auto flex items-center gap-3.5 border-t border-[#F3F4F6] pt-4">
                          <div
                            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm"
                            style={{
                              background:
                                "linear-gradient(135deg, #1B2B6B 0%, #2E7D32 100%)",
                            }}
                          >
                            {t.avatarInitial || t.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1 text-left">
                            <div
                              className="truncate text-[15px] font-bold"
                              style={{ color: "#1B2B6B" }}
                            >
                              {t.name}
                            </div>
                            <div className="truncate text-[12.5px] text-[#6B7280]">
                              📍 {t.trip}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            {activeTestimonials.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevTesti}
                  aria-label="Previous testimonial"
                  className="absolute top-1/2 left-0 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E8E4DC] bg-white text-[#1B2B6B] shadow-md transition-all hover:border-[#1B2B6B] hover:bg-[#FAF8F4] active:scale-95"
                  style={{ zIndex: 10 }}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={handleNextTesti}
                  aria-label="Next testimonial"
                  className="absolute top-1/2 right-0 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E8E4DC] bg-white text-[#1B2B6B] shadow-md transition-all hover:border-[#1B2B6B] hover:bg-[#FAF8F4] active:scale-95"
                  style={{ zIndex: 10 }}
                >
                  →
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default TourismTestimonials
