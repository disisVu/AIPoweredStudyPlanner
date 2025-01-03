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
import { TaskTablePagination } from '@/components/TaskManagement'
import { colors } from '@/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip } from '@radix-ui/react-tooltip'
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CreateTaskModal } from '@/components/Modal'

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
    <div className='flex h-full max-h-full flex-col rounded-md border-t'>
      {/* Header Section */}
      <div className='h-12 rounded-t-lg border-b border-gray-200 px-4 py-2'>
        <div className='grid h-8 grid-cols-12 items-center gap-4'>
          <span className='col-span-10 text-left text-sm font-medium' style={{ color: colors.text_secondary }}>
            Results: {data.length}
          </span>
          <div className='col-span-2 flex items-center justify-end'>
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <div
                      className='flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 hover:border-gray-200 hover:bg-gray-200'
                      style={{ color: colors.text_primary }}
                    >
                      <FontAwesomeIcon icon={faPlus} className='pb-[2px]' />
                    </div>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side='bottom' align='center'>
                  Create task
                </TooltipContent>
                <DialogContent className='sm:max-w-[540px]'>
                  <CreateTaskModal />
                </DialogContent>
              </Tooltip>
            </Dialog>
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
      <div className='flex min-h-16 w-full items-center justify-end border-t px-2 py-3'>
        <TaskTablePagination table={table} />
      </div>
    </div>
  )
}
