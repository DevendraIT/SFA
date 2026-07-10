import { useState, useMemo, useCallback } from "react";
import {
  filterItems,
  sortItems,
  paginate,
  exportToCSV,
  exportToPDF,
  importFromCSV,
} from "../utils/helpers.js";

export function useTableData(items, options = {}) {
  const {
    searchKeys = [],
    defaultSortKey = "createdAt",
    defaultSortDir = "desc",
    pageSize: defaultPageSize = 10,
  } = options;

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(
    () => filterItems(items, search, searchKeys, filters),
    [items, search, searchKeys, filters]
  );

  const sorted = useMemo(
    () => sortItems(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(
    () => paginate(sorted, page, pageSize),
    [sorted, page, pageSize]
  );

  const toggleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  const toggleSelect = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelected((prev) =>
      prev.length === paginated.length ? [] : paginated.map((i) => i.id)
    );
  }, [paginated]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const handleExportCSV = useCallback(
    (columns, filename) => {
      exportToCSV(sorted, columns, filename);
    },
    [sorted]
  );

  const handleExportPDF = useCallback(
    (title, columns) => {
      exportToPDF(title, sorted, columns);
    },
    [sorted]
  );

  const handleImportCSV = useCallback(async (file, mapper) => {
    const rows = await importFromCSV(file);
    return rows.map(mapper);
  }, []);

  return {
    search,
    setSearch,
    filters,
    setFilter,
    sortKey,
    sortDir,
    toggleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selected,
    setSelected,
    toggleSelect,
    toggleSelectAll,
    filtered,
    sorted,
    paginated,
    totalPages,
    totalItems: sorted.length,
    handleExportCSV,
    handleExportPDF,
    handleImportCSV,
  };
}

export default useTableData;
