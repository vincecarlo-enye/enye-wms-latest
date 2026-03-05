import React, { useState, useEffect } from "react";

const CreatePRF = ({ onSubmit, startingPRFNo = 1000 }) => {
  // startingPRFNo is a prop or default number for auto-increment demo

  const [prfNo, setPrfNo] = useState("");
  const [form, setForm] = useState({
    clientName: "",
    project: "",
    poNo: "",
    dateNeeded: "",
    deliverTo: "",
    shippingInstructions: "",
    terms: "",
    itemType: "",
    email: "",
    items: [],
    remarks: "",
    requestedBy: "Admin Enye /",
    notedBy: "",
    approvedBy: "",
    checkedBy: "",
    approvedByPL: "",
    releasedBy: "",
    receivedBy: "",
  });

  useEffect(() => {
    // Simulate auto-increment PRF number on mount
    // In real app, fetch last PRF from server/db and increment
    setPrfNo(`PRF-${startingPRFNo}`);
  }, [startingPRFNo]);

  const [itemInput, setItemInput] = useState({
    qty: "",
    brand: "",
    description: "",
    unitPrice: "",
  });

  // Calculate amount per item and total
  const calculateAmount = (qty, unitPrice) => {
    const q = parseFloat(qty);
    const up = parseFloat(unitPrice);
    if (isNaN(q) || isNaN(up)) return 0;
    return q * up;
  };

  const totalAmount = form.items.reduce((acc, item) => {
    return acc + calculateAmount(item.qty, item.unitPrice);
  }, 0);

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
    // validate itemInput (qty and unitPrice numbers, description not empty)
    if (!itemInput.qty || !itemInput.description || !itemInput.unitPrice) {
      alert("Please fill qty, description and unit price for the item.");
      return;
    }
    setForm((f) => ({
      ...f,
      items: [...f.items, { ...itemInput, amount: calculateAmount(itemInput.qty, itemInput.unitPrice) }],
    }));
    // Reset item inputs
    setItemInput({ qty: "", brand: "", description: "", unitPrice: "" });
  };

  const handleRemoveItem = (index) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== index),
    }));
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
    <form onSubmit={handleSubmit} className="bg-white w-full max-w-5xl mx-auto rounded shadow-lg overflow-hidden mt-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold">Create Purchase Requisition Form</h2>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-8 text-sm text-gray-800 space-y-6">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <img
            src="/src/assets/images/enye.png"
            alt="Logo"
            className="h-10 mx-auto mb-2"
          />
          <h1 className="font-semibold underline text-base">
            Purchase Requisition Form
          </h1>
        </div>

  {/* PRF # on the right */}
  <div className="flex items-center gap-2 justify-end">
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
              <input type="text"
                id="clientName"
                name="clientName"
                value={form.clientName}
                onChange={handleInputChange}
                rows={2}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="project">
                PROJECT:
              </label>
              <input type="text"
                id="project"
                name="project"
                value={form.project}
                onChange={handleInputChange}
                rows={2}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="poNo">
                P.O. #:
              </label>
              <input type="text"
                id="poNo"
                name="poNo"
                value={form.poNo}
                onChange={handleInputChange}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
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
                DATE NEEDED: <span className="text-red-600 italic">(plus 1 day)</span>
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
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
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
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
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
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              />
            </div>
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            <div>
  <label className="block font-semibold mb-1" htmlFor="itemType">
    Item Type:
  </label>
  <select
    id="itemType"
    name="itemType"
    value={form.itemType}
    onChange={handleInputChange}
    className="w-full border border-gray-300 rounded px-3 py-2"
  >
    <option value="">-- Select Item Type --</option>
    <option value="Local item/s">Local item/s</option>
    <option value="Imported Item/s">Imported Item/s</option>
    <option value="Local and Imported Item/s">Local and Imported Item/s</option>
    <option value="Other">Other</option>
  </select>
</div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="email">
                Select Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="example@domain.com"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">This email may be used as a reference for order tracking in the Enyecontrols App. If unsure, please leave it as is</p>
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
              {form.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="border px-2 py-2 text-center text-gray-500">
                    No items added yet.
                  </td>
                </tr>
              )}
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
                      title="Remove item"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}

              {/* Add new item row */}
              <tr>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    name="qty"
                    min="0"
                    value={itemInput.qty}
                    onChange={handleItemChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-center"
                    required
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
                    required
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
                    required
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
                    title="Add item"
                  >
                    + Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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

        {/* Notes / Approval Section */}
        <div className="border text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b">
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <label className="font-semibold" htmlFor="requestedBy">
                Requested By:
              </label>
              <input
                id="requestedBy"
                name="requestedBy"
                value={form.requestedBy}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <label className="font-semibold" htmlFor="notedBy">
                Noted By:
              </label>
              <input
                id="notedBy"
                name="notedBy"
                value={form.notedBy}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div className="p-2">
              <label className="font-semibold" htmlFor="approvedBy">
                Approved By:
              </label>
              <input
                id="approvedBy"
                name="approvedBy"
                value={form.approvedBy}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4">
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <label className="font-semibold" htmlFor="checkedBy">
                Checked By PL:
              </label>
              <input
                id="checkedBy"
                name="checkedBy"
                value={form.checkedBy}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <label className="font-semibold" htmlFor="approvedByPL">
                Approved By PL:
              </label>
              <input
                id="approvedByPL"
                name="approvedByPL"
                value={form.approvedByPL}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <label className="font-semibold" htmlFor="releasedBy">
                Released By:
              </label>
              <input
                id="releasedBy"
                name="releasedBy"
                value={form.releasedBy}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div className="p-2">
              <label className="font-semibold" htmlFor="receivedBy">
                Received By:
              </label>
              <input
                id="receivedBy"
                name="receivedBy"
                value={form.receivedBy}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-8">
          <button
            type="submit"
            className="px-8 py-2 bg-orange-600 text-white 
                       shadow-md border border-orange-600
        cursor-pointer 
        transition-colors duration-200 
        hover:bg-transparent 
        hover:text-orange-600"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreatePRF;
