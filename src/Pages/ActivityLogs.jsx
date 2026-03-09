import React, { useState, useEffect } from "react";
import { useWarehouse } from "../context/WarehouseContext";
import { LogsService } from "../services/logs.service";

const ITEMS_PER_PAGE = 10;

// helper para sa 1 ... 5 ... 10 style
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

const ActivityLogs = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const primaryText = isCebu ? "text-purple-600" : "text-orange-600";
  const tableHeaderBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const hoverRowBg = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
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

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await LogsService.list({
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
        search: search || undefined,
      });

      const rows = Array.isArray(res.data) ? res.data : res.data?.data || [];

      setLogs(
        rows.map((row) => ({
          id: row.id,
          userId: row.userid || row.user_id || "",
          activity: row.activity || "",
          datetime: row.date || row.created_at || "",
        }))
      );

      setPagination({
        current_page: res.current_page ?? 1,
        last_page: res.last_page ?? 1,
        total: res.total ?? rows.length,
      });
    } catch (error) {
      console.error("Fetch logs error:", error);
      setLogs([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  const totalPages = pagination.last_page || 1;
  const paginationItems = getPaginationItems(currentPage, totalPages);

  const handlePageChange = (page) => {
    if (!page || page === "..." || page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${primaryText}`}>Activity Logs</h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search..."
            className={`px-4 py-2 m-6 border ${searchBorder} rounded-lg focus:outline-none focus:ring-2 ${focusRing} transition w-64`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <table className="min-w-full border border-gray-200">
          <thead className={`${tableHeaderBg} text-white`}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  Loading logs...
                </td>
              </tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className={`${hoverRowBg} transition`}>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {log.userId}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{log.activity}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {log.datetime}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No activity found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium border ${paginationBorder} rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>

          {paginationItems.map((item, index) =>
            item === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-500 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => handlePageChange(item)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  currentPage === item ? paginationActive : paginationBorder
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium border ${paginationBorder} rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
