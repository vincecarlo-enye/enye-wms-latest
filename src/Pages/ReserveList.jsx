import { useState } from "react";
import {
  Search,
  Pencil,
  Eye,
  Trash2,
  Hash,
  User,
  Clipboard,
  Calendar,
  Box,
  CalendarCheck,
} from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";

// ─── Warehouse Config ─────────────────────────────────────────────────────────
// Main columns: SRF No. | Intended For | Used For | Reserved Date | To Be Returned On | Status | Action
// Cebu columns: SRF No. | Used For | Requested By | Approved By | Reserve Due Date | Reserved Date | Status | Action

const CEBU_FIELDS = {
  col2: "usedFor",
  col3: "requestedBy",
  col4: "approvedBy",
  col5: "reserveDueDate",  // new cebu-only field
  col6: "reservedDate",
};

// ─── Sample Data ──────────────────────────────────────────────────────────────
const ALL_RESERVE_LIST = [
  // MAIN
  {
    warehouse: "main",
    srfNo: "2024-101-r",
    intendedFor: "Project Beta",
    usedFor: "Inspection",
    reservedDate: "2024-02-10",
    toBeReturnedOn: "2024-02-15",
    status: "Returned",
    itemType: "LOCAL MATERIALS",
    items: [{ productName: "Inspection Kit", barcode: "10000001", quantity: 2, uom: "pcs", notes: "" }],
  },
  {
    warehouse: "main",
    srfNo: "2024-102-r",
    intendedFor: "Sample Team",
    usedFor: "Field Work",
    reservedDate: "2024-02-12",
    toBeReturnedOn: "",
    status: "Reserved",
    itemType: "IMPORTED MATERIALS",
    items: [{ productName: "Field Sensor", barcode: "10000002", quantity: 1, uom: "pc", notes: "" }],
  },
  // CEBU
  {
    warehouse: "cebu",
    srfNo: "CBU-R-2024-001",
    usedFor: "Site Maintenance",
    requestedBy: "Juan dela Cruz",
    approvedBy: "Maria Santos",
    reserveDueDate: "2024-03-20",
    reservedDate: "2024-03-15",
    toBeReturnedOn: "2024-03-22",
    status: "Returned",
    itemType: "TOOLS",
    items: [{ productName: "Wrench Set", barcode: "CBU00001", quantity: 2, uom: "set", notes: "" }],
  },
  {
    warehouse: "cebu",
    srfNo: "CBU-R-2024-002",
    usedFor: "Pipe Repair",
    requestedBy: "Pedro Reyes",
    approvedBy: "Ana Gonzales",
    reserveDueDate: "2024-04-10",
    reservedDate: "2024-04-05",
    toBeReturnedOn: "",
    status: "Reserved",
    itemType: "LOCAL MATERIALS",
    items: [{ productName: "PVC Pipe 2in", barcode: "CBU00002", quantity: 10, uom: "pc", notes: "" }],
  },
];

