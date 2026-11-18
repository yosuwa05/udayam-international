export const TOURISM_DOMAINS = [
  "uvholidays.travel",
  "www.uvholidays.travel",
  "https://www.uvholidays.travel",
  "https://uvholidays.travel",
]

/**
 * Checks whether the current hostname or provided host string matches the tourism domain (uvholidays.travel).
 *
 * @param hostname Optional custom hostname or URL to check. Defaults to `window.location.hostname`.
 * @returns boolean indicating if the target is a tourism domain.
 */
export function isTourismDomain(hostname?: string): boolean {
  if (typeof window === "undefined" && !hostname) {
    return false
  }

  // Allow local dev/preview testing via query parameter ?domain=tourism or ?domain=main
  if (typeof window !== "undefined" && !hostname) {
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const domainParam = searchParams.get("domain")?.toLowerCase()
      if (domainParam === "tourism" || domainParam === "uvholidays") {
        sessionStorage.setItem("agy_domain", "tourism")
        return true
      }
      if (
        domainParam === "parent" ||
        domainParam === "udayam" ||
        domainParam === "main"
      ) {
        sessionStorage.setItem("agy_domain", "main")
        return false
      }
      const saved = sessionStorage.getItem("agy_domain")
      if (saved === "tourism") return true
      if (saved === "main") return false
    } catch {
      // fallback
    }
  }

  const raw = hostname ?? window.location.hostname
  if (!raw) return false

  // Direct check against configured domain list
  if (TOURISM_DOMAINS.includes(raw)) {
    return true
  }

  // Normalize: remove protocol, path, port and lowercase
  const cleanHost = raw
    .replace(/^https?:\/\//i, "")
    .split("/")[0]
    .split(":")[0]
    .trim()
    .toLowerCase()

  if (
    TOURISM_DOMAINS.includes(cleanHost) ||
    cleanHost === "uvholidays.travel" ||
    cleanHost === "www.uvholidays.travel" ||
    cleanHost.endsWith(".uvholidays.travel") ||
    cleanHost.includes("uvholidays")
  ) {
    return true
  }

  // Default to tourism mode during local development unless explicitly switched to main domain
  if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
    return true
  }

  return false
}
