//@ts-nocheck
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import { _axios } from "./axios"

export interface AuthUser {
  _id: string
  fullName: string
  email?: string
  mobile?: string
  countryCode?: string
  profileImage?: string
  loginType: "MOBILE" | "GOOGLE"
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refetch: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSession = useCallback(async () => {
    try {
      const res = await _axios.get("/user-auth/session")
      if (res.data?.status && res.data?.data) {
        setUser(res.data.data as AuthUser)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await _axios.post("/user-auth/logout")
    } catch {
      // ignore
    }
    setUser(null)
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, refetch: fetchSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
