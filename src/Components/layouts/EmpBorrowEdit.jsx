import React, { useState } from "react";
import borrowData from "../../assets/js/EmpBorrowList.json";
import { Trash2, Hash, User, Clipboard, Calendar, Box, CalendarCheck } from "lucide-react";

const EmpBorrowEdit = ({ selectedReserve = {}, onClose, onSave }) => {
  const [editingBorrow, setEditingBorrow] = useState({
    srfNo: selectedReserve.srfNo || "",
    intendedFor: selectedReserve.intendedFor || "",
    usedFor: selectedReserve.usedFor || "",
    borrowedDate: selectedReserve.borrowedDate
      ? new Date(selectedReserve.borrowedDate.split("-").reverse().join("-"))
          .toISOString()
          .slice(0, 10)
      : "",
    returnedOn: selectedReserve.returnedOn
      ? new Date(selectedReserve.returnedOn.split("-").reverse().join("-"))
          .toISOString()
          .slice(0, 10)
      : "",
    itemType: selectedReserve.itemType || "LOCAL MATERIALS",
    borrowItems:
      selectedReserve.items?.length > 0
        ? selectedReserve.items.map((item) => ({
            name: item.productName,
            barcode: item.barcode,
            quantity: item.quantity,
            uom: item.uom,
            notes: item.notes || "",
          }))
        : [],
  });

  const [itemSearch, setItemSearch] = useState("");

  const filteredProducts = borrowData
    .flatMap((r) => r.items)
    .filter((p) =>
      p.productName.toLowerCase().includes(itemSearch.toLowerCase())
    )
    .map((item) => ({ ...item, requestQty: 1 }));

  const updateBorrowItem = (index, field, value) => {
    const updated = [...editingBorrow.borrowItems];
    updated[index] = { ...updated[index], [field]: value };
    setEditingBorrow({ ...editingBorrow, borrowItems: updated });
  };

  const removeBorrowItem = (index) => {
    const updated = editingBorrow.borrowItems.filter((_, i) => i !== index);
    setEditingBorrow({ ...editingBorrow, borrowItems: updated });
  };

  const addProductToBorrow = (product) => {
    if (!product) return;

    // Ensure requestQty <= stock
    if (product.requestQty > product.stock) {
      alert(`Request quantity cannot exceed stock (${product.stock}).`);
      return;
    }

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
      <h2 className="text-xl font-semibold mb-6">Edit Borrow Request</h2>

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

        {/* Borrowed Date */}
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

        {/* Returned On */}
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
        <h3 className="font-semibold mb-2">Borrow Items</h3>
        <table className="w-full border border-gray-300 text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-left">Barcode</th>
              <th className="border p-2 text-center">Quantity</th>
              <th className="border p-2 text-center">UOM</th>
              <th className="border p-2 text-left">Notes</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {editingBorrow.borrowItems.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No items borrowed.
                </td>
              </tr>
            )}
            {editingBorrow.borrowItems.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.barcode}</td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateBorrowItem(idx, "quantity", Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="border p-2 text-center">{item.uom}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateBorrowItem(idx, "notes", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="border p-2 text-center">
                  <button onClick={() => removeBorrowItem(idx)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Products */}
      <div>
        <h3 className="font-semibold mb-2">Add Products</h3>
        <input
          type="text"
          placeholder="Search product..."
          value={itemSearch}
          onChange={(e) => setItemSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <table className="w-full border border-gray-300 text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Product Name</th>
              <th className="border p-2 text-left">Barcode</th>
              <th className="border p-2 text-center">Stock</th>
              <th className="border p-2 text-center">Request Qty</th>
              <th className="border p-2 text-left">UOM</th>
              <th className="border p-2 text-center">Action</th>
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
                <td className="border p-2">{product.productName}</td>
                <td className="border p-2">{product.barcode}</td>
                <td className="border p-2 text-center">{product.stock}</td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    defaultValue={1}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val < 1) val = 1;
                      if (val > product.stock) val = product.stock;
                      product.requestQty = val;
                    }}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="border p-2">{product.uom}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => addProductToBorrow(product)}
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
        <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded">
          Cancel
        </button>
        <button onClick={() => onSave(editingBorrow)} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default EmpBorrowEdit;