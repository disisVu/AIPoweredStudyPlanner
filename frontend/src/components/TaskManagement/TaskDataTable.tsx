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
import { useTaskListQueryContext } from '@/context/Task'
import { LoadingIndicator } from '@/components/Indicator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { setTaskModalAction } from '@/store/reducers/taskSlice'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  setModalOpen: (isModalOpen: boolean) => void
}

export function TaskDataTable<TData, TValue>({ columns, data, setModalOpen }: DataTableProps<TData, TValue>) {
  const taskListQueryContext = useTaskListQueryContext()
  const [sorting, setSorting] = useState<SortingState>([])
  const dataIsAvailable: boolean = !taskListQueryContext.isLoading && !taskListQueryContext.isError
  const dispatch = useDispatch<AppDispatch>()

  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  })

  function openCreateTaskModal() {
    dispatch(setTaskModalAction('add'))
    setModalOpen(true)
  }

  return (
    <div className='flex h-full max-h-full flex-col rounded-md border-t'>
      {/* Header Section */}
      <div className='h-12 rounded-t-lg border-b border-gray-200 px-4 py-2'>
        <div className='grid h-8 grid-cols-12 items-center gap-4'>
          <span className='col-span-10 text-left text-sm font-medium' style={{ color: colors.text_secondary }}>
            Results: {dataIsAvailable ? data.length : '0'}
          </span>
          <div className='col-span-2 flex items-center justify-end'>
            <div
              className='flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 hover:border-gray-200 hover:bg-gray-200'
              onClick={openCreateTaskModal}
            >
              <FontAwesomeIcon icon={faPlus} />
            </div>
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
          {taskListQueryContext.isLoading ? (
            // Display loading rows while data is being fetched
            [...Array(1)].map((_, index) => (
              <TableRow key={index}>
                {columns.map((_column, colIndex) => (
                  <TableCell key={colIndex} className='animate-pulse bg-gray-200 py-[10px]'>
                    <LoadingIndicator />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            // Display actual rows when data is available
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
            // Display "No results" message when no data is available
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
