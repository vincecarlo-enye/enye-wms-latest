import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clipboard,
  Hash,
  Users,
  MapPin,
  Calendar,
  FileText,
  UserCheck,
  User,
  ArrowLeft
} from "lucide-react";

// --- Icons mapping for each field ---
const icons = {
  dr: Clipboard,
  ref: Hash,
  soldTo: Users,
  deliveredTo: MapPin,
  terms: Calendar,
  remarks: FileText,
  preparedBy: User,
  receivedBy: UserCheck,
};



// --- Input component ---
function InputField({ name, label, type = "text", disabled, value, onChange }) {
  const Icon = icons[name] || Clipboard;
  const id = `input-${name}`;
  const hasValue = value !== "" && value !== undefined;

  return (
    <div className="relative flex items-start">
      <div className="absolute left-0 top-0 h-full flex items-center">
        <div className="bg-orange-600 h-full px-3 flex items-center rounded-l-lg">
          <Icon size={18} className="text-white" />
        </div>
      </div>

      {name === "remarks" ? (
        <textarea
          name={name}
          id={id}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder=" "
          rows={4}
          className={`peer w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-50 resize-none ${
            disabled ? "cursor-not-allowed bg-gray-100" : ""
          } focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm`}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={id}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder=" "
          className={`peer w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-50 ${
            disabled ? "cursor-not-allowed bg-gray-100" : ""
          } focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm`}
        />
      )}

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

// --- Main Page ---
export default function AddDelivery() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => ({
    dr: Math.floor(1000 + Math.random() * 9000).toString(),
    ref: "",
    soldTo: "",
    deliveredTo: "",
    terms: "",
    remarks: "",
    preparedBy: "",
    receivedBy: "",
  }));
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["ref", "soldTo", "deliveredTo", "terms", "preparedBy", "receivedBy"];
    const hasEmpty = requiredFields.some((field) => !formData[field]);

    if (hasEmpty) {
      setAlert({ type: "error", message: "Please fill all required fields!", visible: true });
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
      return;
    }

    setAlert({ type: "success", message: "Delivery added successfully!", visible: true });

    // Reset form (DR auto-generated)
    setFormData({
      dr: Math.floor(1000 + Math.random() * 9000).toString(),
      ref: "",
      soldTo: "",
      deliveredTo: "",
      terms: "",
      remarks: "",
      preparedBy: "",
      receivedBy: "",
    });

    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-600">Add Delivery Item</h2>
          <p className="text-gray-500 text-sm">Fill in the details below to record a delivery</p>
        </div>
       <button
          onClick={() => navigate("/Deliver")}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold w-full sm:w-auto border border-orange-600 cursor-pointer transition-colors duration-200 hover:bg-transparent hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* Alert */}
      {alert.visible && (
        <div
          className={`mb-6 px-5 py-4 rounded-lg shadow-md text-white transition-all duration-300 ${
            alert.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Form */}
<div className="max-w-2xl mx-auto">
  <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-8">
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Delivery Information</h3>

      {/* Single-column grid */}
      <div className="grid grid-cols-1 gap-6">
        <InputField name="dr" label="Delivery Receipt (D.R) #" value={formData.dr} disabled />
        <InputField name="ref" label="Ref #" value={formData.ref} onChange={handleChange} />
        <InputField name="soldTo" label="Sold To *" value={formData.soldTo} onChange={handleChange} />
        <InputField name="deliveredTo" label="Delivered To *" value={formData.deliveredTo} onChange={handleChange} />
        <InputField name="terms" label="Terms *" value={formData.terms} onChange={handleChange} />
        <InputField name="remarks" label="Remarks" value={formData.remarks} onChange={handleChange} />
        <InputField name="preparedBy" label="Prepared By *" value={formData.preparedBy} onChange={handleChange} />
        <InputField name="receivedBy" label="Received By *" value={formData.receivedBy} onChange={handleChange} />
      </div>
    </div>

    {/* Submit Button */}
    <div className="flex justify-end pt-4">
      <button
        type="submit"
        className="px-8 py-3 bg-orange-600 text-white 
                   shadow-md border border-orange-600
                   cursor-pointer 
                   transition-colors duration-200 
                   hover:bg-transparent 
                   hover:text-orange-600"
      >
        Add Delivery
      </button>
    </div>
  </form>
</div>
    </main>
  );
}