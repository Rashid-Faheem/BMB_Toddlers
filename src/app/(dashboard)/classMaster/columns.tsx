"use client"

import { ColumnDef } from "@tanstack/react-table"
// import ActionButtons from "./ActionButton"
import ActionButtons from "@/components/action-buttons/ActionButtons"
import clsx from "clsx"
import { Switch } from "@/components/ui/switch"


export const columns = (onDeleteSuccess: () => void): ColumnDef<ClassMaster>[] => [
  {
    accessorKey: "class_name",
    header: "class Name",
  },
  {
  accessorKey: "active",
  header: "Active",
  cell: ({ row }) => {
    const classmaster = row.original

    return (
      <Switch
        checked={classmaster.active}
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
  
  {
       id: "actions", // no accessorKey since it's not bound to data
       header: "Actions",
       cell: ({row}) => <ActionButtons
         id={row.original.id}
         editLabel="Edit Class"
         editUrl="/classMaster/add-ClassMaster?id="
         deleteConfirmMessage="Are you sure you want to delete?"
         onDeleteSuccess={() => onDeleteSuccess()} 
        model=  "classMaster"
     />
   
     }

]
