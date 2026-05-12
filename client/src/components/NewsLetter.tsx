import { useEffect, useRef } from "react"

const NewsLetter = () => {
  const observersRef = useRef<IntersectionObserver[]>([])

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
  return (
    <>
      {/* ── PARALLAX CTA SECTION (SCROLL EFFECT) ──────────────────── */}
      <section
        className="parallax-bg relative flex items-center justify-center px-6 py-36"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80')",
        }}
      >
        {/* Overlay layers for depth effect */}
        <div className="absolute inset-0 bg-[#1B2B6B]/65 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/25"></div>

        {/* Content */}
        <div className="reveal relative z-10 mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-6 font-heading text-4xl md:text-5xl">
            Ready to Begin Your Journey?
          </h2>
          <p className="mb-10 text-xl font-light text-white/85">
            Let us craft the trip of a lifetime for you.
          </p>
          <button className="font-ui rounded-full bg-[#2E7D32] px-10 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#256427] hover:shadow-xl">
            Explore Our Tours
          </button>
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

export default NewsLetter
