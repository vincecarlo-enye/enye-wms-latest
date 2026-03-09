import React, { useEffect, useMemo, useState } from "react";
import Modal from "../Components/modal/Modal";
import EmpReserveView from "../Components/layouts/EmpReserveView";
import EmpReserveOption from "../Components/layouts/EmpReserveOption";
import EmpReserveEdit from "../Components/layouts/EmpReserveEdit";
import { useNavigate } from "react-router-dom";
import { EmpWarrantyListService } from "../services/EmpWarrantyList.service";

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

const getStatusStyle = (status = "") => {
  const upper = status.toUpperCase();
  if (upper.includes("RESERVED")) return "bg-blue-600 text-white";
  if (upper.includes("RECEIVED")) return "bg-blue-600 text-white";
  if (upper.includes("APPROVED") && !upper.includes("DISAPPROVED")) return "bg-green-600 text-white";
  if (upper.includes("DISAPPROVED")) return "bg-red-600 text-white";
  return "bg-yellow-600 text-white";
};

const normalizeWarranty = (item) => ({
  id: item.id,
  srfNo: item.srf_no || item.srf_no_ec || item.srfnoec || item.reference_no || "",
  requestedBy: item.requested_by || item.requestedby || item.employee_name || "",
  intendedFor: item.intended_for || item.intendedfor || item.customer_name || "",
  usedFor: item.used_for || item.usedfor || item.issue_description || item.reason || "",
  itemType: item.item_type || item.itemtype || item.category || "WARRANTY",
  reservedDate: item.date_needed || item.created_at?.slice(0, 10) || "",
  returnOn: item.return_on || item.expected_return_date || "",
  status: item.status || "PENDING",
  remarks: item.remarks || "",
  warehouse: item.warehouse || "",
  items: (item.items || item.replacement_items || []).map((row) => ({
    id: row.id,
    productName: row.prod_name || row.product_name || row.item_name || "",
    barcode: row.barcode || row.serial_no || "",
    quantity: Number(row.qty || row.quantity || 1),
    uom: row.uom || "",
    notes: row.item_notes || row.notes || "",
  })),
});

