import styles from "./Table.module.css"
import type { TableProps } from "./types"

const DEFAULT_MIN_ROWS = 8

export function Table<T>({
  data,
  columns,
  isLoading,
  error,
  emptyMessage = "No hay datos para mostrar.",
  onRetry,
  onRowClick,
  minRows = DEFAULT_MIN_ROWS,
}: TableProps<T>) {
  const emptyRows = Math.max(0, minRows - data.length)

  return (
    <div className={styles.table}>
      <div
        className={styles.header}
        style={{
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        }}
      >
        {columns.map((column) => (
          <span key={column.header} className={column.className}>
            {column.header}
          </span>
        ))}
      </div>

      <div className={styles.body}>
        {isLoading && <SkeletonRows columnsCount={columns.length} minRows={minRows} />}

        {!isLoading && error && (
          <div className={styles.stateRow}>
            <p className={styles.errorText}>{error}</p>

            {onRetry && (
              <button
                type="button"
                className={styles.retryButton}
                onClick={onRetry}
              >
                Reintentar
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && data.length === 0 && (
          <div className={styles.stateRow}>
            <p className={styles.emptyText}>{emptyMessage}</p>
          </div>
        )}

        {!isLoading &&
          !error &&
          data.map((item, index) => {
            const rowContent = (
              <>
                {columns.map((column) => (
                  <span key={column.header} className={column.className}>
                    {column.render(item)}
                  </span>
                ))}
              </>
            )

            if (onRowClick) {
              return (
                <button
                  key={index}
                  type="button"
                  className={styles.dataRow}
                  onClick={() => onRowClick(item)}
                  style={{
                    gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                  }}
                >
                  {rowContent}
                </button>
              )
            }

            return (
              <div
                key={index}
                className={styles.dataRow}
                style={{
                  gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                }}
              >
                {rowContent}
              </div>
            )
          })}

        {!isLoading &&
          !error &&
          data.length > 0 &&
          Array.from({ length: emptyRows }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className={styles.emptyRow}
              style={{
                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
              }}
              aria-hidden="true"
            />
          ))}
      </div>
    </div>
  )
}

interface SkeletonRowsProps {
  columnsCount: number
  minRows: number
}

function SkeletonRows({ columnsCount, minRows }: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: minRows }).map((_, rowIndex) => (
        <div
          key={`skeleton-${rowIndex}`}
          className={styles.emptyRow}
          style={{
            gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
          }}
        >
          {Array.from({ length: columnsCount }).map((_, columnIndex) => (
            <span key={columnIndex} className={styles.skeletonBlock}>
              <span className={styles.skeletonText} />
            </span>
          ))}
        </div>
      ))}
    </>
  )
}