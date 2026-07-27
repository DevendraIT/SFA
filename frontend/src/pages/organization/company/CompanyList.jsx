import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Building2,
  Mail,
  Phone,
  Eye,
  MoreVertical,
  X,
} from "lucide-react";

import CompanyForm from "./CompanyForm";
import toast from "react-hot-toast";
import companyService from "../../../services/company.service";

import useCompanies from "../../../hooks/useCompanies";

export default function CompanyList() {

  const {
    companies,
    loading,
    search,
    setSearch,
    reload,
} = useCompanies({
    debounce: true,
});

  const [showModal, setShowModal] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(null);

  const [viewCompany, setViewCompany] = useState(null);

  // 👇 Add this function here
  const handleDelete = async (company) => {

    const confirmed = window.confirm(
      `Delete "${company.name}" ?`
    );

    if (!confirmed) return;

    try {

      await companyService.deleteCompany(company.id);

      toast.success("Company deleted");

      reload();

    } catch (err) {

      console.log(err);

      toast.error("Unable to delete company");

    }

  };

  console.log("Companies:", companies);

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">

            Company Management

          </h1>

          <p className="text-slate-500 mt-1">

            Manage companies inside your organization.

          </p>

        </div>

        <button
          onClick={() => {
  setSelectedCompany(null);
  setShowModal(true);
}}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 transition"
        >
          <Plus size={18} />

          Create Company
        </button>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company name, code, email or phone..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border bg-white">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
  <th className="px-6 py-4 text-left">
    Company
  </th>

  <th className="px-6 py-4 text-left">
    Code
  </th>

  <th className="px-6 py-4 text-left">
    Email
  </th>

  <th className="px-6 py-4 text-left">
    Phone
  </th>

  <th className="px-6 py-4 text-center">
    Status
  </th>

  <th className="px-6 py-4 text-center">
    Branches
  </th>

  <th className="px-6 py-4 text-center">
    Territories
  </th>

  <th className="px-6 py-4 text-center">
    Actions
  </th>
</tr>

          </thead>

          <tbody>

                        {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-16 text-center text-slate-500"
                >
                  Loading companies...
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center py-16">

                    <Building2
                      size={60}
                      className="text-slate-300"
                    />

                    <h3 className="mt-5 text-xl font-semibold text-slate-700">

                      No Companies Found

                    </h3>

                    <p className="mt-2 text-slate-500">

                      Create your first company to get started.

                    </p>

                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                    >
                      Create Company
                    </button>

                  </div>
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr
                  key={company.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-5">

                    <div>

                      <h4 className="font-semibold text-slate-800">

                        {company.name}

                      </h4>

                      <p className="text-sm text-slate-500">
  Created{" "}
  {company.createdAt
    ? new Date(company.createdAt).toLocaleDateString()
    : "-"}
</p>

                    </div>

                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {company.code || "-"}
                  </td>

                  <td className="px-6 py-5">
  <div className="flex items-center gap-2 text-slate-600">
    <Mail size={15} />
    <span>{company.email || "-"}</span>
  </div>
</td>

<td className="px-6 py-5">
  <div className="flex items-center gap-2 text-slate-600">
    <Phone size={15} />
    <span>{company.phone || "-"}</span>
  </div>
</td>

<td className="px-6 py-5 text-center">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      company.isActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {company.isActive ? "Active" : "Inactive"}
  </span>
</td>

                  <td className="px-6 py-5 text-center">

                    {company._count?.branches ?? 0}

                  </td>

                  <td className="px-6 py-5 text-center">

                    {company._count?.territories ?? 0}

                  </td>

                  <td className="px-6 py-5">

                    <div className="flex items-center justify-center gap-2">

  <button
    onClick={() => setViewCompany(company)}
    className="rounded-lg border p-2 hover:bg-slate-100"
    title="View"
  >
    <Eye size={17} />
  </button>

  <button
    onClick={() => {
      setSelectedCompany(company);
      setShowModal(true);
    }}
    className="rounded-lg border p-2 hover:bg-slate-100"
    title="Edit"
  >
    <Pencil size={17} />
  </button>

  <button
    onClick={() => handleDelete(company)}
    className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
    title="Delete"
  >
    <Trash2 size={17} />
  </button>

</div>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

            {/* Footer */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">

          Total Companies :
          <span className="ml-2 font-semibold text-slate-800">

            {companies?.length || 0}

          </span>

        </p>

        <div className="flex gap-3">

          <button
  disabled
  className="rounded-lg border px-4 py-2 text-sm text-slate-400 opacity-60 cursor-not-allowed"
>
            Previous
          </button>

          <button
  disabled
  className="rounded-lg border px-4 py-2 text-sm text-slate-400 opacity-60 cursor-not-allowed"
>
            Next
          </button>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h4 className="text-sm text-slate-500">

            Total Companies

          </h4>

          <h2 className="mt-2 text-3xl font-bold">

            {companies?.length || 0}

          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h4 className="text-sm text-slate-500">

            Total Branches

          </h4>

          <h2 className="mt-2 text-3xl font-bold">

            {companies?.reduce(
              (sum, company) => sum + (company._count?.branches || 0),
              0
            )}

          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h4 className="text-sm text-slate-500">

            Total Territories

          </h4>

          <h2 className="mt-2 text-3xl font-bold">

            {companies?.reduce(
              (sum, company) => sum + (company._count?.territories || 0),
              0
            )}

          </h2>

        </div>

      </div>

      {/* Create/Edit Company Modal */}

      {showModal && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">

        <button
          type="button"
          onClick={() => {
            setShowModal(false);
            setSelectedCompany(null);
          }}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X size={22} />
        </button>

        <h2 className="mb-6 text-2xl font-bold">

            {selectedCompany
                ? "Edit Company"
                : "Create Company"}

        </h2>

        <CompanyForm

            company={selectedCompany}

            onClose={() => {

                setShowModal(false);

                setSelectedCompany(null);

            }}

            onSuccess={reload}

        />

    </div>

</div>

)}

      {/* Company Details View Modal */}

      {viewCompany && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setViewCompany(null)}>

    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>

        <button
          type="button"
          onClick={() => setViewCompany(null)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-xl bg-indigo-100 p-3">
            <Building2 size={28} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{viewCompany.name}</h2>
            <p className="text-sm text-slate-500">
              {viewCompany.code ? `Code: ${viewCompany.code}` : ''}
              {viewCompany.code && viewCompany.createdAt ? ' | ' : ''}
              {viewCompany.createdAt ? `Created ${new Date(viewCompany.createdAt).toLocaleDateString()}` : ''}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Contact Section */}
          <div className="rounded-xl border border-slate-200 p-5 col-span-full">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-800">{viewCompany.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-800">{viewCompany.phone || "-"}</p>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="rounded-xl border border-slate-200 p-5 col-span-full">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(viewCompany.address || viewCompany.city || viewCompany.state || viewCompany.country || viewCompany.postalCode) ? (
                <>
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-800">{viewCompany.address || "-"}</p>
                  </div>
                  {viewCompany.city && (
                    <div>
                      <p className="text-sm text-slate-500">City</p>
                      <p className="font-medium text-slate-800">{viewCompany.city}</p>
                    </div>
                  )}
                  {viewCompany.state && (
                    <div>
                      <p className="text-sm text-slate-500">State</p>
                      <p className="font-medium text-slate-800">{viewCompany.state}</p>
                    </div>
                  )}
                  {viewCompany.country && (
                    <div>
                      <p className="text-sm text-slate-500">Country</p>
                      <p className="font-medium text-slate-800">{viewCompany.country}</p>
                    </div>
                  )}
                  {viewCompany.postalCode && (
                    <div>
                      <p className="text-sm text-slate-500">Postal Code</p>
                      <p className="font-medium text-slate-800">{viewCompany.postalCode}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="md:col-span-2">
                  <p className="text-slate-400">No address information available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tax Section */}
          <div className="rounded-xl border border-slate-200 p-5 col-span-full">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Tax Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">GST Number</p>
                <p className="font-medium text-slate-800">{viewCompany.gstNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">PAN Number</p>
                <p className="font-medium text-slate-800">{viewCompany.panNumber || "-"}</p>
              </div>
            </div>
          </div>

          {/* Status & Statistics Section */}
          <div className="rounded-xl border border-slate-200 p-5 col-span-full">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Status & Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <span className={`inline-block mt-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  viewCompany.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {viewCompany.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Branches</p>
                <p className="text-2xl font-bold text-slate-800">{viewCompany._count?.branches ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Territories</p>
                <p className="text-2xl font-bold text-slate-800">{viewCompany._count?.territories ?? 0}</p>
              </div>
            </div>
          </div>

        </div>

    </div>

</div>

)}

    </div>

  );

}
