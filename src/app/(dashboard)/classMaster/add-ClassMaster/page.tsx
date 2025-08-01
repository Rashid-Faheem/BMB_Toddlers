'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import LoadingForm from '@/app/loading'
import { Button } from '@/components/ui/button'
import { getClassById, upsertClass } from '@/app/actions/fetch'
// import { getClassById } from './actions/getClassById'
// import { saveClass } from './actions/saveClass'

const ClassMasterSchema = z.object({
  class_name: z.string().min(1, 'Class Name is required'),
  active: z.boolean(),
})

type ClassMasterFormData = z.output<typeof ClassMasterSchema>

export default function ClassMasterFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassMasterFormData>({
    resolver: zodResolver(ClassMasterSchema),
    defaultValues: { active: true },
  })

  useEffect(() => {
    if (!id) return
    const loadData = async () => {
      setLoading(true)
      const data = await getClassById(id)
      if (!data) {
        alert('Class not found.')
        router.push('/classMaster')
      } else {
        reset(data)
      }
      setLoading(false)
    }
    loadData()
  }, [id, reset, router])

  const onSubmit = async (formData: ClassMasterFormData) => {
    setLoading(true)
    const result = await upsertClass(formData, id ?? undefined)
    setLoading(false)

    if (result.success) {
      alert(result.message)
      router.push('/classMaster')
    } else {
      alert(result.message)
    }
  }

  if (loading) return <LoadingForm />

  return (
    <div className="bg-card text-card-foreground w-120 m-4 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit Class' : 'Add New Class'}
      </h1>
      <p className="text-muted-foreground mb-6">
        {id ? 'Update the Class details below.' : 'Fill in the details below to add a new Class.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Class Name</label>
          <input
            type="text"
            {...register('class_name')}
            className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
          />
          {errors.class_name && (
            <p className="text-red-500 text-sm">{errors.class_name.message}</p>
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
            onClick={() => router.push('/classMaster')}
            className="flex items-center justify-center gap-2 bg-red-700 text-white px-4 py-2 rounded transition hover:bg-red-500"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
