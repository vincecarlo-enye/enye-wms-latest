import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViewImportedPRF from "../Components/layouts/ViewImportedPRF";
import Modal from "../Components/modal/Modal";
import StatusImportedPRF from "../Components/layouts/StatusImportedPRF";
import { PRFService } from "../services/prf.service";

const statusTabs = [
  "ALL",
  "PENDING PRF",
  "NOTED PRF",
  "APPROVED PRF",
  "DISAPPROVED PRF",
  "CHECKED PRF",
  "RETURNED PRF",
  "RELEASED PRF",
  "RECEIVED PRF",
  "CANCELED PRF",
];

const getStatusStyle = (status = "") => {
  const upper = status.toUpperCase();

  if (upper.includes("DISAPPROVED")) return "bg-red-600 text-white";
  if (upper.includes("CANCELED")) return "bg-gray-500 text-white";
  if (upper.includes("APPROVED")) return "bg-green-600 text-white";
  if (upper.includes("RETURNED")) return "bg-purple-600 text-white";
  if (upper.includes("RELEASED")) return "bg-blue-600 text-white";
  if (upper.includes("RECEIVED")) return "bg-indigo-600 text-white";
  if (upper.includes("CHECKED")) return "bg-teal-600 text-white";

  return "bg-yellow-600 text-white";
};

