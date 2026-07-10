import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Building,
  Users,
  X,
  Save,
} from "lucide-react";

export default function Departments() {
  /* ===========================
      MOCK DATA
  =========================== */

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Sales",
      code: "DEP001",
      head: "Rahul Sharma",
      employees: 45,
      branch: "Indore Branch",
      status: "Active",
      description: "Handles all sales activities.",
    },
    {
      id: 2,
      name: "Marketing",
      code: "DEP002",
      head: "Neha Jain",
      employees: 28,
      branch: "Bhopal Branch",
      status: "Active",
      description: "Responsible for marketing campaigns.",
    },
    {
      id: 3,
      name: "Human Resources",
      code: "DEP003",
      head: "Amit Verma",
      employees: 12,
      branch: "Head Office",
      status: "Inactive",
      description: "Employee recruitment and management.",
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
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deleteDepartment, setDeleteDepartment] = useState(null);
  const [viewDepartment, setViewDepartment] = useState(null);

  /* ===========================
      FORM DATA
  =========================== */

  const emptyDepartment = {
    name: "",
    code: "",
    head: "",
    employees: "",
    branch: "",
    status: "Active",
    description: "",
  };

  const [formData, setFormData] = useState(emptyDepartment);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sfa_org_departments") || "[]");
      if (Array.isArray(saved) && saved.length) {
        setDepartments(saved);
      }
    } catch {
      // ignore invalid storage data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sfa_org_departments", JSON.stringify(departments));
  }, [departments]);

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
    setEditingDepartment(null);
    setFormData({ ...emptyDepartment });
    setShowModal(true);
  };

  /* ===========================
      EDIT
  =========================== */

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData(department);
    setShowModal(true);
  };

  /* ===========================
      SAVE
  =========================== */

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.head) {
      alert("Please fill all required fields.");
      return;
    }

    setDepartments((prev) => {
      if (editingDepartment) {
        return prev.map((item) =>
          item.id === editingDepartment.id ? { ...formData, id: editingDepartment.id } : item,
        );
      }
      return [...prev, { ...formData, id: Date.now() }];
    });

    setShowModal(false);
    setEditingDepartment(null);
    setFormData({ ...emptyDepartment });
  };

  /* ===========================
      DELETE
  =========================== */

  const confirmDelete = () => {
    setDepartments((prev) => prev.filter((item) => item.id !== deleteDepartment.id));
    setDeleteDepartment(null);
  };

  /* ===========================
      FILTER DATA
  =========================== */

  const filteredDepartments = departments.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.head.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());

    const statusMatch = statusFilter === "All" || item.status === statusFilter;

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
            Department Management
          </h2>

          <p className="text-gray-500 mt-2">
            Manage departments across your organization.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition"
        >
          <Plus size={20} />
          Add Department
        </button>
      </div>

      {/* ===========================
            STATISTICS
      =========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total */}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building className="text-blue-600" size={28} />
          </div>

          <p className="text-gray-500 mt-4">Total Departments</p>

          <h2 className="text-3xl font-bold mt-2">{departments.length}</h2>
        </div>

        {/* Employees */}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
            <Users className="text-green-600" size={28} />
          </div>

          <p className="text-gray-500 mt-4">Total Employees</p>

          <h2 className="text-3xl font-bold mt-2">
            {departments.reduce((sum, dept) => sum + Number(dept.employees), 0)}
          </h2>
        </div>

        {/* Active */}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Building className="text-emerald-600" size={28} />
          </div>

          <p className="text-gray-500 mt-4">Active</p>

          <h2 className="text-3xl font-bold mt-2">
            {departments.filter((dept) => dept.status === "Active").length}
          </h2>
        </div>

        {/* Inactive */}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
            <Building className="text-red-600" size={28} />
          </div>

          <p className="text-gray-500 mt-4">Inactive</p>

          <h2 className="text-3xl font-bold mt-2">
            {departments.filter((dept) => dept.status === "Inactive").length}
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
              placeholder="Search Department, Head or Code..."
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
            <option value="All">All Status</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ===========================
            DEPARTMENT TABLE
      =========================== */}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-6 py-4">Department</th>

              <th className="text-left">Code</th>

              <th className="text-left">Branch</th>

              <th className="text-left">Department Head</th>

              <th className="text-left">Employees</th>

              <th className="text-left">Status</th>

              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department) => (
                <tr
                  key={department.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  {/* Department */}

                  <td className="px-6 py-5">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {department.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {department.description}
                      </p>
                    </div>
                  </td>

                  {/* Code */}

                  <td className="font-medium">{department.code}</td>

                  {/* Branch */}

                  <td>{department.branch}</td>

                  {/* Department Head */}

                  <td>
                    <div>
                      <h4 className="font-medium">{department.head}</h4>
                    </div>
                  </td>

                  {/* Employees */}

                  <td>
                    <span className="font-semibold">
                      {department.employees}
                    </span>
                  </td>

                  {/* Status */}

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        department.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {department.status}
                    </span>
                  </td>

                  {/* Actions */}

                  <td>
                    <div className="flex justify-center gap-3">
                      {/* View */}

                      <button
                        onClick={() => {
                          setViewDepartment(department);
                          setShowViewModal(true);
                        }}
                        className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                      >
                        <Eye size={18} className="mx-auto" />
                      </button>

                      {/* Edit */}

                      <button
                        onClick={() => handleEdit(department)}
                        className="w-9 h-9 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                      >
                        <Pencil size={18} className="mx-auto" />
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() => setDeleteDepartment(department)}
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
                <td colSpan={7} className="py-16 text-center">
                  <Building size={60} className="mx-auto text-gray-300" />

                  <h3 className="text-xl font-semibold mt-5 text-gray-600">
                    No Department Found
                  </h3>

                  <p className="text-gray-500 mt-2">
                    No department matches your search.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===========================
            PAGINATION
      =========================== */}

      <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm p-5">
        <p className="text-gray-500">
          Showing
          <span className="font-semibold mx-1">
            {filteredDepartments.length}
          </span>
          Departments
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
            ADD / EDIT DEPARTMENT MODAL
      =========================== */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl">
            {/* Header */}

            <div className="flex items-center justify-between px-8 py-5 border-b">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingDepartment ? "Edit Department" : "Add New Department"}
                </h2>

                <p className="text-gray-500 mt-1">
                  Fill all department details.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingDepartment(null);
                  setFormData(emptyDepartment);
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Name */}

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Department Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Department Name"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Department Code */}

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Department Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter Department Code"
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

                {/* Department Head */}

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Department Head
                  </label>

                  <input
                    type="text"
                    name="head"
                    value={formData.head}
                    onChange={handleChange}
                    placeholder="Department Head"
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
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
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
                  placeholder="Enter Department Description"
                  className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Footer */}

              <div className="flex justify-end gap-4 mt-8 border-t pt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingDepartment(null);
                    setFormData({ ...emptyDepartment });
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

                  {editingDepartment ? "Update Department" : "Save Department"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && viewDepartment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Department Details</h2>
                <p className="text-gray-500 mt-1">Overview of the selected department.</p>
              </div>
              <button onClick={() => { setShowViewModal(false); setViewDepartment(null); }} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X size={22} />
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Department</span><span>{viewDepartment.name}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Code</span><span>{viewDepartment.code}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Head</span><span>{viewDepartment.head}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Branch</span><span>{viewDepartment.branch}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Employees</span><span>{viewDepartment.employees}</span></div>
              <div className="flex justify-between py-2"><span className="font-semibold">Description</span><span className="text-right">{viewDepartment.description}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================
            DELETE CONFIRMATION MODAL
      =========================== */}

      {deleteDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

            {/* Header */}

            <div className="px-6 py-5 border-b">
              <h2 className="text-xl font-bold text-slate-800">
                Delete Department
              </h2>

              <p className="text-gray-500 mt-2">
                Are you sure you want to delete this department?
              </p>
            </div>


            {/* Content */}

            <div className="p-6">

              <div className="bg-red-50 rounded-xl p-4">

                <h3 className="font-semibold text-red-700">
                  {deleteDepartment.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Code : {deleteDepartment.code}
                </p>

                <p className="text-sm text-gray-600">
                  Department Head : {deleteDepartment.head}
                </p>

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-4 mt-6">

                <button
                  onClick={() => setDeleteDepartment(null)}
                  className="px-5 py-3 border rounded-xl hover:bg-gray-100 transition"
                >
                  Cancel
                </button>


                <button
                  onClick={confirmDelete}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
