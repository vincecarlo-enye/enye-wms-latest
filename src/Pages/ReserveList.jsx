import { useEffect, useMemo, useState } from "react";
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
import { ReserveService } from "../services/reserve.service";

const ITEM_TYPES = [
  "IMPORTED MATERIALS",
  "LOCAL MATERIALS",
  "MOCK-UP MATERIALS",
  "NON MOVING IMPORTED MATERIALS",
  "NON MOVING LOCAL MATERIALS",
  "TOOLS",
];

export default function ReserveList() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [editingReserve, setEditingReserve] = useState(null);
  const [reserveItems, setReserveItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");

  const [reserveList, setReserveList] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const itemsPerPage = 10;

  const headerBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const titleColor = isCebu ? "text-purple-600" : "text-orange-600";
  const hoverRow = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const editBtn = isCebu ? "text-purple-600 hover:text-purple-800" : "text-orange-600 hover:text-orange-800";
  const iconBg = isCebu ? "bg-purple-500" : "bg-orange-500";
  const saveBtnBg = isCebu ? "bg-purple-600 hover:bg-purple-700" : "bg-orange-600 hover:bg-orange-700";
  const focusBorder = isCebu ? "focus:border-purple-500" : "focus:border-orange-500";
  const pgBorder = isCebu ? "border-purple-300 hover:bg-purple-100" : "border-orange-300 hover:bg-orange-100";
  const pgActive = isCebu ? "bg-purple-600 text-white border-purple-600" : "bg-orange-600 text-white border-orange-600";

  const normalizeReserve = (row) => ({
    id: row.id,
    warehouse: (row.warehouse || "main").toLowerCase(),
    srfNo: row.srf_no || row.srf_no_ec || row.srfnoec || "",
    srfNoEc: row.srf_no_ec || row.srfnoec || "",
    intendedFor: row.intended_for || row.intendedfor || "",
    usedFor: row.used_for || row.usedfor || "",
    requestedBy: row.requested_by || row.requestedby || "",
    approvedBy: row.approved_by || row.approvedby || "",
    reserveDueDate: row.reserve_due_date || row.reserve_duedate || "",
    reservedDate: row.date_needed || row.reserved_date || row.reservedDate || "",
    toBeReturnedOn: row.return_on || row.to_be_returned_on || "",
    status: row.status || "Reserved",
    itemType: row.item_type || row.itemtype || "",
    remarks: row.remarks || "",
    notedBy: row.noted_by || "",
    receivedByPL: row.received_by_pl || "",
    approvedByPL: row.approved_by_pl || "",
    releasedBy: row.released_by || "",
    receivedBy: row.received_by || "",
    items: (row.items || []).map((item) => ({
      id: item.id,
      productName: item.prod_name || item.product_name || item.productName || "",
      barcode: item.barcode || "",
      quantity: Number(item.qty || item.quantity || 1),
      uom: item.uom || "pc",
      notes: item.item_notes || item.notes || "",
    })),
  });

  const normalizeProduct = (row) => ({
    id: row.id,
    productName: row.prod_name || row.product_name || row.productName || "",
    barcode: row.barcode || "",
    stock: Number(row.stock || row.quantity || row.qty || 0),
    brand: row.brand || "",
    requestQty: 1,
  });

  const fetchReserveList = async () => {
    try {
      setLoading(true);
      const res = await ReserveService.listReserveRequests({ search });
      const rows = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setReserveList(rows.map(normalizeReserve));
    } catch (error) {
      console.error("Fetch reserve list error:", error);
      setReserveList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await ReserveService.listProducts();
      const rows = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setProducts(rows.map(normalizeProduct));
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchReserveList();
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const warehouseList = useMemo(() => {
    return reserveList.filter((i) => i.warehouse === currentWarehouse);
  }, [reserveList, currentWarehouse]);

  const filteredList = useMemo(() => {
    return warehouseList.filter((i) =>
      i.srfNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [warehouseList, search]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.productName.toLowerCase().includes(itemSearch.toLowerCase())
    );
  }, [products, itemSearch]);

  const handleEditReserve = (reserve) => {
    setEditingReserve({ ...reserve });
    setReserveItems((reserve.items || []).map((i) => ({ ...i })));
  };

  const updateReserveItem = (index, field, value) => {
    const updated = [...reserveItems];
    updated[index][field] = field === "quantity" ? Math.max(1, Number(value) || 1) : value;
    setReserveItems(updated);
  };

  const removeReserveItem = (index) => {
    const updated = [...reserveItems];
    updated.splice(index, 1);
    setReserveItems(updated);
  };

  const updateRequestQty = (index, value) => {
    const product = filteredProducts[index];
    if (!product) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.barcode === product.barcode
          ? { ...p, requestQty: Math.max(1, Number(value) || 1) }
          : p
      )
    );
  };

  const addProductToReserve = (index) => {
    const product = filteredProducts[index];
    if (!product) return;

    if (!reserveItems.find((i) => i.barcode === product.barcode)) {
      setReserveItems([
        ...reserveItems,
        {
          productName: product.productName,
          barcode: product.barcode,
          quantity: product.requestQty || 1,
          uom: "pc",
          notes: "",
        },
      ]);
    }
  };

  const handleSaveReserve = async () => {
    if (!editingReserve?.id) {
      alert("Missing reserve ID.");
      return;
    }

    const payload = {
      srf_no: editingReserve.srfNo || null,
      srf_no_ec: editingReserve.srfNoEc || null,
      type: "reserve",
      warehouse: currentWarehouse,
      intended_for: editingReserve.intendedFor || "",
      used_for: editingReserve.usedFor || "",
      requested_by: editingReserve.requestedBy || "",
      approved_by: editingReserve.approvedBy || "",
      reserve_due_date: editingReserve.reserveDueDate || "",
      date_needed: editingReserve.reservedDate || "",
      return_on: editingReserve.toBeReturnedOn || "",
      item_type: editingReserve.itemType || "",
      status: editingReserve.status || "Reserved",
      remarks: editingReserve.remarks || "",
      items: reserveItems.map((item) => ({
        prod_name: item.productName || "",
        qty: Number(item.quantity || 1),
        uom: item.uom || "pc",
        barcode: item.barcode || "",
        item_notes: item.notes || "",
      })),
    };

    try {
      setSaving(true);
      await ReserveService.updateReserveRequest(editingReserve.id, payload);
      alert("Reserve updated successfully.");
      setEditingReserve(null);
      fetchReserveList();
    } catch (error) {
      console.error("Update reserve error:", error);
      alert(error?.response?.data?.message || "Failed to update reserve.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReserve = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this reserve request?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await ReserveService.deleteReserveRequest(id);
      alert("Reserve deleted successfully.");
      if (selectedReserve?.id === id) setSelectedReserve(null);
      if (editingReserve?.id === id) setEditingReserve(null);
      fetchReserveList();
    } catch (error) {
      console.error("Delete reserve error:", error);
      alert(error?.response?.data?.message || "Failed to delete reserve.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${titleColor}`}>Reserve Lists</h2>
        <p className="text-gray-500 text-sm">Manage reserved requests</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search SRF No..."
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

      <div className="bg-gray-50 p-6">
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">Loading reserve records...</td>
                  </tr>
                ) : paginatedList.length > 0 ? (
                  paginatedList.map((item, index) => (
                    <tr key={item.id ?? index} className={`transition ${hoverRow}`}>
                      <td className="px-6 py-4 font-medium text-gray-800">{item.srfNo}</td>
                      <td className="px-6 py-4 text-gray-600">{item.intendedFor}</td>
                      <td className="px-6 py-4 text-gray-600">{item.usedFor}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{item.reservedDate}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{item.toBeReturnedOn || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Returned" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => setSelectedReserve(item)} className="text-blue-600 hover:text-blue-800 transition"><Eye size={18} /></button>
                          <button onClick={() => handleEditReserve(item)} className={`transition ${editBtn}`}><Pencil size={18} /></button>
                          <button
                            onClick={() => handleDeleteReserve(item.id)}
                            disabled={deletingId === item.id}
                            className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
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
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">Loading reserve records...</td>
                  </tr>
                ) : paginatedList.length > 0 ? (
                  paginatedList.map((item, index) => (
                    <tr key={item.id ?? index} className={`transition ${hoverRow}`}>
                      <td className="px-6 py-4 font-medium text-gray-800">{item.srfNo}</td>
                      <td className="px-6 py-4 text-gray-600">{item.usedFor}</td>
                      <td className="px-6 py-4 text-gray-600">{item.requestedBy || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{item.approvedBy || "-"}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{item.reserveDueDate || "-"}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{item.reservedDate}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Returned" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => setSelectedReserve(item)} className="text-blue-600 hover:text-blue-800 transition"><Eye size={18} /></button>
                          <button onClick={() => handleEditReserve(item)} className={`transition ${editBtn}`}><Pencil size={18} /></button>
                          <button
                            onClick={() => handleDeleteReserve(item.id)}
                            disabled={deletingId === item.id}
                            className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
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

        <div className="sm:hidden space-y-4">
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading reserve records...</div>
          ) : paginatedList.length > 0 ? (
            paginatedList.map((item, index) => (
              <div key={item.id ?? index} className="bg-white shadow rounded-lg p-4 divide-y divide-gray-200">
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
                  <button
                    onClick={() => handleDeleteReserve(item.id)}
                    disabled={deletingId === item.id}
                    className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">No reserve records found.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${pgBorder}`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${currentPage === page ? pgActive : pgBorder}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${pgBorder}`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedReserve && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 print:bg-white print:block">
          <div className="bg-white w-[1000px] max-w-[95vw] max-h-[90vh] overflow-auto p-8 shadow-lg print:shadow-none print:max-h-full print:w-full">
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

            <div className="text-sm mb-6"><strong>Remarks:</strong> {selectedReserve.remarks || "-"}</div>

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

      {editingReserve && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[1000px] max-w-[95vw] max-h-[90vh] overflow-auto p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Reserve Request</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Hash size={18} className="text-white" /></div>
                </div>
                <input type="text" value={editingReserve.srfNo} disabled className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none" />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">SRF No.</label>
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><User size={18} className="text-white" /></div>
                </div>
                {isCebu ? (
                  <>
                    <input type="text" value={editingReserve.usedFor || ""} onChange={(e) => setEditingReserve({ ...editingReserve, usedFor: e.target.value })} placeholder=" " className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                    <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.usedFor ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>Used For</label>
                  </>
                ) : (
                  <>
                    <input type="text" value={editingReserve.intendedFor || ""} onChange={(e) => setEditingReserve({ ...editingReserve, intendedFor: e.target.value })} placeholder=" " className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                    <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.intendedFor ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>Intended For</label>
                  </>
                )}
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Clipboard size={18} className="text-white" /></div>
                </div>
                {isCebu ? (
                  <>
                    <input type="text" value={editingReserve.requestedBy || ""} onChange={(e) => setEditingReserve({ ...editingReserve, requestedBy: e.target.value })} placeholder=" " className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                    <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.requestedBy ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>Requested By</label>
                  </>
                ) : (
                  <>
                    <input type="text" value={editingReserve.usedFor || ""} onChange={(e) => setEditingReserve({ ...editingReserve, usedFor: e.target.value })} placeholder=" " className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                    <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.usedFor ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>To Be Used For</label>
                  </>
                )}
              </div>

              {isCebu && (
                <div className="relative flex items-center w-full">
                  <div className="absolute left-0 h-full flex items-center">
                    <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><User size={18} className="text-white" /></div>
                  </div>
                  <input type="text" value={editingReserve.approvedBy || ""} onChange={(e) => setEditingReserve({ ...editingReserve, approvedBy: e.target.value })} placeholder=" " className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                  <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.approvedBy ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>Approved By</label>
                </div>
              )}

              {isCebu && (
                <div className="relative flex items-center w-full">
                  <div className="absolute left-0 h-full flex items-center">
                    <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><CalendarCheck size={18} className="text-white" /></div>
                  </div>
                  <input type="date" value={editingReserve.reserveDueDate || ""} onChange={(e) => setEditingReserve({ ...editingReserve, reserveDueDate: e.target.value })} className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`} />
                  <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.reserveDueDate ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>Reserve Due Date</label>
                </div>
              )}

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Calendar size={18} className="text-white" /></div>
                </div>
                <input type="date" value={editingReserve.reservedDate || ""} onChange={(e) => setEditingReserve({ ...editingReserve, reservedDate: e.target.value })} className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500" />
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.reservedDate ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>Reserved Date</label>
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><Box size={18} className="text-white" /></div>
                </div>
                <select value={editingReserve.itemType || ""} onChange={(e) => setEditingReserve({ ...editingReserve, itemType: e.target.value })} className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-500">
                  <option value="">Select Item Type</option>
                  {ITEM_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.itemType ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>Item Type</label>
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}><CalendarCheck size={18} className="text-white" /></div>
                </div>
                <input type="date" value={editingReserve.toBeReturnedOn || ""} onChange={(e) => setEditingReserve({ ...editingReserve, toBeReturnedOn: e.target.value })} className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-red-500" />
                <label className={`absolute left-12 bg-white px-1 transition-all duration-200 ${editingReserve.toBeReturnedOn ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}>To Be Returned On</label>
              </div>
            </div>

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
                        <input type="number" min={1} value={item.quantity} onChange={(e) => updateReserveItem(idx, "quantity", e.target.value)} className="w-full border p-1 rounded text-center" />
                      </td>
                      <td className="border p-2 text-center">{item.uom}</td>
                      <td className="border p-2">
                        <input type="text" value={item.notes} onChange={(e) => updateReserveItem(idx, "notes", e.target.value)} className="w-full border p-1 rounded" />
                      </td>
                      <td className="border p-2 text-center">
                        <Trash2 size={18} className="text-red-600 hover:text-red-800 cursor-pointer mx-auto" onClick={() => removeReserveItem(idx)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Add Products</h3>
              <input type="text" placeholder="Search item here..." value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} className="w-full border p-2 mb-2 rounded" />
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
                  {productsLoading ? (
                    <tr>
                      <td colSpan={6} className="border p-2 text-center text-gray-500">Loading products...</td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product, idx) => (
                      <tr key={product.id ?? idx}>
                        <td className="border p-2">{product.productName}</td>
                        <td className="border p-2">{product.barcode}</td>
                        <td className="border p-2 text-center">{product.stock}</td>
                        <td className="border p-2 text-center">
                          <input type="number" min={1} value={product.requestQty || 1} onChange={(e) => updateRequestQty(idx, e.target.value)} className="w-full border p-1 rounded text-center" />
                        </td>
                        <td className="border p-2">{product.brand}</td>
                        <td className="border p-2 text-center">
                          <button onClick={() => addProductToReserve(idx)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                            ADD
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="border p-2 text-center text-gray-500">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setEditingReserve(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleSaveReserve} disabled={saving} className={`text-white px-4 py-2 rounded ${saveBtnBg} disabled:opacity-50`}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
