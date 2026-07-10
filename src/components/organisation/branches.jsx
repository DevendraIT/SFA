import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Building2,
  Users,
  MapPinned,
  X,
  Save,
} from "lucide-react";

export default function Branches() {
  /* ===========================
      MOCK BRANCH DATA
  =========================== */

  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Indore Branch",
      code: "BR001",
      manager: "Rahul Sharma",
      territory: "Central Zone",
      employees: 25,
      phone: "9876543210",
      email: "indore@abcpharma.com",
      address: "Vijay Nagar, Indore",
      status: "Active",
    },
    {
      id: 2,
      name: "Bhopal Branch",
      code: "BR002",
      manager: "Amit Verma",
      territory: "North Zone",
      employees: 18,
      phone: "9876543211",
      email: "bhopal@abcpharma.com",
      address: "MP Nagar, Bhopal",
      status: "Active",
    },
    {
      id: 3,
      name: "Ujjain Branch",
      code: "BR003",
      manager: "Neha Jain",
      territory: "West Zone",
      employees: 15,
      phone: "9876543212",
      email: "ujjain@abcpharma.com",
      address: "Freeganj, Ujjain",
      status: "Inactive",
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
  const [editingBranch, setEditingBranch] = useState(null);
  const [deleteBranch, setDeleteBranch] = useState(null);
  const [viewBranch, setViewBranch] = useState(null);

  /* ===========================
      FORM DATA
  =========================== */

  const emptyBranch = {
    name: "",
    code: "",
    manager: "",
    territory: "",
    employees: "",
    phone: "",
    email: "",
    address: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyBranch);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sfa_org_branches") || "[]");
      if (Array.isArray(saved) && saved.length) {
        setBranches(saved);
      }
    } catch {
      // ignore invalid storage data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sfa_org_branches", JSON.stringify(branches));
  }, [branches]);

  /* ===========================
      INPUT CHANGE
  =========================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================
      OPEN ADD MODAL
  =========================== */

  const handleAdd = () => {
    setEditingBranch(null);
    setFormData({ ...emptyBranch });
    setShowModal(true);
  };

  /* ===========================
      OPEN EDIT MODAL
  =========================== */

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData(branch);
    setShowModal(true);
  };

  /* ===========================
      SAVE BRANCH
  =========================== */

  const resetBranchModal = () => {
    setShowModal(false);
    setEditingBranch(null);
    setFormData({ ...emptyBranch });
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.manager) {
      alert("Please fill all required fields.");
      return;
    }

    setBranches((prev) => {
      if (editingBranch) {
        return prev.map((branch) =>
          branch.id === editingBranch.id ? { ...formData, id: editingBranch.id } : branch
        );
      }
      return [...prev, { ...formData, id: Date.now() }];
    });

    resetBranchModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  /* ===========================
      DELETE BRANCH
  =========================== */

  const confirmDelete = () => {
    setBranches((prev) => prev.filter((branch) => branch.id !== deleteBranch.id));
    setDeleteBranch(null);
  };

  /* ===========================
      FILTERED DATA
  =========================== */

  const filteredBranches = branches.filter((branch) => {
    const searchMatch =
      branch.name.toLowerCase().includes(search.toLowerCase()) ||
      branch.manager.toLowerCase().includes(search.toLowerCase()) ||
      branch.code.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      branch.status === statusFilter;

    return searchMatch && statusMatch;
  });

  /* ===========================
      PAGE
  =========================== */

  return (
    <div className="space-y-6">
              {/* ===========================
            PAGE HEADER
      =========================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <h2 className="text-3xl font-bold text-slate-800">
            Branch Management
          </h2>

          <p className="text-gray-500 mt-2">
            Create, manage and monitor all organization branches.
          </p>

        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition"
        >

          <Plus size={20} />

          Add Branch

        </button>

      </div>

      {/* ===========================
            STATISTICS
      =========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

            <Building2 className="text-blue-600" size={28} />

          </div>

          <p className="text-gray-500 mt-4">
            Total Branches
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {branches.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

            <Users className="text-green-600" size={28} />

          </div>

          <p className="text-gray-500 mt-4">
            Total Employees
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {branches.reduce(
              (total, branch) =>
                total + Number(branch.employees),
              0
            )}

          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">

            <MapPinned className="text-orange-600" size={28} />

          </div>

          <p className="text-gray-500 mt-4">
            Active Branches
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {
              branches.filter(
                (branch) => branch.status === "Active"
              ).length
            }

          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">

            <Building2 className="text-red-600" size={28} />

          </div>

          <p className="text-gray-500 mt-4">
            Inactive Branches
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {
              branches.filter(
                (branch) => branch.status === "Inactive"
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

          <div className="flex-1 relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by Branch Name, Manager or Branch Code..."
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
            BRANCH TABLE
      =========================== */}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left px-6 py-4">
                Branch
              </th>

              <th className="text-left">
                Code
              </th>

              <th className="text-left">
                Territory
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

          <tbody>
                      {filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => (
              <tr
                key={branch.id}
                className="border-b hover:bg-slate-50 transition"
              >
                {/* Branch */}

                <td className="px-6 py-5">

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      {branch.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {branch.address}
                    </p>

                  </div>

                </td>

                {/* Code */}

                <td className="font-medium">
                  {branch.code}
                </td>

                {/* Territory */}

                <td>
                  {branch.territory}
                </td>

                {/* Manager */}

                <td>

                  <div>

                    <h4 className="font-medium">
                      {branch.manager}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {branch.phone}
                    </p>

                  </div>

                </td>

                {/* Employees */}

                <td>

                  <span className="font-semibold">

                    {branch.employees}

                  </span>

                </td>

                {/* Status */}

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      branch.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {branch.status}

                  </span>

                </td>

                {/* Actions */}

                <td>

                  <div className="flex justify-center gap-3">

                    {/* View */}

                    <button
                      onClick={() => {
                        setViewBranch(branch);
                        setShowViewModal(true);
                      }}
                      className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <Eye size={18} className="mx-auto" />
                    </button>

                    {/* Edit */}

                    <button
                      onClick={() => handleEdit(branch)}
                      className="w-9 h-9 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                    >
                      <Pencil size={18} className="mx-auto" />
                    </button>

                    {/* Delete */}

                    <button
                      onClick={() => setDeleteBranch(branch)}
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

                <Building2
                  size={60}
                  className="mx-auto text-gray-300"
                />

                <h3 className="text-xl font-semibold mt-5 text-gray-600">

                  No Branch Found

                </h3>

                <p className="text-gray-500 mt-2">

                  No branch matches your search.

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

            {filteredBranches.length}

          </span>

          Branches

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
            ADD / EDIT BRANCH MODAL
      =========================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingBranch ? "Edit Branch" : "Add New Branch"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in the branch details below.
                </p>
              </div>
              <button
                type="button"
                onClick={resetBranchModal}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
              >
                <X size={22} className="text-slate-600" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Branch Name */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Branch Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Branch Name"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Branch Code */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Branch Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter Branch Code"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Manager */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Branch Manager
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

                {/* Territory */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Territory
                  </label>

                  <input
                    type="text"
                    name="territory"
                    value={formData.territory}
                    onChange={handleChange}
                    placeholder="Territory"
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

                {/* Phone */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Branch Address
                  </label>
                  <textarea
                    rows="4"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Complete Address"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetBranchModal}
                    className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Save size={18} />
                    {editingBranch ? "Update Branch" : "Save Branch"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showViewModal && viewBranch && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Branch Details</h2>
                <p className="text-gray-500 mt-1">Overview of the selected branch.</p>
              </div>
              <button onClick={() => { setShowViewModal(false); setViewBranch(null); }} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X size={22} />
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Branch</span><span>{viewBranch.name}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Code</span><span>{viewBranch.code}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Manager</span><span>{viewBranch.manager}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Territory</span><span>{viewBranch.territory}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Employees</span><span>{viewBranch.employees}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Email</span><span>{viewBranch.email}</span></div>
              <div className="flex justify-between border-b py-2"><span className="font-semibold">Phone</span><span>{viewBranch.phone}</span></div>
              <div className="flex justify-between py-2"><span className="font-semibold">Address</span><span className="text-right">{viewBranch.address}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================
            DELETE CONFIRMATION
      =========================== */}

      {deleteBranch && (

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

              Delete Branch

            </h2>

            <p className="text-gray-500 text-center mt-3">

              Are you sure you want to delete

            </p>

            <p className="font-semibold text-center mt-2">

              {deleteBranch.name} ?

            </p>

            <div className="flex justify-center gap-4 mt-8">

              <button
                onClick={() => setDeleteBranch(null)}
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
    