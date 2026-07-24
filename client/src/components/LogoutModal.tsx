import React, { useEffect } from "react"
import { LogOut, AlertTriangle, X } from "lucide-react"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoggingOut?: boolean
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut = false,
}) => {
  // Lock background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const f = "'Inter', sans-serif"

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(15, 26, 66, 0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoggingOut) onClose()
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#ffffff",
          borderRadius: 24,
          boxShadow: "0 24px 60px rgba(15, 26, 66, 0.3)",
          overflow: "hidden",
          padding: "24px 28px",
          textAlign: "center",
          position: "relative",
          animation: "scaleUp 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoggingOut}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#F3F4F6",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            color: "#6B7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        {/* Warning Icon Badge */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#FEF2F2",
            color: "#DC2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            border: "2px solid #FECACA",
          }}
        >
          <LogOut size={30} />
        </div>

        {/* Modal Title */}
        <h3
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#0F1B47",
            margin: "0 0 8px",
          }}
        >
          Confirm Account Logout
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: f,
            fontSize: ".85rem",
            color: "#5a5a7a",
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          Are you sure you want to log out of your account? You will need to sign in again to access your travel bookings and profile.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            style={{
              flex: 1,
              padding: "11px 18px",
              background: "#F3F4F6",
              color: "#374151",
              border: "1px solid #E5E7EB",
              borderRadius: 999,
              fontSize: ".85rem",
              fontWeight: 700,
              fontFamily: f,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            style={{
              flex: 1,
              padding: "11px 18px",
              background: "linear-gradient(135deg, #DC2626, #B91C1C)",
              color: "#ffffff",
              border: "none",
              borderRadius: 999,
              fontSize: ".85rem",
              fontWeight: 700,
              fontFamily: f,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(220,38,38,0.35)",
            }}
          >
            {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default LogoutModal
