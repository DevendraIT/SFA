import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Loader2, Send, User, FileText, MapPin, ShoppingCart,
  Package, Route, ClipboardCheck, Settings, Info, ChevronRight,
  ChevronLeft, Check, AlertCircle, Map, Target, Calendar,
  Smartphone, Camera, FileSignature, DollarSign, List,
  Lightbulb, Globe, Clock, Users, Briefcase, Building2,
  Hash, Type, AlignLeft, Flag, Layers, BookOpen, Crosshair,
  Navigation, ArrowLeft, RefreshCw, Search, Plus, Minus,
  Mail, Phone, Link, ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import fieldForceApi from "../../api/fieldForce.api";
import salesApi from "../../api/sales.api";
import customerApi from "../../api/customer.api";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const VISIT_TYPES = ["COLD_CALL", "FOLLOW_UP", "MEETING", "DEMO"];
const TASK_CATEGORIES = [
  { value: "FIELD_VISIT", label: "Field Visit", icon: MapPin },
  { value: "ORDER_DELIVERY", label: "Order Delivery", icon: ShoppingCart },
  { value: "CUSTOMER_MEETING", label: "Customer Meeting", icon: Users },
  { value: "COLLECTION", label: "Collection", icon: DollarSign },
  { value: "SURVEY", label: "Survey", icon: ClipboardCheck },
  { value: "DEMO", label: "Product Demo", icon: Lightbulb },
  { value: "FOLLOW_UP", label: "Follow Up", icon: Clock },
  { value: "OTHER", label: "Other", icon: FileText },
];

