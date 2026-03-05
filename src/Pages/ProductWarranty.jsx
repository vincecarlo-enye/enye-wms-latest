import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";

// ─── Sample Data ──────────────────────────────────────────────────────────────
const ALL_WARRANTY_DATA = [
  // MAIN
  {
    warehouse: "main",
    modelName: 'A/4"',
    qty: 1,
    barcode: 12170743,
    manufacturer: "ACI",
    warranty: "5 years and 1 month/s",
    warrantyDate: "2023-01-20",
    warrantyStatus: "Expired",
  },
  {
    warehouse: "main",
    modelName: "A/AN-D-8\"-PB",
    qty: 4,
    barcode: 12171808,
    manufacturer: "ACI",
    warranty: "5 years and 1 month/s",
    warrantyDate: "2023-01-20",
    warrantyStatus: "Expired",
  },
  // CEBU
  {
    warehouse: "cebu",
    modelName: "CBU-VALVE-2IN",
    qty: 2,
    barcode: 98000001,
    manufacturer: "CHINA",
    warranty: "2 years",
    warrantyDate: "2024-03-15",
    warrantyStatus: "Active",
  },
  {
    warehouse: "cebu",
    modelName: "CBU-PUMP-X200",
    qty: 1,
    barcode: 98000002,
    manufacturer: "GRUNDFOS",
    warranty: "3 years",
    warrantyDate: "2023-06-01",
    warrantyStatus: "Expired",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductWarranty() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const itemsPerPage = 10;

  // Theming
  const headerBg    = isCebu ? "bg-purple-600"                        : "bg-orange-600";
  const titleColor  = isCebu ? "text-purple-600"                      : "text-gray-800";
  const hoverRow    = isCebu ? "hover:bg-purple-50"                   : "hover:bg-orange-50";
  const labelColor  = isCebu ? "text-purple-600"                      : "text-orange-600";
  const cardBorder  = isCebu ? "border-purple-200 divide-purple-100"    : "border-orange-200 divide-orange-100";
  const pgBorder    = isCebu ? "border-purple-300 hover:bg-purple-100"  : "border-orange-300 hover:bg-orange-100";
  const pgActive    = isCebu ? "bg-purple-600 text-white border-purple-600" : "bg-orange-600 text-white border-orange-600";
  const pgFooter    = isCebu ? "border-purple-200"                    : "border-orange-200";
  const focusBorder = isCebu ? "focus:border-purple-500"              : "focus:border-orange-500";

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortIndicator = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : "";

  // Filter by warehouse first, then search
  const warehouseData = ALL_WARRANTY_DATA.filter((i) => i.warehouse === currentWarehouse);

  const sortedData = warehouseData.slice().sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    return sortConfig.direction === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const filteredData = sortedData.filter((item) =>
    item.modelName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages   = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { key: "modelName",     label: "Model Name" },
    { key: "qty",           label: "Qty" },
    { key: "barcode",       label: "Barcode" },
    { key: "manufacturer",  label: "Manufacturer" },
    { key: "warranty",      label: "Warranty" },
    { key: "warrantyDate",  label: "Warranty Date" },
    { key: "warrantyStatus",label: "Warranty Status" },
  ];

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${titleColor}`}>Product Warranty</h2>
        <p className="text-sm text-gray-500">Manage your product warranties</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search model..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none ${focusBorder} pr-10`}
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-gray-50 p-4">

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${headerBg} text-white font-semibold`}>
              <tr>
                {columns.map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-sm cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort(key)}
                  >
                    {label}{sortIndicator(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index} className={`transition ${hoverRow}`}>
                    <td className="px-6 py-4 text-gray-800">{item.modelName}</td>
                    <td className="px-6 py-4 text-gray-600">{item.qty}</td>
                    <td className="px-6 py-4 text-gray-600">{item.barcode}</td>
                    <td className="px-6 py-4 text-gray-600">{item.manufacturer}</td>
                    <td className="px-6 py-4 text-gray-600">{item.warranty}</td>
                    <td className="px-6 py-4 text-gray-500">{item.warrantyDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.warrantyStatus === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {item.warrantyStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <div key={index} className={`bg-white p-4 rounded-lg shadow-sm border divide-y ${cardBorder}`}>
                {columns.map(({ key, label }) => (
                  <div key={key} className="flex justify-between py-1">
                    <span className={`font-semibold ${labelColor}`}>{label}:</span>
                    <span className="text-gray-800">
                      {key === "warrantyStatus" ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          item[key] === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>{item[key]}</span>
                      ) : item[key]}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">No products found.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex flex-wrap justify-end items-center gap-2 mt-4 p-2 bg-gray-50 border-t ${pgFooter}`}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded bg-white border disabled:opacity-50 ${pgBorder}`}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === index + 1 ? pgActive : `bg-white ${pgBorder}`
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded bg-white border disabled:opacity-50 ${pgBorder}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}