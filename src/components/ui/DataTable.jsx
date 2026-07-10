import {
  Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Download, Upload, Trash2, Eye, Pencil, FileText,
} from "lucide-react";
import Button from "./Button.jsx";
import { useTableData } from "../../hooks/useTableData.js";

export default function DataTable({
  data = [],
  columns = [],
  searchKeys = [],
  filters = [],
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onImport,
  exportFilename = "export",
  exportTitle = "Export",
  pageSize = 10,
  actions = true,
  theme = "indigo",
}) {
  const table = useTableData(data, { searchKeys, pageSize });
  const themeColors = {
    indigo: "focus:ring-indigo-500 text-indigo-600",
    blue: "focus:ring-blue-500 text-blue-600",
    purple: "focus:ring-purple-500 text-purple-600",
    orange: "focus:ring-orange-500 text-orange-600",
  };
  const tc = themeColors[theme] || themeColors.indigo;

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;
    try {
      const rows = await table.handleImportCSV(file, (r) => r);
      onImport(rows);
    } catch {
      /* handled by parent */
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={table.search}
            onChange={(e) => { table.setSearch(e.target.value); table.setPage(1); }}
            placeholder="Search..."
            className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 ${tc}`}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <select
              key={f.key}
              value={table.filters[f.key] || "All"}
              onChange={(e) => table.setFilter(f.key, e.target.value)}
              className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm"
            >
              <option value="All">{f.label}: All</option>
              {f.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ))}
          <Button variant="secondary" size="sm" icon={Download} onClick={() => table.handleExportCSV(columns, exportFilename)}>
            CSV
          </Button>
          <Button variant="secondary" size="sm" icon={FileText} onClick={() => table.handleExportPDF(exportTitle, columns)}>
            PDF
          </Button>
          {onImport && (
            <label className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
              <Upload className="w-4 h-4" />
              Import
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
          )}
          {table.selected.length > 0 && onBulkDelete && (
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => onBulkDelete(table.selected)}>
              Delete ({table.selected.length})
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50">
              {actions && (
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={table.selected.length === table.paginated.length && table.paginated.length > 0}
                    onChange={table.toggleSelectAll}
                    className="rounded"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-900 select-none"
                  onClick={() => col.sortable !== false && table.toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {table.sortKey === col.key && (
                      table.sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </span>
                </th>
              ))}
              {actions && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {table.paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 2 : 0)} className="p-12 text-center text-slate-400">
                  No records found
                </td>
              </tr>
            ) : (
              table.paginated.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {actions && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={table.selected.includes(row.id)}
                        onChange={() => table.toggleSelect(row.id)}
                        className="rounded"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-slate-700 dark:text-slate-300">
                      {col.render ? col.render(row) : row[col.key] ?? "-"}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {onView && (
                          <button onClick={() => onView(row)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(row)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(row)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Showing {table.paginated.length} of {table.totalItems} records
        </span>
        <div className="flex items-center gap-2">
          <select
            value={table.pageSize}
            onChange={(e) => { table.setPageSize(Number(e.target.value)); table.setPage(1); }}
            className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm"
          >
            {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}/page</option>)}
          </select>
          <button
            onClick={() => table.setPage((p) => Math.max(1, p - 1))}
            disabled={table.page <= 1}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-medium">{table.page} / {table.totalPages}</span>
          <button
            onClick={() => table.setPage((p) => Math.min(table.totalPages, p + 1))}
            disabled={table.page >= table.totalPages}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
