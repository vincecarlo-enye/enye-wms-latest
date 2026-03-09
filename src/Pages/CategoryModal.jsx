import { useState, useEffect } from "react";
import { Plus, Tag, AlignLeft, X, Pencil } from "lucide-react";

export default function CategoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  warehouse, 
  initialData = null 
}) {
  const isEdit = !!initialData;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.category || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, description, id: initialData?.id });
    }
    setName("");
    setDescription("");
    onClose();
  };

  // ── Theming (same as AddCategoryModal)
  const iconBg       = warehouse === "cebu" ? "bg-purple-600" : "bg-orange-600";
  const focusBorder  = warehouse === "cebu" ? "focus:border-purple-600" : "focus:border-orange-600";
  const submitBg     = warehouse === "cebu" ? "bg-purple-600" : "bg-orange-600";
  const submitBorder = warehouse === "cebu" ? "border-purple-600" : "border-orange-600";
  const hoverText    = warehouse === "cebu" ? "hover:text-purple-600" : "hover:text-orange-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              {isEdit ? "Edit Category" : "Add Category"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit ? `Edit category for ${warehouse}` : `Create a new product category for ${warehouse}`}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Category Name */}
          <div className="relative flex items-center">
            <div className="absolute left-0 h-full flex items-center">
              <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                <Tag size={18} className="text-white" />
              </div>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              required
              autoComplete="off"
              className={`peer w-full pl-14 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none ${focusBorder}`}
            />
            <label
              className="absolute left-14 text-gray-500 text-sm transition-all duration-200
                top-2.5 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm bg-white px-1"
            >
              Category Name
            </label>
          </div>

          {/* Description */}
          <div className="relative flex items-start">
            <div className="absolute left-0 top-0 h-full flex items-center">
              <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                <AlignLeft size={18} className="text-white" />
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=" "
              required
              rows={4}
              autoComplete="off"
              className={`peer w-full pl-14 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 resize-none focus:outline-none ${focusBorder}`}
            />
            <label
              className="absolute left-14 text-gray-500 text-sm transition-all duration-200
                top-2.5 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm bg-white px-1"
            >
              Description
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`flex items-center gap-2 ${submitBg} text-white px-4 py-2 border ${submitBorder}
              cursor-pointer transition-colors duration-200 hover:bg-transparent ${hoverText}`}
          >
            {isEdit ? <Pencil size={18} /> : <Plus size={18} />} {isEdit ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
}