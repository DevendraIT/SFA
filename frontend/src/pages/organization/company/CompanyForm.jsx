import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import companyService from "../../../services/company.service";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name is required.")
    .max(100, "Company name cannot exceed 100 characters."),

  code: z
    .string()
    .trim()
    .min(2, "Company code is required.")
    .max(20, "Company code cannot exceed 20 characters."),

  email: z
    .string()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),

  phone: z.string().optional(),

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  country: z.string().optional(),

  postalCode: z.string().optional(),

  gstNumber: z.string().optional(),

  panNumber: z.string().optional(),

  isActive: z.boolean(),
});

export default function CompanyForm({
  company,
  onClose,
  onSuccess,
}) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
      code: "",

      email: "",
      phone: "",

      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",

      gstNumber: "",
      panNumber: "",

      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (!company) return;

    reset({
      name: company.name || "",
      code: company.code || "",

      email: company.email || "",
      phone: company.phone || "",

      address: company.address || "",
      city: company.city || "",
      state: company.state || "",
      country: company.country || "",
      postalCode: company.postalCode || "",

      gstNumber: company.gstNumber || "",
      panNumber: company.panNumber || "",

      isActive:
        company.isActive ?? true,
    });

  }, [company, reset]);

  const onSubmit = async (values) => {

    const payload = {
      ...values,
      code: values.code.toUpperCase(),
    };

    try {

      if (company) {

        await companyService.updateCompany(
          company.id,
          payload
        );

        toast.success(
          "Company updated successfully."
        );

      } else {

        await companyService.createCompany(
          payload
        );

        toast.success(
          "Company created successfully."
        );

      }

      onSuccess?.();

      onClose?.();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Operation failed."
      );

    }

  };



return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-8"
  >
    {/* Basic Information */}

    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="mb-5 text-lg font-semibold text-slate-800">
        Basic Information
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Name *
          </label>

          <input
            {...register("name")}
            placeholder="Enter company name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Code *
          </label>

          <input
            {...register("code")}
            onChange={(e) =>
              setValue(
                "code",
                e.target.value.toUpperCase()
              )
            }
            placeholder="COMP001"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          {errors.code && (
            <p className="mt-1 text-sm text-red-500">
              {errors.code.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <label className="inline-flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) =>
                setValue(
                  "isActive",
                  e.target.checked
                )
              }
              className="h-5 w-5 rounded"
            />

            <span className="font-medium text-slate-700">
              {isActive ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

      </div>
    </div>

    {/* Contact */}

    <div className="rounded-xl border border-slate-200 p-5">

      <h3 className="mb-5 text-lg font-semibold text-slate-800">
        Contact Information
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            {...register("email")}
            type="email"
            placeholder="company@example.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            {...register("phone")}
            placeholder="+91 9876543210"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

      </div>

    </div>

    {/* Address */}

    <div className="rounded-xl border border-slate-200 p-5">

      <h3 className="mb-5 text-lg font-semibold text-slate-800">
        Address Information
      </h3>

      <div className="space-y-5">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Address
          </label>

          <textarea
            rows={3}
            {...register("address")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              City
            </label>

            <input
              {...register("city")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              State
            </label>

            <input
              {...register("state")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Country
            </label>

            <input
              {...register("country")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Postal Code
            </label>

            <input
              {...register("postalCode")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

          </div>

        </div>

      </div>

    </div>

    {/* Tax */}

    <div className="rounded-xl border border-slate-200 p-5">

      <h3 className="mb-5 text-lg font-semibold text-slate-800">
        Tax Information
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium">
            GST Number
          </label>

          <input
            {...register("gstNumber")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            PAN Number
          </label>

          <input
            {...register("panNumber")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

        </div>

      </div>

    </div>

    {/* Footer */}

    <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Saving..."
          : company
          ? "Update Company"
          : "Create Company"}
      </button>

    </div>

  </form>
);
}