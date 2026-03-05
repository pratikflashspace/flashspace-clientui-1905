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
    <div className="overflow-x-auto rounded-2xl border border-[#2D3F33]/10 dark:border-white/10 bg-white dark:bg-[#0f0f0f] shadow-sm">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead className="bg-[#2D3F33]/5 dark:bg-white/5">
          <tr className="border-b border-[#2D3F33]/10 dark:border-white/10 text-[#164e4e]/80 dark:text-gray-300">
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
              className="border-b border-[#2D3F33]/10 dark:border-white/10 text-[#164e4e] dark:text-gray-200 hover:bg-[#2D3F33]/5 dark:hover:bg-white/5"
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
        <p className="p-6 text-center text-sm text-[#164e4e]/70 dark:text-gray-400">
          No records found.
        </p>
      )}
    </div>
  );
}
