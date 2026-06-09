// import { createFileRoute } from '@tanstack/react-router'
// import { useMutation } from '@tanstack/react-query'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from '@/components/ui/input-otp'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
// import { useState } from 'react'
// import { _axios } from '@/lib/axios'

// type Step = 'phone' | 'otp' | 'success'

// export const Route = createFileRoute('/login')({
//   component: LoginPage,
// })

// function LoginPage() {
//   const [step, setStep] = useState<Step>('phone')
//   const [phoneNumber, setPhoneNumber] = useState('')
//   const [otp, setOtp] = useState('')
//   const [otpId, setOtpId] = useState('')
//   const [error, setError] = useState('')

//   const clearError = () => setError('')

//   // ── Send OTP ───────────────────────────────────────────────────
//   const sendOtp = useMutation({
//     mutationFn: (mobile: string) =>
//       _axios
//         .post('/admin/auth/send-otp', { mobile, smsId: '-' })
//         .then((r) => r.data),
//     onSuccess: (data) => {
//       if (data.status) {
//         setOtpId(data.otpId)
//         setStep('otp')
//         clearError()
//       } else setError(data.message || 'Failed to send OTP')
//     },
//     onError: (err: any) =>
//       setError(err.response?.data?.message || 'Something went wrong'),
//   })

//   // ── Login (called after OTP verified) ─────────────────────────
//   const login = useMutation({
//     mutationFn: (phone: string) =>
//       _axios
//         .post('/admin/auth/login', { phoneNumber: phone, fcmToken: '' })
//         .then((r) => r.data),
//     onSuccess: (data) => {
//       if (data.success) {
//         setStep('success')
//         setTimeout(() => {
//           window.location.href = '/'
//         }, 1500)
//       }
//     },
//     onError: (err: any) =>
//       setError(err.response?.data?.message || 'Login failed'),
//   })

//   // ── Verify OTP ────────────────────────────────────────────────
//   const verifyOtp = useMutation({
//     mutationFn: () =>
//       _axios
//         .post('/admin/auth/verify-otp', {
//           otpId,
//           otpNo: otp,
//           mobileNumber: phoneNumber,
//         })
//         .then((r) => r.data),
//     onSuccess: (data) => {
//       if (data.status) login.mutate(phoneNumber)
//       else setError(data.message || 'Invalid OTP')
//     },
//     onError: (err: any) =>
//       setError(err.response?.data?.message || 'Verification failed'),
//   })

//   const handleSendOtp = () => {
//     if (phoneNumber.length !== 10)
//       return setError('Enter a valid 10-digit number')
//     clearError()
//     sendOtp.mutate(phoneNumber)
//   }

//   const handleVerifyOtp = () => {
//     if (otp.length < 6) return setError('Enter the complete 6-digit OTP')
//     clearError()
//     verifyOtp.mutate()
//   }

//   const isLoading = sendOtp.isPending || verifyOtp.isPending || login.isPending

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center px-4"
//       style={{
//         background:
//           'linear-gradient(135deg, #0a1f22 0%, #0d2b2e 55%, #0f2e2e 100%)',
//       }}
//     >
//       {/* Ambient glow */}
//       <div
//         className="fixed inset-0 pointer-events-none"
//         style={{
//           background:
//             'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,162,39,0.07) 0%, transparent 70%)',
//         }}
//       />

//       <div className="relative w-full max-w-sm z-10">
//         {/* ── Brand mark ── */}
//         <div className="flex flex-col items-center mb-8">
//           <img
//             src="/KPLogo.png"
//             className="w-18 h-16 mb-4"
//             alt="Elite KP Jewellery"
//             role="presentation"
//             aria-hidden
//             loading="lazy"
//             decoding="async"
//           />
//           <h1 className="text-white text-xl font-bold tracking-wide">
//             ELITE KP JEWELLERY
//           </h1>
//           <p className="text-xs mt-1" style={{ color: 'rgba(201,162,39,0.9)' }}>
//             ஆபரணம் Creators
//           </p>
//         </div>

//         {/* ── Card ── */}
//         <div
//           className="rounded-2xl overflow-hidden"
//           style={{
//             background: 'rgba(255,255,255,0.04)',
//             border: '1px solid rgba(255,255,255,0.09)',
//             backdropFilter: 'blur(16px)',
//           }}
//         >
//           {/* Card top accent line */}
//           <div
//             className="h-px w-full"
//             style={{
//               background:
//                 'linear-gradient(90deg, transparent, #c9a227, transparent)',
//             }}
//           />

