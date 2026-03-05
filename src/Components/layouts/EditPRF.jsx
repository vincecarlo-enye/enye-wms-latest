import React, { useState } from "react";

const EditPRF = ({ selectedPRF, onSubmit, onClose }) => {
  // ✅ Always call hooks first
  const [prfNo] = useState(selectedPRF?.prfNo || "");
  const [form, setForm] = useState(() => ({
    clientName: selectedPRF?.clientName || "",
    project: selectedPRF?.project || "",
    poNo: selectedPRF?.poNo || "",
    dateNeeded: selectedPRF?.dateNeeded || "",
    deliverTo: selectedPRF?.deliverTo || "",
    shippingInstructions: selectedPRF?.shippingInstructions || "",
    terms: selectedPRF?.terms || "",
    itemType: selectedPRF?.itemType || "",
    email: selectedPRF?.email || "",
    items: selectedPRF?.items || [],
    remarks: selectedPRF?.remarks || "",
    requestedBy: selectedPRF?.requestedBy || "",
    notedBy: selectedPRF?.notedBy || "",
    approvedBy: selectedPRF?.approvedBy || "",
    checkedBy: selectedPRF?.checkedBy || "",
    approvedByPL: selectedPRF?.approvedByPL || "",
    releasedBy: selectedPRF?.releasedBy || "",
    receivedBy: selectedPRF?.receivedBy || "",
  }));

  const [itemInput, setItemInput] = useState({ qty: "", brand: "", description: "", unitPrice: "" });

  // Early return in JSX instead
  if (!selectedPRF) return <div className="p-4 text-center text-gray-500">No PRF selected</div>;
  // Helper
  const calculateAmount = (qty, unitPrice) => {
    const q = parseFloat(qty);
    const up = parseFloat(unitPrice);
    if (isNaN(q) || isNaN(up)) return 0;
    return q * up;
  };

  const totalAmount = form.items.reduce(
    (acc, item) => acc + calculateAmount(item.qty, item.unitPrice),
    0
  );

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemInput((i) => ({ ...i, [name]: value }));
  };

  const handleAddItem = () => {
    if (!itemInput.qty || !itemInput.description || !itemInput.unitPrice) {
      alert("Please fill qty, description, and unit price.");
      return;
    }
    setForm((f) => ({
      ...f,
      items: [...f.items, { ...itemInput, amount: calculateAmount(itemInput.qty, itemInput.unitPrice) }],
    }));
    setItemInput({ qty: "", brand: "", description: "", unitPrice: "" });
  };

  const handleRemoveItem = (index) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));
  };

  const currentDate = new Date().toISOString().slice(0, 10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientName || !form.project) {
      alert("Please fill Client Name and Project");
      return;
    }
    onSubmit?.({ prfNo, date: currentDate, ...form });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white w-full max-w-5xl mx-auto rounded shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold">Edit Purchase Requisition Form</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-8 text-sm text-gray-800 space-y-6">
        {/* PRF # */}
        <div className="flex items-center gap-2 justify-end mb-8">
          <span className="font-semibold">PRF #:</span>
          <span className="text-gray-700">{prfNo}</span>
        </div>

        {/* PRF Info */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="clientName">
                CLIENT NAME:
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={form.clientName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="project">
                PROJECT:
              </label>
              <input
                type="text"
                id="project"
                name="project"
                value={form.project}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="poNo">
                P.O. #:
              </label>
              <input
                type="text"
                id="poNo"
                name="poNo"
                value={form.poNo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="date">
                DATE:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={currentDate}
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
  <div>
    <label className="block font-semibold mb-1" htmlFor="dateNeeded">
      DATE NEEDED:
    </label>
    <input
      type="date"
      id="dateNeeded"
      name="dateNeeded"
      value={form.dateNeeded}
      onChange={handleInputChange}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>
  <div>
    <label className="block font-semibold mb-1" htmlFor="deliverTo">
      DELIVER TO:
    </label>
    <input
      type="text"
      id="deliverTo"
      name="deliverTo"
      value={form.deliverTo}
      onChange={handleInputChange}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>
  <div>
    <label className="block font-semibold mb-1" htmlFor="shippingInstructions">
      SHIPPING INSTRUCTIONS:
    </label>
    <input
      type="text"
      id="shippingInstructions"
      name="shippingInstructions"
      value={form.shippingInstructions}
      onChange={handleInputChange}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>
  <div>
    <label className="block font-semibold mb-1" htmlFor="terms">
      TERMS:
    </label>
    <input
      type="text"
      id="terms"
      name="terms"
      value={form.terms}
      onChange={handleInputChange}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
  <div>
    <label className="block font-semibold mb-1" htmlFor="itemType">
      ITEM TYPE:
    </label>
    <select
  id="itemType"
  name="itemType"
  value={form.itemType}
  onChange={handleInputChange}
  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
>
  <option value="">Select Item Type</option>
  <option value="Local Item/s">Local Item/s</option>
  <option value="Imported Item/s">Imported Item/s</option>
  <option value="Local and Imported Item/s">Local and Imported Item/s</option>
  <option value="Others">Others</option>
</select>
  </div>
  <div>
    <label className="block font-semibold mb-1" htmlFor="email">
      EMAIL:
    </label>
    <input
      type="email"
      id="email"
      name="email"
      value={form.email}
      onChange={handleInputChange}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>
</div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full border border-gray-400 text-xs min-w-150 mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">QTY</th>
                <th className="border px-2 py-1">BRANDS/SUPPLIER</th>
                <th className="border px-2 py-1">DESCRIPTION</th>
                <th className="border px-2 py-1">UNIT PRICE</th>
                <th className="border px-2 py-1">AMOUNT</th>
                <th className="border px-2 py-1">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1 text-center">{item.qty}</td>
                  <td className="border px-2 py-1">{item.brand}</td>
                  <td className="border px-2 py-1">{item.description}</td>
                  <td className="border px-2 py-1 text-center">{item.unitPrice}</td>
                  <td className="border px-2 py-1 text-center">
                    {calculateAmount(item.qty, item.unitPrice).toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(i)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}

              {/* Add new item */}
              <tr>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    name="qty"
                    min="0"
                    value={itemInput.qty}
                    onChange={handleItemChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="brand"
                    value={itemInput.brand}
                    onChange={handleItemChange}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Brand/Supplier"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="description"
                    value={itemInput.description}
                    onChange={handleItemChange}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Description"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    name="unitPrice"
                    min="0"
                    step="0.01"
                    value={itemInput.unitPrice}
                    onChange={handleItemChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  {calculateAmount(itemInput.qty, itemInput.unitPrice).toFixed(2)}
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                  >
                    + Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <p className="font-semibold border-b mb-2">Note/s From:</p>
        </div>

        {/* Remarks and Total */}
        <div className="flex flex-col sm:flex-row justify-between mb-8 gap-2">
          <div className="flex-1">
            <label className="block font-semibold mb-1" htmlFor="remarks">
              REMARKS:
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={form.remarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            />
          </div>
          <div className="w-full sm:w-auto font-bold bg-yellow-300 px-4 py-3 text-center sm:text-left rounded">
            TOTAL: {totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Approval Section */}
        <div className="border text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b">
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Requested By:</p>
              <p>{selectedPRF.requestedBy}</p>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Noted By:</p>
              <p>{selectedPRF.notedBy || "-"}</p>
            </div>
            <div className="p-2">
              <p className="font-semibold">Approved By:</p>
              <p>{selectedPRF.approvedBy || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4">
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Checked By PL:</p>
              <p>{selectedPRF.checkedBy || "-"}</p>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Approved By PL:</p>
              <p>{selectedPRF.approvedByPL || "-"}</p>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Released By:</p>
              <p>{selectedPRF.releasedBy || "-"}</p>
            </div>
            <div className="p-2">
              <p className="font-semibold">Received By:</p>
              <p>{selectedPRF.receivedBy || "-"}</p>
            </div>
          </div>
        </div>


        

        {/* Submit Button */}
        <div className="flex justify-end gap-2 mt-8">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditPRF;