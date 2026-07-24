import React, { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/useAuth"
import { _axios } from "@/lib/axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Lock,
  Edit3,
  Save,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react"

export const Profile: React.FC = () => {
  const { user, refetch } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setEmail(user.email || "")
      setMobile(user.mobile || "")
      setProfileImage(user.profileImage || "")
      setPreviewUrl(user.profileImage || null)
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8ECFA] text-[#1B2B6B]">
          <User size={32} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#0F1B47]">
          Sign In Required
        </h2>
        <p className="mt-2 max-w-md text-sm text-[#5a5a7a]">
          Please sign in to view and manage your profile details, personal
          preferences, and travel account settings.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-full bg-[#1B2B6B] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
        >
          Return to Home
        </button>
      </div>
    )
  }

  const isEmailEditable = user.loginType !== "GOOGLE" || !user.isEmailVerified
  const isMobileEditable = user.loginType !== "MOBILE" || !user.isMobileVerified

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB")
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      toast.info(
        `Selected "${file.name}". Click "Save Profile Details" to upload.`
      )
    }
  }

  const handleClearSelectedFile = () => {
    setSelectedFile(null)
    setPreviewUrl(profileImage || null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (selectedFile) {
        const formData = new FormData()
        formData.append("fullName", fullName.trim())
        if (isEmailEditable && email.trim())
          formData.append("email", email.trim())
        if (isMobileEditable && mobile.trim())
          formData.append("mobile", mobile.trim())
        formData.append("profileImageFile", selectedFile)

        const res = await _axios.patch("/user-auth/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        if (res.data?.status) {
          toast.success("Profile photo & details updated successfully! 🎉")
          setSelectedFile(null)
          if (res.data?.data?.profileImage) {
            setProfileImage(res.data.data.profileImage)
            setPreviewUrl(res.data.data.profileImage)
          }
          if (refetch) await refetch()
        } else {
          toast.error(res.data?.error || "Failed to update profile")
        }
      } else {
        const payload: any = {
          fullName: fullName.trim(),
          profileImage: profileImage.trim(),
        }

        if (isEmailEditable && email.trim()) payload.email = email.trim()
        if (isMobileEditable && mobile.trim()) payload.mobile = mobile.trim()

        const res = await _axios.patch("/user-auth/profile", payload)

        if (res.data?.status) {
          toast.success("Profile updated successfully! 🎉")
          if (refetch) await refetch()
        } else {
          toast.error(res.data?.error || "Failed to update profile")
        }
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to update profile details"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const displayAvatar = previewUrl || profileImage

  return (
    <div className="min-h-screen bg-[#F4F6FB] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Banner Header */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl md:p-10"
          style={{
            background: "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 100%)",
          }}
        >
          <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-start">
            {/* Avatar with Camera Upload Button */}
            <div
              className="group relative cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 bg-gradient-to-br from-amber-400 to-amber-600 text-3xl font-bold text-white shadow-lg md:h-28 md:w-28">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={fullName}
                    className="h-full w-full object-cover"
                    onError={() => setPreviewUrl(null)}
                  />
                ) : (
                  (fullName[0] || "U").toUpperCase()
                )}

                {/* Hover overlay button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={22} className="text-white" />
                  <span className="mt-1 text-[10px] font-bold text-white">
                    Change
                  </span>
                </div>
              </div>
              <span className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-md">
                <Camera size={14} />
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-amber-300 uppercase backdrop-blur-sm">
                <ShieldCheck size={14} /> Verified Member Account
              </div>
              <h1 className="mt-2 font-serif text-2xl font-bold text-white md:text-3xl">
                {user.fullName || "Travel Enthusiast"}
              </h1>
              <p className="mt-1 text-xs text-white/80 md:text-sm">
                {user.email ||
                  (user.mobile ? `+91 ${user.mobile}` : "Account Details")}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
                  Login Method:{" "}
                  <strong>
                    {user.loginType === "GOOGLE"
                      ? "Google OAuth"
                      : "Mobile OTP"}
                  </strong>
                </span>
                <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Status: ACTIVE
                </span>
              </div>
            </div>

            {/* Quick Link to My Bookings */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-[#0F1B47] shadow-lg transition-transform hover:scale-105 hover:bg-amber-400"
              >
                <ShoppingBag size={16} /> My Bookings <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl md:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8ECFA] text-[#1B2B6B]">
              <Edit3 size={20} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0F1B47]">
                Personal Account Settings
              </h2>
              <p className="text-xs text-gray-500">
                Update your avatar photo, full name, and contact information
                below.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="mt-6 flex flex-col gap-6"
          >
            {/* Profile Photo Upload Section */}
            <div className="rounded-2xl border border-gray-200 bg-[#FAF8F4] p-5">
              <label className="mb-3 block text-xs font-bold tracking-wider text-[#0F1B47] uppercase">
                Profile Avatar Image
              </label>

              <div className="flex flex-col items-center gap-5 sm:flex-row">
                {/* Image Preview Box */}
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-sm">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={28} className="text-gray-300" />
                  )}
                </div>

                {/* Upload Buttons */}
                <div className="flex w-full flex-1 flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-xl bg-[#1B2B6B] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0F1B47]"
                    >
                      <Upload size={14} /> Upload New Photo
                    </button>

                    {selectedFile && (
                      <button
                        type="button"
                        onClick={handleClearSelectedFile}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100"
                      >
                        <X size={14} /> Clear Selection
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500">
                    {selectedFile
                      ? `Selected File: ${selectedFile.name}`
                      : "Supports JPG, PNG, WEBP (Max size: 10MB). Image is stored securely."}
                  </p>
                </div>
              </div>

              {/* Or paste Image URL */}
              <div className="mt-4 border-t border-gray-200 pt-3">
                <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                  Or enter image URL:
                </label>
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => {
                    setProfileImage(e.target.value)
                    setPreviewUrl(e.target.value || null)
                    setSelectedFile(null)
                  }}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 outline-none focus:border-[#1B2B6B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Full Name *
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm font-medium text-gray-800 transition-all outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Email Address
                  </label>
                  {!isEmailEditable && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                      <Lock size={12} /> Verified via Google
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    disabled={!isEmailEditable}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm font-medium transition-all outline-none ${
                      !isEmailEditable
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-500"
                        : "border-gray-200 bg-white text-gray-800 focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10"
                    }`}
                  />
                </div>
                {!isEmailEditable && (
                  <p className="mt-1 text-[11px] text-gray-400">
                    Primary Google email address cannot be modified.
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Mobile Number
                  </label>
                  {!isMobileEditable && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <Lock size={12} /> Verified via Mobile OTP
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </span>
                  <input
                    type="tel"
                    disabled={!isMobileEditable}
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                    className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm font-medium transition-all outline-none ${
                      !isMobileEditable
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-500"
                        : "border-gray-200 bg-white text-gray-800 focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10"
                    }`}
                  />
                </div>
                {!isMobileEditable && (
                  <p className="mt-1 text-[11px] text-gray-400">
                    OTP verified mobile number is locked for security.
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0F1B47] to-[#1B2B6B] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
              >
                <Save size={16} />
                {isSaving ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
