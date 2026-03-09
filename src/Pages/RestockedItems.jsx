import React, { useState, useEffect } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import AddRestockItemModal from "./AddRestockItems";
import { useWarehouse } from "../context/WarehouseContext";
import { RestockService } from "../services/restock.service";

const ITEMS_PER_PAGE = 5;

export default function RestockedItems() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const primaryBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const primaryText = isCebu ? "text-purple-600" : "text-orange-600";
  const primaryBorder = isCebu ? "border-purple-600" : "border-orange-600";
  const hoverRowBg = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const hoverHeaderText = isCebu ? "hover:text-purple-200" : "hover:text-orange-200";
  const focusRing = isCebu
    ? "focus:ring-purple-500 focus:border-purple-500"
    : "focus:ring-orange-500 focus:border-orange-500";
  const cardBorderLeft = isCebu ? "border-purple-600" : "border-orange-600";
  const cardLabelColor = isCebu ? "text-purple-600" : "text-orange-600";
  const paginationActive = isCebu
    ? "bg-purple-600 text-white border-purple-600"
    : "bg-orange-600 text-white border-orange-600";
  const paginationBorder = isCebu
    ? "border-purple-300 hover:bg-purple-100"
    : "border-orange-300 hover:bg-orange-100";
  const addBtnHoverText = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";

  // ── Headers ────────────────────────────────────────────────────────────────
  const headers = [
    { key: "modelName", label: "Model Name" },
    { key: "barcode", label: "Barcode" },
    { key: "buyingPrice", label: "Buying Price" },
    { key: "addedQuantity", label: "Added Qty" },
    { key: "availableStock", label: "Available" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "remarks", label: "Remarks" },
    { key: "restockedBy", label: "Restocked By" },
    { key: "date", label: "Date" },
  ];

  const formatPrice = (val) => {
    const num = Number(val);
    return Number.isNaN(num) ? "N/A" : `$${num.toFixed(2)}`;
  };

  const mapRestockItem = (item) => ({
    id: item.id ?? item.restock_id ?? item.prod_id,
    modelName: item.modelName ?? item.prod_name ?? "-",
    barcode: item.barcode ?? "-",
    buyingPrice: item.buyingPrice ?? item.buy_price ?? 0,
    addedQuantity: item.addedQuantity ?? item.qty ?? item.qty ?? 0,
    availableStock: item.availableStock ?? item.available_stock ?? item.qty ?? 0,
    manufacturer: item.supplier ?? "-",
    remarks: item.remarks ?? "-",
    restockedBy: item.restockedBy ?? item.restocked_by ?? item.user_name ?? "-",
    date: item.date ?? item.created_at ?? "-",
    warehouse: item.warehouse ?? item.branch ?? currentWarehouse,
  });

  const fetchRestocks = async () => {
    try {
      const data = await RestockService.list({
        search,
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
        sortKey: sortConfig.key,
        sortDir: sortConfig.direction,
        warehouse: currentWarehouse,
      });

      const rows = Array.isArray(data?.data) ? data.data : [];
      setItems(rows.map(mapRestockItem));
      setTotalItems(data?.total || 0);
      setLastPage(data?.last_page || 1);
    } catch (err) {
      console.error("Error fetching restocked items:", err);
      setItems([]);
      setTotalItems(0);
      setLastPage(1);
    }
  };

  useEffect(() => {
    fetchRestocks();
  }, [search, currentPage, sortConfig, currentWarehouse]);

  const handleAddItem = async () => {
    setIsModalOpen(false);
    await fetchRestocks();
  };

  const totalPages = lastPage || Math.ceil(totalItems / ITEMS_PER_PAGE);

  const getPagination = () => {
    const pages = [];
    const maxButtons = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${primaryText}`}>
            Restocked Items ({currentWarehouse.toUpperCase()} Warehouse)
          </h2>
          <p className="text-gray-500 text-sm">Manage your restocked inventory</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 ${primaryBg} text-white px-4 py-2 border ${primaryBorder} hover:bg-transparent ${addBtnHoverText} transition w-full md:w-auto`}
        >
          <Plus size={18} /> Restock Item
        </button>
      </div>

      {/* Search */}
      <div className="overflow-x-auto mb-4">
        <div className="flex justify-end">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search model or barcode..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${focusRing} pr-10 transition`}
            />
            <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${primaryBg} text-white`}>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  onClick={() => handleSort(header.key)}
                  className={`px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer ${hoverHeaderText} transition`}
                >
                  {header.label}
                  {sortConfig.key === header.key && (
                    <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={item.id ?? idx} className={`${hoverRowBg} transition`}>
                  {headers.map((header) => (
                    <td key={header.key} className="px-6 py-4 text-gray-700 text-sm">
                      {header.key === "buyingPrice"
                        ? formatPrice(item[header.key])
                        : item[header.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-6 text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4 mt-4">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id ?? idx}
              className={`bg-white shadow rounded p-4 flex flex-col gap-2 border-l-4 ${cardBorderLeft}`}
            >
              {headers.map((header) => (
                <div key={header.key} className="text-sm text-gray-700">
                  <span className={`font-semibold ${cardLabelColor}`}>{header.label}:</span>{" "}
                  {header.key === "buyingPrice"
                    ? formatPrice(item[header.key])
                    : item[header.key] || "-"}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">No items found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-end items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${paginationBorder} disabled:opacity-50`}
          >
            <ChevronLeft size={16} />
          </button>

          {getPagination().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page ? paginationActive : `bg-white ${paginationBorder}`
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${paginationBorder} disabled:opacity-50`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modal */}
      <AddRestockItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
        warehouse={currentWarehouse}
      />
    </div>
  );
}
