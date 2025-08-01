"use client"

import { ColumnDef } from "@tanstack/react-table"
// import ActionButtons from "./ActionButton"
import ActionButtons from "@/components/action-buttons/ActionButtons"
import { Switch } from "@/components/ui/switch"
import clsx from "clsx"


export const columns = (onDeleteSuccess: () => void): ColumnDef<Student>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "fname",
    header: "Father Name",
  },
  {
    accessorKey: "contactno",
    header: "Contact No",
  },

  {
    accessorFn: (row) => row.session?.sessionName ?? "—",
    id: "sessionName",
    header: "Session",
    cell: ({ getValue }) => <div>{String(getValue())}</div>,
  },
  {
  accessorFn: (row) => row.class_?.class_name ?? "—",
  id: "className",
  header: "Class",
  cell: ({ getValue }) => <div>{String(getValue())}</div>,
  },
  {
  accessorKey: "active",
  header: "Active",
  cell: ({ row }) => {
    const student = row.original

    return (
      <Switch
        checked={student.active}
        // disabled // prevent toggle unless you add logic
        // className="cursor-not-allowed"
        className={clsx(
          "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300",
          "cursor-not-allowed"
        )}
      />
    )
  }
},
  // {
  //   accessorFn: (row) => row.class.name, // 👈 yeh function ab allowed hai client-side pe
  //   id: "className",
  //   header: "Class",
  //   cell: ({ getValue }) => <div>{String(getValue())}</div>,
  // },
  {
    id: "actions", // no accessorKey since it's not bound to data
    header: "Actions",
    cell: ({row}) => <ActionButtons
    id={row.original.id}
    // resource="users"
    editUrl="/student/add-Student?id="
    editLabel="Edit Student"
    model="student"
    deleteConfirmMessage="Are you sure you want to delete?"
    onDeleteSuccess={() => onDeleteSuccess()}
  />

  }
]
