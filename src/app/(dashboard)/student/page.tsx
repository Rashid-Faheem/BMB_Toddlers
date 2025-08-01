'use client'

import { columns as getColumns } from "./columns"
import { DataTable } from "../../../components/ui/data-table"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import LoadingForm from '@/app/loading'
import { fetchStudents as fetchStudentsAction } from '@/app/actions/fetch'

export default function DemoPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchStudentsAction() // ← server action
      setStudents(data)
    } catch (err) {
      console.error("Error fetching students:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  if (loading) return <LoadingForm />

  return (
    <div className="container mx-auto">
      <div className="bg-card text-card-foreground m-4 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Student List</h1>

        <Link
          className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors"
          href="student/add-Student"
        >
          Add New
        </Link>

        <DataTable
          columns={getColumns(fetchStudents)} // <-- inject the callback
          data={students}
          loading={loading}
        />
      </div>
    </div>
  )
}
