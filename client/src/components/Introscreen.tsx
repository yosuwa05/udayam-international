import { useEffect, useState, useRef } from "react"

interface IntroScreenProps {
  onComplete: () => void
}

const TAGLINE = "Travel  ·  Trust  ·  Tourism"
const HOLD_AFTER_TYPED_MS = 1200 // pause after full tagline before exit

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [typed, setTyped] = useState("")
  const [exiting, setExiting] = useState(false)
  const [showAll, setShowAll] = useState(false) // controls heading + icon fade-in
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setExiting(true)
    setTimeout(onComplete, 900)
  }

  useEffect(() => {
    // 1. After 700ms, fade in icon + heading
    const t1 = setTimeout(() => setShowAll(true), 700)

    // 2. After 1800ms start typing tagline
    let charIndex = 0
    let typingInterval: ReturnType<typeof setInterval>

    const t2 = setTimeout(() => {
      typingInterval = setInterval(() => {
        charIndex++
        setTyped(TAGLINE.slice(0, charIndex))
        if (charIndex >= TAGLINE.length) {
          clearInterval(typingInterval)
          // 3. Hold, then exit
          setTimeout(finish, HOLD_AFTER_TYPED_MS)
        }
      }, 68) // ~68ms per char → smooth but readable
    }, 1800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearInterval(typingInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <style>{`
        @keyframes ui-fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ui-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .intro-skip {
          position: absolute;
          top: 24px; right: 28px;
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #6b5a3e;
          background: none;
          border: 0.5px solid #3a2e1e;
          padding: 5px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          font-family: 'Georgia', serif;
        }
        .intro-skip:hover { color: #c9a96e; border-color: #6b5a3e; }
      `}</style>

      {/* Full-screen overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          opacity: exiting ? 0 : 1,
          transition: exiting ? "opacity 0.9s ease" : "none",
          pointerEvents: exiting ? "none" : "auto",
        }}
      >
        <button className="intro-skip" onClick={finish}>
          Skip
        </button>

        {/* Icon + Heading group */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            opacity: showAll ? 1 : 0,
            animation: showAll ? "ui-fadeUp 1.1s ease forwards" : "none",
          }}
        >
          {/* Globe / travel icon in gold */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c9a96e"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
          </svg>

          {/* Brand name */}
          <h1
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(30px, 6vw, 58px)",
              fontWeight: 400,
              color: "#c9a96e",
              letterSpacing: "12px",
              textTransform: "uppercase",
              margin: 0,
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            Udayam&nbsp;International
          </h1>

          {/* Tagline — always rendered, width expands as chars are typed */}
          <p
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(11px, 1.8vw, 18px)",
              fontWeight: 400,
              color: "#7a6647",
              letterSpacing: "6px",
              textTransform: "uppercase",
              margin: "4px 0 0",
              textAlign: "center",
              minHeight: "22px",
              /* cursor blink only while still typing */
              borderRight:
                typed.length < TAGLINE.length ? "1.5px solid #c9a96e" : "none",
              paddingRight: typed.length < TAGLINE.length ? "3px" : "0",
              animation:
                typed.length < TAGLINE.length
                  ? "ui-fadeIn 0.3s ease forwards"
                  : "none",
            }}
          >
            {typed || "\u00A0" /* keeps height before first char */}
          </p>
        </div>
      </div>
    </>
  )
}
