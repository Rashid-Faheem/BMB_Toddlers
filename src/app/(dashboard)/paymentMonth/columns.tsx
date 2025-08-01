"use client"

import { Switch } from "@/components/ui/switch"
import { ColumnDef } from "@tanstack/react-table"
import clsx from "clsx"


export const columns = (onDeleteSuccess: () => void): ColumnDef<paymentMonth>[] => [
  {
    accessorKey: "month_name",
    header: "Month Name",
  },
  // {
  //   accessorKey: "date",
  //   header: "Date",
  // },
  {
    accessorKey: "session_id",
    header: "Session",
    cell: ({ row }) => {
      const session = row.original.session
      return (
        <div>
          {session ? (
            <span>
              {session.sessionName} (
              {session.startDate instanceof Date ? session.startDate.toLocaleDateString() : session.startDate} - 
              {session.endDate instanceof Date ? session.endDate.toLocaleDateString() : session.endDate}
              )
            </span>
          ) : (
            <span className="text-red-500">Session not found</span>
          )}
        </div>
      )
    },
  },
  // {
  //   accessorKey: "active",
  //   header: "Active",
  // },
  
  {
  accessorKey: "active",
  header: "Active",
  cell: ({ row }) => {
    const isActive = row.getValue("active") as boolean;

    return (
      <Switch
        checked={isActive}
        className={clsx(
                  "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300",
                  "cursor-not-allowed"
                )}
      />
    );
  }
},
  // {
  //   accessorFn: (row) => row.class.name, // 👈 yeh function ab allowed hai client-side pe
  //   id: "className",
  //   header: "Class",
  //   cell: ({ getValue }) => <div>{String(getValue())}</div>,
  // },
  // {
  //   id: "actions", // no accessorKey since it's not bound to data
  //   header: "Actions",
  //   cell: ({ row }) => <ActionButtons id={row.original.id} onDeleteSuccess={onDeleteSuccess} />,
  // },

]
