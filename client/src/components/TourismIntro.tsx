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
        }}
      />
    </div>
  )
}

export default TourismIntro