//           <div className="p-8">
//             {/* ── Error alert ── */}
//             {error && (
//               <Alert
//                 variant="destructive"
//                 className="mb-5 border-red-500/30 bg-red-500/10 text-red-300"
//               >
//                 <AlertCircle className="h-4 w-4 text-red-400" />
//                 <AlertDescription className="text-red-300 text-sm">
//                   {error}
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* ══════════════ STEP: PHONE ══════════════ */}
//             {step === 'phone' && (
//               <div className="space-y-6">
//                 <div>
//                   <h2 className="text-white text-lg font-semibold">
//                     Welcome back
//                   </h2>
//                   <p
//                     className="text-sm mt-1"
//                     style={{ color: 'rgba(255,255,255,0.45)' }}
//                   >
//                     Enter your mobile number to continue
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     className="text-xs font-medium uppercase tracking-widest"
//                     style={{ color: 'rgba(201,162,39,0.8)' }}
//                   >
//                     Mobile Number
//                   </label>
//                   <div
//                     className="flex items-center rounded-xl overflow-hidden"
//                     style={{
//                       border: '1px solid rgba(255,255,255,0.12)',
//                       background: 'rgba(255,255,255,0.05)',
//                     }}
//                   >
//                     <span
//                       className="px-4 py-3 text-sm font-semibold border-r select-none"
//                       style={{
//                         color: 'rgba(255,255,255,0.6)',
//                         borderColor: 'rgba(255,255,255,0.12)',
//                         background: 'rgba(255,255,255,0.04)',
//                       }}
//                     >
//                       +91
//                     </span>
//                     <Input
//                       type="tel"
//                       inputMode="numeric"
//                       placeholder="10-digit number"
//                       value={phoneNumber}
//                       onChange={(e) => {
//                         setPhoneNumber(e.target.value.replace(/\D/g, ''))
//                         clearError()
//                       }}
//                       onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
//                       maxLength={10}
//                       className="border-0 bg-transparent text-white placeholder:text-white/25 text-sm h-12 focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
//                     />
//                     <span
//                       className="pr-4 text-xs tabular-nums"
//                       style={{
//                         color:
//                           phoneNumber.length === 10
//                             ? '#c9a227'
//                             : 'rgba(255,255,255,0.25)',
//                       }}
//                     >
//                       {phoneNumber.length}/10
//                     </span>
//                   </div>
//                 </div>

//                 <Button
//                   onClick={handleSendOtp}
//                   disabled={isLoading || phoneNumber.length !== 10}
//                   className="w-full h-11 font-semibold text-sm rounded-xl"
//                   style={{
//                     background: '#c9a227',
//                     color: '#1a1a1a',
//                     border: 'none',
//                   }}
//                 >
//                   {sendOtp.isPending ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
//                       OTP…
//                     </>
//                   ) : (
//                     'Send OTP →'
//                   )}
//                 </Button>
//               </div>
//             )}

//             {/* ══════════════ STEP: OTP ══════════════ */}
//             {step === 'otp' && (
//               <div className="space-y-6">
//                 {/* Back */}
//                 <button
//                   onClick={() => {
//                     setStep('phone')
//                     setOtp('')
//                     clearError()
//                   }}
//                   className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
//                   style={{ color: 'rgba(201,162,39,0.8)' }}
//                 >
//                   <ArrowLeft size={13} /> Change number
//                 </button>

//                 <div>
//                   <h2 className="text-white text-lg font-semibold">
//                     Verify OTP
//                   </h2>
//                   <p
//                     className="text-sm mt-1"
//                     style={{ color: 'rgba(255,255,255,0.45)' }}
//                   >
//                     Code sent to{' '}
//                     <span
//                       className="font-semibold"
//                       style={{ color: 'rgba(255,255,255,0.75)' }}
//                     >
//                       +91 {phoneNumber}
//                     </span>
//                   </p>
//                 </div>

//                 {/* OTP boxes */}
//                 <div className="flex justify-center">
//                   <InputOTP
//                     maxLength={6}
//                     value={otp}
//                     onChange={(val) => {
//                       setOtp(val)
//                       clearError()
//                     }}
//                     onComplete={handleVerifyOtp}
//                   >
//                     <InputOTPGroup className="gap-2">
//                       {[0, 1, 2, 3, 4, 5].map((i) => (
//                         <InputOTPSlot
//                           key={i}
//                           index={i}
//                           className="w-11 h-12 rounded-xl text-base font-bold text-white"
//                           style={{
//                             background: 'rgba(255,255,255,0.06)',
//                             border: '1px solid rgba(255,255,255,0.15)',
//                           }}
//                         />
//                       ))}
//                     </InputOTPGroup>
//                   </InputOTP>
//                 </div>

