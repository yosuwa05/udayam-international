// import { useEffect, useRef, useState } from "react"
// import logo from "../assets/UVHolidays.JPG.jpeg"

// type Phase = "start" | "animate" | "hold" | "exit" | "done"

// const TourismIntro = ({ onComplete }: { onComplete: () => void }) => {
//   const [phase, setPhase] = useState<Phase>("start")
//   const onCompleteRef = useRef(onComplete)

//   useEffect(() => {
//     const raf1 = requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         setPhase("animate")

//         const t1 = setTimeout(() => setPhase("hold"), 1200) // zoom settles → tagline appears
//         const t2 = setTimeout(() => setPhase("exit"), 6500) // hold for ~5s
//         const t3 = setTimeout(() => {
//           setPhase("done")
//           onCompleteRef.current()
//         }, 7200) // 0.7s fade out → done at 7.2s

//         return () => {
//           clearTimeout(t1)
//           clearTimeout(t2)
//           clearTimeout(t3)
//         }
//       })
//     })

//     return () => cancelAnimationFrame(raf1)
//   }, [])

//   if (phase === "done") return null

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 9999,
//         background: "#fff",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 24,
//         opacity: phase === "exit" ? 0 : 1,
//         transition: phase === "exit" ? "opacity 0.7s ease" : "none",
//         pointerEvents: "none",
//       }}
//     >
//       <img
//         src={logo}
//         alt="UV Holidays"
//         style={{
//           width: 280,
//           height: 280,
//           objectFit: "contain",
//           borderRadius: 16,
//           transform: phase === "start" ? "scale(4.5)" : "scale(1)",
//           opacity: phase === "start" ? 0 : 1,
//           filter: phase === "start" ? "blur(10px)" : "blur(0px)",
//           transition:
//             phase === "animate"
//               ? "transform 1.1s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, filter 0.6s ease"
//               : "none",
//         }}
//       />

//       <p
//         style={{
//           margin: 0,
//           fontSize: 20,
//           fontWeight: 600,
//           letterSpacing: "0.22em",
//           textTransform: "uppercase",
//           color: "#999",
//           opacity: phase === "hold" ? 1 : 0,
//           transform: phase === "hold" ? "translateY(0)" : "translateY(6px)",
//           transition: "opacity 0.5s ease, transform 0.5s ease",
//         }}
//       >
//         Explore the world with UV Holidays
//       </p>

//       {/* progress bar */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           height: 2,
//           background: "#222",
//           borderRadius: "0 2px 2px 0",
//           width:
//             phase === "start"
//               ? "0%"
//               : phase === "animate"
//                 ? "20%"
//                 : phase === "hold"
//                   ? "90%"
//                   : "100%",
//           transition:
//             phase === "animate"
//               ? "width 1.1s cubic-bezier(0.16,1,0.3,1)"
//               : phase === "hold"
//                 ? "width 5.3s linear"
//                 : phase === "exit"
//                   ? "width 0.7s ease"
//                   : "none",
//         }}
//       />
//     </div>
//   )
// }

// export default TourismIntro

// import { useEffect, useRef, useState } from "react"
// import logo from "../assets/UVHolidays1.JPG.jpeg"

// const TourismIntro = ({ onComplete }: { onComplete: () => void }) => {
//   const [visible, setVisible] = useState(false)
//   const onCompleteRef = useRef(onComplete)

//   useEffect(() => {
//     // Fade in
//     const fadeInTimer = setTimeout(() => {
//       setVisible(true)
//     }, 100)

//     // Fade out and complete
//     const fadeOutTimer = setTimeout(() => {
//       setVisible(false)

//       // Wait for fade out animation to finish
//       setTimeout(() => {
//         onCompleteRef.current()
//       }, 800)
//     }, 3200) // Total display time (adjust as needed)

//     return () => {
//       clearTimeout(fadeInTimer)
//       clearTimeout(fadeOutTimer)
//     }
//   }, [])

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 9999,
//         background: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         opacity: visible ? 1 : 0,
//         transition: "opacity 0.8s ease-in-out",
//         pointerEvents: "none",
//       }}
//     >
//       <img
//         src={logo}
//         alt="UV Holidays"
//         style={{
//           width: 920,
//           height: 820,
//           objectFit: "contain",
//           borderRadius: 16,
//           opacity: visible ? 1 : 0,
//           transform: visible ? "scale(1)" : "scale(1.08)",
//           transition: "opacity 0.8s ease-in-out, transform 0.8s ease-in-out",
//         }}
//       />
//     </div>
//   )
// }

// export default TourismIntro
import { useEffect, useRef, useState } from "react"
import logo from "../assets/UVHolidays1.JPG.jpeg"

const TourismIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setVisible(true)
    }, 100)

    const fadeOutTimer = setTimeout(() => {
      setVisible(false)

      setTimeout(() => {
        onCompleteRef.current()
      }, 800)
    }, 3200)

    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(fadeOutTimer)
    }
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
        pointerEvents: "none",
      }}
    >
      <img
        src={logo}
        alt="UV Holidays"
        style={{
          // Responsive sizing
          width: "100%",
          maxWidth: "920px",
          height: "auto",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: "16px",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(1.08)",
          transition: "opacity 0.8s ease-in-out, transform 0.8s ease-in-out",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)", // optional nice touch
        }}
      />
    </div>
  )
}

export default TourismIntro
