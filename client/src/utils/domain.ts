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

  return (
    TOURISM_DOMAINS.includes(cleanHost) ||
    cleanHost === "uvholidays.travel" ||
    cleanHost === "www.uvholidays.travel" ||
    cleanHost.endsWith(".uvholidays.travel")
  )
}
