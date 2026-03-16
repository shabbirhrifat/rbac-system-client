type Column<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Array<Column<T>>;
  rows: T[];
  getRowKey?: (row: T, index: number) => string;
};

export function DataTable<T>({ columns, rows, getRowKey }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/90 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur sm:rounded-[28px]">
      <div className="sm:hidden">
        {rows.length ? (
          <div className="divide-y divide-neutral-100">
            {rows.map((row, index) => (
              <div key={getRowKey?.(row, index) ?? index.toString()} className="grid gap-3 px-4 py-4">
                {columns.map((column) => (
                  <div key={column.header} className="grid gap-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                      {column.header}
                    </p>
                    <div className={column.className}>{column.render(row)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="hidden overflow-x-auto sm:block">
        <table className="min-w-full divide-y divide-neutral-200 text-sm">
          <thead>
            <tr className="bg-neutral-50/80 text-left text-xs uppercase tracking-[0.2em] text-neutral-400">
              {columns.map((column) => (
                <th key={column.header} className={`px-4 py-3.5 font-medium sm:px-5 sm:py-4 ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row, index) => (
              <tr key={getRowKey?.(row, index) ?? index.toString()} className="align-top text-neutral-700 transition-colors hover:bg-brand-50/40">
                {columns.map((column) => (
                  <td key={column.header} className={`px-4 py-3.5 sm:px-5 sm:py-4 ${column.className ?? ""}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
