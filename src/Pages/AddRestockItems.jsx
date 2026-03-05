import { useState } from "react";
import { Tag, Barcode, Hash, Calendar, FileText } from "lucide-react";

const generateBarcode = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

export default function AddRestockItemModal({ isOpen, onClose, onAddItem }) {
  const [modelName, setModelName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warrantyYears, setWarrantyYears] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState("");
  const [remarks, setRemarks] = useState("");
  const [barcode, setBarcode] = useState(() => generateBarcode());

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formatWarranty = () => {
      if (!warrantyYears && !warrantyMonths) return "No Warranty";
      let result = "";
      if (warrantyYears) result += `${warrantyYears} Year(s) `;
      if (warrantyMonths) result += `${warrantyMonths} Month(s)`;
      return result.trim();
    };

    const formData = {
      modelName,
      barcode,
      quantity,
      warranty: formatWarranty(),
      remarks,
    };

    onAddItem(formData);

    // Reset form fields
    setModelName("");
    setBarcode(generateBarcode());
    setQuantity("");
    setWarrantyYears("");
    setWarrantyMonths("");
    setRemarks("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative m-4">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b">
          Add Items to Restock
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Model Name */}
          <div className="relative flex items-center">
            <div className="absolute left-0 h-full flex items-center">
              <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
                <Tag size={18} className="text-white" />
              </div>
            </div>
            <input
              type="text"
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder=" "
              required
              className="peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500"
            />
            <label
              htmlFor="modelName"
              className="absolute left-14 text-gray-500 text-sm transition-all duration-200
                top-2.5 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm bg-white px-1"
            >
              Model Name
            </label>
          </div>

          {/* Barcode */}
          <div className="relative flex flex-col">
            <div className="flex items-center">
              <div className="bg-orange-500 h-10 px-3 flex items-center rounded-l-lg">
                <Barcode size={18} className="text-white" />
              </div>
              <input
                type="text"
                value={barcode}
                disabled
                className="peer w-full border border-gray-300 rounded-r-lg bg-gray-100 pl-3 py-2 cursor-not-allowed"
              />
            </div>
            <label
              className="absolute left-14 -top-2 text-gray-600 text-sm bg-gray-100 px-1"
            >
              Barcode
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              (Numbers Only up to 12 Digits) - Make Sure Check Digit is Correct
            </p>
          </div>

          {/* Quantity */}
          <div className="relative flex items-center">
            <div className="absolute left-0 h-full flex items-center">
              <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
                <Hash size={18} className="text-white" />
              </div>
            </div>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder=" "
              required
              className="peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500"
            />
            <label
              className="absolute left-14 text-gray-500 text-sm transition-all duration-200
                top-2.5 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm bg-white px-1"
            >
              Quantity
            </label>
          </div>

          {/* Warranty */}
<div className="relative w-full">
  {/* Calendar Icon */}
  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full flex items-center">
    <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
      <Calendar size={18} className="text-white" />
    </div>
  </div>

  {/* Floating Label */}
  <label
    className="absolute left-14 -top-2 text-gray-600 text-sm bg-white px-1 z-10"
  >
    Warranty
  </label>

  {/* Bordered Container */}
  <div className="pl-14 border border-gray-300 rounded-lg p-3 grid grid-cols-1 gap-3 sm:grid-cols-2 bg-gray-50">
    <select
      value={warrantyYears}
      onChange={(e) => setWarrantyYears(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-500"
    >
      <option value="">Select Years</option>
      {[1, 2, 3, 4, 5].map((y) => (
        <option key={y} value={y}>{y} Year(s)</option>
      ))}
    </select>

    <select
      value={warrantyMonths}
      onChange={(e) => setWarrantyMonths(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-500"
    >
      <option value="">Select Months</option>
      {[...Array(12).keys()].slice(1).map((m) => (
        <option key={m} value={m}>{m} Month(s)</option>
      ))}
    </select>
  </div>
</div>

          {/* Remarks */}
          <div className="relative flex items-start">
            <div className="absolute left-0 top-0 h-full flex items-center">
              <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
                <FileText size={18} className="text-white" />
              </div>
            </div>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder=" "
              rows={3}
              className="peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 resize-none focus:outline-none focus:border-orange-500"
            />
            <label
              className="absolute left-14 text-gray-500 text-sm transition-all duration-200
                top-2.5 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm bg-white px-1"
            >
              Remarks
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-600 py-2 text-white flex items-center justify-center gap-2 border border-orange-600 
            cursor-pointer transition-colors duration-200 hover:bg-transparent hover:text-orange-600"
          >
            <Tag size={18} /> Add to Restock
          </button>
        </form>
      </div>
    </div>
  );
}