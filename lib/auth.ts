export const PASSWORD_HASH =
  "f54d5ed91e4499fdecd4a6f4ed394adf0eacfad18dc203a7680b97b142abd696"

export const AUTH_COOKIE = "vantage-auth"

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const buffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
