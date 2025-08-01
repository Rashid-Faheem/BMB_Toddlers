'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import LoadingForm from '@/app/loading'
import { Button } from '@/components/ui/button'
import { getcategoryById, upsertcategoryMaster } from '@/app/actions/fetch'
// import { getClassById } from './actions/getClassById'
// import { saveClass } from './actions/saveClass'

const CategorySchema = z.object({
  category: z.string().min(1, 'Category is required'),
  active: z.boolean(),
})

type CategoryFormData = z.output<typeof CategorySchema>

export default function CategoryFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { active: true },
  })

  useEffect(() => {
    if (!id) return
    const loadData = async () => {
      setLoading(true)
      const data = await getcategoryById(id)
      if (!data) {
        alert('Category not found.')
        router.push('/category')
      } else {
        reset(data)
      }
      setLoading(false)
    }
    loadData()
  }, [id, reset, router])

  const onSubmit = async (formData: CategoryFormData) => {
    setLoading(true)
    const result = await upsertcategoryMaster(formData, id ?? undefined)
    setLoading(false)

    if (result.success) {
      alert(result.message)
      router.push('/category')
    } else {
      alert(result.message)
    }
  }

  if (loading) return <LoadingForm />

  return (
    <div className="bg-card text-card-foreground w-120 m-4 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit Category' : 'Add New Category'}
      </h1>
      <p className="text-muted-foreground mb-6">
        {id ? 'Update the Category details below.' : 'Fill in the details below to add a new Category.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            type="text"
            {...register('category')}
            className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Active</label>
          <input
            type="checkbox"
            {...register('active')}
            className="border p-2 rounded bg-secondary text-secondary-foreground"
          />
          {errors.active && (
            <p className="text-red-500 text-sm">{errors.active.message}</p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <Button
            type="submit"
            className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors"
            size="lg"
            disabled={loading}
          >
            {loading ? (id ? 'Updating...' : 'Submitting...') : id ? 'Update' : 'Submit'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={() => router.push('/category')}
            className="flex items-center justify-center gap-2 bg-red-700 text-white px-4 py-2 rounded transition hover:bg-red-500"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