const SECTIONS = [
  { id: "taskInfo", label: "Task Information", icon: Info },
  { id: "assignment", label: "Assignment", icon: Users },
  { id: "customer", label: "Customer Details", icon: Building2 },
  { id: "order", label: "Sales Order", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
  { id: "route", label: "Route Assignment", icon: Route },
  { id: "visit", label: "Visit Configuration", icon: MapPin },
  { id: "requirements", label: "Execution Requirements", icon: Settings },
  { id: "instructions", label: "Instructions", icon: BookOpen },
  { id: "summary", label: "Summary", icon: Check },
];

// =====================================================
// SECTION 1: Task Information
// =====================================================
function TaskInfoSection({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Target size={16} className="text-blue-500" /> Task Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TASK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = data.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onChange({ ...data, category: cat.value })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400"} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Type size={14} /> Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Enter field mission title"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Flag size={14} /> Priority
          </label>
          <select
            value={data.priority}
            onChange={(e) => onChange({ ...data, priority: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <AlignLeft size={14} /> Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
          placeholder="Describe the mission objective, expected outcomes..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
        />
      </div>
    </div>
  );
}

// =====================================================
// SECTION 2: Assignment
// =====================================================
function AssignmentSection({ data, onChange, executives, territories }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <User size={14} className="text-blue-500" /> Assign To <span className="text-red-500">*</span>
        </label>
        <select
          value={data.assignedToId}
          onChange={(e) => onChange({ ...data, assignedToId: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        >
          <option value="">Select Executive</option>
          {executives.map((exec) => (
            <option key={exec.id} value={exec.id}>
              {exec.firstName} {exec.lastName} {exec.email ? `(${exec.email})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Globe size={14} /> Territory / Beat
          </label>
          <select
            value={data.territoryId}
            onChange={(e) => onChange({ ...data, territoryId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Territory</option>
            {territories.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Calendar size={14} /> Due Date
          </label>
          <input
            type="date"
            value={data.dueDate}
            onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Clock size={14} /> Due Time
          </label>
          <input
            type="time"
            value={data.dueTime}
            onChange={(e) => onChange({ ...data, dueTime: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Layers size={14} /> Reference Type
          </label>
          <select
            value={data.referenceType}
            onChange={(e) => onChange({ ...data, referenceType: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">None</option>
            <option value="ORDER">Order</option>
            <option value="VISIT">Visit</option>
            <option value="LEAD">Lead</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SECTION 3: Customer Details
// =====================================================
function CustomerSection({ data, onChange, customers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleAddressSearch = useCallback(async (query) => {
    if (!query || query.length < 5) return;
    setSearching(true);
    try {
      // Use a free geocoding API (Nominatim / OpenStreetMap)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        { headers: { "Accept-Language": "en" } }
      );
      const results = await res.json();
      setSearchResults(
        results.map((r) => ({
          displayName: r.display_name,
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
        }))
      );
      setShowSearch(true);
    } catch (err) {
      console.error("Address search failed:", err);
      toast.error("Failed to search address");
    } finally {
      setSearching(false);
    }
  }, []);

  const selectAddress = (result) => {
    onChange({
      ...data,
      customerAddress: result.displayName,
      latitude: result.lat.toString(),
      longitude: result.lng.toString(),
    });
    setSearchQuery(result.displayName);
    setShowSearch(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <Building2 size={14} className="text-blue-500" /> Select Customer
        </label>
        <select
          value={data.customerId}
          onChange={(e) => {
            const customer = customers.find((c) => c.id === e.target.value);
            const address = customer?.address;
            const addressStr = typeof address === "object" ? JSON.stringify(address) : address || "";
            onChange({
              ...data,
              customerId: e.target.value,
              customerName: customer?.name || "",
              customerEmail: customer?.email || "",
              customerPhone: customer?.phone || "",
              customerAddress: addressStr,
              latitude: customer?.latitude?.toString() || "",
              longitude: customer?.longitude?.toString() || "",
            });
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.email ? `- ${c.email}` : ""} {c.phone ? `(${c.phone})` : ""}
            </option>
          ))}
        </select>
      </div>

      {data.customerId && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Building2 size={16} className="text-blue-600" />
            <span className="font-semibold text-slate-800">{data.customerName}</span>
          </div>
          {data.customerEmail && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail size={14} /> {data.customerEmail}
            </div>
          )}
          {data.customerPhone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={14} /> {data.customerPhone}
            </div>
          )}
          {data.customerAddress && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={14} /> {data.customerAddress}
            </div>
          )}
        </div>
      )}

      {/* Address Search - replaces manual lat/lng */}
      <div className="border-t border-slate-200 pt-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <MapPin size={14} className="text-blue-500" /> Customer Address / Location
        </label>
        <p className="text-xs text-slate-400 mb-2">
          Search for an address. Latitude & Longitude will be fetched automatically.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 651 Sector A, Mahalaxmi Nagar, Indore"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectAddress(r)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 border-b border-slate-100 last:border-0"
                  >
                    <MapPin size={12} className="inline text-slate-400 mr-1.5" />
                    {r.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleAddressSearch(searchQuery)}
            disabled={searching || searchQuery.length < 5}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
        </div>
      </div>

      {/* Auto-filled Coordinates */}
      {data.latitude && data.longitude && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Check size={16} /> Location Coordinates (Auto-detected)
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500">Latitude</label>
              <p className="text-sm font-mono text-slate-800">{data.latitude}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500">Longitude</label>
              <p className="text-sm font-mono text-slate-800">{data.longitude}</p>
            </div>
          </div>
          {/* Map Preview using OpenStreetMap */}
          <div className="mt-2 rounded-lg overflow-hidden border border-emerald-200 h-40">
            <iframe
              title="Map Preview"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${data.longitude},${data.latitude},${data.longitude},${data.latitude}&layer=mapnik&marker=${data.latitude},${data.longitude}`}
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
          <a
            href={`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}#map=15/${data.latitude}/${data.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
          >
            <ExternalLink size={12} /> Open in OpenStreetMap
          </a>
        </div>
      )}
    </div>
  );
}

// =====================================================
// SECTION 4: Sales Order
// =====================================================
function OrderSection({ data, onChange, orders }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <ShoppingCart size={14} className="text-blue-500" /> Link Sales Order
        </label>
        <select
          value={data.orderId}
          onChange={(e) => {
            const order = orders.find((o) => o.id === e.target.value);
            onChange({
              ...data,
              orderId: e.target.value,
              orderNumber: order?.orderNumber || "",
              orderStatus: order?.status || "",
              orderTotal: order?.totalAmount || 0,
              orderItems: order?.items || [],
            });
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">No Order Linked</option>
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.orderNumber} - {o.customer?.name || o.customerName || "N/A"} - ${o.totalAmount || 0}
            </option>
          ))}
        </select>
      </div>

      {data.orderId && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">{data.orderNumber}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              {data.orderStatus}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <DollarSign size={14} /> Total: ${Number(data.orderTotal).toLocaleString()}
          </div>
          {data.orderItems?.length > 0 && (
            <div className="text-sm text-slate-600">
              <span className="font-medium">{data.orderItems.length}</span> item(s) in order
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =====================================================
// SECTION 5: Products
// =====================================================
function ProductsSection({ data, onChange }) {
  const addProduct = () => {
    const products = [...(data.products || [])];
    products.push({ name: "", quantity: 1, sku: "", batch: "", notes: "" });
    onChange({ ...data, products });
  };

  const removeProduct = (index) => {
    const products = [...(data.products || [])];
    products.splice(index, 1);
    onChange({ ...data, products });
  };

  const updateProduct = (index, field, value) => {
    const products = [...(data.products || [])];
    products[index] = { ...products[index], [field]: value };
    onChange({ ...data, products });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Package size={14} className="text-blue-500" /> Products / Items
        </label>
        <button
          type="button"
          onClick={addProduct}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {(data.products || []).length === 0 && (
        <div className="text-center py-6 text-slate-400 text-sm">
          <Package size={32} className="mx-auto mb-2 text-slate-300" />
          No products added. Click "Add Product" to include items.
        </div>
      )}

      {(data.products || []).map((product, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 relative"
        >
          <button
            type="button"
            onClick={() => removeProduct(index)}
            className="absolute top-3 right-3 h-6 w-6 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition"
          >
            <Minus size={12} className="text-red-500" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Product Name</label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => updateProduct(index, "name", e.target.value)}
                placeholder="Product name"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => updateProduct(index, "quantity", parseInt(e.target.value) || 1)}
                min="1"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">SKU</label>
              <input
                type="text"
                value={product.sku}
                onChange={(e) => updateProduct(index, "sku", e.target.value)}
                placeholder="SKU code"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Batch Number</label>
              <input
                type="text"
                value={product.batch}
                onChange={(e) => updateProduct(index, "batch", e.target.value)}
                placeholder="Batch/Lot"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Notes</label>
            <input
              type="text"
              value={product.notes}
              onChange={(e) => updateProduct(index, "notes", e.target.value)}
              placeholder="Additional notes for this product"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// SECTION 6: Route Assignment
// =====================================================
function RouteSection({ data, onChange, beatPlans }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <Route size={14} className="text-blue-500" /> Beat Plan
        </label>
        <select
          value={data.beatPlanId}
          onChange={(e) => {
            const plan = beatPlans.find((b) => b.id === e.target.value);
            onChange({
              ...data,
              beatPlanId: e.target.value,
              beatPlanTitle: plan?.title || "",
            });
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">No Beat Plan</option>
          {beatPlans.map((bp) => (
            <option key={bp.id} value={bp.id}>
              {bp.title} - {dayjs(bp.startDate).format("MMM D")} to {dayjs(bp.endDate).format("MMM D, YYYY")}
            </option>
          ))}
        </select>
      </div>

      {data.beatPlanId && (
        <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
            <Map size={16} className="text-indigo-600" /> {data.beatPlanTitle}
          </div>
          <p className="text-xs text-slate-500">Route will be optimized based on the assigned beat plan and customer locations.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Globe size={14} /> Start Location
          </label>
          <input
            type="text"
            value={data.startLocation}
            onChange={(e) => onChange({ ...data, startLocation: e.target.value })}
            placeholder="Office, Branch, Home"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Navigation size={14} /> Travel Mode
          </label>
          <select
            value={data.travelMode}
            onChange={(e) => onChange({ ...data, travelMode: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="DRIVING">Driving</option>
            <option value="WALKING">Walking</option>
            <option value="BICYCLING">Bicycling</option>
            <option value="TRANSIT">Transit</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SECTION 7: Visit Configuration
// =====================================================
function VisitSection({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <ClipboardCheck size={14} className="text-blue-500" /> Visit Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VISIT_TYPES.map((vt) => {
            const isActive = data.visitType === vt;
            return (
              <button
                key={vt}
                type="button"
                onClick={() => onChange({ ...data, visitType: vt })}
                className={`px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {vt.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Clock size={14} /> Scheduled Start
          </label>
          <input
            type="datetime-local"
            value={data.visitStartTime}
            onChange={(e) => onChange({ ...data, visitStartTime: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Clock size={14} /> Scheduled End
          </label>
          <input
            type="datetime-local"
            value={data.visitEndTime}
            onChange={(e) => onChange({ ...data, visitEndTime: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <Clock size={14} /> Expected Duration (minutes)
        </label>
        <input
          type="number"
          value={data.visitDuration}
          onChange={(e) => onChange({ ...data, visitDuration: parseInt(e.target.value) || 30 })}
          min="5"
          max="480"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>
  );
}

// =====================================================
// SECTION 8: Execution Requirements
// =====================================================
function RequirementsSection({ data, onChange }) {
  const toggle = (key) => {
    onChange({ ...data, [key]: !data[key] });
  };

  const requirements = [
    { key: "requireGps", label: "GPS Tracking", icon: MapPin, desc: "Require real-time GPS tracking during execution" },
    { key: "requirePhoto", label: "Photo Capture", icon: Camera, desc: "Require photo evidence at location" },
    { key: "requireSignature", label: "Digital Signature", icon: FileSignature, desc: "Require customer digital signature" },
    { key: "requireVisitNotes", label: "Visit Notes", icon: FileText, desc: "Require detailed visit notes" },
    { key: "requireInvoice", label: "Generate Invoice", icon: DollarSign, desc: "Generate invoice upon completion" },
    { key: "requirePayment", label: "Payment Collection", icon: DollarSign, desc: "Collect payment during visit" },
    { key: "requireCheckIn", label: "Geo Check-In", icon: Map, desc: "Require geo-verified check-in at customer location" },
    { key: "requireCheckOut", label: "Geo Check-Out", icon: Map, desc: "Require geo-verified check-out" },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">Toggle the requirements that must be fulfilled during mission execution.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {requirements.map((req) => {
          const Icon = req.icon;
          const isOn = data[req.key];
          return (
            <button
              key={req.key}
              type="button"
              onClick={() => toggle(req.key)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                isOn
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isOn ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isOn ? "text-blue-700" : "text-slate-700"}`}>
                  {req.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{req.desc}</p>
              </div>
              <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                isOn ? "bg-blue-600" : "bg-slate-200"
              }`}>
                {isOn && <Check size={12} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================
// SECTION 9: Instructions
// =====================================================
function InstructionsSection({ data, onChange }) {
  const addInstruction = () => {
    const instructions = [...(data.instructions || [])];
    instructions.push({ text: "", type: "NOTE" });
    onChange({ ...data, instructions });
  };

  const removeInstruction = (index) => {
    const instructions = [...(data.instructions || [])];
    instructions.splice(index, 1);
    onChange({ ...data, instructions });
  };

  const updateInstruction = (index, field, value) => {
    const instructions = [...(data.instructions || [])];
    instructions[index] = { ...instructions[index], [field]: value };
    onChange({ ...data, instructions });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <BookOpen size={14} className="text-blue-500" /> Mission Instructions
        </label>
        <button
          type="button"
          onClick={addInstruction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
        >
          <Plus size={14} /> Add Step
        </button>
      </div>

      {(data.instructions || []).length === 0 && (
        <div className="text-center py-6 text-slate-400 text-sm">
          <BookOpen size={32} className="mx-auto mb-2 text-slate-300" />
          No instructions added. Add step-by-step instructions for the executive.
        </div>
      )}

      {(data.instructions || []).map((inst, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="h-7 w-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
            {index + 1}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <select
                value={inst.type}
                onChange={(e) => updateInstruction(index, "type", e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500"
              >
                <option value="NOTE">Note</option>
                <option value="WARNING">Warning</option>
                <option value="ACTION">Action Required</option>
                <option value="INFO">Information</option>
              </select>
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition"
              >
                <X size={12} className="text-red-500" />
              </button>
            </div>
            <textarea
              value={inst.text}
              onChange={(e) => updateInstruction(index, "text", e.target.value)}
              rows={2}
              placeholder="Instruction details..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
            />
          </div>
        </div>
      ))}

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <Link size={14} /> Attachment Links (comma separated)
        </label>
        <input
          type="text"
          value={data.attachmentLinks}
          onChange={(e) => onChange({ ...data, attachmentLinks: e.target.value })}
          placeholder="https://docs.google.com/..., https://drive.google.com/..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>
  );
}

// =====================================================
// SECTION 10: Summary
// =====================================================
function SummarySection({ data, executives, customers, orders, beatPlans }) {
  const executive = executives.find((e) => e.id === data.assignedToId);
  const customer = customers.find((c) => c.id === data.customerId);
  const order = orders.find((o) => o.id === data.orderId);
  const beatPlan = beatPlans.find((b) => b.id === data.beatPlanId);
  const category = TASK_CATEGORIES.find((c) => c.value === data.category);

  const summaryItems = [
    {
      label: "Task Information",
      icon: Info,
      items: [
        { label: "Category", value: category?.label || data.category || "Not set" },
        { label: "Title", value: data.title || "Not set" },
        { label: "Priority", value: data.priority || "MEDIUM" },
        { label: "Has Description", value: data.description ? "Yes" : "No" },
      ],
    },
    {
      label: "Assignment",
      icon: User,
      items: [
        { label: "Executive", value: executive ? `${executive.firstName} ${executive.lastName}` : "Not set" },
        { label: "Due Date", value: data.dueDate ? dayjs(data.dueDate).format("MMM D, YYYY") : "Not set" },
        { label: "Due Time", value: data.dueTime || "Not set" },
      ],
    },
    {
      label: "Customer",
      icon: Building2,
      items: [
        { label: "Customer", value: customer?.name || data.customerName || "Not set" },
        { label: "Coordinates", value: data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : "Not set" },
      ],
    },
    {
      label: "Sales Order",
      icon: ShoppingCart,
      show: !!data.orderId,
      items: [
        { label: "Order", value: data.orderNumber || "Not set" },
        { label: "Total", value: data.orderTotal ? `$${Number(data.orderTotal).toLocaleString()}` : "N/A" },
      ],
    },
    {
      label: "Products",
      icon: Package,
      show: (data.products || []).length > 0,
      items: [
        { label: "Items", value: `${(data.products || []).length} product(s)` },
      ],
    },
    {
      label: "Route",
      icon: Route,
      show: !!data.beatPlanId,
      items: [
        { label: "Beat Plan", value: beatPlan?.title || data.beatPlanTitle || "Not set" },
        { label: "Start Location", value: data.startLocation || "Not set" },
        { label: "Travel Mode", value: data.travelMode || "Driving" },
      ],
    },
    {
      label: "Visit",
      icon: ClipboardCheck,
      items: [
        { label: "Type", value: data.visitType || "Not set" },
        { label: "Duration", value: data.visitDuration ? `${data.visitDuration} min` : "30 min" },
      ],
    },
    {
      label: "Requirements",
      icon: Settings,
      items: [
        { label: "GPS Required", value: data.requireGps ? "Yes" : "No" },
        { label: "Photo Required", value: data.requirePhoto ? "Yes" : "No" },
        { label: "Signature Required", value: data.requireSignature ? "Yes" : "No" },
        { label: "Payment Required", value: data.requirePayment ? "Yes" : "No" },
      ],
    },
    {
      label: "Instructions",
      icon: BookOpen,
      show: (data.instructions || []).length > 0,
      items: [
        { label: "Steps", value: `${(data.instructions || []).length} instruction(s)` },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
          <Check size={16} />
          Review all details before assigning the field mission.
        </div>
      </div>

      <div className="space-y-4">
        {summaryItems.map((section) => {
          if (section.show === false) return null;
          const Icon = section.icon;
          return (
            <div key={section.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-blue-600" />
                <h4 className="text-sm font-semibold text-slate-800">{section.label}</h4>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{item.label}:</span>
                    <span className="font-medium text-slate-800 truncate ml-2">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function AssignTaskModal({
  isOpen,
  onClose,
  executives = [],
  onSuccess,
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [beatPlans, setBeatPlans] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    // Section 1: Task Info
    category: "FIELD_VISIT",
    title: "",
    description: "",
    priority: "MEDIUM",
    // Section 2: Assignment
    assignedToId: "",
    territoryId: "",
    dueDate: "",
    dueTime: "",
    referenceType: "",
    // Section 3: Customer
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    latitude: "",
    longitude: "",
    // Section 4: Order
    orderId: "",
    orderNumber: "",
    orderStatus: "",
    orderTotal: 0,
    orderItems: [],
    // Section 5: Products
    products: [],
    // Section 6: Route
    beatPlanId: "",
    beatPlanTitle: "",
    startLocation: "",
    travelMode: "DRIVING",
    // Section 7: Visit
    visitType: "MEETING",
    visitStartTime: "",
    visitEndTime: "",
    visitDuration: 30,
    // Section 8: Requirements
    requireGps: true,
    requirePhoto: false,
    requireSignature: false,
    requireVisitNotes: true,
    requireInvoice: false,
    requirePayment: false,
    requireCheckIn: true,
    requireCheckOut: false,
    // Section 9: Instructions
    instructions: [],
    attachmentLinks: "",
  });

  const extractArray = (resp, arrayKey) => {
    // Handle multiple response formats robustly
    if (!resp) return [];
    // If it's already an array, return it
    if (Array.isArray(resp)) return resp;
    // Backend controllers call successResponse(res, dataObj, messageStr)
    // which maps params as: message=dataObj, data=messageStr (swapped)
    // So the actual payload is in resp.message[arrayKey]
    if (resp.message && Array.isArray(resp.message[arrayKey])) return resp.message[arrayKey];
    // Standard format: resp.data[arrayKey]
    if (resp.data && Array.isArray(resp.data[arrayKey])) return resp.data[arrayKey];
    // Fallback: resp[arrayKey]
    if (Array.isArray(resp[arrayKey])) return resp[arrayKey];
    // Last resort: check if data itself is the array key
    if (resp.data && Array.isArray(resp.data)) return resp.data;
    return [];
  };

  const loadReferenceData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [ordersRes, customersRes, beatPlansRes] = await Promise.allSettled([
        salesApi.listOrders({ take: 100 }),
        customerApi.list({ take: 200 }),
        fieldForceApi.listBeatPlans({ take: 50 }),
      ]);

      if (ordersRes.status === "fulfilled") {
        const resp = ordersRes.value?.data;
        setOrders(extractArray(resp, "orders"));
      }
      if (customersRes.status === "fulfilled") {
        const resp = customersRes.value?.data;
        setCustomers(extractArray(resp, "customers"));
      }
      if (beatPlansRes.status === "fulfilled") {
        const resp = beatPlansRes.value?.data;
        setBeatPlans(extractArray(resp, "plans"));
      }
    } catch (err) {
      console.error("Failed to load reference data:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadReferenceData();
    }
  }, [isOpen, loadReferenceData]);

  const totalSections = SECTIONS.length;

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignedToId || !formData.title.trim()) {
      toast.error("Executive and Title are required.");
      setCurrentSection(0);
      return;
    }

    try {
      setSubmitting(true);

      const dueDateValue = formData.dueDate
        ? formData.dueTime
          ? new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString()
          : new Date(formData.dueDate).toISOString()
        : undefined;

      const metadata = {
        category: formData.category,
        customer: formData.customerId
          ? {
              id: formData.customerId,
              name: formData.customerName,
              email: formData.customerEmail,
              phone: formData.customerPhone,
              address: formData.customerAddress,
              lat: formData.latitude ? parseFloat(formData.latitude) : undefined,
              lng: formData.longitude ? parseFloat(formData.longitude) : undefined,
            }
          : undefined,
        order: formData.orderId
          ? {
              id: formData.orderId,
              orderNumber: formData.orderNumber,
              status: formData.orderStatus,
              total: formData.orderTotal,
            }
          : undefined,
        products: formData.products?.length > 0 ? formData.products : undefined,
        route: formData.beatPlanId
          ? {
              beatPlanId: formData.beatPlanId,
              beatPlanTitle: formData.beatPlanTitle,
              startLocation: formData.startLocation,
              travelMode: formData.travelMode,
            }
          : undefined,
        visit: {
          type: formData.visitType,
          scheduledStart: formData.visitStartTime || undefined,
          scheduledEnd: formData.visitEndTime || undefined,
          duration: formData.visitDuration,
        },
        requirements: {
          gps: formData.requireGps,
          photo: formData.requirePhoto,
          signature: formData.requireSignature,
          visitNotes: formData.requireVisitNotes,
          invoice: formData.requireInvoice,
          payment: formData.requirePayment,
          checkIn: formData.requireCheckIn,
          checkOut: formData.requireCheckOut,
        },
        instructions: formData.instructions?.length > 0 ? formData.instructions : undefined,
        attachmentLinks: formData.attachmentLinks || undefined,
        territoryId: formData.territoryId || undefined,
      };

      const payload = {
        assignedToId: formData.assignedToId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        dueDate: dueDateValue,
        referenceType: formData.referenceType || undefined,
        referenceId: formData.customerId || formData.orderId || undefined,
        metadata,
      };

      await fieldForceApi.createTask(payload);
      toast.success("Field mission assigned successfully!");
      onSuccess?.();
      onClose();
      setFormData({
        category: "FIELD_VISIT",
        title: "",
        description: "",
        priority: "MEDIUM",
        assignedToId: "",
        territoryId: "",
        dueDate: "",
        dueTime: "",
        referenceType: "",
        customerId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        latitude: "",
        longitude: "",
        orderId: "",
        orderNumber: "",
        orderStatus: "",
        orderTotal: 0,
        orderItems: [],
        products: [],
        beatPlanId: "",
        beatPlanTitle: "",
        startLocation: "",
        travelMode: "DRIVING",
        visitType: "MEETING",
        visitStartTime: "",
        visitEndTime: "",
        visitDuration: 30,
        requireGps: true,
        requirePhoto: false,
        requireSignature: false,
        requireVisitNotes: true,
        requireInvoice: false,
        requirePayment: false,
        requireCheckIn: true,
        requireCheckOut: false,
        instructions: [],
        attachmentLinks: "",
      });
      setCurrentSection(0);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to assign field mission");
    } finally {
      setSubmitting(false);
    }
  };

  const section = SECTIONS[currentSection];
  const SectionIcon = section.icon;

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <TaskInfoSection data={formData} onChange={setFormData} />;
      case 1:
        return <AssignmentSection data={formData} onChange={setFormData} executives={executives} territories={territories} />;
      case 2:
        return <CustomerSection data={formData} onChange={setFormData} customers={customers} />;
      case 3:
        return <OrderSection data={formData} onChange={setFormData} orders={orders} />;
      case 4:
        return <ProductsSection data={formData} onChange={setFormData} />;
      case 5:
        return <RouteSection data={formData} onChange={setFormData} beatPlans={beatPlans} />;
      case 6:
        return <VisitSection data={formData} onChange={setFormData} />;
      case 7:
        return <RequirementsSection data={formData} onChange={setFormData} />;
      case 8:
        return <InstructionsSection data={formData} onChange={setFormData} />;
      case 9:
        return (
          <SummarySection
            data={formData}
            executives={executives}
            customers={customers}
            orders={orders}
            beatPlans={beatPlans}
          />
        );
      default:
        return null;
    }
  };

  const isLastSection = currentSection === totalSections - 1;
  const isFirstSection = currentSection === 0;
  const canProceed = () => {
    if (currentSection === 0) return formData.title.trim().length > 0;
    if (currentSection === 1) return formData.assignedToId.length > 0;
    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Target size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Assign Field Mission</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Section {currentSection + 1} of {totalSections} - {section.label}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <div className="flex gap-1">
                {SECTIONS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSection(i)}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i === currentSection
                        ? "bg-blue-600"
                        : i < currentSection
                        ? "bg-blue-400"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
                {SECTIONS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSection(i)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                      i === currentSection
                        ? "bg-blue-100 text-blue-700"
                        : i < currentSection
                        ? "text-blue-500"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {i < currentSection ? <Check size={10} /> : <s.icon size={10} />}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                  <span className="ml-3 text-sm text-slate-500">Loading reference data...</span>
                </div>
              ) : (
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderSection()}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200">
              <button
                type="button"
                onClick={isFirstSection ? onClose : handlePrev}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
              >
                <ChevronLeft size={16} />
                {isFirstSection ? "Cancel" : "Previous"}
              </button>

              <div className="flex items-center gap-3">
                {!isLastSection ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {submitting ? "Assigning..." : "Assign Mission"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
