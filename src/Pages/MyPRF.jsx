import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/modal/Modal";
import ViewPRF from "../Components/layouts/ViewPRF";
import EditPRF from "../Components/layouts/EditPRF";
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

  return "bg-yellow-600 text-white"; // Pending / Noted / others
};

const MyPRF = () => {
  const navigate = useNavigate();

  const [prfList, setPrfList] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedPRF, setSelectedPRF] = useState(null);
  const [selectedEdit, setSelectedEdit] = useState(null);
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
        scope: "me",
        // item_type: optional filter kung gusto mo
      });

      // Laravel paginator when returned as JSON via response()->json($paginator)
      // is typically { data: [...], current_page, last_page, total, ... }. [web:1310][web:1315]
      const rows = Array.isArray(res.data) ? res.data : res.data?.data || [];

      setPrfList(rows.map(normalizePRF));

      setPagination({
        current_page: res.current_page ?? 1,
        last_page: res.last_page ?? 1,
        total: res.total ?? rows.length,
      });
    } catch (error) {
      console.error("Fetch PRF error:", error);
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

    // optional: extra client-side filtering on top of backend search
    // if (search.trim() !== "") {
    //   const s = search.toLowerCase();
    //   data = data.filter(
    //     (item) =>
    //       item.prfNo.toLowerCase().includes(s) ||
    //       item.requestedBy.toLowerCase().includes(s) ||
    //       item.clientName.toLowerCase().includes(s) ||
    //       item.project.toLowerCase().includes(s) ||
    //       item.poNo.toLowerCase().includes(s)
    //   );
    // }

    return data;
  }, [prfList, activeTab]);

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
      <header className="flex flex-wrap md:flex-nowrap justify-between items-center p-4 md:p-6 bg-white shadow-sm border-b gap-2">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-800 flex-1">
          My PRF
        </h1>

        <button
          onClick={() => navigate("/CreatePRF")}
          className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white 
                     shadow-md border border-orange-600
                     cursor-pointer 
                     transition-colors duration-200 
                     hover:bg-transparent 
                     hover:text-orange-600"
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
                className={`relative px-4 py-2 text-xs md:text-sm font-medium text-gray-600 cursor-pointer group
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
          className="border px-3 py-2 rounded w-full md:w-64"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-orange-600 text-white font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">PRF #</th>
                <th className="px-6 py-3 text-left">Requested By</th>
                <th className="px-6 py-3 text-left">Client Name</th>
                <th className="px-6 py-3 text-left">Project</th>
                <th className="px-6 py-3 text-left">P.O #</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Loading PRF records...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id || item.prfNo} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4 text-gray-800">{item.prfNo}</td>
                    <td className="px-6 py-4 text-gray-600">{item.requestedBy}</td>
                    <td className="px-6 py-4 text-gray-600">{item.clientName}</td>
                    <td className="px-6 py-4 text-gray-600">{item.project}</td>
                    <td className="px-6 py-4 text-gray-600">{item.poNo}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="grid grid-cols-3 gap-2 justify-items-start">
                        {/* View Button */}
                        <button
                          onClick={() => setSelectedPRF(item)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          View
                        </button>

                        {/* Edit Button */}
                        {!String(item.status)
                          .toUpperCase()
                          .includes("DISAPPROVED") && (
                          <button
                            onClick={() => setSelectedEdit(item)}
                            className="text-yellow-600 hover:text-yellow-800 transition"
                          >
                            Edit
                          </button>
                        )}

                        {/* Print Button */}
                        <button
                          onClick={() => setSelectedPrint(item)}
                          className="text-gray-600 hover:text-gray-800 transition col-start-3"
                        >
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No PRF records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center py-6 text-gray-500">
              Loading PRF records...
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id || item.prfNo}
                className="bg-white p-4 rounded-lg shadow border border-orange-200 divide-y divide-orange-100"
              >
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-orange-600">PRF #:</span>
                  <span className="text-gray-800">{item.prfNo}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-orange-600">
                    Requested By:
                  </span>
                  <span className="text-gray-800">{item.requestedBy}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-orange-600">
                    Client Name:
                  </span>
                  <span className="text-gray-800">{item.clientName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-orange-600">Project:</span>
                  <span className="text-gray-800">{item.project}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-orange-600">P.O #:</span>
                  <span className="text-gray-800">{item.poNo}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-orange-600">Status:</span>
                  <span className="text-gray-800">{item.status}</span>
                </div>

                <div className="flex gap-2 justify-center mt-2">
                  <button
                    className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition"
                    onClick={() => setSelectedPRF(item)}
                  >
                    View
                  </button>
                  {!String(item.status).toUpperCase().includes("DISAPPROVED") && (
                    <button
                      className="flex-1 bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 transition"
                      onClick={() => setSelectedEdit(item)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 transition"
                    onClick={() => setSelectedPrint(item)}
                  >
                    Print
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No PRF records found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-end items-center gap-2 mt-4 p-2 bg-gray-50 border-t border-orange-200">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
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
              onClick={() => handlePageChange(pagination.current_page + 1)}
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
        <ViewPRF
          selectedPRF={(selectedPRF || selectedPrint)?.raw || selectedPRF || selectedPrint}
          onClose={() => {
            setSelectedPRF(null);
            setSelectedPrint(null);
          }}
          autoPrint={!!selectedPrint}
        />
      </Modal>

      {/* Edit Modal */}
      {selectedEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto p-6 shadow-lg rounded">
            <EditPRF
              selectedPRF={selectedEdit.raw || selectedEdit}
              onClose={() => setSelectedEdit(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPRF;
