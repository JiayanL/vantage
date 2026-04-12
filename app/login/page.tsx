"use client"

import { useActionState } from "react"
import { Telescope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/app/login/actions"

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Telescope className="size-5" />
          </div>
          <CardTitle>Vantage</CardTitle>
          <CardDescription>Enter the password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                autoFocus
                required
              />
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
