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

// ─── Warehouse Config ────────────────────────────────────────────────────────
const COL_LABELS = {
  main: { col3: "Intended For", col4: "Used For" },
  cebu: { col3: "Requested By", col4: "Approved By" },
};

const FIELD_KEYS = {
  main: { col3: "intendedFor", col4: "usedFor" },
  cebu: { col3: "requestedBy", col4: "approvedBy" },
};

// ─── Sample Data ─────────────────────────────────────────────────────────────
const ALL_BORROW_LIST = [
  {
    warehouse: "main",
    srfNo: "2023-355-e",
    intendedFor: "Sample",
    usedFor: "Testing",
    borrowedDate: "2023-09-13",
    returnedOn: "2023-09-15",
    status: "Returned",
    itemType: "LOCAL MATERIALS",
    items: [
      { productName: "Sample Item", barcode: "00000001", quantity: 1, uom: "pc", notes: "" },
    ],
  },
  {
    warehouse: "main",
    srfNo: "2023-356-e",
    intendedFor: "Project Alpha",
    usedFor: "Installation",
    borrowedDate: "2023-09-18",
    returnedOn: "",
    status: "Borrowed",
    itemType: "IMPORTED MATERIALS",
    items: [
      { productName: "Project Item", barcode: "00000002", quantity: 1, uom: "pc", notes: "" },
    ],
  },
  {
    warehouse: "cebu",
    srfNo: "CBU-2024-001",
    requestedBy: "Juan dela Cruz",
    approvedBy: "Maria Santos",
    borrowedDate: "2024-01-10",
    returnedOn: "2024-01-15",
    status: "Returned",
    itemType: "TOOLS",
    items: [
      { productName: "Wrench Set", barcode: "CBU00001", quantity: 2, uom: "set", notes: "Handle with care" },
    ],
  },
  {
    warehouse: "cebu",
    srfNo: "CBU-2024-002",
    requestedBy: "Pedro Reyes",
    approvedBy: "Ana Gonzales",
    borrowedDate: "2024-02-05",
    returnedOn: "",
    status: "Borrowed",
    itemType: "LOCAL MATERIALS",
    items: [
      { productName: "PVC Pipe 2in", barcode: "CBU00002", quantity: 10, uom: "pc", notes: "" },
    ],
  },
];

