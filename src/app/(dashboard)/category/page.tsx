'use client'

import { columns as getColumns } from "./columns"
import React, { useCallback, useEffect, useState } from 'react'
import LoadingForm from '@/app/loading'
import { CategoryMaster } from '@/generated/prisma'
import Link from 'next/link'
import { DataTable } from '@/components/ui/data-table'
import { fetchCategoryMaster } from "@/app/actions/fetch"

const CategoryPage = () => {
  const [CategoryMaster, setCategoryMaster] = useState<CategoryMaster[]>([])
  const [loading, setLoading] = useState(true)

  
     const fetchCategory = useCallback(async () => {
        setLoading(true)
        try {
          const data = await fetchCategoryMaster()
          setCategoryMaster(data)
        } catch (err) {
          console.error("Error loading sessions:", err)
        } finally {
          setLoading(false)
        }
      }, [])
    
      useEffect(() => {
        fetchCategory()
      }, [fetchCategory])
    
      
  
  if (loading) return (
    <LoadingForm />
  )

  
   return (
    <div className="container mx-auto">
      <div className="bg-card text-card-foreground m-4 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Category List</h1>
        <Link 
          className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors"
          href="category/add-Category">
          Add New
        </Link>

        <DataTable
          columns={getColumns(fetchCategory)} // <-- inject the callback
          data={CategoryMaster}
          loading={loading}
        />
      </div>
      
    </div>
  )
}

export default CategoryPage