const EmpWarrantyList = () => {
  const navigate = useNavigate();

  const [warrantyList, setWarrantyList] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWarrantyList = async () => {
    try {
      setLoading(true);
      const rows = await EmpWarrantyListService.list({ search });
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

  const filteredData = useMemo(() => {
    let data = warrantyList;

    if (activeTab !== "ALL") {
      data = data.filter((item) => {
        const statusUpper = (item.status || "").toUpperCase();

        if (activeTab === "APPROVED") {
          return statusUpper.includes("APPROVED") && !statusUpper.includes("DISAPPROVED");
        }

        return statusUpper.includes(activeTab);
      });
    }

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      data = data.filter(
        (item) =>
          (item.srfNo || "").toLowerCase().includes(s) ||
          (item.requestedBy || "").toLowerCase().includes(s) ||
          (item.intendedFor || "").toLowerCase().includes(s)
      );
    }

    return data;
  }, [warrantyList, activeTab, search]);

  const handleSaveEdit = async (updatedData, reason) => {
    try {
      const payload = {
        srf_no: updatedData.srfNo || null,
        requested_by: updatedData.requestedBy || "",
        intended_for: updatedData.intendedFor || "",
        used_for: updatedData.usedFor || "",
        item_type: updatedData.itemType || "",
        date_needed: updatedData.reservedDate || "",
        return_on: updatedData.returnOn || "",
        status: updatedData.status || "PENDING",
        remarks: updatedData.remarks || reason || "",
        items: (updatedData.items || []).map((item) => ({
          prod_name: item.productName || "",
          qty: Number(item.quantity || 1),
          uom: item.uom || "",
          barcode: item.barcode || "",
          item_notes: item.notes || "",
        })),
      };

      const saved = await EmpWarrantyListService.update(updatedData.id, payload);
      const normalized = normalizeWarranty(saved);

      setWarrantyList((prev) =>
        prev.map((r) => (r.id === normalized.id ? normalized : r))
      );

      setSelectedEdit(null);
    } catch (error) {
      console.error("Update warranty error:", error);
      alert(error?.response?.data?.message || "Failed to update warranty request.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex flex-wrap md:flex-nowrap justify-between items-center p-4 md:p-6 bg-white shadow-sm border-b gap-2">
        <div>
          <h2 className="text-2xl font-bold text-orange-600">Employee Warranty List</h2>
        </div>

        <button
          onClick={() => navigate("/RequestForm")}
          className="w-full sm:w-auto bg-orange-600 text-white text-sm md:text-base px-4 py-2 hover:bg-transparent border hover:border-orange-600 hover:text-orange-600 cursor-pointer transition"
        >
          Add New
        </button>
      </header>

      <div className="bg-white border-b border-gray-300 shadow-sm">
        <div className="flex flex-wrap gap-2 px-4 py-3">
          {statusTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 text-xs md:text-sm font-medium text-gray-600 cursor-pointer group transition-colors duration-300 ${
                  isActive ? "text-orange-600" : "hover:text-orange-600"
                }`}
              >
                {tab}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 bg-orange-600 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-white border-b flex justify-end">
        <input
          className="border px-3 py-2 rounded w-full md:w-64"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main className="min-h-screen p-4 md:p-6 bg-gray-50">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-orange-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">SRF No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Requested By</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Intended For</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Used For</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Item Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Request Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Loading warranty records...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id || item.srfNo} className="hover:bg-orange-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.srfNo}</td>
                    <td className="px-4 py-3 text-gray-600">{item.requestedBy}</td>
                    <td className="px-4 py-3 text-gray-600">{item.intendedFor}</td>
                    <td className="px-4 py-3 text-gray-600">{item.usedFor}</td>
                    <td className="px-4 py-3 text-gray-600">{item.itemType}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{item.reservedDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 text-xs rounded font-semibold ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="grid grid-cols-3 gap-2 justify-items-start">
                        <button
                          onClick={() => setSelectedWarranty(item)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          View
                        </button>

                        {!item.status.toUpperCase().includes("DISAPPROVED") && (
                          <button
                            onClick={() => setSelectedOption(item)}
                            className="text-orange-600 hover:text-orange-800 transition"
                          >
                            Option
                          </button>
                        )}

                        {item.status.toUpperCase() === "PENDING" && (
                          <button
                            onClick={() => setSelectedEdit(item)}
                            className="text-yellow-600 hover:text-yellow-800 transition"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No warranty records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading warranty records...</div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id || item.srfNo} className="bg-white shadow rounded-lg p-4 divide-y divide-gray-200">
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
                  <span className="font-semibold text-gray-700">Request Date</span>
                  <span className="text-gray-800">{item.reservedDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-gray-700">Status</span>
                  <span className={`px-2 py-1 text-xs rounded font-semibold ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setSelectedWarranty(item)}
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
              No warranty records found.
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={!!selectedWarranty} onClose={() => setSelectedWarranty(null)}>
        <EmpReserveView
          selectedReserve={selectedWarranty}
          onClose={() => setSelectedWarranty(null)}
        />
      </Modal>

      <Modal
        isOpen={!!selectedOption}
        onClose={() => setSelectedOption(null)}
        width="max-w-4xl"
      >
        <EmpReserveOption
          selectedReserve={selectedOption}
          onClose={() => setSelectedOption(null)}
          onApprove={(item, reason) => console.log("Approve", item, reason)}
          onReserveOrRelease={(item, type, reason) => console.log(type, item, reason)}
          onProcess={(item, reason) => console.log("Process", item, reason)}
          onDisapprove={(item, reason) => console.log("Disapprove", item, reason)}
        />
      </Modal>

      <Modal
        isOpen={!!selectedEdit}
        onClose={() => setSelectedEdit(null)}
        width="max-w-6xl"
      >
        <EmpReserveEdit
          selectedReserve={selectedEdit}
          onClose={() => setSelectedEdit(null)}
          onSave={handleSaveEdit}
        />
      </Modal>
    </div>
  );
};

export default EmpWarrantyList;
