import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  MapPinned,
  Building2,
  Users,
  X,
  Save,
} from "lucide-react";

export default function Territories() {
  /* ===========================
      MOCK DATA
  =========================== */

  const [territories, setTerritories] = useState([
    {
      id: 1,
      name: "Central Zone",
      code: "TZ001",
      manager: "Rahul Sharma",
      branch: "Indore Branch",
      employees: 30,
      status: "Active",
      description: "Handles Central India Sales",
    },
    {
      id: 2,
      name: "North Zone",
      code: "TZ002",
      manager: "Amit Verma",
      branch: "Bhopal Branch",
      employees: 22,
      status: "Active",
      description: "North Region Operations",
    },
    {
      id: 3,
      name: "West Zone",
      code: "TZ003",
      manager: "Neha Jain",
      branch: "Ujjain Branch",
      employees: 15,
      status: "Inactive",
      description: "West Region Sales",
    },
  ]);

  /* ===========================
      SEARCH & FILTER
  =========================== */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ===========================
      MODALS
  =========================== */

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState(null);
  const [deleteTerritory, setDeleteTerritory] = useState(null);
  const [viewTerritory, setViewTerritory] = useState(null);

  /* ===========================
      FORM DATA
  =========================== */

  const emptyTerritory = {
    name: "",
    code: "",
    manager: "",
    branch: "",
    employees: "",
    status: "Active",
    description: "",
  };

  const [formData, setFormData] = useState(emptyTerritory);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sfa_org_territories") || "[]");
      if (Array.isArray(saved) && saved.length) {
        setTerritories(saved);
      }
    } catch {
      // ignore invalid storage data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sfa_org_territories", JSON.stringify(territories));
  }, [territories]);

  /* ===========================
      HANDLE INPUT
  =========================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================
      ADD
  =========================== */

  const handleAdd = () => {
    setEditingTerritory(null);
    setFormData({ ...emptyTerritory });
    setShowModal(true);
  };

  /* ===========================
      EDIT
  =========================== */

  const handleEdit = (territory) => {
    setEditingTerritory(territory);
    setFormData(territory);
    setShowModal(true);
  };

  /* ===========================
      SAVE
  =========================== */

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.manager) {
      alert("Please fill all required fields.");
      return;
    }

    setTerritories((prev) => {
      if (editingTerritory) {
        return prev.map((item) =>
          item.id === editingTerritory.id ? { ...formData, id: editingTerritory.id } : item
        );
      }
      return [...prev, { ...formData, id: Date.now() }];
    });

    setShowModal(false);
    setEditingTerritory(null);
    setFormData({ ...emptyTerritory });
  };

  /* ===========================
      DELETE
  =========================== */

  const confirmDelete = () => {
    setTerritories((prev) => prev.filter((item) => item.id !== deleteTerritory.id));
    setDeleteTerritory(null);
  };

  /* ===========================
      FILTER
  =========================== */

  const filteredTerritories = territories.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.manager.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      item.status === statusFilter;

    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
              {/* ===========================
            HEADER
      =========================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <h2 className="text-3xl font-bold text-slate-800">
            Territory Management
          </h2>

          <p className="text-gray-500 mt-2">
            Manage all sales territories across your organization.
          </p>

        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition"
        >

          <Plus size={20} />

          Add Territory

        </button>

      </div>

      {/* ===========================
            STATISTICS
      =========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Total Territories */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

            <MapPinned
              className="text-blue-600"
              size={28}
            />

          </div>

          <p className="text-gray-500 mt-4">
            Total Territories
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {territories.length}
          </h2>

        </div>

        {/* Employees */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

            <Users
              className="text-green-600"
              size={28}
            />

          </div>

          <p className="text-gray-500 mt-4">
            Employees
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {territories.reduce(
              (sum, territory) =>
                sum + Number(territory.employees),
              0
            )}

          </h2>

        </div>

        {/* Active */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">

            <Building2
              className="text-emerald-600"
              size={28}
            />

          </div>

          <p className="text-gray-500 mt-4">
            Active Territories
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {
              territories.filter(
                (item) => item.status === "Active"
              ).length
            }

          </h2>

        </div>

        {/* Inactive */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">

            <Building2
              className="text-red-600"
              size={28}
            />

          </div>

          <p className="text-gray-500 mt-4">
            Inactive Territories
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {
              territories.filter(
                (item) => item.status === "Inactive"
              ).length
            }

          </h2>

        </div>

      </div>

      {/* ===========================
            SEARCH & FILTER
      =========================== */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search Territory, Manager or Code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

      </div>

      {/* ===========================
            TERRITORY TABLE
      =========================== */}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left px-6 py-4">
                Territory
              </th>

              <th className="text-left">
                Code
              </th>

              <th className="text-left">
                Branch
              </th>

              <th className="text-left">
                Manager
              </th>

              <th className="text-left">
                Employees
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>          {filteredTerritories.length > 0 ? (
            filteredTerritories.map((territory) => (
              <tr
                key={territory.id}
                className="border-b hover:bg-slate-50 transition"
              >
                {/* Territory */}

                <td className="px-6 py-5">

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      {territory.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {territory.description}
                    </p>

                  </div>

                </td>

                {/* Code */}

                <td className="font-medium">
                  {territory.code}
                </td>

                {/* Branch */}

                <td>
                  {territory.branch}
                </td>

                {/* Manager */}

                <td>

                  <div>

                    <h4 className="font-medium">
                      {territory.manager}
                    </h4>

                  </div>

                </td>

                {/* Employees */}

                <td>

                  <span className="font-semibold">
                    {territory.employees}
                  </span>

                </td>

                {/* Status */}

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      territory.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {territory.status}
                  </span>

                </td>

                {/* Actions */}

                <td>

                  <div className="flex justify-center gap-3">

                    {/* View */}

                    <button
                      onClick={() => {
                        setViewTerritory(territory);
                        setShowViewModal(true);
                      }}
                      className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <Eye size={18} className="mx-auto" />
                    </button>

                    {/* Edit */}

                    <button
                      onClick={() => handleEdit(territory)}
                      className="w-9 h-9 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                    >
                      <Pencil size={18} className="mx-auto" />
                    </button>

                    {/* Delete */}

                    <button
                      onClick={() => setDeleteTerritory(territory)}
                      className="w-9 h-9 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash2 size={18} className="mx-auto" />
                    </button>

                  </div>

                </td>

              </tr>
            ))
          ) : (

            <tr>

              <td
                colSpan={7}
                className="py-16 text-center"
              >

                <MapPinned
                  size={60}
                  className="mx-auto text-gray-300"
                />

                <h3 className="text-xl font-semibold mt-5 text-gray-600">
                  No Territory Found
                </h3>

                <p className="text-gray-500 mt-2">
                  No territory matches your search.
                </p>

              </td>

            </tr>

          )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm p-5">

        <p className="text-gray-500">

          Showing

          <span className="font-semibold mx-1">

            {filteredTerritories.length}

          </span>

          Territories

        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">

            Previous

          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">

            1

          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">

            Next

          </button>

        </div>

      </div>
            {/* ===========================
            ADD / EDIT TERRITORY MODAL
      =========================== */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl">

            {/* Header */}

            <div className="flex items-center justify-between px-8 py-5 border-b">

              <div>

                <h2 className="text-2xl font-bold text-slate-800">

                  {editingTerritory
                    ? "Edit Territory"
                    : "Add New Territory"}

                </h2>

                <p className="text-gray-500 mt-1">
                  Fill all territory details.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTerritory(null);
                  setFormData({ ...emptyTerritory });
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={22} />
              </button>

            </div>

            {/* Form */}

            <div className="p-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Territory Name */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Territory Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Territory Name"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Territory Code */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Territory Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter Territory Code"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Branch */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Branch
                  </label>

                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Branch Name"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Manager */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Territory Manager
                  </label>

                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    placeholder="Manager Name"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Employees */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Employees
                  </label>

                  <input
                    type="number"
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    placeholder="Number of Employees"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Status */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

              {/* Description */}

              <div className="mt-6">

                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>

                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter Territory Description"
                  className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />

              </div>
                            {/* Footer */}

              <div className="flex justify-end gap-4 mt-8 border-t pt-6">

                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingTerritory(null);
                    setFormData(emptyTerritory);
                  }}
                  className="px-6 py-3 border rounded-xl hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
                >
                  <Save size={18} />

                  {editingTerritory
                    ? "Update Territory"
                    : "Save Territory"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {showViewModal && viewTerritory && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Territory Details</h2>
                <p className="text-gray-500 mt-1">Overview of the selected territory.</p>
              </div>
              <button onClick={() => { setShowViewModal(false); setViewTerritory(null); }} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X size={22} />
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Territory</span><span>{viewTerritory.name}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Code</span><span>{viewTerritory.code}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Branch</span><span>{viewTerritory.branch}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Manager</span><span>{viewTerritory.manager}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Employees</span><span>{viewTerritory.employees}</span></div>
              <div className="flex justify-between py-2"><span className="font-semibold">Description</span><span className="text-right">{viewTerritory.description}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================
            DELETE CONFIRMATION
      =========================== */}

      {deleteTerritory && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

            <div className="flex justify-center">

              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">

                <Trash2
                  size={36}
                  className="text-red-600"
                />

              </div>

            </div>

            <h2 className="text-2xl font-bold text-center mt-6">

              Delete Territory

            </h2>

            <p className="text-gray-500 text-center mt-3">

              Are you sure you want to delete

            </p>

            <p className="font-semibold text-center mt-2">

              {deleteTerritory.name} ?

            </p>

            <div className="flex justify-center gap-4 mt-8">

              <button
                onClick={() => setDeleteTerritory(null)}
                className="px-6 py-3 border rounded-xl hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
