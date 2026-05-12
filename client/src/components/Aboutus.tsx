import React, { useCallback, useEffect, useRef, useState } from "react"

const AboutUs = () => {
  // Refs
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const prevMouseRef = useRef({ x: 0, y: 0 })
  const isFlyingRef = useRef(false)
  const planeAnimRef = useRef<number | null>(null)
  const flyTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const observersRef = useRef<IntersectionObserver[]>([])

  // States
  const [countersStarted, setCountersStarted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorHover, setCursorHover] = useState(false)
  const [cursorAngle, setCursorAngle] = useState(0)
  const [planePos, setPlanePos] = useState({ x: -70, y: 0 })
  const [planeOpacity, setPlaneOpacity] = useState(0)

  // Throttled Mouse Move (Biggest performance killer)
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      const newX = e.clientX
      const newY = e.clientY
      setMousePos({ x: newX, y: newY })

      const dx = e.movementX || newX - prevMouseRef.current.x
      const dy = e.movementY || newY - prevMouseRef.current.y

      if (dx !== 0 || dy !== 0) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) - 45
        setCursorAngle(angle)
      }

      prevMouseRef.current = { x: newX, y: newY }
    }, 16), // ~60fps
    []
  )

  // Mouse Move Listener
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  // Hover Effects for Interactive Elements
  useEffect(() => {
    const interactiveElements = document.querySelectorAll(
      "a, button, .vc, .vcard, .tcard, .acard, .tc, .tcm"
    )

    const handleEnter = () => setCursorHover(true)
    const handleLeave = () => setCursorHover(false)

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter)
      el.addEventListener("mouseleave", handleLeave)
    })

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter)
        el.removeEventListener("mouseleave", handleLeave)
      })
    }
  }, [])

  // Consolidated Reveal Observer
  useEffect(() => {
    const elements = document.querySelectorAll(".rv, .rvl, .rvr, .reveal")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("vis", "visible")
            }, index * 60) // Slightly staggered but smoother
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    elements.forEach((el) => observer.observe(el))
    observersRef.current.push(observer)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Counter Animation
  useEffect(() => {
    const counters = document.querySelectorAll(".counter")

    if (counters.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          setCountersStarted(true)

          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute("data-t") || "0", 10)
            const duration = 1200
            const startTime = performance.now()

            const updateCounter = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 4) // smoother easeOut
              const current = Math.floor(target * eased)

              counter.textContent = current.toString()

              if (progress < 1) {
                requestAnimationFrame(updateCounter)
              } else {
                counter.textContent = target.toString()
              }
            }

            requestAnimationFrame(updateCounter)
          })
        }
      },
      { threshold: 0.6 }
    )

    observer.observe(counters[0])
    observersRef.current.push(observer)

    return () => observer.disconnect()
  }, [countersStarted])

  // Flying Plane Animation
  const flyAcross = useCallback(() => {
    if (isFlyingRef.current) return
    isFlyingRef.current = true

    const y = 70 + Math.random() * (window.innerHeight - 200)
    const duration = 2400
    const startTime = performance.now()

    setPlaneOpacity(0.65)

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const xPos = -70 + (window.innerWidth + 140) * eased
      const yPos = y - Math.sin(progress * Math.PI) * 50

      setPlanePos({ x: xPos, y: yPos })

      if (progress < 1) {
        planeAnimRef.current = requestAnimationFrame(animate)
      } else {
        setPlaneOpacity(0)
        setTimeout(() => {
          isFlyingRef.current = false
        }, 600)
      }
    }

    if (planeAnimRef.current) cancelAnimationFrame(planeAnimRef.current)
    planeAnimRef.current = requestAnimationFrame(animate)
  }, [])

  // Scroll-triggered Plane (Optimized)
  useEffect(() => {
    const sections = document.querySelectorAll("section, .sb, .mq")

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (flyTimeoutRef.current) clearTimeout(flyTimeoutRef.current)
          flyTimeoutRef.current = setTimeout(flyAcross, 650)
        }
      },
      { threshold: 0.25, rootMargin: "100px" }
    )

    sections.forEach((section) => observer.observe(section))
    observersRef.current.push(observer)

    return () => {
      observer.disconnect()
      if (flyTimeoutRef.current) clearTimeout(flyTimeoutRef.current)
      if (planeAnimRef.current) cancelAnimationFrame(planeAnimRef.current)
    }
  }, [flyAcross])
  return (
    <>
      {/* Custom Cursor */}
      {/* <div
        id="cur"
        className={`pointer-events-none fixed z-[99999] h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] transition-all duration-200 ${
          cursorHover ? "h-[60px] w-[60px] bg-[rgba(27,43,107,0.06)]" : ""
        }`}
        style={{
          left: mousePos.x,
          top: mousePos.y,
          borderColor: "rgba(27,43,107,0.35)",
        }}
      />
      <div
        id="cur-dot"
        className="pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-1/2 text-[17px] transition-transform duration-75"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: `translate(-50%, -50%) rotate(${cursorAngle}deg)`,
        }}
      >
        ✈
      </div> */}

      {/* Flying Plane */}
      {/* <div
        id="fp"
        className="pointer-events-none fixed z-[9990] text-[22px]"
        style={{
          left: planePos.x,
          top: planePos.y,
          opacity: planeOpacity,
          filter: "drop-shadow(0 2px 8px rgba(27,43,107,0.3))",
        }}
      >
        ✈️
      </div> */}

      {/* HERO */}
      <section className="hero relative flex h-screen min-h-[700px] flex-col justify-end overflow-hidden px-4 pb-[88px] md:px-16">
        <div className="hbg absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="hov2 absolute inset-0 bg-gradient-to-b from-[rgba(15,26,66,0.2)] via-[rgba(15,26,66,0.12)] via-35% to-[rgba(15,26,66,0.93)] to-75%" />
        <div className="scroll-hint absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 animate-[fsu_1s_0.7s_forwards] flex-col items-center gap-2 opacity-0">
          <div className="sh-line h-11 w-px animate-[shp_2.2s_ease-in-out_infinite] bg-gradient-to-b from-white/50 to-transparent" />
          <span className="sh-txt font-inter text-[0.62rem] tracking-[0.14em] text-white/35 uppercase">
            Scroll
          </span>
        </div>
        <div className="hero-content relative z-[2] max-w-[1100px]">
          <div className="h-eye mb-5 inline-flex animate-[fsu_0.9s_0.2s_forwards] items-center gap-2.5 font-inter text-[0.72rem] font-semibold tracking-[0.16em] text-white/55 uppercase opacity-0">
            <span className="inline-block h-px w-[30px] bg-white/40" />
            About Horizons Travel Co. · Est. 2004
          </div>
          <h1 className="h1 font-libre mb-[30px] animate-[fsu_1s_0.35s_forwards] text-[clamp(3rem,6vw,6.2rem)] leading-[1.01] font-bold text-white opacity-0">
            We Craft Journeys
            <br />
            That Become{" "}
            <em className="text-[#7ed88a] italic not-italic">Stories</em>
            <br />
            For a Lifetime.
          </h1>
          <div className="h-row flex animate-[fsu_1s_0.5s_forwards] flex-col items-start justify-between gap-10 opacity-0 md:flex-row md:items-end">
            <p className="h-desc max-w-[460px] text-base leading-[1.8] text-white/60">
              Twenty years curating the world's finest travel experiences for
              explorers who believe the journey is just as important as the
              destination.
            </p>
            <div className="h-stats flex gap-11">
              <div className="hs text-right">
                <div className="hs-n font-libre font-inter text-[2.2rem] leading-none font-bold text-white">
                  48K<sup className="text-[1.1rem] text-[#7ed88a]">+</sup>
                </div>
                <div className="hs-l mt-1 font-inter text-[0.68rem] tracking-[0.1em] text-white/40 uppercase">
                  Travellers
                </div>
              </div>
              <div className="hs text-right">
                <div className="hs-n font-libre font-inter text-[2.2rem] leading-none font-bold text-white">
                  120<sup className="text-[1.1rem] text-[#7ed88a]">+</sup>
                </div>
                <div className="hs-l mt-1 font-inter text-[0.68rem] tracking-[0.1em] text-white/40 uppercase">
                  Countries
                </div>
              </div>
              <div className="hs text-right">
                <div className="hs-n font-libre font-inter text-[2.2rem] leading-none font-bold text-white">
                  4.9<sup className="text-[1.1rem] text-[#7ed88a]">★</sup>
                </div>
                <div className="hs-l mt-1 font-inter text-[0.68rem] tracking-[0.1em] text-white/40 uppercase">
                  Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      {/* <div className="mq overflow-hidden border-y border-white/5 bg-[#1B2B6B] py-[18px]">
        <div className="mq-track flex w-max animate-[mqscroll_28s_linear_infinite]">
          {[
            "Personalised Itineraries",
            "120+ Destinations",
            "24/7 Travel Support",
            "IATA Accredited",
            "Eco-Certified",
            "Award Winning Agency",
            "20 Years of Excellence",
          ].map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="mq-item flex items-center gap-[18px] px-9 font-inter text-[0.72rem] font-medium tracking-[0.14em] whitespace-nowrap text-white/40 uppercase">
                <div className="mq-dot h-1 w-1 rounded-full bg-[#43A047]" />
                {item}
              </div>
            </React.Fragment>
          ))}
          {[
            "Personalised Itineraries",
            "120+ Destinations",
            "24/7 Travel Support",
            "IATA Accredited",
            "Eco-Certified",
            "Award Winning Agency",
            "20 Years of Excellence",
          ].map((item, idx) => (
            <div
              key={`dup-${idx}`}
              className="mq-item flex items-center gap-[18px] px-9 font-inter text-[0.72rem] font-medium tracking-[0.14em] whitespace-nowrap text-white/40 uppercase"
            >
              <div className="mq-dot h-1 w-1 rounded-full bg-[#43A047]" />
              {item}
            </div>
          ))}
        </div>
      </div> */}

      {/* INTRO SPLIT */}
      <div
        className="intro grid min-h-[85vh] grid-cols-1 overflow-hidden lg:min-h-[88vh] lg:grid-cols-2"
        id="story"
      >
        {/* Left - Content */}
        <div className="intro-l rvl flex translate-x-0 flex-col justify-center bg-[#FAF8F4] p-6 opacity-0 transition-all duration-800 sm:p-10">
          <p className="ey mb-[14px] flex items-center gap-2.5 font-inter text-[0.7rem] font-bold tracking-[0.18em] text-[#2E7D32] uppercase">
            <span className="h-[1.5px] w-6 bg-[#2E7D32]" />
            Our Story
          </p>

          <h2 className="sh font-libre mb-5 text-[clamp(2rem,5vw,3.2rem)] leading-[1.1] font-bold text-[#1B2B6B]">
            Born from a Passion
            <br />
            for <em className="text-[#2E7D32] italic">Exploration</em>
          </h2>

          <p className="bt mb-5 text-[15px] leading-[1.85] text-[#5a5a7a] sm:text-base">
            In 2004, a small team of travel enthusiasts in Chennai dared to
            imagine a world where everyone could experience the beauty of
            distant lands without stress or compromise. That spark became
            Horizons Travel Co.
          </p>

          <p className="bt mb-9 text-[15px] leading-[1.85] text-[#5a5a7a] sm:text-base">
            Over two decades, we've grown from a local boutique agency to a
            nationally recognised travel brand — crafting over 48,000
            personalised journeys for travellers who believe every trip should
            feel like the best chapter of their story.
          </p>

          <a
            href="#cta"
            className="btn-nv inline-flex items-center gap-2 self-start rounded-full bg-[#1B2B6B] px-8 py-4 font-inter text-[0.88rem] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#243590] hover:shadow-[0_10px_28px_rgba(27,43,107,0.25)]"
          >
            Start Your Journey →
          </a>
        </div>

        {/* Right - Image */}
        <div className="intro-r rvr relative min-h-[380px] translate-x-0 overflow-hidden opacity-0 transition-all duration-800 lg:min-h-auto">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80"
            alt="Road trip travel"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[8s] ease-in-out hover:scale-150"
          />

          <div className="ir-overlay absolute inset-0 bg-gradient-to-r from-[rgba(247,245,240,0.15)] to-transparent" />

          {/* Top Tag - Responsive */}
          <div className="ir-tag absolute top-6 right-6 rounded-full bg-orange-500 px-5 py-2.5 font-inter text-[0.7rem] font-semibold tracking-[0.06em] text-white backdrop-blur-[8px] hover:bg-orange-600 sm:top-8 sm:right-8 sm:text-[0.72rem]">
            ✦ Est. 2004 · Chennai
          </div>

          {/* Bottom Badge - Responsive */}
          <div className="ir-badge absolute bottom-8 left-4 min-w-[130px] rounded-2xl bg-white px-6 py-5 text-center shadow-[0_20px_60px_rgba(27,43,107,0.15)] sm:left-6 sm:min-w-[140px] sm:py-[22px] md:left-8 lg:-left-7">
            <div className="ib-n font-libre text-[2.2rem] leading-none font-bold text-[#1B2B6B] sm:text-[2.6rem]">
              20+
            </div>
            <div className="ib-t mt-1 font-inter text-[0.65rem] tracking-[0.1em] text-[#9494b0] uppercase sm:text-[0.66rem]">
              Years of
              <br />
              Excellence
            </div>
          </div>
        </div>
      </div>

      {/* PHOTO COLLAGE */}
      <section className="collage bg-white px-6 py-20 md:px-16">
        <div className="col-top mb-14 grid grid-cols-1 items-end gap-12 md:grid-cols-2">
          <div className="rv translate-y-9 opacity-0 transition-all duration-800">
            <p className="ey mb-[14px] flex items-center gap-2.5 font-inter text-[0.7rem] font-bold tracking-[0.18em] text-[#2E7D32] uppercase">
              <span className="h-[1.5px] w-6 bg-[#2E7D32]" />
              Where We've Been
            </p>
            <h2 className="sh font-libre text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.15] font-bold text-[#1B2B6B]">
              Destinations That
              <br />
              Define{" "}
              <em className="text-[#2E7D32] italic not-italic">Dreams</em>
            </h2>
          </div>
          <div className="rv d2 translate-y-9 opacity-0 transition-all delay-100 duration-800">
            <p className="bt text-base leading-[1.85] text-[#5a5a7a]">
              From the Swiss Alps to Rajasthan's golden sands — every
              destination in our portfolio has been hand-selected and personally
              vetted by our team of expert travellers.
            </p>
          </div>
        </div>
        <div className="cgrid rv grid translate-y-9 grid-cols-1 gap-3.5 opacity-0 transition-all duration-800 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr]">
          <div className="ci c1 relative overflow-hidden rounded-2xl lg:row-span-2">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&auto=format&fit=crop&q=80"
              alt="Swiss Alps"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="ci-lbl absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-inter text-[0.66rem] font-semibold tracking-[0.05em] text-[#1B2B6B] backdrop-blur-[8px]">
              Swiss Alps
            </div>
          </div>
          <div className="ci relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&auto=format&fit=crop&q=80"
              alt="Santorini"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="ci-lbl absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-inter text-[0.66rem] font-semibold tracking-[0.05em] text-[#1B2B6B] backdrop-blur-[8px]">
              Santorini
            </div>
          </div>
          <div className="ci c3 relative overflow-hidden rounded-2xl lg:row-span-2">
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&auto=format&fit=crop&q=80"
              alt="Dubai"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="ci-lbl absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-inter text-[0.66rem] font-semibold tracking-[0.05em] text-[#1B2B6B] backdrop-blur-[8px]">
              Dubai
            </div>
          </div>
          <div className="ci relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=500&auto=format&fit=crop&q=80"
              alt="Bali"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="ci-lbl absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-inter text-[0.66rem] font-semibold tracking-[0.05em] text-[#1B2B6B] backdrop-blur-[8px]">
              Bali
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      {/* <div className="sb relative grid grid-cols-2 overflow-hidden bg-[#1B2B6B] px-6 py-[72px] md:grid-cols-4 md:px-16">
        <div className="bg-radial-gradient absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full from-[rgba(46,125,50,0.12)] to-transparent" />
        <div className="si rv relative z-[1] translate-y-9 border-r border-white/7 px-5 py-10 text-center opacity-0 transition-all duration-800">
          <div className="sn font-libre mb-2 text-[3.4rem] leading-none font-bold text-white">
            <span className="counter" data-t="48">
              0
            </span>
            K<sup className="text-[1.5rem] text-[#43A047]">+</sup>
          </div>
          <div className="sl font-inter text-[0.7rem] font-medium tracking-[0.1em] text-white/38 uppercase">
            Happy Travellers
          </div>
        </div>
        <div className="si rv d1 relative z-[1] translate-y-9 border-r border-white/7 px-5 py-10 text-center opacity-0 transition-all delay-100 duration-800">
          <div className="sn font-libre mb-2 text-[3.4rem] leading-none font-bold text-white">
            <span className="counter" data-t="120">
              0
            </span>
            <sup className="text-[1.5rem] text-[#43A047]">+</sup>
          </div>
          <div className="sl font-inter text-[0.7rem] font-medium tracking-[0.1em] text-white/38 uppercase">
            Countries Covered
          </div>
        </div>
        <div className="si rv d2 relative z-[1] translate-y-9 border-r border-white/7 px-5 py-10 text-center opacity-0 transition-all delay-200 duration-800">
          <div className="sn font-libre mb-2 text-[3.4rem] leading-none font-bold text-white">
            <span className="counter" data-t="20">
              0
            </span>
            <sup className="text-[1.5rem] text-[#43A047]">+</sup>
          </div>
          <div className="sl font-inter text-[0.7rem] font-medium tracking-[0.1em] text-white/38 uppercase">
            Years of Experience
          </div>
        </div>
        <div className="si rv d3 relative z-[1] translate-y-9 px-5 py-10 text-center opacity-0 transition-all delay-300 duration-800">
          <div className="sn font-libre mb-2 text-[3.4rem] leading-none font-bold text-white">
            <span className="counter" data-t="35">
              0
            </span>
            <sup className="text-[1.5rem] text-[#43A047]">+</sup>
          </div>
          <div className="sl font-inter text-[0.7rem] font-medium tracking-[0.1em] text-white/38 uppercase">
            Industry Awards
          </div>
        </div>
      </div> */}

      {/* VISION MISSION */}
      <section className="vm bg-[#F7F5F0] px-6 py-20 md:px-16" id="vision">
        <div className="rv max-w-[600px] translate-y-9 opacity-0 transition-all duration-800">
          <p className="ey mb-[14px] flex items-center gap-2.5 font-inter text-[0.7rem] font-bold tracking-[0.18em] text-[#2E7D32] uppercase">
            <span className="h-[1.5px] w-6 bg-[#2E7D32]" />
            Purpose & Direction
          </p>
          <h2 className="sh font-libre text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.15] font-bold text-[#1B2B6B]">
            What Drives Us{" "}
            <em className="text-[#2E7D32] italic not-italic">Forward</em>
          </h2>
        </div>
        <div className="vm-g mt-[60px] grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="vc rv d1 relative translate-y-9 overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white p-11 opacity-0 transition-all delay-100 duration-400 duration-800 hover:-translate-y-2 hover:border-[rgba(27,43,107,0.15)] hover:shadow-[0_32px_80px_rgba(27,43,107,0.1)]">
            <div className="vc-n font-libre mb-5 font-inter text-[3.5rem] leading-none font-bold text-[#E8E4DC]">
              01
            </div>
            <h3 className="font-libre mb-[14px] text-[1.35rem] text-[#1B2B6B]">
              Our Vision
            </h3>
            <p className="text-[0.9rem] leading-[1.8] text-[#5a5a7a]">
              To be the most trusted travel companion for India's next
              generation of explorers — making world-class travel accessible,
              sustainable, and profoundly personal.
            </p>
          </div>
          <div className="vc rv d2 relative translate-y-9 overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white p-11 opacity-0 transition-all delay-200 duration-400 duration-800 hover:-translate-y-2 hover:border-[rgba(27,43,107,0.15)] hover:shadow-[0_32px_80px_rgba(27,43,107,0.1)]">
            <div className="vc-n font-libre mb-5 font-inter text-[3.5rem] leading-none font-bold text-[#E8E4DC]">
              02
            </div>
            <h3 className="font-libre mb-[14px] text-[1.35rem] text-[#1B2B6B]">
              Our Mission
            </h3>
            <p className="text-[0.9rem] leading-[1.8] text-[#5a5a7a]">
              To design journeys curated to individual dreams — from budget solo
              backpacks to luxury escapes — with zero compromise on quality,
              safety, or soul.
            </p>
          </div>
          <div className="vc rv d3 relative translate-y-9 overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white p-11 opacity-0 transition-all delay-300 duration-400 duration-800 hover:-translate-y-2 hover:border-[rgba(27,43,107,0.15)] hover:shadow-[0_32px_80px_rgba(27,43,107,0.1)]">
            <div className="vc-n font-libre mb-5 font-inter text-[3.5rem] leading-none font-bold text-[#E8E4DC]">
              03
            </div>
            <h3 className="font-libre mb-[14px] text-[1.35rem] text-[#1B2B6B]">
              Our Promise
            </h3>
            <p className="text-[0.9rem] leading-[1.8] text-[#5a5a7a]">
              Every booking comes with our personal guarantee — 24/7 on-ground
              support, verified partners, and real humans who genuinely care
              about your experience.
            </p>
          </div>
        </div>
      </section>

      {/* STORY TIMELINE */}
      <section className="story bg-white px-6 py-20 md:px-16">
        <div className="st-g grid grid-cols-1 items-center gap-[100px] lg:grid-cols-2">
          <div>
            <div className="rv translate-y-9 opacity-0 transition-all duration-800">
              <p className="ey mb-[14px] flex items-center gap-2.5 font-inter text-[0.7rem] font-bold tracking-[0.18em] text-[#2E7D32] uppercase">
                <span className="h-[1.5px] w-6 bg-[#2E7D32]" />
                Our Journey
              </p>
              <h2 className="sh font-libre text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.15] font-bold text-[#1B2B6B]">
                From Idea to a
                <br />
                <em className="text-[#2E7D32] italic not-italic">
                  Trusted
                </em>{" "}
                Travel Partner
              </h2>
            </div>
            <div className="tl mt-10">
              {[
                {
                  year: "2004",
                  title: "Founded in Chennai",
                  desc: "Started as a 3-person team with a shared belief that travel should be deeply personal and stress-free.",
                  delay: "d1",
                },
                {
                  year: "2010",
                  title: "National Recognition",
                  desc: "Featured in Condé Nast Traveller India as one of the most exciting boutique travel curators.",
                  delay: "d2",
                },
                {
                  year: "2015",
                  title: "IATA Accreditation",
                  desc: "Received full International Air Transport Association accreditation, joining verified global operators.",
                  delay: "d3",
                },
                {
                  year: "2019",
                  title: "Digital Innovation Award",
                  desc: "First Indian agency to launch an AI-powered personalised trip-builder platform for modern travellers.",
                  delay: "d4",
                },
                {
                  year: "2024",
                  title: "48,000+ Journeys Crafted",
                  desc: "Celebrated two decades with a community of 48,000+ travellers across 120+ countries worldwide.",
                  delay: "d5",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`tl-i rv relative flex gap-6 pb-[34px] ${item.delay} translate-y-9 opacity-0 transition-all duration-800 delay-${(idx + 1) * 100}`}
                >
                  <div className="tl-d relative z-[1] flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#E8E4DC] bg-white text-[0.75rem] transition-all duration-300 hover:border-[#1B2B6B] hover:bg-[#1B2B6B] hover:text-white">
                    ✦
                  </div>
                  <div>
                    <div className="tl-yr mb-1 font-inter text-[0.68rem] font-bold tracking-[0.12em] text-[#2E7D32] uppercase">
                      {item.year}
                    </div>
                    <div className="tl-ti font-libre mb-1.5 text-[1.02rem] text-[#1B2B6B]">
                      {item.title}
                    </div>
                    <p className="tl-tx text-[0.86rem] leading-[1.7] text-[#9494b0]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="st-imgs rvr relative h-[600px] opacity-0 transition-all duration-800 md:mt-16 md:translate-x-9">
            <div className="si1 absolute top-0 left-0 z-[1] h-[80%] w-[72%] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80"
                alt="Journey"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="si2 absolute right-0 bottom-0 z-[2] h-[55%] w-[55%] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(27,43,107,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&auto=format&fit=crop&q=80"
                alt="Adventure"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="si3 absolute top-[58%] left-1/2 z-[3] min-w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#1B2B6B] px-7 py-[22px] text-center shadow-[0_16px_48px_rgba(27,43,107,0.25)]">
              <div className="si3-n font-libre text-3xl font-bold text-white">
                20+
              </div>
              <div className="si3-t mt-1 font-inter text-[0.62rem] tracking-[0.1em] text-white/45 uppercase">
                Years of
                <br />
                Wanderlust
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testi relative overflow-hidden bg-[#1B2B6B] px-6 py-20 md:px-16">
        <div className="bg-radial-gradient absolute -top-[200px] -right-[200px] h-[600px] w-[600px] rounded-full from-[rgba(46,125,50,0.12)] to-transparent" />
        <div className="testi-hd mb-14 flex flex-col items-start justify-between md:flex-row md:items-end">
          <div>
            <p className="ey mb-[14px] flex items-center gap-2.5 font-inter text-[0.7rem] font-bold tracking-[0.18em] text-white/30 uppercase">
              <span className="h-[1.5px] w-6 bg-white/30" />
              Customer Stories
            </p>
            <h2 className="sh font-libre rv translate-y-9 text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.15] font-bold text-white opacity-0 transition-all duration-800">
              Over 21,000{" "}
              <em className="text-[#7ed88a] italic not-italic">
                5-Star Reviews
              </em>
            </h2>
          </div>
          <p className="testi-sub rv d2 max-w-[220px] translate-y-9 text-left text-[0.88rem] text-white/38 opacity-0 transition-all delay-100 duration-800 md:text-right">
            Real stories from travellers who trusted us with their most precious
            moments.
          </p>
        </div>
        <div className="tg grid grid-cols-1 gap-5 md:grid-cols-[1.6fr_1fr]">
          <div className="tc rv translate-y-9 rounded-2xl border border-white/8 bg-white/5 p-9 opacity-0 transition-all duration-350 duration-800 hover:bg-white/10">
            <div className="tstars mb-[14px] text-[0.85rem] tracking-[2px] text-[#f4c150]">
              ★★★★★
            </div>
            <p className="tq font-libre mb-6 text-[1.05rem] leading-[1.75] text-white/82 italic">
              "Horizons didn't just plan our honeymoon — they crafted a story
              we'll tell for the rest of our lives. Every detail, from the
              sunrise villa in Bali to the private beach dinner, was absolutely
              perfect."
            </p>
            <div className="ta flex items-center gap-3">
              <div className="tav2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/10 font-inter text-[0.76rem] font-semibold text-white/60">
                DM
              </div>
              <div>
                <div className="tan font-inter text-[0.82rem] font-semibold text-white/65">
                  Deepa & Mahesh
                </div>
                <div className="tal text-[0.7rem] text-white/30">
                  Bangalore, India
                </div>
              </div>
            </div>
          </div>
          <div className="tr flex flex-col gap-5">
            <div className="tcm rv d2 translate-y-9 rounded-2xl border border-white/8 bg-white/5 p-6 opacity-0 transition-all delay-100 duration-350 duration-800 hover:bg-white/10">
              <div className="tstars mb-[14px] text-[0.75rem] text-[#f4c150]">
                ★★★★★
              </div>
              <p className="tq font-libre mb-4 text-[0.88rem] leading-[1.75] text-white/82 italic">
                "As a solo female traveller, safety was my priority. Horizons
                made me feel supported every single moment — from landing to
                departing."
              </p>
              <div className="ta flex items-center gap-3">
                <div className="tav2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/10 font-inter text-[0.76rem] font-semibold text-white/60">
                  AK
                </div>
                <div>
                  <div className="tan font-inter text-[0.82rem] font-semibold text-white/65">
                    Anika Kapoor
                  </div>
                  <div className="tal text-[0.7rem] text-white/30">
                    Mumbai, India
                  </div>
                </div>
              </div>
            </div>
            <div className="tcm rv d3 translate-y-9 rounded-2xl border border-white/8 bg-white/5 p-6 opacity-0 transition-all delay-200 duration-350 duration-800 hover:bg-white/10">
              <div className="tstars mb-[14px] text-[0.75rem] text-[#f4c150]">
                ★★★★★
              </div>
              <p className="tq font-libre mb-4 text-[0.88rem] leading-[1.75] text-white/82 italic">
                "The Switzerland itinerary was pure magic. Nothing felt generic
                — it felt like it was made just for us."
              </p>
              <div className="ta flex items-center gap-3">
                <div className="tav2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/10 font-inter text-[0.76rem] font-semibold text-white/60">
                  RS
                </div>
                <div>
                  <div className="tan font-inter text-[0.82rem] font-semibold text-white/65">
                    Rajan & Sunita
                  </div>
                  <div className="tal text-[0.7rem] text-white/30">
                    Chennai, India
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fsu {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shp {
          0%, 100% {
            opacity: 1;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.4;
            transform: scaleY(0.65);
          }
        }
        @keyframes mqscroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .rv, .rvl, .rvr {
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .rv.vis, .rvl.vis, .rvr.vis {
          opacity: 1 !important;
          transform: none !important;
        }
        .d1 { transition-delay: 0.1s; }
        .d2 { transition-delay: 0.2s; }
        .d3 { transition-delay: 0.3s; }
        .d4 { transition-delay: 0.4s; }
        .d5 { transition-delay: 0.5s; }
        .border-white\\/7 {
          border-right-color: rgba(255, 255, 255, 0.07);
        }
        .border-white\\/8 {
          border-color: rgba(255, 255, 255, 0.08);
        }
        .bg-radial-gradient {
          background: radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 70%);
        }
        .tl-i::after {
          content: '';
          position: absolute;
          left: 17px;
          top: 36px;
          bottom: 0;
          width: 1px;
          background: #E8E4DC;
        }
        .tl-i:last-child::after {
          display: none;
        }
        .tl-i:last-child {
          padding-bottom: 0;
        }
          /* Scroll-reveal animation */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal.delay-1 {
          transition-delay: 100ms;
        }
        .reveal.delay-2 {
          transition-delay: 200ms;
        }
        .reveal.delay-3 {
          transition-delay: 300ms;
        }

        /* Parallax CTA - fixed background effect */
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        /* For mobile devices, disable fixed attachment */
        @media (max-width: 768px) {
          .parallax-bg {
            background-attachment: scroll;
          }
        }

        /* Icon circle hover */
        .icon-circle {
          transition:
            background 0.3s,
            color 0.3s;
        }
        .icon-circle:hover {
          background: #1b2b6b;
          color: #fff;
        }
        .icon-circle svg {
          transition: stroke 0.3s;
        }

        /* Selection highlight */
        ::selection {
          background: #1b2b6b;
          color: #fff;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  )
}
// Throttle utility
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
export default AboutUs