const ImportedPRF = () => {
  const navigate = useNavigate();

  const [prfList, setPrfList] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedPRF, setSelectedPRF] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPrint, setSelectedPrint] = useState(null);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const normalizePRF = (row) => ({
    id: row.id,
    prfNo: row.prf_no || `PRF-${row.id}`,
    requestedBy: row.requested_by || "",
    itemType: row.item_type || "",
    clientName: row.client_name || "",
    project: row.proj || "",
    poNo: row.po_no || "",
    status: row.prf_status || "PENDING PRF",
    raw: row,
  });

  const fetchPRF = async () => {
    try {
      setLoading(true);

      const res = await PRFService.list({
        page,
        per_page: perPage,
        search: search || undefined,
        item_type: "Imported Item/s", // adjust exact value to match DB
      });

      const rows = Array.isArray(res.data) ? res.data : res.data?.data || [];

      setPrfList(rows.map(normalizePRF));

      setPagination({
        current_page: res.current_page ?? 1,
        last_page: res.last_page ?? 1,
        total: res.total ?? rows.length,
      });
    } catch (error) {
      console.error("Fetch imported PRF error:", error);
      setPrfList([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search]);

  const filteredData = useMemo(() => {
    let data = prfList;

    if (activeTab && activeTab !== "ALL") {
      const tabStatus = activeTab.replace(" PRF", "").toUpperCase();
      data = data.filter((item) =>
        (item.status || "").toUpperCase().includes(tabStatus)
      );
    }

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.prfNo.toLowerCase().includes(s) ||
          item.requestedBy.toLowerCase().includes(s) ||
          (item.itemType || "").toLowerCase().includes(s) ||
          item.clientName.toLowerCase().includes(s) ||
          item.project.toLowerCase().includes(s) ||
          item.poNo.toLowerCase().includes(s)
      );
    }

    return data;
  }, [prfList, activeTab, search]);

  const totalPages = pagination.last_page || 1;

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

  const paginationItems = getPaginationItems(pagination.current_page, totalPages);

  const handleTabClick = (tab) => {
    setActiveTab((prev) => (prev === tab ? "ALL" : tab));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (!newPage || newPage === "..." || newPage < 1 || newPage > totalPages) {
      return;
    }
    setPage(newPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm border-b">
        <h1 className="text-2xl font-semibold text-gray-800">Imported PRF</h1>

        <button
          onClick={() => navigate("/CreateImportedPRF")}
          className="bg-orange-500 text-white px-4 py-2 border border-orange-600 
                     cursor-pointer 
                     transition-colors duration-200 
                     hover:bg-transparent 
                     hover:text-orange-600 "
        >
          Add New
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-wrap gap-2 px-4 py-3">
          {statusTabs.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => handleTabClick(item)}
                className={`relative px-4 py-2 font-medium text-gray-600 cursor-pointer group
                  ${isActive ? "text-orange-600" : "hover:text-orange-600"}
                `}
              >
                {item}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 bg-orange-600 transition-all duration-300
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                ></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border-b flex justify-end">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 w-64"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Main */}
      <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Header */}
            <thead className="bg-orange-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  PRF #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Requested By
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Item Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  P.O #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    Loading PRF records...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No PRF records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id || item.prfNo}
                    className="hover:bg-orange-50 transition"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {item.prfNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.requestedBy}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.itemType}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.clientName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.project}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.poNo}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded font-semibold ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
                          onClick={() => setSelectedPRF(item)}
                        >
                          View
                        </button>

                        {!item.status
                          .toUpperCase()
                          .includes("DISAPPROVED") && (
                          <button
                            className="text-yellow-600 hover:text-yellow-800 cursor-pointer transition"
                            onClick={() => setSelectedStatus(item)}
                          >
                            Status
                          </button>
                        )}

                        <button
                          className="text-gray-600 hover:text-gray-800 cursor-pointer transition"
                          onClick={() => setSelectedPrint(item)}
                        >
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center py-6 text-gray-500">
              Loading PRF records...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No PRF records found.
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id || item.prfNo}
                className="bg-white rounded-lg shadow border border-orange-200 p-4"
              >
                {/* PRF Header */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {item.prfNo}
                  </span>

                  <span
                    className={`px-2 py-1 text-xs rounded font-semibold ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-orange-600">
                      Requested By:
                    </span>{" "}
                    {item.requestedBy}
                  </div>
                  <div>
                    <span className="font-semibold text-orange-600">
                      Item Type:
                    </span>{" "}
                    {item.itemType}
                  </div>
                  <div>
                    <span className="font-semibold text-orange-600">
                      Client:
                    </span>{" "}
                    {item.clientName}
                  </div>
                  <div>
                    <span className="font-semibold text-orange-600">
                      Project:
                    </span>{" "}
                    {item.project}
                  </div>
                  <div>
                    <span className="font-semibold text-orange-600">
                      P.O #:
                    </span>{" "}
                    {item.poNo}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 py-1 text-xs rounded border border-blue-600 bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 transition"
                    onClick={() => setSelectedPRF(item)}
                  >
                    View
                  </button>

                  {!item.status.toUpperCase().includes("DISAPPROVED") && (
                    <button
                      className="flex-1 py-1 text-xs rounded border border-yellow-500 bg-yellow-500 text-white hover:bg-transparent hover:text-yellow-600 transition"
                      onClick={() => setSelectedStatus(item)}
                    >
                      Status
                    </button>
                  )}

                  <button
                    className="flex-1 py-1 text-xs rounded border border-gray-500 bg-gray-500 text-white hover:bg-transparent hover:text-gray-600 transition"
                    onClick={() => setSelectedPrint(item)}
                  >
                    Print
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-end items-center gap-2 mt-4 p-2 bg-gray-50 border-t border-orange-200">
            <button
              onClick={() =>
                handlePageChange(pagination.current_page - 1)
              }
              disabled={pagination.current_page === 1}
              className="px-3 py-1 rounded border border-orange-300 bg-white disabled:opacity-50"
            >
              Prev
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
                  onClick={() => handlePageChange(item)}
                  className={`px-3 py-1 rounded border ${
                    pagination.current_page === item
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white border-orange-300 hover:bg-orange-100"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() =>
                handlePageChange(pagination.current_page + 1)
              }
              disabled={pagination.current_page === totalPages}
              className="px-3 py-1 rounded border border-orange-300 bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* View / Print Modal */}
      <Modal
        isOpen={!!selectedPRF || !!selectedPrint}
        onClose={() => {
          setSelectedPRF(null);
          setSelectedPrint(null);
        }}
      >
        <ViewImportedPRF
          selectedPRF={(selectedPRF || selectedPrint)?.raw || selectedPRF || selectedPrint}
          onClose={() => {
            setSelectedPRF(null);
            setSelectedPrint(null);
          }}
          autoPrint={!!selectedPrint}
        />
      </Modal>

      {/* Status Modal */}
      {selectedStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto p-6 shadow-lg">
            <StatusImportedPRF
              selectedPRF={selectedStatus.raw || selectedStatus}
              onClose={() => setSelectedStatus(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportedPRF;
