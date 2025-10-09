"use client"

import { ColumnDef } from "@tanstack/react-table"

export type UserColumns = {
  id: string
  fullName: string
  email?: string | null
  createdAt?: string | null
}

export const columns: ColumnDef<UserColumns | null | undefined>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      return (
        <>
          <div className="text-sm">{row.getValue("fullName")}</div>
          <div className="text-gray-500">{row.original?.email}</div>
        </>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
]
