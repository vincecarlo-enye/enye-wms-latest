import React, { useState, useMemo } from "react";
import categories from "../assets/js/Categories.json";
import StockDataJSON from "../assets/js/StockItems.json";
import { useNavigate } from "react-router-dom";
import { useWarehouse } from "../context/WarehouseContext";
import { Edit3, Eye, Trash2 } from "lucide-react";
import AddProduct from "./AddProducts";

const ITEMS_PER_PAGE = 5;

const StockItems = () => {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const titleColor  = isCebu ? "text-purple-600"                            : "text-orange-600";
  const headerBg    = isCebu ? "bg-purple-600"                              : "bg-orange-600";
  const hoverRow    = isCebu ? "hover:bg-purple-50"                         : "hover:bg-orange-50";
  const hoverCard   = isCebu ? "hover:bg-purple-50"                         : "hover:bg-orange-50";
  const tabActive   = isCebu ? "text-purple-600"                            : "text-orange-600";
  const tabBar      = isCebu ? "bg-purple-600"                              : "bg-orange-600";
  const tabHover    = isCebu ? "hover:text-purple-600"                      : "hover:text-orange-600";
  const searchFocus = isCebu
    ? "border-purple-300 focus:ring-purple-500 focus:border-purple-500"
    : "border-orange-300 focus:ring-orange-500 focus:border-orange-500";
  const pgBorder    = isCebu ? "border-purple-300 hover:bg-purple-100"      : "border-orange-300 hover:bg-orange-100";
  const pgActive    = isCebu ? "bg-purple-600 text-white border-purple-600" : "bg-orange-600 text-white border-orange-600";
  const editIcon    = isCebu ? "hover:text-purple-600"                      : "hover:text-orange-600";

  const menuItems = useMemo(() => categories.map((cat) => cat.name), []);
  const [activeMenu, setActiveMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const [stockItems, setStockItems] = useState({ main: StockDataJSON, cebu: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStock = useMemo(() => {
    let data = stockItems[currentWarehouse];
    if (activeMenu) data = data.filter((item) => item.category === activeMenu);
    if (search)
      data = data.filter(
        (item) =>
          item.modelName.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.manufacturer.toLowerCase().includes(search.toLowerCase())
      );
    return data;
  }, [activeMenu, search, stockItems, currentWarehouse]);

  const totalPages = Math.ceil(filteredStock.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredStock.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddProduct = (newProduct) => {
    const warehouseStock = stockItems[currentWarehouse];
    const id = warehouseStock.length ? Math.max(...warehouseStock.map((p) => p.id)) + 1 : 1;
    const totalBuyingPrice = newProduct.buyingPrice * newProduct.quantity;
    setStockItems((prev) => ({
      ...prev,
      [currentWarehouse]: [...prev[currentWarehouse], { ...newProduct, id, totalBuyingPrice }],
    }));
    setIsModalOpen(false);
    setCurrentPage(totalPages);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <h1 className={`text-3xl font-bold ${titleColor}`}>
          {isCebu ? "Cebu Items" : "Stock Items"}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/OutOfStock")}
            className="bg-red-600 text-white px-4 py-2 border border-red-600 hover:bg-transparent hover:text-red-600 transition"
          >
            Out of Stock List
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 border border-green-600 hover:bg-transparent hover:text-green-600 transition"
          >
            Add Products
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {menuItems.map((item) => {
          const isActive = activeMenu === item;
          return (
            <button
              key={item}
              onClick={() => setActiveMenu(isActive ? null : item)}
              className={`relative px-4 py-2 font-medium text-gray-600 cursor-pointer group
                ${isActive ? tabActive : tabHover}`}
            >
              {item}
              <span
                className={`absolute left-0 bottom-0 h-0.5 ${tabBar} transition-all duration-300
                  ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
              />
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition w-full md:w-64 ${searchFocus}`}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border border-gray-200">
          <thead className={`${headerBg} text-white`}>
            <tr>
              {["ID", "Model Name", "Description", "Quantity", "Manufacturer", "Buying Price", "Total Price", "Actions"].map((col) => (
                <th key={col} className={`px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider ${col === "Actions" ? "text-center" : ""}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className={`transition ${hoverRow}`}>
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.modelName}</td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{item.manufacturer}</td>
                  <td className="px-6 py-4">${item.buyingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">${item.totalBuyingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <Edit3 size={18} className={`text-gray-500 ${editIcon} cursor-pointer transition`} />
                    <Eye size={18} className="text-gray-500 hover:text-gray-900 cursor-pointer transition" />
                    <Trash2 size={18} className="text-gray-500 hover:text-red-600 cursor-pointer transition" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No stock items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {currentData.length > 0 ? (
          currentData.map((item) => (
            <div key={item.id} className={`bg-white shadow rounded p-4 transition ${hoverCard}`}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Model:</span> {item.modelName}
              </div>
              <div className="mb-1"><span className="font-semibold">Description:</span> {item.description}</div>
              <div className="mb-1"><span className="font-semibold">Quantity:</span> {item.quantity}</div>
              <div className="mb-1"><span className="font-semibold">Manufacturer:</span> {item.manufacturer}</div>
              <div className="mb-1"><span className="font-semibold">Buying Price:</span> ${item.buyingPrice.toFixed(2)}</div>
              <div className="mb-2"><span className="font-semibold">Total Price:</span> ${item.totalBuyingPrice.toFixed(2)}</div>
              <div className="flex gap-3 justify-end">
                <Edit3 size={18} className={`text-gray-500 ${editIcon} cursor-pointer transition`} />
                <Eye size={18} className="text-gray-500 hover:text-gray-900 cursor-pointer transition" />
                <Trash2 size={18} className="text-gray-500 hover:text-red-600 cursor-pointer transition" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">No stock items found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 ${pgBorder}`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  currentPage === page ? pgActive : pgBorder
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 ${pgBorder}`}
          >
            Next
          </button>
        </div>
      )}

      <AddProduct
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
        warehouse={currentWarehouse}
      />
    </div>
  );
};

export default StockItems;