import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";
import { ProductWarrantyService } from "../services/productwarranty.service";

export default function ProductWarranty() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [warrantyList, setWarrantyList] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const headerBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const titleColor = isCebu ? "text-purple-600" : "text-gray-800";
  const hoverRow = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const labelColor = isCebu ? "text-purple-600" : "text-orange-600";
  const cardBorder = isCebu
    ? "border-purple-200 divide-purple-100"
    : "border-orange-200 divide-orange-100";
  const pgBorder = isCebu
    ? "border-purple-300 hover:bg-purple-100"
    : "border-orange-300 hover:bg-orange-100";
  const pgActive = isCebu
    ? "bg-purple-600 text-white border-purple-600"
    : "bg-orange-600 text-white border-orange-600";
  const pgFooter = isCebu ? "border-purple-200" : "border-orange-200";
  const focusBorder = isCebu
    ? "focus:border-purple-500"
    : "focus:border-orange-500";

  const normalizeWarranty = (item) => ({
    id: item.id,
    warehouse: (item.warehouse || "main").toLowerCase(),
    modelName: item.prod_name || "",
    qty: Number(item.qty || 0),
    barcode: item.barcode || "",
    manufacturer: item.supplier || "",
    warranty: item.warranty || "",
    month: item.month || "",
    warrantyDate: item.warranty_validity || "",
    warrantyStatus: item.status || "",
  });

  const fetchWarrantyList = async () => {
    try {
      setLoading(true);
      const rows = await ProductWarrantyService.list({ search });
      setWarrantyList(rows.map(normalizeWarranty));
    } catch (error) {
      console.error("Fetch warranty list error:", error);
      setWarrantyList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarrantyList();
  }, [search]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortIndicator = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : "";

  const columns = [
    { key: "modelName", label: "Model Name" },
    { key: "qty", label: "Qty" },
    { key: "barcode", label: "Barcode" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "warranty", label: "Warranty" },
    { key: "warrantyDate", label: "Warranty Date" },
    { key: "warrantyStatus", label: "Warranty Status" },
  ];

  const warehouseData = useMemo(() => {
    return warrantyList.filter((i) => i.warehouse === currentWarehouse);
  }, [warrantyList, currentWarehouse]);

  const sortedData = useMemo(() => {
    const data = [...warehouseData];

    if (!sortConfig.key) return data;

    return data.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (sortConfig.key === "qty") {
        return sortConfig.direction === "asc"
          ? Number(aVal) - Number(bVal)
          : Number(bVal) - Number(aVal);
      }

      return sortConfig.direction === "asc"
        ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
        : String(bVal ?? "").localeCompare(String(aVal ?? ""));
    });
  }, [warehouseData, sortConfig]);

  const filteredData = useMemo(() => {
    const s = search.toLowerCase();

    return sortedData.filter(
      (item) =>
        (item.modelName || "").toLowerCase().includes(s) ||
        String(item.barcode || "").toLowerCase().includes(s) ||
        (item.manufacturer || "").toLowerCase().includes(s) ||
        (item.warrantyStatus || "").toLowerCase().includes(s)
    );
  }, [sortedData, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = filteredData.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const getPaginationItems = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }

    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const paginationItems = getPaginationItems(safeCurrentPage, totalPages);

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${titleColor}`}>Product Warranty</h2>
        <p className="text-sm text-gray-500">Manage your product warranties</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search model..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none ${focusBorder} pr-10`}
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-gray-50 p-4">
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
                    {label}
                    {sortIndicator(key)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className={`transition ${hoverRow}`}>
                    <td className="px-6 py-4 text-gray-800">{item.modelName}</td>
                    <td className="px-6 py-4 text-gray-600">{item.qty}</td>
                    <td className="px-6 py-4 text-gray-600">{item.barcode}</td>
                    <td className="px-6 py-4 text-gray-600">{item.manufacturer}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.month ? `${item.warranty} ${item.month}` : item.warranty}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.warrantyDate || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          String(item.warrantyStatus).toLowerCase() === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.warrantyStatus || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-4">
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading products...</div>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <div
                key={item.id}
                className={`bg-white p-4 rounded-lg shadow-sm border divide-y ${cardBorder}`}
              >
                {columns.map(({ key, label }) => (
                  <div key={key} className="flex justify-between py-1">
                    <span className={`font-semibold ${labelColor}`}>{label}:</span>
                    <span className="text-gray-800">
                      {key === "warrantyStatus" ? (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            String(item[key]).toLowerCase() === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item[key] || "-"}
                        </span>
                      ) : key === "warranty" ? (
                        item.month ? `${item.warranty} ${item.month}` : item.warranty
                      ) : (
                        item[key] || "-"
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">No products found.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div
            className={`flex flex-wrap justify-end items-center gap-2 mt-4 p-2 bg-gray-50 border-t ${pgFooter}`}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1}
              className={`p-2 rounded bg-white border disabled:opacity-50 ${pgBorder}`}
            >
              <ChevronLeft size={16} />
            </button>

            {paginationItems.map((item, index) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-500 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`px-3 py-1 rounded border ${
                    safeCurrentPage === item ? pgActive : `bg-white ${pgBorder}`
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={safeCurrentPage === totalPages}
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
