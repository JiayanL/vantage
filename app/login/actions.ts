"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AUTH_COOKIE, PASSWORD_HASH, hashPassword } from "@/lib/auth"

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const password = formData.get("password")

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Password is required." }
  }

  const hash = await hashPassword(password)

  if (hash !== PASSWORD_HASH) {
    return { error: "Incorrect password." }
  }

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  redirect("/dashboard")
}
