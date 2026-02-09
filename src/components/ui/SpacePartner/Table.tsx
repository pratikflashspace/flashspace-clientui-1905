import React from "react";

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
};

export default function Table<T extends { id: string }>({ data, columns }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200 text-slate-600">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-5 py-4 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-slate-100 text-slate-700 hover:bg-slate-50"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-5 py-4">
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <p className="p-6 text-center text-sm text-slate-500">
          No records found.
        </p>
      )}
    </div>
  );
}
