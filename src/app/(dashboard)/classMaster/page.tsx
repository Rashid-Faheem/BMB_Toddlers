'use client'

import { columns as getColumns } from "./columns"
import { DataTable } from "../../../components/ui/data-table"
import { useEffect, useState, useCallback } from "react"
import LoadingForm from '@/app/loading'
import Link from "next/link"
import { fetchClassMasters } from "@/app/actions/fetch"

export default function DemoPage() {
  const [ClassMaster, setClassMaster] = useState<ClassMaster[]>([])
  const [loading, setLoading] = useState(true)


  
   const fetchClassMaster = useCallback(async () => {
      setLoading(true)
      try {
        const data = await fetchClassMasters()
        setClassMaster(data)
      } catch (err) {
        console.error("Error loading sessions:", err)
      } finally {
        setLoading(false)
      }
    }, [])
  
    useEffect(() => {
      fetchClassMaster()
    }, [fetchClassMaster])
  

  // const fetchClassMaster = useCallback(async () => {
  //   setLoading(true)
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ClassMaster/`)
  //     if (!res.ok) throw new Error("Failed to fetch ClassMaster")
  //     const data = await res.json()
  //     setClassMaster(data)
  //   } catch (err) {
  //     console.error("Error fetching ClassMaster:", err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [])

  // useEffect(() => {
  //   fetchClassMaster()
  // }, [fetchClassMaster])

if (loading) return (
  <LoadingForm />
)
  return (
    <div className="container mx-auto">
      <div className="bg-card text-card-foreground m-4 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Class List</h1>
        <Link 
          className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors"
          href="classMaster/add-ClassMaster">
          Add New
        </Link>

        <DataTable
          columns={getColumns(fetchClassMaster)} // <-- inject the callback
          data={ClassMaster}
          loading={loading}
        />
      </div>
      
    </div>
  )
}
