import React, { useState } from "react";
import WarrantyRequests from "../../assets/js/EmpWarrantyList.json"; // JSON file
import { Trash2, Hash, User, Clipboard, Calendar, Box, CalendarCheck } from "lucide-react";

const EmpWarrantyEdit = ({ selectedWarranty = {}, onClose, onSave }) => {
  // Initialize borrowItems
  const [editingBorrow, setEditingBorrow] = useState({
    srfNo: selectedWarranty.srfNo || "",
    intendedFor: selectedWarranty.intendedFor || "",
    usedFor: selectedWarranty.usedFor || "",
    borrowedDate: selectedWarranty.WarrantyDate
      ? new Date(selectedWarranty.WarrantyDate.split("-").reverse().join("-")).toISOString().slice(0, 10)
      : "",
    returnedOn: selectedWarranty.returnDate
      ? new Date(selectedWarranty.returnDate.split("-").reverse().join("-")).toISOString().slice(0, 10)
      : "",
    itemType: selectedWarranty.itemType || "LOCAL MATERIALS",
    borrowItems:
      selectedWarranty.borrowItems?.length > 0
        ? selectedWarranty.borrowItems
        : (
  WarrantyRequests.find(
    (r) => r.srfNo === selectedWarranty.srfNo
  )?.items?.filter((i) => i && i.productName) || []
).map((item) => ({
  name: item.productName,
  barcode: item.barcode,
  quantity: item.quantity,
  uom: item.uom,
  notes: item.notes || "",
}))
  });

  const [itemSearch, setItemSearch] = useState("");

  // Compute filtered products dynamically (no useEffect needed)
 const filteredProducts = WarrantyRequests
  .flatMap((r) => r.items || []) // fallback to empty array if items is undefined
  .filter((p) => p && p.productName) // ensure p is not undefined and has productName
  .filter((p) =>
    p.productName.toLowerCase().includes(itemSearch.toLowerCase())
  )
  .map((item) => ({ ...item, requestQty: 1 }));

  // Update borrowItems quantity or notes
  const updateBorrowItem = (index, field, value) => {
    const updated = [...editingBorrow.borrowItems];
    updated[index] = { ...updated[index], [field]: value };
    setEditingBorrow({ ...editingBorrow, borrowItems: updated });
  };

  // Remove borrow item
  const removeBorrowItem = (index) => {
    const updated = editingBorrow.borrowItems.filter((_, i) => i !== index);
    setEditingBorrow({ ...editingBorrow, borrowItems: updated });
  };

  // Add product to borrowItems
  const addProductToBorrow = (product) => {
    if (!product) return;

    const exists = editingBorrow.borrowItems.some(
      (item) => item.barcode === product.barcode
    );
    if (exists) return;

    const newItem = {
      name: product.productName,
      barcode: product.barcode,
      quantity: product.requestQty || 1,
      uom: product.uom || "pcs",
      notes: "",
    };

    setEditingBorrow({
      ...editingBorrow,
      borrowItems: [...editingBorrow.borrowItems, newItem],
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6">Edit Warranty Request</h2>

      {/* Top Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* SRF No. */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-0 h-full flex items-center">
            <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
              <Hash size={18} className="text-white" />
            </div>
          </div>
          <input
            type="text"
            value={editingBorrow.srfNo}
            disabled
            placeholder=" "
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500"
          />
          <label
            className={`absolute left-12 bg-white px-1 transition-all duration-200
              ${editingBorrow.srfNo ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}
          >
            SRF No.
          </label>
        </div>

        {/* Intended For */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-0 h-full flex items-center">
            <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
              <User size={18} className="text-white" />
            </div>
          </div>
          <input
            type="text"
            value={editingBorrow.intendedFor}
            onChange={(e) => setEditingBorrow({ ...editingBorrow, intendedFor: e.target.value })}
            placeholder=" "
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500"
          />
          <label
            className={`absolute left-12 bg-white px-1 transition-all duration-200
              ${editingBorrow.intendedFor ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}
          >
            Intended For
          </label>
        </div>

        {/* To be used for */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-0 h-full flex items-center">
            <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
              <Clipboard size={18} className="text-white" />
            </div>
          </div>
          <input
            type="text"
            value={editingBorrow.usedFor}
            onChange={(e) => setEditingBorrow({ ...editingBorrow, usedFor: e.target.value })}
            placeholder=" "
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500"
          />
          <label
            className={`absolute left-12 bg-white px-1 transition-all duration-200
              ${editingBorrow.usedFor ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}
          >
            To be used for
          </label>
        </div>

        {/* Date Needed */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-0 h-full flex items-center">
            <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
              <Calendar size={18} className="text-white" />
            </div>
          </div>
          <input
            type="date"
            value={editingBorrow.borrowedDate}
            onChange={(e) => setEditingBorrow({ ...editingBorrow, borrowedDate: e.target.value })}
            placeholder=" "
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500"
          />
          <label
            className={`absolute left-12 bg-white px-1 transition-all duration-200
              ${editingBorrow.borrowedDate ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}
          >
            Date Needed
          </label>
        </div>

        {/* Item Type */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-0 h-full flex items-center">
            <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
              <Box size={18} className="text-white" />
            </div>
          </div>
          <select
            value={editingBorrow.itemType}
            onChange={(e) => setEditingBorrow({ ...editingBorrow, itemType: e.target.value })}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-500"
          >
            <option>IMPORTED MATERIALS</option>
            <option>LOCAL MATERIALS</option>
            <option>MOCK-UP MATERIALS</option>
            <option>NON MOVING IMPORTED MATERIALS</option>
            <option>NON MOVING LOCAL MATERIALS</option>
            <option>TOOLS</option>
          </select>
          <label
            className={`absolute left-12 bg-white px-1 transition-all duration-200
              ${editingBorrow.itemType ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}
          >
            Item Type
          </label>
        </div>

        {/* To be returned on */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-0 h-full flex items-center">
            <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
              <CalendarCheck size={18} className="text-white" />
            </div>
          </div>
          <input
            type="date"
            value={editingBorrow.returnedOn}
            onChange={(e) => setEditingBorrow({ ...editingBorrow, returnedOn: e.target.value })}
            placeholder=" "
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-red-500"
          />
          <label
            className={`absolute left-12 bg-white px-1 transition-all duration-200
              ${editingBorrow.returnedOn ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}`}
          >
            To be returned on
          </label>
        </div>
      </div>

      {/* Borrow Items Table */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Warranty Items</h3>
        <table className="w-full border border-gray-300 text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Item</th>
              <th className="border border-gray-300 p-2 text-left">Barcode</th>
              <th className="border border-gray-300 p-2 text-center">Quantity</th>
              <th className="border border-gray-300 p-2 text-center">UOM</th>
              <th className="border border-gray-300 p-2 text-left">Notes</th>
              <th className="border border-gray-300 p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {editingBorrow.borrowItems.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No items Warranty.
                </td>
              </tr>
            )}
            {editingBorrow.borrowItems.map((item, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">{item.barcode}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateBorrowItem(idx, "quantity", e.target.value)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">{item.uom}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateBorrowItem(idx, "notes", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => removeBorrowItem(idx)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Products Section */}
<div>
  <h3 className="font-semibold mb-2">Add Products</h3>
  <input
    type="text"
    placeholder="Search item here..."
    value={itemSearch}
    onChange={(e) => setItemSearch(e.target.value)}
    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
  />
  <table className="w-full border border-gray-300 text-sm border-collapse">
    <thead className="bg-gray-100">
      <tr>
        <th className="border border-gray-300 p-2 text-left">Product Name</th>
        <th className="border border-gray-300 p-2 text-left">Barcode</th>
        <th className="border border-gray-300 p-2 text-center">Stock</th>
        <th className="border border-gray-300 p-2 text-center">Request Qty</th>
        <th className="border border-gray-300 p-2 text-left">Brand</th>
        <th className="border border-gray-300 p-2 text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts.length === 0 && (
        <tr>
          <td colSpan={6} className="p-3 text-center text-gray-500">
            No products found.
          </td>
        </tr>
      )}
      {filteredProducts.map((product, idx) => (
        <tr key={idx}>
          <td className="border border-gray-300 p-2">{product.productName}</td>
          <td className="border border-gray-300 p-2">{product.barcode}</td>
          <td className="border border-gray-300 p-2 text-center">{product.stock}</td>
          <td className="border border-gray-300 p-2 text-center">
            <input
              type="number"
              min={1}
              max={product.quantity}
              defaultValue={1}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (val < 1) val = 1;
                if (val > product.quantity) val = product.quantity;
                product.requestQty = val;
              }}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
            />
          </td>
          <td className="border border-gray-300 p-2">{product.brand || "-"}</td>
          <td className="border border-gray-300 p-2 text-center">
            <button
              onClick={() => {
                if (product.requestQty > product.quantity) {
                  alert(`Request quantity cannot exceed stock (${product.quantity}).`);
                  return;
                }
                addProductToBorrow(product);
              }}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              ADD
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(editingBorrow)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EmpWarrantyEdit;