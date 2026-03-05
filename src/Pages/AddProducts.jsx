import { useState } from "react";
import {
  Tag, List, Factory, DollarSign, Barcode,
  Layers, Clock, Edit3, AlignLeft,
} from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";

const icons = {
  modelName: Tag,
  category: List,
  manufacturer: Factory,
  buyingPrice: DollarSign,
  barcode: Barcode,
  quantity: Layers,
  unitOfMeasure: Clock,
  warrantyMonths: Clock,
  warrantyYears: Clock,
  remarks: Edit3,
  description: AlignLeft,
};

function InputField({ name, label, type = "text", disabled, value, onChange, min, step, iconBg, focusRing }) {
  const Icon = icons[name] || Tag;
  const id = `input-${name}`;
  const hasValue = value !== "" && value !== undefined;

  return (
    <div className="relative flex items-center">
      <div className="absolute left-0 h-full flex items-center">
        <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <input
        type={type}
        name={name}
        id={id}
        disabled={disabled}
        min={min}
        step={step}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-50 ${
          disabled ? "cursor-not-allowed bg-gray-100" : ""
        } focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent shadow-sm`}
      />
      <label
        htmlFor={id}
        className={`absolute left-14 text-gray-500 text-sm transition-all duration-200 bg-white px-1
          ${hasValue ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}
          peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm`}
      >
        {label}
      </label>
    </div>
  );
}

function TextareaField({ name, label, rows = 4, value, onChange, iconBg, focusRing }) {
  const Icon = icons[name] || Tag;
  const id = `textarea-${name}`;
  const hasValue = value !== "" && value !== undefined;

  return (
    <div className="relative flex items-center">
      <div className="absolute left-0 top-0 h-full flex items-center">
        <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-50 resize-none focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent shadow-sm`}
      />
      <label
        htmlFor={id}
        className={`absolute left-14 text-gray-500 text-sm transition-all duration-200 bg-white px-1
          ${hasValue ? "-top-2 text-gray-600 text-sm" : "top-2.5 text-gray-400 text-base"}
          peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm`}
      >
        {label}
      </label>
    </div>
  );
}

export default function AddProduct({ isOpen, onClose, warehouse }) {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const iconBg       = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const primaryText  = isCebu ? "text-purple-600"        : "text-orange-600";
  const focusRing    = isCebu ? "focus:ring-purple-400"  : "focus:ring-orange-400";
  const selectFocus  = isCebu ? "focus:ring-purple-400"  : "focus:ring-orange-400";
  const submitBg     = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const submitBorder = isCebu ? "border-purple-600"      : "border-orange-600";
  const hoverText    = isCebu ? "hover:text-purple-600"  : "hover:text-orange-600";

  const [formData, setFormData] = useState(() => ({
    modelName: "",
    category: "",
    manufacturer: "",
    buyingPrice: "",
    barcode: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    quantity: "",
    unitOfMeasure: "",
    warrantyMonths: 0,
    warrantyYears: 0,
    remarks: "",
    description: "",
  }));

  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["modelName", "category", "manufacturer", "buyingPrice", "quantity", "unitOfMeasure", "description"];
    const hasEmpty = requiredFields.some((field) => !formData[field]);

    if (hasEmpty) {
      setAlert({ type: "error", message: "Please fill all required fields!", visible: true });
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
      return;
    }

    setAlert({ type: "success", message: "Product added successfully!", visible: true });
    setFormData((prev) => ({
      ...prev,
      modelName: "", category: "", manufacturer: "", buyingPrice: "",
      barcode: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      quantity: "", unitOfMeasure: "", warrantyMonths: 0, warrantyYears: 0,
      remarks: "", description: "",
    }));
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
  };

  if (!isOpen) return null;

  const fieldProps = { iconBg, focusRing };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg overflow-y-auto max-h-[90vh] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ✕
        </button>

        <main className="min-h-screen bg-gray-50 py-2 px-2">
          {/* Alert */}
          {alert.visible && (
            <div className={`mb-6 px-5 py-4 rounded-lg shadow-md text-white transition-all duration-300 ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}>
              {alert.message}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-8">

              <div>
                <h2 className={`text-2xl font-bold ${primaryText}`}>Add Product for {warehouse}</h2>
                <p className="text-gray-500 text-sm">Fill in the details below to add a new product</p>
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField name="modelName" label="Model Name *" value={formData.modelName} onChange={handleChange} {...fieldProps} />
                  <InputField name="category" label="Category *" value={formData.category} onChange={handleChange} {...fieldProps} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField name="manufacturer" label="Manufacturer *" value={formData.manufacturer} onChange={handleChange} {...fieldProps} />
                  <InputField name="buyingPrice" label="Buying Price *" type="number" min="0" step="0.01" value={formData.buyingPrice} onChange={handleChange} {...fieldProps} />
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Inventory Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <InputField name="barcode" label="Barcode" disabled value={formData.barcode} onChange={handleChange} {...fieldProps} />
                    <p className="text-xs text-gray-400 mt-2">Numbers only (max 10 digits)</p>
                  </div>
                  <InputField name="quantity" label="Quantity *" type="number" min="0" value={formData.quantity} onChange={handleChange} {...fieldProps} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField name="unitOfMeasure" label="Unit of Measure *" value={formData.unitOfMeasure} onChange={handleChange} {...fieldProps} />
                  <div className="relative border rounded-xl p-5 pt-6 bg-gray-50">
                    <span className="absolute -top-3 left-4 bg-gray-50 px-2 text-sm text-gray-600 font-medium">Warranty</span>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        name="warrantyMonths"
                        value={formData.warrantyMonths}
                        onChange={handleChange}
                        className={`h-12 px-4 border rounded-lg bg-white focus:ring-2 ${selectFocus} focus:outline-none shadow-sm`}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>{i} Month{i !== 1 ? "s" : ""}</option>
                        ))}
                      </select>
                      <select
                        name="warrantyYears"
                        value={formData.warrantyYears}
                        onChange={handleChange}
                        className={`h-12 px-4 border rounded-lg bg-white focus:ring-2 ${selectFocus} focus:outline-none shadow-sm`}
                      >
                        {Array.from({ length: 6 }, (_, i) => (
                          <option key={i} value={i}>{i} Year{i !== 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Additional Information</h3>
                <TextareaField name="remarks" label="Remarks" rows={2} value={formData.remarks} onChange={handleChange} {...fieldProps} />
                <TextareaField name="description" label="Product Description *" rows={4} value={formData.description} onChange={handleChange} {...fieldProps} />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className={`px-8 py-3 ${submitBg} text-white shadow-md border ${submitBorder} cursor-pointer transition-colors duration-200 hover:bg-transparent ${hoverText}`}
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}