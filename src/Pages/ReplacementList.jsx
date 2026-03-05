import { useState } from "react";
import {
  Search,
  Pencil,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  User,
  Clipboard,
  Calendar,
  Box,
  CalendarCheck,
} from "lucide-react";

// Dummy SelectField / InputField / TextareaField components
const InputField = ({ name, label, value, onChange, type = "text" }) => (
  <div className="relative flex items-center w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500"
    />
    <label
      className={`absolute left-3 bg-white px-1 transition-all duration-200 ${
        value ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"
      }`}
    >
      {label}
    </label>
  </div>
);

const SelectField = ({ name, label, value, onChange, options }) => (
  <div className="relative flex items-center w-full">
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <label
      className={`absolute left-3 bg-white px-1 transition-all duration-200 ${
        value ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"
      }`}
    >
      {label}
    </label>
  </div>
);

const TextareaField = ({ name, label, value, onChange }) => (
  <div className="flex flex-col w-full">
    <label className="mb-1 text-sm font-semibold">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-2 py-1"
    />
  </div>
);

export default function ReplacementList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [replacementList] = useState([
    {
      clientName: "Client A",
      projectName: "Project Alpha",
      itemType: "LOCAL MATERIALS",
      itemSuppliedBy: "Supplier X",
      deliveryDate: "2024-02-01",
      referenceNo: "WC-001",
      principalInvoice: "INV-1001",
      drNo: "DR-001",
      warrantyClaimETA: "2024-02-10",
      replacementDate: "2024-02-15",
      remarks: "Sample remark",
      selectedItems: [
        { item: "Inspection Kit", barcode: "100001", qty: 2, uom: "pcs" },
      ],
      status: "Completed",
    },
    {
      clientName: "Client B",
      projectName: "Project Beta",
      itemType: "IMPORTED MATERIALS",
      itemSuppliedBy: "Supplier Y",
      deliveryDate: "2024-02-05",
      referenceNo: "WC-002",
      principalInvoice: "INV-1002",
      drNo: "DR-002",
      warrantyClaimETA: "2024-02-12",
      replacementDate: "",
      remarks: "",
      selectedItems: [
        { item: "Field Sensor", barcode: "100002", qty: 1, uom: "pc" },
      ],
      status: "Pending",
    },
  ]);

  const [sortConfig] = useState({ key: "", direction: "asc" });
  const [selectedReplacement, setSelectedReplacement] = useState(null);
  const [editingReplacement, setEditingReplacement] = useState(null);

  const [itemTypes] = useState([
    "IMPORTED MATERIALS",
    "LOCAL MATERIALS",
    "MOCK-UP MATERIALS",
    "NON MOVING IMPORTED MATERIALS",
    "NON MOVING LOCAL MATERIALS",
    "TOOLS",
  ]);

  const itemsPerPage = 10;

  // Sorting
  const sortedList = replacementList.slice().sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key] || "";
    const bVal = b[sortConfig.key] || "";
    return sortConfig.direction === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // Filter
  const filteredList = sortedList.filter(
    (item) =>
      item.clientName.toLowerCase().includes(search.toLowerCase()) ||
      item.referenceNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Edit Replacement
  const handleEditReplacement = (replacement) => {
    setEditingReplacement({ ...replacement });
  };

  // Warranty Items functions
  const handleItemChange = (index, field, value) => {
    const updated = [...editingReplacement.selectedItems];
    updated[index][field] = value;
    setEditingReplacement({ ...editingReplacement, selectedItems: updated });
  };

  const removeItem = (index) => {
    const updated = [...editingReplacement.selectedItems];
    updated.splice(index, 1);
    setEditingReplacement({ ...editingReplacement, selectedItems: updated });
  };

  const addItem = () => {
    const updated = [
      ...editingReplacement.selectedItems,
      { item: "", barcode: "", qty: 1, uom: "" },
    ];
    setEditingReplacement({ ...editingReplacement, selectedItems: updated });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditingReplacement({ ...editingReplacement, [name]: value });
  };

  const handlePrint = () => {
  window.print();
};


  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-600">Replacement List</h2>
          <p className="text-gray-500 text-sm">Manage replacement/warranty</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-105">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by client or reference..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 pr-10"
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 p-6">

  {/* Replacement Table - Desktop */}
  <div className="overflow-x-auto hidden sm:block">
    <table className="min-w-full border border-gray-200">
      <thead className="bg-orange-600 text-white">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Client Name</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Project</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Reference No.</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Replacement Date</th>
          <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {paginatedList.length > 0 ? (
          paginatedList.map((item, idx) => (
            <tr key={idx} className="hover:bg-orange-50 transition">
              <td className="px-6 py-4 font-medium text-gray-800">{item.clientName}</td>
              <td className="px-6 py-4 text-gray-600">{item.projectName}</td>
              <td className="px-6 py-4 text-gray-600">{item.referenceNo}</td>
              <td className="px-6 py-4 text-gray-500 text-sm">{item.replacementDate || "-"}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setSelectedReplacement(item)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEditReplacement(item)}
                    className="text-orange-600 hover:text-orange-800 transition"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center py-6 text-gray-500">
              No replacement records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Replacement Cards - Mobile */}
  <div className="sm:hidden space-y-4">
    {paginatedList.length > 0 ? (
      paginatedList.map((item, idx) => (
        <div key={idx} className="bg-white shadow rounded-lg p-4 divide-y divide-gray-200">
          <div className="flex justify-between py-2">
            <span className="font-semibold text-gray-700">Client Name</span>
            <span className="text-gray-800">{item.clientName}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold text-gray-700">Project</span>
            <span className="text-gray-800">{item.projectName}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold text-gray-700">Reference No.</span>
            <span className="text-gray-800">{item.referenceNo}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold text-gray-700">Replacement Date</span>
            <span className="text-gray-800">{item.replacementDate || "-"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold text-gray-700">Status</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              item.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {item.status}
            </span>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setSelectedReplacement(item)}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEditReplacement(item)}
              className="text-orange-600 hover:text-orange-800 transition"
            >
              <Pencil size={18} />
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-6 text-gray-500">No replacement records found.</div>
    )}
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex justify-end items-center mt-6 space-x-2">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium border border-orange-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-100"
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 text-sm font-medium rounded-md border ${
              currentPage === page
                ? "bg-orange-600 text-white border-orange-600"
                : "border-orange-300 hover:bg-orange-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium border border-orange-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-100"
      >
        Next
      </button>
    </div>
  )}
</div>

      {/* View Modal */}
      {selectedReplacement && (
       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 print:bg-white print:block">
          <div className="bg-white w-250 max-h-[90vh] overflow-auto p-8 shadow-lg print:shadow-none print:max-h-full print:w-full">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-orange-600">ENYE</h1>
              <h2 className="text-lg font-semibold">Replacement</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm mb-6">
              <div>
                <p>
                  Client: <strong>{selectedReplacement.clientName}</strong>
                </p>
                <p>Project: <strong>{selectedReplacement.projectName}</strong></p>
                <p>Item Type: <strong>{selectedReplacement.itemType}</strong></p>
              </div>

              <div>
                <p>
                  Item Supplied By: <strong>{selectedReplacement.itemSuppliedBy}</strong>
                </p>
                <p>Delivery Date: <strong>{selectedReplacement.deliveryDate}</strong></p>
                <p>Principal Invoice: <strong>{selectedReplacement.principalInvoice}</strong></p>
              </div>

              <div className="text-right">
                <p>
                  Reference No: <strong>{selectedReplacement.referenceNo}</strong>
                </p>
                <p>DR No: <strong>{selectedReplacement.drNo}</strong></p>
                <p>
                  Replacement Date: <strong>{selectedReplacement.replacementDate || "-"}</strong>
                </p>
              </div>
            </div>

            <hr className="mb-6" />

            <table className="w-full border border-gray-400 text-sm mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Barcode</th>
                  <th className="border p-2 text-center">Qty</th>
                  <th className="border p-2 text-left">UOM</th>
                </tr>
              </thead>
              <tbody>
                {selectedReplacement.selectedItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{item.item}</td>
                    <td className="border p-2">{item.barcode}</td>
                    <td className="border p-2 text-center">{item.qty}</td>
                    <td className="border p-2">{item.uom}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-sm mb-6">
              <strong>Remarks:</strong> {selectedReplacement.remarks || "-"}
            </div>

            {/* Approval / Signature Section */}
            <div className="border border-gray-400 text-sm mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 xl:grid-cols-7 print:grid-cols-7">

                <div className="border p-3">
                  <div className="font-semibold mb-3">Requested by:</div>
                  <div>{selectedReplacement.requestedBy || "Admin Enye"}</div>
                </div>

                <div className="border p-3">
                  <div className="font-semibold mb-3">Noted by:</div>
                  <div>{selectedReplacement.notedBy || "Immediate Supervisor"}</div>
                </div>

                <div className="border p-3">
                  <div className="font-semibold mb-3">Approved by:</div>
                  <div>{selectedReplacement.approvedBy || "Department Manager"}</div>
                </div>

                <div className="border p-3">
                  <div className="font-semibold mb-3">Warehouse Received by:</div>
                  <div>{selectedReplacement.warehouseReceivedBy || "Warehouse Staff"}</div>
                </div>

                <div className="border p-3">
                  <div className="font-semibold mb-3">Warehouse Approved by:</div>
                  <div>{selectedReplacement.warehouseApprovedBy || "Warehouse Manager"}</div>
                </div>

                <div className="border p-3">
                  <div className="font-semibold mb-3">Released by:</div>
                  <div>{selectedReplacement.releasedBy || "Warehouse"}</div>
                </div>

                <div className="border p-3">
                  <div className="font-semibold mb-3">Received by:</div>
                  <div>{selectedReplacement.receivedBy || "Client / Employee"}</div>
                </div>

              </div>
            </div>


            <div className="flex justify-center gap-4 print:hidden">
  <button
    onClick={handlePrint}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
  >
    Print
  </button>

  <button
    onClick={() => setSelectedReplacement(null)}
    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
  >
    Close
  </button>
</div>

          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingReplacement && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-250 max-h-[90vh] overflow-auto p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Replacement</h2>

            {/* Top Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <InputField
                name="clientName"
                label="Client Name *"
                value={editingReplacement.clientName}
                onChange={handleFieldChange}
              />
              <InputField
                name="projectName"
                label="Project Name"
                value={editingReplacement.projectName}
                onChange={handleFieldChange}
              />
              <SelectField
                name="itemType"
                label="Item Type *"
                value={editingReplacement.itemType}
                onChange={handleFieldChange}
                options={itemTypes}
              />
              <InputField
                name="itemSuppliedBy"
                label="Item Supplied By *"
                value={editingReplacement.itemSuppliedBy}
                onChange={handleFieldChange}
              />
              <InputField
                name="deliveryDate"
                label="Delivery Date *"
                type="date"
                value={editingReplacement.deliveryDate}
                onChange={handleFieldChange}
              />
              <InputField
                name="referenceNo"
                label="Reference No."
                value={editingReplacement.referenceNo}
                onChange={handleFieldChange}
              />
              <InputField
                name="principalInvoice"
                label="Principal Invoice"
                value={editingReplacement.principalInvoice}
                onChange={handleFieldChange}
              />
              <InputField
                name="drNo"
                label="DR No."
                value={editingReplacement.drNo}
                onChange={handleFieldChange}
              />
              <InputField
                name="warrantyClaimETA"
                label="Warranty Claim ETA"
                value={editingReplacement.warrantyClaimETA}
                onChange={handleFieldChange}
              />
              <InputField
                name="replacementDate"
                label="Replacement Date"
                type="date"
                value={editingReplacement.replacementDate}
                onChange={handleFieldChange}
              />
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Selected Items</h3>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Barcode</th>
                    <th className="border p-2 text-center">Qty</th>
                    <th className="border p-2">UOM</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {editingReplacement.selectedItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item.item}
                          onChange={(e) => handleItemChange(idx, "item", e.target.value)}
                          className="w-full border p-1 rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item.barcode}
                          onChange={(e) =>
                            handleItemChange(idx, "barcode", e.target.value)
                          }
                          className="w-full border p-1 rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "qty",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 border p-1 text-center rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item.uom}
                          onChange={(e) => handleItemChange(idx, "uom", e.target.value)}
                          className="w-full border p-1 rounded"
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-red-600 font-bold"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addItem}
                className="mt-2 bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600"
              >
                + Add Item
              </button>
            </div>

            {/* Remarks */}
            <div className="mb-4">
              <TextareaField
                name="remarks"
                label="Remarks"
                value={editingReplacement.remarks}
                onChange={handleFieldChange}
              />
            </div>

            {/* Attach File */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Attach File
              </label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  console.log(file);
                }}
                className="w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2 cursor-pointer
               file:mr-4 file:py-1 file:px-3 file:rounded file:border-0
               file:text-sm file:font-semibold file:bg-orange-500 file:text-white
               hover:file:bg-orange-600"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingReplacement(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditingReplacement(null)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
