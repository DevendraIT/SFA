export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const formatCurrency = (amount, currency = "INR") => {
  const num = Number(amount) || 0;
  if (currency === "INR") {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(num);
};

export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ") : "";

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const exportToCSV = (data, columns, filename = "export") => {
  if (!data?.length) return;
  const headers = columns.map((c) => c.label || c.key);
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = c.render ? c.render(row) : row[c.key];
      const str = String(val ?? "").replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToPDF = (title, data, columns) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const headers = columns.map((c) => c.label || c.key);
  const rows = data.map(
    (row) =>
      `<tr>${columns
        .map((c) => {
          const val = c.render ? c.render(row) : row[c.key];
          return `<td style="border:1px solid #ddd;padding:8px">${val ?? ""}</td>`;
        })
        .join("")}</tr>`
  );
  printWindow.document.write(`
    <!DOCTYPE html><html><head><title>${title}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px}h1{font-size:20px;margin-bottom:16px}
    table{width:100%;border-collapse:collapse;font-size:12px}th{background:#1e1b4b;color:#fff;padding:10px;text-align:left}
    td{border:1px solid #ddd;padding:8px}</style></head>
    <body><h1>${title}</h1><p>Generated: ${formatDateTime(new Date())}</p>
    <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.join("")}</tbody></table></body></html>`);
  printWindow.document.close();
  printWindow.print();
};

export const importFromCSV = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split("\n").filter((l) => l.trim());
        if (lines.length < 2) {
          resolve([]);
          return;
        }
        const headers = lines[0].split(",").map((h) =>
          h.replace(/"/g, "").trim()
        );
        const rows = lines.slice(1).map((line) => {
          const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = (values[i] || "").replace(/"/g, "").trim();
          });
          return obj;
        });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });

export const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export const sortItems = (items, sortKey, sortDir) => {
  if (!sortKey) return items;
  return [...items].sort((a, b) => {
    const aVal = a[sortKey] ?? "";
    const bVal = b[sortKey] ?? "";
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    const cmp = String(aVal).localeCompare(String(bVal));
    return sortDir === "asc" ? cmp : -cmp;
  });
};

export const filterItems = (items, search, searchKeys, filters = {}) => {
  let result = items;
  if (search?.trim()) {
    const q = search.toLowerCase();
    result = result.filter((item) =>
      searchKeys.some((key) =>
        String(item[key] ?? "").toLowerCase().includes(q)
      )
    );
  }
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "All" && value !== "") {
      result = result.filter((item) => String(item[key]) === String(value));
    }
  });
  return result;
};

export const getRoleDashboard = (role) => {
  const map = {
    SUPER_ADMIN: "/admin/dashboard",
    ADMIN: "/admin/dashboard",
    HEAD_SALES: "/headsales/dashboard",
    SALES_MANAGER: "/salesmanager/dashboard",
    SALES_PERSON: "/salesperson/dashboard",
  };
  return map[role] || "/login";
};

export const ROLE_LABELS = {
  SUPER_ADMIN: "Admin",
  ADMIN: "Admin",
  HEAD_SALES: "Head of Sales",
  SALES_MANAGER: "Sales Manager",
  SALES_PERSON: "Sales Person",
};
