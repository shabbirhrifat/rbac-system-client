type Column<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Array<Column<T>>;
  rows: T[];
};

export function DataTable<T>({ columns, rows }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 text-sm">
          <thead>
            <tr className="bg-neutral-50/80 text-left text-xs uppercase tracking-[0.2em] text-neutral-400">
              {columns.map((column) => (
                <th key={column.header} className={`px-5 py-4 font-medium ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row, index) => (
              <tr key={index} className="align-top text-neutral-700 transition-colors hover:bg-brand-50/40">
                {columns.map((column) => (
                  <td key={column.header} className={`px-5 py-4 ${column.className ?? ""}`}>
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
