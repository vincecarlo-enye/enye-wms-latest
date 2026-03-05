import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProduct from "./AddProducts";
import AddRestockItems from "./AddRestockItems";
import { useWarehouse } from "../context/WarehouseContext";
import {
  User,
  Package,
  TrendingUp,
  CornerDownLeft,
  Bookmark,
  MapPin,
  Truck,
  Barcode,
  Search,
  FileText,
} from "lucide-react";

export default function WarehouseDashboard() {
  const [barcode, setBarcode] = useState("");
  const navigate = useNavigate();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddRestockItems, setShowAddRestockItems] = useState(false);
  const { currentWarehouse, toggleWarehouse } = useWarehouse();

  const isCebu = currentWarehouse === "cebu";

  const warehouseData = {
    main: {
      title: "Main Warehouse",
      stats: [
        { label: "Users",             value: "106",    color: "from-red-500 to-red-600",      icon: User,          path: "/UserManagement" },
        { label: "Products",          value: "2,602",  color: "from-cyan-500 to-cyan-600",    icon: Package,       path: "/StockItems" },
        { label: "Out of Stock",      value: "1,663",  color: "from-orange-500 to-orange-600",icon: FileText,      path: "/OutOfStock" },
        { label: "Restock",           value: "10,177", color: "from-green-500 to-green-600",  icon: TrendingUp,    path: "/RestockedItems" },
        { label: "Delivered",         value: "5,310",  color: "from-purple-500 to-purple-600",icon: Truck,         path: "/Deliver" },
        { label: "Borrowed/Returned", value: "3,196",  color: "from-emerald-500 to-emerald-600", icon: CornerDownLeft, path: "/BorrowList" },
        { label: "Reserved",          value: "222",    color: "from-amber-500 to-amber-600",  icon: Bookmark,      path: "/ReserveList" },
      ],
    },
    cebu: {
      title: "Cebu Warehouse",
      stats: [
        { label: "Users",             value: "0", color: "from-red-500 to-red-600",      icon: User,          path: "/UserManagement" },
        { label: "Products",          value: "0", color: "from-cyan-500 to-cyan-600",    icon: Package,       path: "/StockItems" },
        { label: "Out of Stock",      value: "0", color: "from-orange-500 to-orange-600",icon: FileText,      path: "/OutOfStock" },
        { label: "Restock",           value: "0", color: "from-green-500 to-green-600",  icon: TrendingUp,    path: "/RestockedItems" },
        { label: "Delivered",         value: "0", color: "from-purple-500 to-purple-600",icon: Truck,         path: "/Deliver" },
        { label: "Borrowed/Returned", value: "0", color: "from-emerald-500 to-emerald-600", icon: CornerDownLeft, path: "/BorrowList" },
        { label: "Reserved",          value: "0", color: "from-amber-500 to-amber-600",  icon: Bookmark,      path: "/ReserveList" },
      ],
    },
  };

  const visitCard = {
    special: true,
    icon: MapPin,
    color: "from-pink-500 to-pink-600",
    label: isCebu ? "Visit Main Warehouse" : "Visit Cebu Warehouse",
  };

  const stats = [...warehouseData[currentWarehouse].stats, visitCard];

  // Theming
  const focusBorder       = isCebu ? "focus:border-orange-500"  : "focus:border-orange-500";
  const activityIconBg    = isCebu ? "bg-orange-100"            : "bg-orange-100";
  const activityIconColor = isCebu ? "text-orange-600"          : "text-orange-600";
  const qa4Color          = isCebu ? "from-orange-500 to-orange-600" : "from-orange-500 to-orange-600";

  return (
    <main className="flex-1 p-6 bg-gray-100">

      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {warehouseData[currentWarehouse].title} Dashboard
        </h2>
        <p className="text-sm text-gray-500">Admin Control Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-linear-to-br ${stat.color} text-white rounded-lg shadow-lg hover:scale-105 transition-transform relative flex flex-col overflow-hidden`}
            >
              <div className="absolute top-0 right-0 opacity-10">
                <Icon size={120} />
              </div>
              <div className="relative z-10 flex flex-col flex-1 p-4">
                {stat.special ? (
                  <>
                    <h3 className="text-3xl font-bold mb-2">Visit</h3>
                    <p className="text-lg mb-2">{stat.label}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                    <p className="text-lg mb-2">{stat.label}</p>
                  </>
                )}
                <button
                  onClick={() => stat.special ? toggleWarehouse() : navigate(stat.path)}
                  className="mt-auto w-full text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm py-1 rounded cursor-pointer transition"
                >
                  More info →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barcode Scanner */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Barcode size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Barcode Scanner</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Scan your item"
            className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg ${focusBorder} focus:outline-none pr-12`}
          />
          <Search className="absolute right-4 top-3.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activities</h3>
          <div className="space-y-3">
            {[
              { text: "Product restocked",      time: "2 minutes ago" },
              { text: "New order received",     time: "15 minutes ago" },
              { text: "Stock request approved", time: "1 hour ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className={`w-10 h-10 ${activityIconBg} rounded-full flex items-center justify-center`}>
                  <Package size={20} className={activityIconColor} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">

            {/* Add Product — passes currentWarehouse as prop */}
            <button
              onClick={() => setShowAddProductModal(true)}
              className="p-4 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:scale-105 cursor-pointer transition"
            >
              <Package className="mx-auto mb-2" size={24} />
              <span className="text-sm">Add Product</span>
            </button>

            {/* Restock Item — RestockedItems reads context internally */}
            <button
              onClick={() => setShowAddRestockItems(true)}
              className="p-4 bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg hover:scale-105 cursor-pointer transition"
            >
              <TrendingUp className="mx-auto mb-2" size={24} />
              <span className="text-sm">Restock Item</span>
            </button>

            {/* Process Order — Deliver reads context internally */}
            <button
              onClick={() => navigate("/Deliver")}
              className="p-4 bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:scale-105 cursor-pointer transition"
            >
              <Truck className="mx-auto mb-2" size={24} />
              <span className="text-sm">Process Order</span>
            </button>

            {/* Create PRF — CreatePRF reads context internally */}
            <button
              onClick={() => navigate("/CreatePRF")}
              className={`p-4 bg-linear-to-br ${qa4Color} text-white rounded-lg hover:scale-105 cursor-pointer transition`}
            >
              <FileText className="mx-auto mb-2" size={24} />
              <span className="text-sm">Create PRF</span>
            </button>

          </div>
        </div>
      </div>

      {/* AddProduct receives currentWarehouse so it shows "Add Product for Main/Cebu" */}
      <AddProduct
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        warehouse={currentWarehouse}
      />

      {/* AddRestockItems — reads currentWarehouse from context internally */}
      <AddRestockItems
        isOpen={showAddRestockItems}
        onClose={() => setShowAddRestockItems(false)}
      />
    </main>
  );
}