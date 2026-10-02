import type { ReactNode } from "react"

export interface TableColumn<T> {
  header: string
  render: (item: T) => ReactNode
  className?: string
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  isLoading: boolean
  error: string | null
  emptyMessage?: string
  onRetry?: () => void
  onRowClick?: (item: T) => void
  minRows?: number
}