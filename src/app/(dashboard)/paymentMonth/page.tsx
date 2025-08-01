'use client'

import { columns as getColumns } from './columns'
import LoadingForm from '@/app/loading'
import { DataTable } from '../../../components/ui/data-table'
import { useEffect, useState, useCallback } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createPaymentMonths, fetchPaymentMonths, getOpenSessions, getSessionById } from '@/app/actions/fetch'

function getMonthsBetweenDates(start: Date, end: Date) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const result = []
  startDate.setDate(1)

  while (startDate <= endDate) {
    result.push({
      label: startDate.toLocaleString('default', { month: 'short' }).toUpperCase() + '-' + startDate.getFullYear(),
      value: startDate.toISOString().split('T')[0],
    })
    startDate.setMonth(startDate.getMonth() + 1)
  }

  return result
}

export default function DemoPage() {
  const [paymentMonth, setPaymentMonth] = useState<paymentMonth[]>([])
  const [session, setSession] = useState<sessionMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [generating, setGenerating] = useState(false)


  const fetchMonthsClient = useCallback(async () => {
  setLoading(true)
  const data = await fetchPaymentMonths()
  setPaymentMonth(data)
  setLoading(false)
}, [])

  const handleGenerate = async () => {
    if (!selectedSessionId) {
      alert('Please select a session.')
      return
    }

    setGenerating(true)
    try {
      const session = await getSessionById(selectedSessionId)
      if (!session) throw new Error('Session not found.')

      const months = getMonthsBetweenDates(session.startDate, session.endDate)

      const result = await createPaymentMonths(selectedSessionId, months)
      if (result.success) {
        alert('Months generated successfully.')
        await fetchPaymentMonths()
      } else {
        alert(result.error || 'Failed to generate.')
      }
    } catch (err) {
      console.error(err)
      alert('Error generating months.')
    } finally {
      setGenerating(false)
    }
  }
  
useEffect(() => {
  fetchMonthsClient()
}, [fetchMonthsClient])

  return (
    <div className="container mx-auto">
      <div className="bg-card text-card-foreground m-4 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Payment Months</h1>

        <Dialog
          onOpenChange={async (open) => {
            if (open) {
              const data = await getOpenSessions()
              setSession(data)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors">
              Generate Months
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate</DialogTitle>
              <DialogDescription>Select a session to generate months</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <label className="block mb-1 font-medium">Select Session</label>
                <select
                  className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                >
                  <option value="">Select Session</option>
                  {session.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.sessionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors"
                size="lg"
                disabled={generating}
                onClick={handleGenerate}
              >
                {generating ? 'Creating...' : 'Generate'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="destructive" size="lg">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {loading ? (
          <LoadingForm />
        ) : (
          <DataTable columns={getColumns(fetchPaymentMonths)} data={paymentMonth} loading={loading} />
        )}
      </div>
    </div>
  )
}
