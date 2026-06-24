import { cn } from "@/lib/utils";

interface DataTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  className,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-outline-variant/60">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-wider text-muted",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-outline-variant/30 transition-colors hover:bg-surface-container-low/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-4 text-sm", column.className)}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
