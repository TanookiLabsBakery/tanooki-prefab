"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

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
          <div className="text-muted-foreground">{row.original?.email}</div>
        </>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const raw = row.getValue<string | null>("createdAt")
      return raw ? format(new Date(raw), "MMM d, yyyy") : "—"
    },
  },
]
