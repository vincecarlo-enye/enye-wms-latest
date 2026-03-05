import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import categories from "../assets/js/Categories.json";
import StockData from "../assets/js/StockItems.json";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";

const ITEMS_PER_PAGE = 5;

const OutOfStock = () => {
  const navigate = useNavigate();
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const primaryText      = isCebu ? "text-purple-600"        : "text-orange-600";
  const primaryBg        = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const primaryBorder    = isCebu ? "border-purple-600"      : "border-orange-600";
  const hoverPrimaryText = isCebu ? "hover:text-purple-600"  : "hover:text-orange-600";
  const tableHeaderBg    = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const hoverRowBg       = isCebu ? "hover:bg-purple-50"     : "hover:bg-orange-50";
  const tabActive        = isCebu ? "text-purple-600"        : "text-orange-600";
  const tabHover         = isCebu ? "hover:text-purple-600"  : "hover:text-orange-600";
  const tabUnderline     = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const searchBorder     = isCebu ? "border-purple-300"      : "border-orange-300";
  const focusRing        = isCebu ? "focus:ring-purple-500 focus:border-purple-500" : "focus:ring-orange-500 focus:border-orange-500";
  const paginationBorder = isCebu ? "border-purple-300 hover:bg-purple-100" : "border-orange-300 hover:bg-orange-100";
  const paginationActive = isCebu ? "bg-purple-600 text-white border-purple-600" : "bg-orange-600 text-white border-orange-600";

  const menuItems = useMemo(() => categories.map((cat) => cat.name), []);
  const [activeMenu, setActiveMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStock = useMemo(() => {
    let data = StockData.filter(item => item.quantity === 0);
    if (activeMenu) data = data.filter(item => item.category === activeMenu);
    if (search) data = data.filter(item =>
      item.modelName.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(search.toLowerCase())
    );
    return data;
  }, [activeMenu, search]);

  const totalPages = Math.ceil(filteredStock.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredStock.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <h1 className={`text-3xl font-bold ${primaryText}`}>Out of Stock Items</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/StockItems")}
            className={`${primaryBg} text-white px-4 py-2 border ${primaryBorder}
            hover:bg-transparent ${hoverPrimaryText} cursor-pointer transition`}
          >
            Stocks List
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {menuItems.map(item => {
          const isActive = activeMenu === item;
          return (
            <button
              key={item}
              onClick={() => setActiveMenu(isActive ? null : item)}
              className={`relative px-4 py-2 font-medium text-gray-600 cursor-pointer group
                ${isActive ? tabActive : tabHover}
              `}
            >
              {item}
              <span
                className={`absolute left-0 bottom-0 h-0.5 ${tabUnderline} transition-all duration-300
                  ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                `}
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
          className={`px-4 py-2 border ${searchBorder} rounded-lg focus:outline-none
          focus:ring-2 ${focusRing} transition w-full md:w-64`}
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Table for md+ */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border border-gray-200">
          <thead className={`${tableHeaderBg} text-white`}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Model Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Manufacturer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Buying Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? currentData.map(item => (
              <tr key={item.id} className={`${hoverRowBg} transition`}>
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.modelName}</td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">{item.manufacturer}</td>
                <td className="px-6 py-4">${item.buyingPrice.toFixed(2)}</td>
                <td className="px-6 py-4">${item.totalBuyingPrice.toFixed(2)}</td>
                <td className="px-6 py-4 flex justify-center gap-3">
                  <Edit className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
                  <Eye className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                  <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer" />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No out-of-stock items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {currentData.length > 0 ? currentData.map(item => (
          <div key={item.id} className={`bg-white shadow rounded p-4 ${hoverRowBg} transition`}>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Model:</span> {item.modelName}
            </div>
            <div className="mb-1"><span className="font-semibold">Description:</span> {item.description}</div>
            <div className="mb-1"><span className="font-semibold">Quantity:</span> {item.quantity}</div>
            <div className="mb-1"><span className="font-semibold">Manufacturer:</span> {item.manufacturer}</div>
            <div className="mb-1"><span className="font-semibold">Buying Price:</span> ${item.buyingPrice.toFixed(2)}</div>
            <div className="mb-2"><span className="font-semibold">Total Price:</span> ${item.totalBuyingPrice.toFixed(2)}</div>
            <div className="flex gap-3 justify-end">
              <Edit className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
              <Eye className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
              <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer" />
            </div>
          </div>
        )) : (
          <div className="text-center py-6 text-gray-500">No out-of-stock items found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium border ${paginationBorder} rounded-md disabled:opacity-50`}
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
                  currentPage === page ? paginationActive : paginationBorder
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium border ${paginationBorder} rounded-md disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OutOfStock;