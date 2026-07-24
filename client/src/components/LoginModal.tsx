import React, { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"
import { _axios } from "@/lib/axios"
import { useAuth } from "@/lib/useAuth"

/* ─── Google GIS type shim ─────────────────────────────────────────────────── */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: any) => void
          renderButton: (el: HTMLElement, opts: any) => void
          prompt: () => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""
console.log(GOOGLE_CLIENT_ID, "sss")
type Step = "method" | "otp"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { refetch } = useAuth()

  // ── form state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("method")
  const [mobile, setMobile] = useState("")
  const [otpId, setOtpId] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [name, setName] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)

  // ── loading / error states ────────────────────────────────────────────────
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // ── OTP resend timer ──────────────────────────────────────────────────────
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── OTP input refs ────────────────────────────────────────────────────────
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // ── Google button ref ─────────────────────────────────────────────────────
  const googleBtnRef = useRef<HTMLDivElement>(null)

  // ── Reset on close ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("method")
        setMobile("")
        setOtp(["", "", "", "", "", ""])
        setOtpId("")
        setName("")
        setIsNewUser(false)
        setTimer(0)
        if (timerRef.current) clearInterval(timerRef.current)
      }, 300)
    }
  }, [isOpen])

  // ── Start countdown ───────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setTimer(60)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  // ── Google GIS setup ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !GOOGLE_CLIENT_ID) return

    const initGoogle = () => {
      if (!window.google) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })
      if (googleBtnRef.current) {
        // GIS renderButton requires a pixel number — "100%" is rejected
        const btnWidth = googleBtnRef.current.offsetWidth || 376
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: btnWidth,
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
        })
      }
    }

    if (window.google) {
      initGoogle()
    } else {
      const script = document.getElementById(
        "google-gsi"
      ) as HTMLScriptElement | null
      if (!script) {
        const s = document.createElement("script")
        s.id = "google-gsi"
        s.src = "https://accounts.google.com/gsi/client"
        s.onload = initGoogle
        document.head.appendChild(s)
      } else {
        script.onload = initGoogle
      }
    }
  }, [isOpen, step])

  // ── Google credential callback ────────────────────────────────────────────
  const handleGoogleCredential = async (response: { credential: string }) => {
    console.log(response, "response from google")
    setGoogleLoading(true)
    try {
      const res = await _axios.post("/user-auth/google-login", {
        idToken: response.credential,
      })
      if (res.data?.status) {
        toast.success(`Welcome, ${res.data.data?.fullName || "there"}! 🎉`)
        await refetch()
        onClose()
      } else {
        toast.error(res.data?.message || "Google login failed")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Google login failed")
    } finally {
      setGoogleLoading(false)
    }
  }

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const digits = mobile.replace(/\D/g, "")
    if (digits.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }
    setSendingOtp(true)
    try {
      const res = await _axios.post("/user-auth/send-otp", {
        mobile: digits,
      })
      if (res.data?.status) {
        setOtpId(res.data.otpId)
        setStep("otp")
        startTimer()
        toast.success("OTP sent to your mobile!")
      } else {
        toast.error(res.data?.message || "Failed to send OTP")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP")
    } finally {
      setSendingOtp(false)
    }
  }

  // ── OTP input handler ─────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(""))
      otpRefs.current[5]?.focus()
    }
  }

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const otpNo = otp.join("")
    if (otpNo.length < 4) {
      toast.error("Please enter the complete OTP")
      return
    }
    setVerifyingOtp(true)
    try {
      const payload: any = {
        otpId,
        otpNo,
        mobile: mobile.replace(/\D/g, ""),
        countryCode: "+91",
      }
      if (isNewUser && name.trim()) payload.fullName = name.trim()

      const res = await _axios.post("/user-auth/verify-otp", payload)
      if (res.data?.status) {
        toast.success(
          `Welcome${res.data.data?.fullName ? `, ${res.data.data.fullName}` : ""}! 🎉`
        )
        await refetch()
        onClose()
      } else {
        toast.error(res.data?.message || "Invalid OTP")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed")
    } finally {
      setVerifyingOtp(false)
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (timer > 0) return
    setSendingOtp(true)
    try {
      const res = await _axios.post("/user-auth/send-otp", {
        mobile: mobile.replace(/\D/g, ""),
      })
      if (res.data?.status) {
        setOtpId(res.data.otpId)
        setOtp(["", "", "", "", "", ""])
        startTimer()
        toast.success("New OTP sent!")
      } else {
        toast.error(res.data?.message || "Failed to resend OTP")
      }
    } catch {
      toast.error("Failed to resend OTP")
    } finally {
      setSendingOtp(false)
    }
  }

  // ── Backdrop click ────────────────────────────────────────────────────────
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(13, 27, 62, 0.55)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          animation: "fadeIn 0.2s ease",
        }}
      >
        {/* ── Modal Card ── */}
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            background: "#fff",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow:
              "0 32px 80px rgba(13,27,62,0.22), 0 8px 24px rgba(13,27,62,0.12)",
            animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            position: "relative",
          }}
        >
          {/* ── Header banner ── */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 60%, #2563EB 100%)",
              padding: "32px 32px 28px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 34,
                height: 34,
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                lineHeight: 1,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
            >
              ×
            </button>

            {/* Icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "14px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                fontSize: 24,
              }}
            >
              ✈️
            </div>

            <h2
              style={{
                color: "#fff",
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                fontFamily: "'Libre Baskerville', serif",
                lineHeight: 1.2,
              }}
            >
              {step === "method" ? "Welcome Back" : "Verify Your Number"}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                margin: "6px 0 0",
                fontSize: "0.875rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {step === "method"
                ? "Sign in to access your bookings and wishlist"
                : `We've sent a 6-digit OTP to +91 ${mobile}`}
            </p>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "28px 32px 32px" }}>
            {/* ══ STEP: METHOD ══════════════════════════════════════════════════ */}
            {step === "method" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Google Sign-In */}
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 10px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Continue with
                  </p>
                  {googleLoading ? (
                    <div
                      style={{
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 999,
                        border: "1.5px solid #E5E7EB",
                      }}
                    >
                      <Spinner color="#1B2B6B" size={20} />
                    </div>
                  ) : GOOGLE_CLIENT_ID ? (
                    <div ref={googleBtnRef} style={{ width: "100%" }} />
                  ) : (
                    <button
                      onClick={() =>
                        toast.info(
                          "Google login requires VITE_GOOGLE_CLIENT_ID"
                        )
                      }
                      style={googleBtnStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#F3F4F6")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </button>
                  )}
                </div>

                {/* Divider */}
                {/* <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#9CA3AF",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    or continue with mobile
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
                </div>

                <div>
                  <label style={labelStyle}>Mobile Number</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 14px",
                        border: "1.5px solid #E5E7EB",
                        borderRadius: 12,
                        background: "#F9FAFB",
                        fontSize: "0.9rem",
                        fontFamily: "'Inter', sans-serif",
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      style={inputStyle}
                      maxLength={10}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={
                    sendingOtp || mobile.replace(/\D/g, "").length !== 10
                  }
                  style={{
                    ...primaryBtnStyle,
                    opacity:
                      sendingOtp || mobile.replace(/\D/g, "").length !== 10
                        ? 0.6
                        : 1,
                  }}
                >
                  {sendingOtp ? <Spinner color="#fff" size={18} /> : "Send OTP"}
                </button> */}

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.78rem",
                    color: "#9CA3AF",
                    fontFamily: "'Inter', sans-serif",
                    margin: 0,
                  }}
                >
                  By signing in, you agree to our{" "}
                  <span style={{ color: "#1B2B6B", cursor: "pointer" }}>
                    Terms
                  </span>
                  {" & "}
                  <span style={{ color: "#1B2B6B", cursor: "pointer" }}>
                    Privacy Policy
                  </span>
                </p>
              </div>
            )}

            {/* ══ STEP: OTP ═════════════════════════════════════════════════════ */}
            {step === "otp" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                {/* Back button */}
                <button
                  onClick={() => {
                    setStep("method")
                    setOtp(["", "", "", "", "", ""])
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#6B7280",
                    fontSize: "0.85rem",
                    fontFamily: "'Inter', sans-serif",
                    padding: 0,
                  }}
                >
                  ← Change number
                </button>

                {/* Name input (shown for better UX; optional) */}
                <div>
                  <label style={labelStyle}>Your Name (optional)</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setIsNewUser(true)
                    }}
                    style={inputStyle}
                  />
                </div>

                {/* OTP boxes */}
                <div>
                  <label style={labelStyle}>Enter OTP</label>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: "space-between",
                    }}
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        style={{
                          width: 46,
                          height: 52,
                          textAlign: "center",
                          fontSize: "1.4rem",
                          fontWeight: 700,
                          border: digit
                            ? "2px solid #1B2B6B"
                            : "1.5px solid #E5E7EB",
                          borderRadius: 12,
                          outline: "none",
                          background: digit ? "#EEF2FF" : "#F9FAFB",
                          color: "#0F1B47",
                          transition: "border-color 0.2s, background 0.2s",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Verify button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || otp.join("").length < 4}
                  style={{
                    ...primaryBtnStyle,
                    opacity: verifyingOtp || otp.join("").length < 4 ? 0.6 : 1,
                  }}
                >
                  {verifyingOtp ? (
                    <Spinner color="#fff" size={18} />
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                {/* Resend */}
                <div style={{ textAlign: "center" }}>
                  {timer > 0 ? (
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#6B7280",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Resend OTP in{" "}
                      <span style={{ color: "#1B2B6B", fontWeight: 600 }}>
                        {timer}s
                      </span>
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={sendingOtp}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#1B2B6B",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        fontFamily: "'Inter', sans-serif",
                        textDecoration: "underline",
                      }}
                    >
                      {sendingOtp ? "Sending…" : "Resend OTP"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95) }
                    to   { opacity: 1; transform: translateY(0) scale(1) }
                }
            `}</style>
    </>
  )
}

/* ─── Sub-components ───────────────────────────────────────────────────────── */

function Spinner({
  color = "#fff",
  size = 20,
}: {
  color?: string
  size?: number
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          strokeOpacity="0.25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </span>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

/* ─── Shared styles ────────────────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: 8,
  fontFamily: "'Inter', sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1.5px solid #E5E7EB",
  borderRadius: 12,
  fontSize: "0.95rem",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  background: "#F9FAFB",
  color: "#111827",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
}

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  background: "linear-gradient(135deg, #0F1B47, #1B2B6B)",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  fontSize: "0.97rem",
  fontWeight: 700,
  fontFamily: "'Inter', sans-serif",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  transition: "opacity 0.2s, transform 0.15s",
  boxShadow: "0 4px 16px rgba(27,43,107,0.3)",
}

const googleBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 16px",
  background: "#fff",
  color: "#374151",
  border: "1.5px solid #E5E7EB",
  borderRadius: 999,
  fontSize: "0.95rem",
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  transition: "background 0.2s",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
}