const ALL_PRODUCTS = [
  { productName: 'DRILL BIT 5/32"', barcode: "04188095", stock: 10, brand: "DORMER" },
  { productName: 'DRILL BIT 5/32"', barcode: "11182268", stock: 4, brand: "DORMER" },
  { productName: 'DRILL BIT 5/32"', barcode: "06221355", stock: 14, brand: "DORMER" },
  { productName: "PLATE MVD 6 40MM X 20MM", barcode: "08254303", stock: 2, brand: "LOCAL" },
  { productName: "PILOT LAMP 220V GREEN", barcode: "03183146", stock: 160, brand: "CHINA" },
  { productName: "RVHX-0080C", barcode: "05237433", stock: 5, brand: "CONEX BANNINGER" },
  { productName: "ANSI CLASS150-DN250", barcode: "02188176", stock: 194, brand: "CHINA" },
  { productName: "WRENCH SET 10PC", barcode: "CBU10001", stock: 8, brand: "STANLEY" },
  { productName: "PVC PIPE 2IN", barcode: "CBU10002", stock: 50, brand: "LOCAL" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function BorrowList() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";
  const cols = COL_LABELS[currentWarehouse];
  const fields = FIELD_KEYS[currentWarehouse];

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [editingBorrow, setEditingBorrow] = useState(null);
  const [borrowItems, setBorrowItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(ALL_PRODUCTS);

  const itemsPerPage = 10;

  // Theming based on warehouse
  const headerBg      = isCebu ? "bg-purple-600"                       : "bg-orange-600";
  const titleColor    = isCebu ? "text-purple-600"                     : "text-orange-600";
  const hoverRow      = isCebu ? "hover:bg-purple-50"                  : "hover:bg-orange-50";
  const editBtnColor  = isCebu ? "text-purple-600 hover:text-purple-800" : "text-orange-600 hover:text-orange-800";
  const iconBg        = isCebu ? "bg-purple-500"                       : "bg-orange-500";
  const saveBtnBg     = isCebu ? "bg-purple-600 hover:bg-purple-700"     : "bg-orange-600 hover:bg-orange-700";
  const focusBorder   = isCebu ? "focus:border-purple-500"             : "focus:border-orange-500";
  const pgBorder      = isCebu ? "border-purple-300 hover:bg-purple-100" : "border-orange-300 hover:bg-orange-100";
  const pgActive      = isCebu ? "bg-purple-600 text-white border-purple-600" : "bg-orange-600 text-white border-orange-600";

  // Data filtered by warehouse
  const warehouseBorrowList = ALL_BORROW_LIST.filter((i) => i.warehouse === currentWarehouse);
  const filteredBorrowList  = warehouseBorrowList.filter((i) =>
    i.srfNo.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages         = Math.ceil(filteredBorrowList.length / itemsPerPage);
  const paginatedBorrowList = filteredBorrowList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCol3 = (item) => item[fields.col3] || "-";
  const getCol4 = (item) => item[fields.col4] || "-";

  const handleEditBorrow = (borrow) => {
    setEditingBorrow({ ...borrow });
    setBorrowItems(borrow.items.map((item) => ({ ...item })));
  };

  const updateBorrowItem = (index, field, value) => {
    const updated = [...borrowItems];
    updated[index][field] = value;
    setBorrowItems(updated);
  };

  const removeBorrowItem = (index) => {
    const updated = [...borrowItems];
    updated.splice(index, 1);
    setBorrowItems(updated);
  };

  const updateRequestQty = (index, value) => {
    const updated = [...filteredProducts];
    updated[index].requestQty = value;
    setFilteredProducts(updated);
  };

  const addProductToBorrow = (index) => {
    const product = filteredProducts[index];
    if (!borrowItems.find((i) => i.barcode === product.barcode)) {
      setBorrowItems([
        ...borrowItems,
        { productName: product.productName, barcode: product.barcode, quantity: product.requestQty || 1, uom: "pc", notes: "" },
      ]);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${titleColor}`}>Borrow List</h1>
        <p className="text-sm text-gray-500">Manage borrowed and reserved requests</p>
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

        {/* Table — Desktop */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-full border border-gray-200">
            <thead className={`${headerBg} text-white`}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">SRF No.</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">{cols.col3}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">{cols.col4}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Borrowed Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Returned On</th>
                <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedBorrowList.length > 0 ? (
                paginatedBorrowList.map((item, index) => (
                  <tr key={index} className={`transition ${hoverRow}`}>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.srfNo}</td>
                    <td className="px-6 py-4 text-gray-600">{getCol3(item)}</td>
                    <td className="px-6 py-4 text-gray-600">{getCol4(item)}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.borrowedDate}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.returnedOn || "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.status === "Returned" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setSelectedBorrow(item)} className="text-blue-600 hover:text-blue-800 transition">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleEditBorrow(item)} className={`transition ${editBtnColor}`}>
                          <Pencil size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">No borrow records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cards — Mobile */}
        <div className="sm:hidden space-y-4">
          {paginatedBorrowList.length > 0 ? (
            paginatedBorrowList.map((item, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-4 divide-y divide-gray-200">
                <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">SRF No.</span><span className="text-gray-800">{item.srfNo}</span></div>
                <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">{cols.col3}</span><span className="text-gray-800">{getCol3(item)}</span></div>
                <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">{cols.col4}</span><span className="text-gray-800">{getCol4(item)}</span></div>
                <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Borrowed Date</span><span className="text-gray-800">{item.borrowedDate}</span></div>
                <div className="flex justify-between py-2"><span className="font-semibold text-gray-700">Returned On</span><span className="text-gray-800">{item.returnedOn || "-"}</span></div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-700">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.status === "Returned" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{item.status}</span>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setSelectedBorrow(item)} className="text-blue-600 hover:text-blue-800 transition"><Eye size={18} /></button>
                  <button onClick={() => handleEditBorrow(item)} className={`transition ${editBtnColor}`}><Pencil size={18} /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">No borrow records found.</div>
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

      {/* ── VIEW MODAL ──────────────────────────────────────────────────────── */}
      {selectedBorrow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 print:bg-white print:block">
          <div className="bg-white w-250 max-h-[90vh] overflow-auto p-8 shadow-lg print:shadow-none print:max-h-full print:w-full">

            <div className="text-center mb-6">
              <h1 className={`text-3xl font-bold ${titleColor}`}>{isCebu ? "ENYE — Cebu" : "ENYE"}</h1>
              <h2 className="text-lg font-semibold">Borrow</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm mb-6">
              <div>
                <p>{cols.col3}: <strong>{getCol3(selectedBorrow)}</strong></p>
                <p>Item type: <strong>{selectedBorrow.itemType || "Local Item/s"}</strong></p>
              </div>
              <div>
                <p>{cols.col4}: <strong>{getCol4(selectedBorrow)}</strong></p>
                <p>Date needed: <strong>{selectedBorrow.borrowedDate}</strong></p>
              </div>
              <div className="text-right">
                <p>SRF No: <strong>{selectedBorrow.srfNo}</strong></p>
                <p>To be returned on: <strong>{selectedBorrow.returnedOn || "-"}</strong></p>
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
                {selectedBorrow.items.map((item, idx) => (
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

            <div className="text-sm mb-6"><strong>Remarks:</strong> THIS IS FOR TESTING ONLY</div>

            {/* Approval / Signature Section */}
            <div className="border border-gray-400 text-sm mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 print:grid-cols-7">
                {isCebu ? (
                  <>
                    <div className="border p-3"><div className="font-semibold mb-3">Requested by:</div><div>{selectedBorrow.requestedBy || "—"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Approved by:</div><div>{selectedBorrow.approvedBy || "—"}</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Received by PL:</div><div>Cebu Logistics</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Approved by PL:</div><div>Cebu Logistics Mgr</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Released/Reserved by:</div><div>Cebu Logistics</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Received by:</div><div>Employee</div></div>
                  </>
                ) : (
                  <>
                    <div className="border p-3"><div className="font-semibold mb-3">Requested by:</div><div>Admin Enye</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Noted by:</div><div>Immediate Supervisor</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Approved by:</div><div>Department Manager</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Received by PL:</div><div>Logistics</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Approved by PL:</div><div>Logistics Manager</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Released/Reserved by:</div><div>Logistics</div></div>
                    <div className="border p-3"><div className="font-semibold mb-3">Received by:</div><div>Employee</div></div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 print:hidden">
              <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Print</button>
              <button onClick={() => setSelectedBorrow(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ──────────────────────────────────────────────────────── */}
      {editingBorrow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-250 max-h-[90vh] overflow-auto p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Borrow Request</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

              {/* SRF No. */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Hash size={18} className="text-white" /></div>
                </div>
                <input type="text" value={editingBorrow.srfNo} disabled
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none" />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">SRF No.</label>
              </div>

              {/* Col3 — Intended For / Requested By */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><User size={18} className="text-white" /></div>
                </div>
                <input type="text" value={editingBorrow[fields.col3] || ""}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, [fields.col3]: e.target.value })}
                  placeholder=" "
                  className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${
                  editingBorrow[fields.col3] ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"
                }`}>{cols.col3}</label>
              </div>

              {/* Col4 — Used For / Approved By */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Clipboard size={18} className="text-white" /></div>
                </div>
                <input type="text" value={editingBorrow[fields.col4] || ""}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, [fields.col4]: e.target.value })}
                  placeholder=" "
                  className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${
                  editingBorrow[fields.col4] ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"
                }`}>{cols.col4}</label>
              </div>

              {/* Date Needed */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Calendar size={18} className="text-white" /></div>
                </div>
                <input type="date" value={editingBorrow.borrowedDate}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, borrowedDate: e.target.value })}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500" />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">Date Needed</label>
              </div>

              {/* Item Type */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Box size={18} className="text-white" /></div>
                </div>
                <select value={editingBorrow.itemType}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, itemType: e.target.value })}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-500">
                  <option>IMPORTED MATERIALS</option>
                  <option>LOCAL MATERIALS</option>
                  <option>MOCK-UP MATERIALS</option>
                  <option>NON MOVING IMPORTED MATERIALS</option>
                  <option>NON MOVING LOCAL MATERIALS</option>
                  <option>TOOLS</option>
                </select>
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">Item Type</label>
              </div>

              {/* To be returned on */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><CalendarCheck size={18} className="text-white" /></div>
                </div>
                <input type="date" value={editingBorrow.returnedOn}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, returnedOn: e.target.value })}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-red-500" />
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${
                  editingBorrow.returnedOn ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"
                }`}>To be returned on</label>
              </div>

            </div>

            {/* Borrow Items Table */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Borrow Items</h3>
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
                  {borrowItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{item.productName}</td>
                      <td className="border p-2">{item.barcode}</td>
                      <td className="border p-2">
                        <input type="number" min={1} value={item.quantity}
                          onChange={(e) => updateBorrowItem(idx, "quantity", e.target.value)}
                          className="w-full border p-1 rounded text-center" />
                      </td>
                      <td className="border p-2 text-center">{item.uom}</td>
                      <td className="border p-2">
                        <input type="text" value={item.notes}
                          onChange={(e) => updateBorrowItem(idx, "notes", e.target.value)}
                          className="w-full border p-1 rounded" />
                      </td>
                      <td className="border p-2 text-center">
                        <div className="flex justify-center">
                          <Trash2 size={18} className="text-red-600 hover:text-red-800 cursor-pointer" onClick={() => removeBorrowItem(idx)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Product Search/Add Table */}
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
                          <button onClick={() => addProductToBorrow(idx)}
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
              <button onClick={() => setEditingBorrow(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={() => setEditingBorrow(null)} className={`text-white px-4 py-2 rounded ${saveBtnBg}`}>Save</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}