const ALL_PRODUCTS = [
  { productName: "MEASURING TAPE 50FT", barcode: "20000001", stock: 10, brand: "STANLEY" },
  { productName: "SAFETY HELMET", barcode: "20000002", stock: 15, brand: "3M" },
  { productName: "WRENCH SET", barcode: "20000003", stock: 5, brand: "FACOM" },
  { productName: "DRILL MACHINE", barcode: "20000004", stock: 7, brand: "BOSCH" },
  { productName: "SAFETY GLOVES", barcode: "20000005", stock: 50, brand: "LOCAL" },
  { productName: "TORQUE WRENCH", barcode: "20000006", stock: 8, brand: "CHINA" },
  { productName: "VALVE DN100", barcode: "20000007", stock: 20, brand: "CHINA" },
  { productName: "WRENCH SET 10PC", barcode: "CBU10001", stock: 8, brand: "STANLEY" },
  { productName: "PVC PIPE 2IN", barcode: "CBU10002", stock: 50, brand: "LOCAL" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ReserveList() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [editingReserve, setEditingReserve] = useState(null);
  const [reserveItems, setReserveItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(ALL_PRODUCTS);

  const itemsPerPage = 10;

  // Theming
  const headerBg     = isCebu ? "bg-purple-600"                       : "bg-orange-600";
  const titleColor   = isCebu ? "text-purple-600"                     : "text-orange-600";
  const hoverRow     = isCebu ? "hover:bg-purple-50"                  : "hover:bg-orange-50";
  const editBtn      = isCebu ? "text-purple-600 hover:text-purple-800" : "text-orange-600 hover:text-orange-800";
  const iconBg       = isCebu ? "bg-purple-500"                       : "bg-orange-500";
  const saveBtnBg    = isCebu ? "bg-purple-600 hover:bg-purple-700"     : "bg-orange-600 hover:bg-orange-700";
  const focusBorder  = isCebu ? "focus:border-purple-500"             : "focus:border-orange-500";
  const pgBorder     = isCebu ? "border-purple-300 hover:bg-purple-100" : "border-orange-300 hover:bg-orange-100";
  const pgActive     = isCebu ? "bg-purple-600 text-white border-purple-600" : "bg-orange-600 text-white border-orange-600";

  // Filtered data
  const warehouseList = ALL_RESERVE_LIST.filter((i) => i.warehouse === currentWarehouse);
  const filteredList  = warehouseList.filter((i) =>
    i.srfNo.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages        = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList     = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditReserve = (reserve) => {
    setEditingReserve({ ...reserve });
    setReserveItems(reserve.items.map((i) => ({ ...i })));
  };

  const updateReserveItem = (index, field, value) => {
    const updated = [...reserveItems];
    updated[index][field] = value;
    setReserveItems(updated);
  };

  const removeReserveItem = (index) => {
    const updated = [...reserveItems];
    updated.splice(index, 1);
    setReserveItems(updated);
  };

  const updateRequestQty = (index, value) => {
    const updated = [...filteredProducts];
    updated[index].requestQty = value;
    setFilteredProducts(updated);
  };

  const addProductToReserve = (index) => {
    const product = filteredProducts[index];
    if (!reserveItems.find((i) => i.barcode === product.barcode)) {
      setReserveItems([
        ...reserveItems,
        { productName: product.productName, barcode: product.barcode, quantity: product.requestQty || 1, uom: "pc", notes: "" },
      ]);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${titleColor}`}>Reserve Lists</h2>
        <p className="text-gray-500 text-sm">Manage reserved requests</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search SRF No..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none ${focusBorder} pr-10`}
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-gray-50 p-6">

        {/* ── MAIN TABLE — Desktop ── */}
        {!isCebu && (
          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full border border-gray-200">
              <thead className={`${headerBg} text-white`}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">SRF No.</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Intended For</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Used For</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Reserved Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">To Be Returned On</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedList.length > 0 ? (
                  paginatedList.map((item, index) => (
                    <tr key={index} className={`transition ${hoverRow}`}>
                      <td className="px-6 py-4 font-medium text-gray-800">{item.srfNo}</td>
                      <td className="px-6 py-4 text-gray-600">{item.intendedFor}</td>
                      <td className="px-6 py-4 text-gray-600">{item.usedFor}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{item.reservedDate}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{item.toBeReturnedOn || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Returned" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>{item.status}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => setSelectedReserve(item)} className="text-blue-600 hover:text-blue-800 transition"><Eye size={18} /></button>
                          <button onClick={() => handleEditReserve(item)} className={`transition ${editBtn}`}><Pencil size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-500">No reserve records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── CEBU TABLE — Desktop ── */}
        {isCebu && (
          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full border border-gray-200">
              <thead className={`${headerBg} text-white`}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">SRF No.</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Used For</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Requested By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Approved By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Reserve Due Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Reserved Date</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedList.length > 0 ? (
                  paginatedList.map((item, index) => (
                    <tr key={index} className={`transition ${hoverRow}`}>
                      <td className="px-6 py-4 font-medium text-gray-800">{item.srfNo}</td>
                      <td className="px-6 py-4 text-gray-600">{item.usedFor}</td>
                      <td className="px-6 py-4 text-gray-600">{item.requestedBy || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{item.approvedBy || "-"}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{item.reserveDueDate || "-"}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{item.reservedDate}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Returned" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>{item.status}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => setSelectedReserve(item)} className="text-blue-600 hover:text-blue-800 transition"><Eye size={18} /></button>
                          <button onClick={() => handleEditReserve(item)} className={`transition ${editBtn}`}><Pencil size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-500">No reserve records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── MOBILE CARDS ── */}
        <div className="sm:hidden space-y-4">
          {paginatedList.length > 0 ? (
            paginatedList.map((item, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-4 divide-y divide-gray-200">
                <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">SRF No.</span><span className="text-gray-800">{item.srfNo}</span></div>
                {!isCebu && <>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Intended For</span><span className="text-gray-800">{item.intendedFor}</span></div>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Used For</span><span className="text-gray-800">{item.usedFor}</span></div>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Reserved Date</span><span className="text-gray-800">{item.reservedDate}</span></div>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">To Be Returned On</span><span className="text-gray-800">{item.toBeReturnedOn || "-"}</span></div>
                </>}
                {isCebu && <>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Used For</span><span className="text-gray-800">{item.usedFor}</span></div>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Requested By</span><span className="text-gray-800">{item.requestedBy || "-"}</span></div>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Approved By</span><span className="text-gray-800">{item.approvedBy || "-"}</span></div>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Reserve Due Date</span><span className="text-gray-800">{item.reserveDueDate || "-"}</span></div>
                  <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Reserved Date</span><span className="text-gray-800">{item.reservedDate}</span></div>
                </>}
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-700">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.status === "Returned" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{item.status}</span>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setSelectedReserve(item)} className="text-blue-600 hover:text-blue-800 transition"><Eye size={18} /></button>
                  <button onClick={() => handleEditReserve(item)} className={`transition ${editBtn}`}><Pencil size={18} /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">No reserve records found.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center mt-6 space-x-2">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${pgBorder}`}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${currentPage === page ? pgActive : pgBorder}`}>
                  {page}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${pgBorder}`}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── VIEW MODAL ────────────────────────────────────────────────────────── */}
      {selectedReserve && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 print:bg-white print:block">
          <div className="bg-white w-250 max-h-[90vh] overflow-auto p-8 shadow-lg print:shadow-none print:max-h-full print:w-full">

            <div className="text-center mb-6">
              <h1 className={`text-3xl font-bold ${titleColor}`}>{isCebu ? "ENYE — Cebu" : "ENYE"}</h1>
              <h2 className="text-lg font-semibold">Reserve</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm mb-6">
              <div>
                {isCebu ? (
                  <p>Requested by: <strong>{selectedReserve.requestedBy || "-"}</strong></p>
                ) : (
                  <p>Intended for: <strong>{selectedReserve.intendedFor}</strong></p>
                )}
                <p>Item type: <strong>{selectedReserve.itemType || "Local Item/s"}</strong></p>
              </div>
              <div>
                {isCebu ? (
                  <p>Approved by: <strong>{selectedReserve.approvedBy || "-"}</strong></p>
                ) : (
                  <p>To be used for: <strong>{selectedReserve.usedFor}</strong></p>
                )}
                <p>
                  {isCebu ? "Reserve Due Date" : "Date needed"}:{" "}
                  <strong>{isCebu ? (selectedReserve.reserveDueDate || "-") : selectedReserve.reservedDate}</strong>
                </p>
              </div>
              <div className="text-right">
                <p>SRF No: <strong>{selectedReserve.srfNo}</strong></p>
                <p>Reserved Date: <strong>{selectedReserve.reservedDate}</strong></p>
                {isCebu && <p>To be returned on: <strong>{selectedReserve.toBeReturnedOn || "-"}</strong></p>}
              </div>
            </div>

            <hr className="mb-6" />

            <table className="w-full border border-gray-400 text-sm mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Barcode</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">UOM</th>
                  <th className="border p-2">Notes</th>
                  <th className="border p-2">Release/Reserve</th>
                </tr>
              </thead>
              <tbody>
                {selectedReserve.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{item.productName}</td>
                    <td className="border p-2">{item.barcode}</td>
                    <td className="border p-2 text-center">{item.quantity}</td>
                    <td className="border p-2 text-center">{item.uom}</td>
                    <td className="border p-2">{item.notes}</td>
                    <td className="border p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-sm mb-6"><strong>Remarks:</strong> THIS IS FOR DEMO PURPOSES</div>

            {/* Signature Section */}
            <div className="border border-gray-400 text-sm mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 print:grid-cols-7">
                {isCebu ? (
                  <>
                    <div className="border p-3"><div className="font-semibold mb-3">Requested by:</div><div>{selectedReserve.requestedBy || "—"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Approved by:</div><div>{selectedReserve.approvedBy || "—"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Received by PL:</div><div>Cebu Logistics</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Approved by PL:</div><div>Cebu Logistics Mgr</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Released/Reserved by:</div><div>Cebu Logistics</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Received by:</div><div>Employee</div></div>
                  </>
                ) : (
                  <>
                    <div className="border p-3"><div className="font-semibold mb-3">Requested by:</div><div>{selectedReserve.requestedBy || "Admin Enye"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Noted by:</div><div>{selectedReserve.notedBy || "Immediate Supervisor"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Approved by:</div><div>{selectedReserve.approvedBy || "Department Manager"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Received by PL:</div><div>{selectedReserve.receivedByPL || "Logistics"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Approved by PL:</div><div>{selectedReserve.approvedByPL || "Logistics Manager"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Released/Reserved by:</div><div>{selectedReserve.releasedBy || "Logistics"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Received by:</div><div>{selectedReserve.receivedBy || "Employee"}</div></div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 print:hidden">
              <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Print</button>
              <button onClick={() => setSelectedReserve(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ────────────────────────────────────────────────────────── */}
      {editingReserve && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-250 max-h-[90vh] overflow-auto p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Reserve Request</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

              {/* SRF No. */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Hash size={18} className="text-white" /></div>
                </div>
                <input type="text" value={editingReserve.srfNo} disabled
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none" />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">SRF No.</label>
              </div>

              {/* Intended For (Main) / Used For (Cebu) */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><User size={18} className="text-white" /></div>
                </div>
                {isCebu ? (
                  <>
                    <input type="text" value={editingReserve.usedFor || ""}
                      onChange={(e) => setEditingReserve({ ...editingReserve, usedFor: e.target.value })}
                      placeholder=" "
                      className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                    <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.usedFor ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                      Used For
                    </label>
                  </>
                ) : (
                  <>
                    <input type="text" value={editingReserve.intendedFor || ""}
                      onChange={(e) => setEditingReserve({ ...editingReserve, intendedFor: e.target.value })}
                      placeholder=" "
                      className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                    <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.intendedFor ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                      Intended For
                    </label>
                  </>
                )}
              </div>

              {/* Used For (Main) / Requested By (Cebu) */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Clipboard size={18} className="text-white" /></div>
                </div>
                {isCebu ? (
                  <>
                    <input type="text" value={editingReserve.requestedBy || ""}
                      onChange={(e) => setEditingReserve({ ...editingReserve, requestedBy: e.target.value })}
                      placeholder=" "
                      className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                    <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.requestedBy ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                      Requested By
                    </label>
                  </>
                ) : (
                  <>
                    <input type="text" value={editingReserve.usedFor || ""}
                      onChange={(e) => setEditingReserve({ ...editingReserve, usedFor: e.target.value })}
                      placeholder=" "
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500" />
                    <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.usedFor ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                      To Be Used For
                    </label>
                  </>
                )}
              </div>

              {/* Approved By — Cebu only */}
              {isCebu && (
                <div className="relative flex items-center w-full">
                  <div className="absolute left-0 h-full flex items-center">
                    <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><User size={18} className="text-white" /></div>
                  </div>
                  <input type="text" value={editingReserve.approvedBy || ""}
                    onChange={(e) => setEditingReserve({ ...editingReserve, approvedBy: e.target.value })}
                    placeholder=" "
                    className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                  <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.approvedBy ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                    Approved By
                  </label>
                </div>
              )}

              {/* Reserve Due Date — Cebu only */}
              {isCebu && (
                <div className="relative flex items-center w-full">
                  <div className="absolute left-0 h-full flex items-center">
                    <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><CalendarCheck size={18} className="text-white" /></div>
                  </div>
                  <input type="date" value={editingReserve.reserveDueDate || ""}
                    onChange={(e) => setEditingReserve({ ...editingReserve, reserveDueDate: e.target.value })}
                    className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                  <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.reserveDueDate ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                    Reserve Due Date
                  </label>
                </div>
              )}

              {/* Reserved Date */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Calendar size={18} className="text-white" /></div>
                </div>
                <input type="date" value={editingReserve.reservedDate || ""}
                  onChange={(e) => setEditingReserve({ ...editingReserve, reservedDate: e.target.value })}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500" />
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.reservedDate ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                  Reserved Date
                </label>
              </div>

              {/* Item Type */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Box size={18} className="text-white" /></div>
                </div>
                <select value={editingReserve.itemType || ""}
                  onChange={(e) => setEditingReserve({ ...editingReserve, itemType: e.target.value })}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-500">
                  <option value="">Select Item Type</option>
                  <option>IMPORTED MATERIALS</option>
                  <option>LOCAL MATERIALS</option>
                  <option>MOCK-UP MATERIALS</option>
                  <option>NON MOVING IMPORTED MATERIALS</option>
                  <option>NON MOVING LOCAL MATERIALS</option>
                  <option>TOOLS</option>
                </select>
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.itemType ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                  Item Type
                </label>
              </div>

              {/* To Be Returned On */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><CalendarCheck size={18} className="text-white" /></div>
                </div>
                <input type="date" value={editingReserve.toBeReturnedOn || ""}
                  onChange={(e) => setEditingReserve({ ...editingReserve, toBeReturnedOn: e.target.value })}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-red-500" />
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.toBeReturnedOn ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>
                  To Be Returned On
                </label>
              </div>

            </div>

            {/* Reserve Items Table */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Reserve Items</h3>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Barcode</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">UOM</th>
                    <th className="border p-2">Notes</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reserveItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{item.productName}</td>
                      <td className="border p-2">{item.barcode}</td>
                      <td className="border p-2">
                        <input type="number" min={1} value={item.quantity}
                          onChange={(e) => updateReserveItem(idx, "quantity", e.target.value)}
                          className="w-full border p-1 rounded text-center" />
                      </td>
                      <td className="border p-2 text-center">{item.uom}</td>
                      <td className="border p-2">
                        <input type="text" value={item.notes}
                          onChange={(e) => updateReserveItem(idx, "notes", e.target.value)}
                          className="w-full border p-1 rounded" />
                      </td>
                      <td className="border p-2 text-center">
                        <Trash2 size={18} className="text-red-600 hover:text-red-800 cursor-pointer mx-auto"
                          onClick={() => removeReserveItem(idx)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Products Table */}
            <div>
              <h3 className="font-semibold mb-2">Add Products</h3>
              <input type="text" placeholder="Search item here..." value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="w-full border p-2 mb-2 rounded" />
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Product Name</th>
                    <th className="border p-2">Barcode</th>
                    <th className="border p-2">Stock</th>
                    <th className="border p-2">Request Qty</th>
                    <th className="border p-2">Brand</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts
                    .filter((p) => p.productName.toLowerCase().includes(itemSearch.toLowerCase()))
                    .map((product, idx) => (
                      <tr key={idx}>
                        <td className="border p-2">{product.productName}</td>
                        <td className="border p-2">{product.barcode}</td>
                        <td className="border p-2 text-center">{product.stock}</td>
                        <td className="border p-2 text-center">
                          <input type="number" min={1} value={product.requestQty || 1}
                            onChange={(e) => updateRequestQty(idx, e.target.value)}
                            className="w-full border p-1 rounded text-center" />
                        </td>
                        <td className="border p-2">{product.brand}</td>
                        <td className="border p-2 text-center">
                          <button onClick={() => addProductToReserve(idx)}
                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                            ADD
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setEditingReserve(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={() => setEditingReserve(null)} className={`text-white px-4 py-2 rounded ${saveBtnBg}`}>Save</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}