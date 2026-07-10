import ProductStats from "../../components/salesperson/product/productstats.jsx";
import ProductFilters from "../../components/salesperson/product/productfilter.jsx";
import ProductGrid from "../../components/salesperson/product/productgrid.jsx";

export default function SPProducts() {
  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Products
          </h1>

          <p className="text-slate-500 mt-2">
            Browse products and manage inventory information
          </p>
        </div>

        <button className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
          + Add Product
        </button>

      </div>

      <ProductStats />

      <ProductFilters />

      <ProductGrid />

    </div>
  );
}