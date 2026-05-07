import React, { useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";

const getCellValue = (row, column) => {
  if (column.accessor) return column.accessor(row);
  const value = row[column.key];
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
};

const DataTable = ({
  columns,
  rows,
  emptyMessage = "No data available.",
  searchable = false,
  sortable = false,
  paginated = false,
  pageSize = 5,
  searchPlaceholder = "Search table..."
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: columns[0]?.key || "", direction: "asc" });
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!searchable || !normalizedSearch) return rows;

    return rows.filter((row) =>
      columns.some((column) => String(getCellValue(row, column)).toLowerCase().includes(normalizedSearch))
    );
  }, [columns, rows, searchable, searchTerm]);

  const sortedRows = useMemo(() => {
    if (!sortable || !sortConfig.key) return filteredRows;
    const column = columns.find((item) => item.key === sortConfig.key);
    if (!column) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aValue = String(getCellValue(a, column)).toLowerCase();
      const bValue = String(getCellValue(b, column)).toLowerCase();
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }, [columns, filteredRows, sortable, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const visibleRows = paginated ? sortedRows.slice((page - 1) * pageSize, page * pageSize) : sortedRows;

  const handleSort = (column) => {
    if (!sortable || column.sortable === false) return;
    setSortConfig((current) => ({
      key: column.key,
      direction: current.key === column.key && current.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-xl border border-slate-900/10 bg-white/75 shadow-2xl shadow-slate-400/20 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-black/20"
    >
      {searchable && (
        <div className="flex flex-col gap-3 border-b border-slate-900/10 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <label className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700 dark:text-cyan-100" />
            <input
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-md border border-slate-300 bg-white/80 py-2 pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-teal-700 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:border-cyan-200"
              placeholder={searchPlaceholder}
            />
          </label>
          <div className="text-sm text-slate-600 dark:text-white/60">
            {sortedRows.length} result{sortedRows.length === 1 ? "" : "s"}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-900/10 bg-slate-950/5 text-slate-800 dark:border-white/15 dark:bg-white/10 dark:text-cyan-50">
            <tr>
              {columns.map((column) => {
                const isActiveSort = sortConfig.key === column.key;
                const SortIcon = sortConfig.direction === "asc" ? ArrowDownAZ : ArrowUpAZ;
                return (
                  <th key={column.key} className="px-5 py-4 font-semibold">
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className={`inline-flex items-center gap-2 ${sortable && column.sortable !== false ? "cursor-pointer hover:text-teal-800 dark:hover:text-white" : "cursor-default"}`}
                    >
                      {column.label}
                      {sortable && column.sortable !== false && isActiveSort && <SortIcon className="h-4 w-4" />}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/10 dark:divide-white/10">
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-600 dark:text-white/70">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleRows.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || row._id || rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: rowIndex * 0.03 }}
                  className="text-slate-700 transition hover:bg-slate-950/5 dark:text-white/80 dark:hover:bg-white/10"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 align-top">
                      {column.render ? column.render(row) : getCellValue(row, column)}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {paginated && sortedRows.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-900/10 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-white/70">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 transition hover:border-teal-700 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:border-cyan-200 dark:hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 transition hover:border-teal-700 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:border-cyan-200 dark:hover:text-white"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DataTable;
