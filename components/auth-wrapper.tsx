"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const accessToken = localStorage.getItem("access_token")

        if (!accessToken) {
          // No token found, redirect to login
          router.push("/login")
          return
        }

        // Optional: You can add token validation here
        // For example, check if token is expired
        // const tokenData = JSON.parse(atob(accessToken.split('.')[1]))
        // if (tokenData.exp * 1000 < Date.now()) {
        //   localStorage.removeItem("access_token")
        //   router.push("/login")
        //   return
        // }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        // If there's an error reading from localStorage, redirect to login
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
