import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TaskTablePagination } from '@/pages/TaskManagementNew/components'
import { colors } from '@/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function TaskDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  })

  return (
    <div className='flex h-full flex-col rounded-md border-t'>
      {/* Header Section */}
      <div className='h-16 rounded-t-lg border-b border-gray-200 px-4 py-3'>
        <div className='grid h-10 grid-cols-12 items-center gap-4'>
          <span className='col-span-10 text-left text-sm font-medium' style={{ color: colors.text_secondary }}>
            Results: {data.length}
          </span>
          <div
            className='col-span-2 flex h-full cursor-pointer items-center justify-center gap-4 rounded-md px-4 text-white hover:brightness-110'
            style={{ backgroundColor: colors.primary }}
          >
            <FontAwesomeIcon icon={faPlus} className='pb-[2px]' />
            <span className='text-sm font-medium text-white'>Create Task</span>
          </div>
        </div>
      </div>
      {/* Table Section */}
      <Table className='flex-1 overflow-hidden'>
        <TableHeader className='bg-gray-200'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.size
                    }}
                    className='py-[10px]'
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      minWidth: cell.column.columnDef.size,
                      maxWidth: cell.column.columnDef.size
                    }}
                    className='py-[10px]'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 py-[10px] text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination Section */}
      <div className='min-h-16 w-full border-t px-2 py-4'>
        <TaskTablePagination table={table} />
      </div>
    </div>
  )
}