//                 <Button
//                   onClick={handleVerifyOtp}
//                   disabled={isLoading || otp.length < 6}
//                   className="w-full h-11 font-semibold text-sm rounded-xl"
//                   style={{
//                     background: '#c9a227',
//                     color: '#1a1a1a',
//                     border: 'none',
//                   }}
//                 >
//                   {verifyOtp.isPending || login.isPending ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
//                       Verifying…
//                     </>
//                   ) : (
//                     'Verify & Login →'
//                   )}
//                 </Button>

//                 <div className="text-center">
//                   <button
//                     onClick={() => {
//                       setOtp('')
//                       clearError()
//                       sendOtp.mutate(phoneNumber)
//                     }}
//                     disabled={sendOtp.isPending}
//                     className="text-xs underline underline-offset-4 transition-opacity hover:opacity-70"
//                     style={{ color: 'rgba(255,255,255,0.35)' }}
//                   >
//                     {sendOtp.isPending
//                       ? 'Resending…'
//                       : "Didn't receive? Resend OTP"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ══════════════ STEP: SUCCESS ══════════════ */}
//             {step === 'success' && (
//               <div className="text-center py-6 space-y-4">
//                 <div
//                   className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
//                   style={{
//                     background: 'rgba(34,197,94,0.15)',
//                     border: '1px solid rgba(34,197,94,0.3)',
//                   }}
//                 >
//                   <CheckCircle2 className="h-8 w-8 text-green-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-white text-lg font-semibold">
//                     Login Successful
//                   </h3>
//                   <p
//                     className="text-sm mt-1"
//                     style={{ color: 'rgba(255,255,255,0.45)' }}
//                   >
//                     Redirecting to dashboard…
//                   </p>
//                 </div>
//                 <div className="flex justify-center">
//                   <Loader2
//                     className="h-4 w-4 animate-spin"
//                     style={{ color: '#c9a227' }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <p
//           className="text-center text-xs mt-6"
//           style={{ color: 'rgba(255,255,255,0.2)' }}
//         >
//           © {new Date().getFullYear()} Elite KP Jewellery. All rights reserved.
//         </p>
//       </div>
//     </div>
//   )
// }
import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { _axios } from '@/lib/axios'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const clearError = () => setError('')

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) =>
      _axios.post('/admin/auth/login', { email, password }).then((r) => r.data),

    onSuccess: (data) => {
      if (data.ok) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Invalid email or password')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    loginMutation.mutate({ email, password })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'linear-gradient(135deg, #0a1625 0%, #0f253f 50%, #1e3a5f 100%)',
      }}
    >
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(34, 211, 238, 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md z-10">
        {/* Brand / Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/KPLogo.png"
            className="w-24 h-24 mb-5 object-contain"
            alt="Udyam Tourist"
          />
        </div>

        {/* Login Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(103, 232, 249, 0.15)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="p-10">
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 border-red-500/30 bg-red-500/10"
              >
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <div className="text-center py-10">
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(52, 211, 153, 0.15)' }}
                >
                  <CheckCircle2 className="h-11 w-11 text-emerald-400" />
                </div>
                <h3 className="text-white text-2xl font-semibold">
                  Welcome Back!
                </h3>
                <p className="text-emerald-400 mt-2">
                  Redirecting to dashboard...
                </p>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="text-center mb-2">
                  <h2 className="text-white text-2xl font-semibold">
                    Admin Portal
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Sign in to manage tours &amp; bookings
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="text-xs font-semibold tracking-widest text-cyan-400 block mb-2">
                      EMAIL ADDRESS
                    </label>
                    <Input
                      type="email"
                      placeholder="admin@udyamtourist.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        clearError()
                      }}
                      className="bg-slate-900/70 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:border-cyan-400"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="text-xs font-semibold tracking-widest text-cyan-400 block mb-2">
                      PASSWORD
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        clearError()
                      }}
                      className="bg-slate-900/70 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:border-cyan-400"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 text-base font-semibold rounded-2xl transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
                    color: '#0f172a',
                  }}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-8 text-slate-500">
          © {new Date().getFullYear()} Udyam Tourist • All Rights Reserved
        </p>
      </div>
    </div>
  )
}
