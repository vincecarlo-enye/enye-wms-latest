import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";
import { CategoryService } from "../services/category.service";
import { ProductListService, ProductService } from "../services/productslist.service";

const ITEMS_PER_PAGE = 5;

const OutOfStock = () => {
  const navigate = useNavigate();
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const primaryText = isCebu ? "text-purple-600" : "text-orange-600";
  const primaryBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const primaryBorder = isCebu ? "border-purple-600" : "border-orange-600";
  const hoverPrimaryText = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";
  const tableHeaderBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const hoverRowBg = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const tabActive = isCebu ? "text-purple-600" : "text-orange-600";
  const tabHover = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";
  const tabUnderline = isCebu ? "bg-purple-600" : "bg-orange-600";
  const searchBorder = isCebu ? "border-purple-300" : "border-orange-300";
  const focusRing = isCebu
    ? "focus:ring-purple-500 focus:border-purple-500"
    : "focus:ring-orange-500 focus:border-orange-500";
  const paginationBorder = isCebu
    ? "border-purple-300 hover:bg-purple-100"
    : "border-orange-300 hover:bg-orange-100";
  const paginationActive = isCebu
    ? "bg-purple-600 text-white border-purple-600"
    : "bg-orange-600 text-white border-orange-600";

  // ── State ────────────────────────────────────────────────────────────────
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // ── Fetch categories ─────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const data = await CategoryService.list({ page: 1, perPage: 1000 });

      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      const mapped = rows
        .map((item) => item.category ?? item.name ?? item.category_name ?? "")
        .filter(Boolean);

      setMenuItems(mapped);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setMenuItems([]);
    }
  };

  // ── Fetch out-of-stock products ──────────────────────────────────────────
  const fetchOutOfStock = async () => {
    try {
      const data = await ProductListService.outOfStock({
        search,
        category: activeMenu || "",
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
      });

      setOutOfStockItems(data?.data || []);
      setTotalItems(data?.total || 0);
      setLastPage(data?.last_page || 1);
    } catch (err) {
      console.error("Error fetching out-of-stock products:", err);
      setOutOfStockItems([]);
      setTotalItems(0);
      setLastPage(1);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentWarehouse]);

  useEffect(() => {
    fetchOutOfStock();
  }, [activeMenu, search, currentPage, currentWarehouse]);

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = lastPage;

  const getPagination = () => {
    const pages = [];
    const maxButtons = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await ProductService.remove(id);
      await fetchOutOfStock();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <h1 className={`text-3xl font-bold ${primaryText}`}>Out of Stock Items</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/StockItems")}
            className={`${primaryBg} text-white px-4 py-2 border ${primaryBorder} hover:bg-transparent ${hoverPrimaryText} cursor-pointer transition`}
          >
            Stocks List
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {menuItems.map((item) => {
          const isActive = activeMenu === item;

          return (
            <button
              key={item}
              onClick={() => {
                setActiveMenu(isActive ? null : item);
                setCurrentPage(1);
              }}
              className={`relative px-4 py-2 font-medium text-gray-600 cursor-pointer group ${isActive ? tabActive : tabHover}`}
            >
              {item}
              <span
                className={`absolute left-0 bottom-0 h-0.5 ${tabUnderline} transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
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
          className={`px-4 py-2 border ${searchBorder} rounded-lg focus:outline-none focus:ring-2 ${focusRing} transition w-full md:w-64`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
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
            {outOfStockItems.length > 0 ? (
              outOfStockItems.map((item) => (
                <tr key={item.prod_id} className={`${hoverRowBg} transition`}>
                  <td className="px-6 py-4">{item.prod_id}</td>
                  <td className="px-6 py-4">{item.prod_name}</td>
                  <td className="px-6 py-4">{item.prod_desc}</td>
                  <td className="px-6 py-4">{item.qty ?? item.barcode_qty}</td>
                  <td className="px-6 py-4">{item.manufacturer}</td>
                  <td className="px-6 py-4">${Number(item.buy_price || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    ${((Number(item.buy_price || 0)) * Number(item.barcode_qty ?? item.barcode_qty ?? 0)).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <Edit className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
                    <Eye className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                    <Trash2
                      className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() => handleDelete(item.prod_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
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
        {outOfStockItems.length > 0 ? (
          outOfStockItems.map((item) => (
            <div key={item.prod_id} className={`bg-white shadow rounded p-4 ${hoverRowBg} transition`}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Model:</span> {item.prod_name}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Description:</span> {item.prod_desc}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Quantity:</span> {item.qty ?? item.barcode_qty}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Manufacturer:</span> {item.manufacturer}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Buying Price:</span> ${Number(item.buy_price || 0).toFixed(2)}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Total Price:</span> $
                {((Number(item.buy_price || 0)) * Number(item.qty ?? item.barcode_qty ?? 0)).toFixed(2)}
              </div>
              <div className="flex gap-3 justify-end">
                <Edit className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
                <Eye className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <Trash2
                  className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer"
                  onClick={() => handleDelete(item.prod_id)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">No out-of-stock items found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 ${paginationBorder}`}
          >
            Previous
          </button>

          {getPagination().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${
                currentPage === page ? paginationActive : paginationBorder
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 ${paginationBorder}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OutOfStock;
