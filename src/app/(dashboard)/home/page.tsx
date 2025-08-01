// app/dashboard/page.tsx
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const savedSession = localStorage.getItem("session")
    if (!savedSession) router.push("/login")
    else setSession(JSON.parse(savedSession))
  }, [])

  if (!session) return <div>Loading...</div>

  return (
    // <div>
    //   <h1>Welcome, {session.name}</h1>
    //   <p>Your role: {session.role}</p>
    //   {session.role === "ADMIN" && (
    //     <a href="/admin" className="text-blue-600 underline">Go to Admin Page</a>
    //   )}
    // </div>
    <>
    </>
  )
}
