import React, { useState, useMemo } from "react";
import { useWarehouse } from "../context/WarehouseContext";

const activityData = [
  { id: 1, name: "John Doe", activity: "Logged in", datetime: "Feb 24, 2026 - 10:30 AM" },
  { id: 2, name: "Jane Smith", activity: "Updated profile information", datetime: "Feb 24, 2026 - 09:15 AM" },
  { id: 3, name: "Michael Johnson", activity: "Created a new post", datetime: "Feb 23, 2026 - 04:45 PM" },
  { id: 4, name: "Emily Davis", activity: "Logged out", datetime: "Feb 23, 2026 - 02:10 PM" },
  { id: 5, name: "Chris Brown", activity: "Changed password", datetime: "Feb 22, 2026 - 06:22 PM" },
  { id: 6, name: "Sarah Wilson", activity: "Uploaded a file", datetime: "Feb 22, 2026 - 01:10 PM" },
  { id: 7, name: "David Lee", activity: "Deleted a comment", datetime: "Feb 21, 2026 - 11:40 AM" },
  { id: 8, name: "Anna Taylor", activity: "Registered account", datetime: "Feb 21, 2026 - 08:15 AM" },
  { id: 9, name: "Mark Anderson", activity: "Logged in", datetime: "Feb 20, 2026 - 07:55 PM" },
  { id: 10, name: "Lisa Thomas", activity: "Updated settings", datetime: "Feb 20, 2026 - 03:30 PM" },
];

const ITEMS_PER_PAGE = 5;

const ActivityLogs = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { currentWarehouse } = useWarehouse();

  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const primaryText      = isCebu ? "text-purple-600"        : "text-orange-600";
  const tableHeaderBg    = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const hoverRowBg       = isCebu ? "hover:bg-purple-50"     : "hover:bg-orange-50";
  const searchBorder     = isCebu ? "border-purple-300"      : "border-orange-300";
  const focusRing        = isCebu ? "focus:ring-purple-500 focus:border-purple-500" : "focus:ring-orange-500 focus:border-orange-500";
  const paginationBorder = isCebu ? "border-purple-300 hover:bg-purple-100" : "border-orange-300 hover:bg-orange-100";
  const paginationActive = isCebu ? "bg-purple-600 text-white border-purple-600" : "bg-orange-600 text-white border-orange-600";

  // Filtered Data
  const filteredData = useMemo(() => {
    return activityData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.activity.toLowerCase().includes(search.toLowerCase()) ||
      item.datetime.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => setCurrentPage(page);

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
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Activity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Date & Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((log) => (
                <tr key={log.id} className={`${hoverRowBg} transition`}>
                  <td className="px-6 py-4 font-medium text-gray-800">{log.name}</td>
                  <td className="px-6 py-4 text-gray-600">{log.activity}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{log.datetime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No activity found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > ITEMS_PER_PAGE && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium border ${paginationBorder} rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  currentPage === page ? paginationActive : paginationBorder
                }`}
              >
                {page}
              </button>
            );
          })}

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