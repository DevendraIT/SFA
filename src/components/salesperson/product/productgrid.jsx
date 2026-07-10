import {
  FiShoppingCart,
  FiEye,
} from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Tablet",
    price: "₹55",
    stock: 320,
    image: "https://via.placeholder.com/300x180",
  },
  {
    id: 2,
    name: "Vitamin C",
    category: "Capsule",
    price: "₹120",
    stock: 180,
    image: "https://via.placeholder.com/300x180",
  },
];

export default function ProductGrid() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {products.map((product) => (

        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition"
        >

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />

          <div className="p-5">

            <h3 className="font-bold text-lg">
              {product.name}
            </h3>

            <p className="text-gray-500 mt-2">
              {product.category}
            </p>

            <div className="flex justify-between mt-4">

              <div>

                <p className="text-blue-600 font-bold">
                  {product.price}
                </p>

                <p className="text-sm text-gray-500">
                  Stock : {product.stock}
                </p>

              </div>

            </div>

            <div className="flex gap-3 mt-5">

              <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl flex justify-center items-center gap-2">

                <FiShoppingCart />

                Order

              </button>

              <button className="bg-slate-100 px-4 rounded-xl">

                <FiEye />

              </button>

            </div>

          </div>

        </div>

      ))}

    </div>
  );
}