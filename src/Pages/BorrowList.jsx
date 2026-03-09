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
import { RequestService } from "../services/request.service";

const COL_LABELS = {
  main: { col3: "Intended For", col4: "Used For" },
  cebu: { col3: "Requested By", col4: "Approved By" },
};

const FIELD_KEYS = {
  main: { col3: "intendedFor", col4: "usedFor" },
  cebu: { col3: "requestedBy", col4: "approvedBy" },
};

const ITEM_TYPE_OPTIONS = [
  "IMPORTED MATERIALS",
  "LOCAL MATERIALS",
  "MOCK-UP MATERIALS",
  "NON MOVING IMPORTED MATERIALS",
  "NON MOVING LOCAL MATERIALS",
  "TOOLS",
];

export default function BorrowList() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";
  const cols = COL_LABELS[currentWarehouse] || COL_LABELS.main;
  const fields = FIELD_KEYS[currentWarehouse] || FIELD_KEYS.main;

  const [search, setSearch] = useState("");
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [editingBorrow, setEditingBorrow] = useState(null);
  const [borrowItems, setBorrowItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");

  const [borrowList, setBorrowList] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const headerBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const titleColor = isCebu ? "text-purple-600" : "text-orange-600";
  const hoverRow = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const editBtnColor = isCebu ? "text-purple-600 hover:text-purple-800" : "text-orange-600 hover:text-orange-800";
  const iconBg = isCebu ? "bg-purple-500" : "bg-orange-500";
  const saveBtnBg = isCebu ? "bg-purple-600 hover:bg-purple-700" : "bg-orange-600 hover:bg-orange-700";
  const focusBorder = isCebu ? "focus:border-purple-500" : "focus:border-orange-500";

  const normalizeBorrow = (row) => ({
    id: row.id,
    srfNo: row.srf_no || "",
    srfNoEc: row.srf_no_ec || "",
    deptShname: row.dept_shname || "",
    intendedFor: row.intended_for || "",
    usedFor: row.used_for || "",
    requestedBy: row.requested_by || "",
    approvedBy: row.approved_by || "",
    borrowedDate: row.date_needed || row.date_created || "",
    returnedOn: row.return_on || "",
    itemType: row.item_type || "",
    warehouse: row.warehouse || "",
    remarks: row.remarks || "",
    status: row.status || "Pending",
    stat: row.stat ?? 0,
    type: row.type || "borrow",
    items: (row.items || []).map((item) => ({
      id: item.id,
      productName: item.prod_name || "",
      barcode: item.barcode || "",
      quantity: Number(item.qty || 1),
      uom: item.uom || "",
      notes: item.item_notes || "",
      brand: item.brand || "",
    })),
  });

  const fetchBorrowRequests = async () => {
    try {
      setLoading(true);
      const res = await RequestService.listBorrowRequests({
        search,
        type: "borrow",
      });

      const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setBorrowList(rows.map(normalizeBorrow));
    } catch (error) {
      console.error("Fetch borrow requests error:", error);
      setBorrowList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await RequestService.listProducts({ page: 1, perPage: 200 });
      const rows = res?.data?.data || res?.data || res?.items || [];

      const normalized = Array.isArray(rows)
        ? rows.map((p) => ({
            id: p.id,
            productName: p.prod_name || p.product_name || p.productName || p.name || "",
            barcode: p.barcode || "",
            stock: Number(p.stock || p.qty || p.quantity || 0),
            brand: p.brand || "",
            requestQty: 1,
          }))
        : [];

      setProducts(normalized);
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowRequests();
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const getCol3 = (item) => item?.[fields.col3] || "-";
  const getCol4 = (item) => item?.[fields.col4] || "-";

  const handleEditBorrow = (borrow) => {
    setEditingBorrow({ ...borrow });
    setBorrowItems((borrow.items || []).map((item) => ({ ...item })));
  };

  const updateBorrowItem = (index, field, value) => {
    setBorrowItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: field === "quantity" ? Math.max(1, Number(value) || 1) : value }
          : item
      )
    );
  };

  const removeBorrowItem = (index) => {
    setBorrowItems((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.productName.toLowerCase().includes(itemSearch.toLowerCase()) ||
        p.barcode.toLowerCase().includes(itemSearch.toLowerCase())
    );
  }, [products, itemSearch]);

  const updateRequestQty = (index, value) => {
    const target = filteredProducts[index];
    if (!target) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.barcode === target.barcode
          ? { ...p, requestQty: Math.max(1, Number(value) || 1) }
          : p
      )
    );
  };

  const addProductToBorrow = (index) => {
    const product = filteredProducts[index];
    if (!product) return;

    if (borrowItems.find((i) => i.barcode === product.barcode)) return;

    setBorrowItems((prev) => [
      ...prev,
      {
        productName: product.productName,
        barcode: product.barcode,
        quantity: Number(product.requestQty || 1),
        uom: "pc",
        notes: "",
        brand: product.brand || "",
      },
    ]);
  };

  const handleSaveBorrow = async () => {
    if (!editingBorrow?.id) {
      alert("Missing request ID.");
      return;
    }

    const payload = {
      srf_no: editingBorrow.srfNo || null,
      srf_no_ec: editingBorrow.srfNoEc || null,
      type: "borrow",
      dept_shname: editingBorrow.deptShname || "",
      intended_for: editingBorrow.intendedFor || "",
      used_for: editingBorrow.usedFor || "",
      return_on: editingBorrow.returnedOn || "",
      item_type: editingBorrow.itemType || "",
      date_needed: editingBorrow.borrowedDate || "",
      warehouse: editingBorrow.warehouse || currentWarehouse || "",
      requested_by: editingBorrow.requestedBy || "",
      remarks: editingBorrow.remarks || "",
      status: editingBorrow.status || "Pending",
      stat: editingBorrow.stat ?? 0,
      items: borrowItems.map((item) => ({
        prod_name: item.productName || "",
        qty: Number(item.quantity) || 1,
        uom: item.uom || "",
        barcode: item.barcode || "",
        item_notes: item.notes || "",
      })),
    };

    try {
      setSaving(true);
      await RequestService.updateBorrowRequest(editingBorrow.id, payload);
      alert("Borrow request updated successfully.");
      setEditingBorrow(null);
      setBorrowItems([]);
      fetchBorrowRequests();
    } catch (error) {
      console.error("Update borrow request error:", error);
      alert(error?.response?.data?.message || "Failed to update borrow request.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBorrow = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this borrow request?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await RequestService.deleteBorrowRequest(id);
      alert("Borrow request deleted successfully.");
      setSelectedBorrow(null);
      setEditingBorrow(null);
      setBorrowItems([]);
      fetchBorrowRequests();
    } catch (error) {
      console.error("Delete borrow request error:", error);
      alert(error?.response?.data?.message || "Failed to delete borrow request.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${titleColor}`}>Borrow List</h1>
        <p className="text-sm text-gray-500">Manage borrowed and returned requests</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search SRF No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none ${focusBorder} pr-10`}
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-gray-50 p-6">
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">Loading borrow records...</td>
                </tr>
              ) : borrowList.length > 0 ? (
                borrowList.map((item, index) => (
                  <tr key={item.id ?? index} className={`transition ${hoverRow}`}>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.srfNo}</td>
                    <td className="px-6 py-4 text-gray-600">{getCol3(item)}</td>
                    <td className="px-6 py-4 text-gray-600">{getCol4(item)}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.borrowedDate || "-"}</td>
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
                        <button
                          onClick={() => handleDeleteBorrow(item.id)}
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
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">No borrow records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBorrow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 print:bg-white print:block">
          <div className="bg-white w-[1000px] max-w-[95vw] max-h-[90vh] overflow-auto p-8 shadow-lg print:shadow-none print:max-h-full print:w-full">
            <div className="text-center mb-6">
              <h1 className={`text-3xl font-bold ${titleColor}`}>{isCebu ? "ENYE — Cebu" : "ENYE"}</h1>
              <h2 className="text-lg font-semibold">Borrow</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6">
              <div>
                <p>{cols.col3}: <strong>{getCol3(selectedBorrow)}</strong></p>
                <p>Item type: <strong>{selectedBorrow.itemType || "Local Item/s"}</strong></p>
              </div>
              <div>
                <p>{cols.col4}: <strong>{getCol4(selectedBorrow)}</strong></p>
                <p>Date needed: <strong>{selectedBorrow.borrowedDate || "-"}</strong></p>
              </div>
              <div className="md:text-right">
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
                {selectedBorrow.items.length > 0 ? (
                  selectedBorrow.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{item.productName}</td>
                      <td className="border p-2">{item.barcode}</td>
                      <td className="border p-2 text-center">{item.quantity}</td>
                      <td className="border p-2 text-center">{item.uom}</td>
                      <td className="border p-2">{item.notes}</td>
                      <td className="border p-2"></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="border p-2 text-center text-gray-500">No items found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="text-sm mb-6">
              <strong>Remarks:</strong> {selectedBorrow.remarks || "-"}
            </div>

            <div className="flex justify-center gap-4 print:hidden">
              <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                Print
              </button>
              <button onClick={() => setSelectedBorrow(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingBorrow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[1000px] max-w-[95vw] max-h-[90vh] overflow-auto p-6 shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Edit Borrow Request</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                    <Hash size={18} className="text-white" />
                  </div>
                </div>
                <input
                  type="text"
                  value={editingBorrow.srfNo || ""}
                  disabled
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">SRF No.</label>
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                    <User size={18} className="text-white" />
                  </div>
                </div>
                <input
                  type="text"
                  value={editingBorrow.intendedFor || ""}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, intendedFor: e.target.value })}
                  className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`}
                />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">{cols.col3}</label>
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                    <Clipboard size={18} className="text-white" />
                  </div>
                </div>
                <input
                  type="text"
                  value={editingBorrow.usedFor || ""}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, usedFor: e.target.value })}
                  className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`}
                />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">{cols.col4}</label>
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                    <Calendar size={18} className="text-white" />
                  </div>
                </div>
                <input
                  type="date"
                  value={editingBorrow.borrowedDate || ""}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, borrowedDate: e.target.value })}
                  className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`}
                />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">Date Needed</label>
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                    <Box size={18} className="text-white" />
                  </div>
                </div>
                <select
                  value={editingBorrow.itemType || ""}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, itemType: e.target.value })}
                  className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`}
                >
                  {ITEM_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">Item Type</label>
              </div>

              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                    <CalendarCheck size={18} className="text-white" />
                  </div>
                </div>
                <input
                  type="date"
                  value={editingBorrow.returnedOn || ""}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, returnedOn: e.target.value })}
                  className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`}
                />
                <label className="absolute left-12 -top-2 bg-white px-1 text-gray-600 text-sm">To be returned on</label>
              </div>
            </div>

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
                  {borrowItems.length > 0 ? (
                    borrowItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border p-2">{item.productName}</td>
                        <td className="border p-2">{item.barcode}</td>
                        <td className="border p-2">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateBorrowItem(idx, "quantity", e.target.value)}
                            className="w-full border p-1 rounded text-center"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={item.uom}
                            onChange={(e) => updateBorrowItem(idx, "uom", e.target.value)}
                            className="w-full border p-1 rounded text-center"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => updateBorrowItem(idx, "notes", e.target.value)}
                            className="w-full border p-1 rounded"
                          />
                        </td>
                        <td className="border p-2 text-center">
                          <div className="flex justify-center">
                            <Trash2
                              size={18}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                              onClick={() => removeBorrowItem(idx)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="border p-2 text-center text-gray-500">No items added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Add Products</h3>
              <input
                type="text"
                placeholder="Search item here..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="w-full border p-2 mb-2 rounded"
              />

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
                          <input
                            type="number"
                            min={1}
                            value={product.requestQty || 1}
                            onChange={(e) => updateRequestQty(idx, e.target.value)}
                            className="w-full border p-1 rounded text-center"
                          />
                        </td>
                        <td className="border p-2">{product.brand}</td>
                        <td className="border p-2 text-center">
                          <button
                            type="button"
                            onClick={() => addProductToBorrow(idx)}
                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            ADD
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="border p-2 text-center text-gray-500">No matching products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {
                  setEditingBorrow(null);
                  setBorrowItems([]);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBorrow}
                disabled={saving}
                className={`text-white px-4 py-2 rounded ${saveBtnBg} disabled:opacity-50`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
