import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import borrowData from "../assets/js/EmpBorrowList.json";
import Modal from "../Components/modal/Modal";
import EmpBorrowView from "../Components/layouts/EmpBorrowView";
import EmpBorrowOption from "../Components/layouts/EmpBorrowOption";
import EmpBorrowEdit from "../Components/layouts/EmpBorrowEdit";

const statusTabs = [
  "ALL",
  "PENDING",
  "NOTED",
  "APPROVED BY MANAGER",
  "RECEIVED",
  "APPROVED",
  "RELEASED",
  "RECEIVED BY REQUESTOR",
  "DISAPPROVED",
];

const getStatusStyle = (status) => {
  if (status.includes("Reserved")) return "bg-blue-600 text-white";
  if (status.includes("Approved")) return "bg-green-600 text-white";
  if (status.includes("Disapproved")) return "bg-red-600 text-white";
  return "bg-yellow-600 text-white";
};

const EmpBorrowList = () => {
  const navigate = useNavigate();

  // Load JSON data into state
  const [borrowList, setBorrowList] = useState(borrowData);

  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedEdit, setSelectedEdit] = useState(null);

  // Filter data based on tab and search
  const filteredData = useMemo(() => {
    let data = borrowList;

    if (activeTab !== "ALL") {
      data = data.filter((item) => {
        const statusUpper = item.status.toUpperCase();
        if (activeTab === "APPROVED") {
          return statusUpper.includes("APPROVED") && !statusUpper.includes("DISAPPROVED");
        }
        return statusUpper.includes(activeTab);
      });
    }

    if (search.trim() !== "") {
      data = data.filter(
        (item) =>
          item.srfNo.toLowerCase().includes(search.toLowerCase()) ||
          item.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
          item.intendedFor.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [borrowList, activeTab, search]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex flex-wrap md:flex-nowrap justify-between items-center p-4 md:p-6 bg-white shadow-sm border-b gap-2">
       <div>
          <h2 className="text-2xl font-bold text-orange-600">Borrowed/Returned Items</h2>
        </div>
        <button
          onClick={() => navigate("/RequestForm")}
          className="w-full sm:w-auto bg-orange-600 text-white text-sm md:text-base px-4 py-2 hover:bg-transparent border hover:border-orange-600 hover:text-orange-600 cursor-pointer transition"
        >
          Add New
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-300 shadow-sm">
        <div className="flex flex-wrap gap-2 px-4 py-3">
          {statusTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 text-xs md:text-sm font-medium text-gray-600 cursor-pointer group transition-colors duration-300
                  ${isActive ? "text-orange-600" : "hover:text-orange-600"}
                `}
              >
                {tab}
                {/* Underline */}
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main className="min-h-screen p-4 md:p-6 bg-gray-50">

  {/* Desktop Table */}
  <div className="hidden md:block overflow-x-auto">
    <table className="min-w-full border border-gray-200 bg-white">
      <thead className="bg-orange-600 text-white">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">SRF No.</th>
          <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Requested By</th>
          <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Intended For</th>
          <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Used For</th>
          <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Item Type</th>
          <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Borrowed Date</th>
          <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
          <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <tr key={item.srfNo} className="hover:bg-orange-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{item.srfNo}</td>
              <td className="px-4 py-3 text-gray-600">{item.requestedBy}</td>
              <td className="px-4 py-3 text-gray-600">{item.intendedFor}</td>
              <td className="px-4 py-3 text-gray-600">{item.usedFor}</td>
              <td className="px-4 py-3 text-gray-600">{item.itemType}</td>
              <td className="px-4 py-3 text-gray-500 text-sm">{item.borrowedDate}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-3 py-1 text-xs rounded font-semibold ${getStatusStyle(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
              <div className="grid grid-cols-3 gap-2 justify-items-start">
                {/* Always on the left */}
                <button
                  onClick={() => setSelectedBorrow(item)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  View
                </button>

                {/* Option button (conditionally shown) */}
                <div>
                  {!item.status.toUpperCase().includes("DISAPPROVED") && (
                    <button
                      onClick={() => setSelectedOption(item)}
                      className="text-orange-600 hover:text-orange-800 transition"
                    >
                      Option
                    </button>
                  )}
                </div>

                {/* Edit button (conditionally shown) */}
                <div>
                  {item.status.toUpperCase() === "PENDING" && (
                    <button
                      onClick={() => setSelectedEdit(item)}
                      className="text-yellow-600 hover:text-yellow-800 transition"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="text-center py-6 text-gray-500">
              No borrow records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Mobile Cards */}
  <div className="md:hidden space-y-4">
    {filteredData.length > 0 ? (
      filteredData.map((item) => (
        <div key={item.srfNo} className="bg-white shadow rounded-lg p-4 divide-y divide-gray-200">
          <div className="flex justify-between py-1">
            <span className="font-semibold text-gray-700">SRF No.</span>
            <span className="text-gray-800">{item.srfNo}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-gray-700">Requested By</span>
            <span className="text-gray-800">{item.requestedBy}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-gray-700">Intended For</span>
            <span className="text-gray-800">{item.intendedFor}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-gray-700">Used For</span>
            <span className="text-gray-800">{item.usedFor}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-gray-700">Item Type</span>
            <span className="text-gray-800">{item.itemType}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-gray-700">Borrowed Date</span>
            <span className="text-gray-800">{item.borrowedDate}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-gray-700">Status</span>
            <span className={`px-2 py-1 text-xs rounded font-semibold ${getStatusStyle(item.status)}`}>
              {item.status}
            </span>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => setSelectedBorrow(item)}
              className="text-blue-600 px-2 py-1 rounded text-xs transition"
            >
              View
            </button>
            {!item.status.toUpperCase().includes("DISAPPROVED") && (
              <button
                onClick={() => setSelectedOption(item)}
                className="text-orange-600 px-2 py-1 rounded text-xs transition"
              >
                Option
              </button>
            )}
            {item.status.toUpperCase() === "PENDING" && (
              <button
                onClick={() => setSelectedEdit(item)}
                className="text-yellow-600 px-2 py-1 rounded text-xs transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-6 text-gray-500">
        No borrow records found.
      </div>
    )}
  </div>
</main>

      {/* View Modal */}
      <Modal isOpen={!!selectedBorrow} onClose={() => setSelectedBorrow(null)}>
        <EmpBorrowView selectedBorrow={selectedBorrow} onClose={() => setSelectedBorrow(null)} />
      </Modal>

      {/* Option Modal */}
      {selectedOption && (
        <div className="fixed inset-0 z-1000 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto p-6 shadow-lg rounded">
            <EmpBorrowOption
              selectedBorrow={selectedOption}
              onClose={() => setSelectedOption(null)}
              onApprove={(item) => console.log("Approve", item)}
              onReserve={(item) => console.log("Reserve", item)}
              onRelease={(item) => console.log("Release", item)}
              onDisapprove={(item) => console.log("Disapprove", item)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!selectedEdit} onClose={() => setSelectedEdit(null)} width="max-w-6xl">
        <EmpBorrowEdit
          selectedReserve={selectedEdit}
          onClose={() => setSelectedEdit(null)}
          onSave={(updatedData) => {
            // Update borrowList state
            setBorrowList((prev) =>
              prev.map((r) => (r.srfNo === updatedData.srfNo ? updatedData : r))
            );
            setSelectedEdit(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default EmpBorrowList;