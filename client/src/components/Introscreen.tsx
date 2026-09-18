// import { useEffect, useState, useRef } from "react"

// interface IntroScreenProps {
//   onComplete: () => void
// }

// const TAGLINE = "Travel  ★  Trust  ★  Tourism"
// const HOLD_AFTER_TYPED_MS = 1200 // pause after full tagline before exit

// export default function IntroScreen({ onComplete }: IntroScreenProps) {
//   const [typed, setTyped] = useState("")
//   const [exiting, setExiting] = useState(false)
//   const [showAll, setShowAll] = useState(false) // controls heading + icon fade-in
//   const doneRef = useRef(false)

//   const finish = () => {
//     if (doneRef.current) return
//     doneRef.current = true
//     setExiting(true)
//     setTimeout(onComplete, 900)
//   }

//   useEffect(() => {
//     // 1. After 700ms, fade in icon + heading
//     const t1 = setTimeout(() => setShowAll(true), 700)

//     // 2. After 1800ms start typing tagline
//     let charIndex = 0
//     let typingInterval: ReturnType<typeof setInterval>

//     const t2 = setTimeout(() => {
//       typingInterval = setInterval(() => {
//         charIndex++
//         setTyped(TAGLINE.slice(0, charIndex))
//         if (charIndex >= TAGLINE.length) {
//           clearInterval(typingInterval)
//           // 3. Hold, then exit
//           setTimeout(finish, HOLD_AFTER_TYPED_MS)
//         }
//       }, 68) // ~68ms per char → smooth but readable
//     }, 1800)

//     return () => {
//       clearTimeout(t1)
//       clearTimeout(t2)
//       clearInterval(typingInterval)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return (
//     <>
//       <style>{`
//         @keyframes ui-fadeUp {
//           from { opacity: 0; transform: translateY(22px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes ui-fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }
//         .intro-skip {
//           position: absolute;
//           top: 24px; right: 28px;
//           font-size: 11px;
//           letter-spacing: 2.5px;
//           text-transform: uppercase;
//           color: #6b5a3e;
//           background: none;
//           border: 0.5px solid #3a2e1e;
//           padding: 5px 16px;
//           border-radius: 20px;
//           cursor: pointer;
//           transition: color 0.2s, border-color 0.2s;
//           font-family: 'Georgia', serif;
//         }
//         .intro-skip:hover { color: #c9a96e; border-color: #6b5a3e; }
//       `}</style>

//       {/* Full-screen overlay */}
//       <div
//         style={{
//           position: "fixed",
//           inset: 0,
//           background: "#0a0a0a",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 9999,
//           opacity: exiting ? 0 : 1,
//           transition: exiting ? "opacity 0.9s ease" : "none",
//           pointerEvents: exiting ? "none" : "auto",
//         }}
//       >
//         {/* Icon + Heading group */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: "20px",
//             opacity: showAll ? 1 : 0,
//             animation: showAll ? "ui-fadeUp 1.1s ease forwards" : "none",
//           }}
//         >
//           {/* Brand name */}
//           <h1
//             style={{
//               fontFamily: "'Georgia', 'Times New Roman', serif",
//               fontSize: "clamp(30px, 6vw, 58px)",
//               fontWeight: 400,
//               color: "#c9a96e",
//               letterSpacing: "12px",
//               textTransform: "uppercase",
//               margin: 0,
//               textAlign: "center",
//               lineHeight: 1,
//             }}
//           >
//             Udayam&nbsp;International
//           </h1>

//           <p
//             style={{
//               fontFamily: "'Georgia', 'Times New Roman', serif",
//               fontSize: "clamp(11px, 1.8vw, 18px)",
//               fontWeight: 400,
//               color: "#7a6647",
//               letterSpacing: "6px",
//               textTransform: "uppercase",
//               margin: "4px 0 0",
//               textAlign: "center",
//               minHeight: "22px",
//               /* cursor blink only while still typing */
//               borderRight:
//                 typed.length < TAGLINE.length ? "1.5px solid #c9a96e" : "none",
//               paddingRight: typed.length < TAGLINE.length ? "3px" : "0",
//               animation:
//                 typed.length < TAGLINE.length
//                   ? "ui-fadeIn 0.3s ease forwards"
//                   : "none",
//             }}
//           >
//             {typed || "\u00A0" /* keeps height before first char */}
//           </p>
//         </div>
//       </div>
//     </>
//   )
// }
import { useEffect, useState, useRef } from "react"

interface IntroScreenProps {
  onComplete: () => void
}

const TAGLINE = "Trade  ★   Travel ★   Trust"
const HOLD_AFTER_TYPED_MS = 400

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [typed, setTyped] = useState("")
  const [exiting, setExiting] = useState(false)
  const [showBrand, setShowBrand] = useState(false)
  const [showTagline, setShowTagline] = useState(false)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setExiting(true)
    setTimeout(onComplete, 500)
  }

  // Handle brand animation end
  const handleBrandAnimationEnd = () => {
    setShowTagline(true)

    // Start typing immediately after brand is fully visible
    let charIndex = 0
    const typingInterval = setInterval(() => {
      charIndex++
      setTyped(TAGLINE.slice(0, charIndex))

      if (charIndex >= TAGLINE.length) {
        clearInterval(typingInterval)
        setTimeout(finish, HOLD_AFTER_TYPED_MS)
      }
    }, 68)
  }

  useEffect(() => {
    // Save original overflow values
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow

    // Hide scrollbar on mount
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    // Start showing brand name
    const t1 = setTimeout(() => setShowBrand(true), 60)

    return () => {
      clearTimeout(t1)
      // Restore scrollbar on unmount
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.overflow = originalBodyOverflow
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes ui-fadeInSlow {
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
        .intro-skip:hover { 
          color: #c9a96e; 
          border-color: #6b5a3e; 
        }
      `}</style>

      {/* Full-screen overlay */}
      <div
        className="h-screen [&::-webkit-scrollbar]:hidden"
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
          transition: exiting ? "opacity 0.5s ease" : "none",
          pointerEvents: exiting ? "none" : "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "28px",
          }}
        >
          {/* Brand Name - Slow fade in */}
          <h1
            className="text-base tracking-[6px] md:text-5xl md:tracking-[12px]"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              // fontSize: "clamp(30px, 6vw, 58px)",
              fontWeight: 400,
              color: "#c9a96e",
              textTransform: "uppercase",
              margin: 0,
              textAlign: "center",
              lineHeight: 1,
              opacity: showBrand ? 1 : 0,
              transition: "opacity 2.4s ease-in-out",
              animation: showBrand
                ? "ui-fadeInSlow 2.4s ease-in-out forwards"
                : "none",
            }}
            onAnimationEnd={handleBrandAnimationEnd}
          >
            Udayam&nbsp;International
          </h1>

          {/* Tagline */}
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
              opacity: showTagline ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
              borderRight:
                typed.length < TAGLINE.length ? "1.5px solid #c9a96e" : "none",
              paddingRight: typed.length < TAGLINE.length ? "3px" : "0",
            }}
          >
            {typed || "\u00A0"}
          </p>
        </div>
      </div>
    </>
  )
}
