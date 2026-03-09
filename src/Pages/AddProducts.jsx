import { useState, useEffect } from "react";
import {
  Tag, List, Factory, DollarSign, Barcode,
  Layers, Clock, Edit3, AlignLeft,
} from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";
import { CategoryService } from "../services/category.service";
import { ProductService } from "../services/productslist.service";

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

function InputField({
  name,
  label,
  type = "text",
  disabled,
  value,
  onChange,
  min,
  step,
  iconBg,
  focusRing,
}) {
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

function TextareaField({
  name,
  label,
  rows = 4,
  value,
  onChange,
  iconBg,
  focusRing,
  disabled,
}) {
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
        disabled={disabled}
        placeholder=" "
        className={`peer w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-50 resize-none focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent shadow-sm ${
          disabled ? "cursor-not-allowed bg-gray-100" : ""
        }`}
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

export default function AddProduct({
  isOpen,
  onClose,
  warehouse,
  onAddProduct,
  onUpdatedProduct,
  mode = "create",
  selectedProduct = null,
}) {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const iconBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const primaryText = isCebu ? "text-purple-600" : "text-orange-600";
  const focusRing = isCebu ? "focus:ring-purple-400" : "focus:ring-orange-400";
  const selectFocus = isCebu ? "focus:ring-purple-400" : "focus:ring-orange-400";
  const submitBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const submitBorder = isCebu ? "border-purple-600" : "border-orange-600";
  const hoverText = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";

  const getEmptyForm = () => ({
    modelName: "",
    category: "",
    manufacturer: "",
    buy_price: "",
    barcode: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    quantity: "",
    unitOfMeasure: "",
    warrantyMonths: 0,
    warrantyYears: 0,
    remarks: "",
    description: "",
  });

  const [formData, setFormData] = useState(getEmptyForm());
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      if (!isOpen) return;

      try {
        const res = await CategoryService.list({ page: 1, perPage: 1000 });

        const rows = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];

        setCategories(rows);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories([]);
      }
    };

    loadCategories();
  }, [isOpen, currentWarehouse]);

  useEffect(() => {
    if (!isOpen) return;

    if ((isViewMode || isEditMode) && selectedProduct) {
      setFormData({
        modelName: selectedProduct.prod_name || "",
        category: selectedProduct.category || "",
        manufacturer: selectedProduct.manufacturer || "",
        buy_price: selectedProduct.buy_price || "",
        barcode: selectedProduct.barcode || "",
        quantity: selectedProduct.qty || selectedProduct.barcode_qty || "",
        unitOfMeasure: selectedProduct.uom || "",
        warrantyMonths: selectedProduct.month || 0,
        warrantyYears: selectedProduct.warranty || 0,
        remarks: selectedProduct.remarks || "",
        description: selectedProduct.prod_desc || "",
      });
    } else {
      setFormData(getEmptyForm());
    }
  }, [isOpen, mode, selectedProduct, isViewMode, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isViewMode) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isViewMode) {
      onClose();
      return;
    }

    const requiredFields = [
      "modelName",
      "category",
      "manufacturer",
      "buy_price",
      "quantity",
      "unitOfMeasure",
      "description",
    ];

    const hasEmpty = requiredFields.some((field) => !formData[field]);

    if (hasEmpty) {
      setAlert({ type: "error", message: "Please fill all required fields!", visible: true });
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: "",
        category: String(formData.category),
        prod_name: String(formData.modelName),
        prod_desc: String(formData.description),
        barcode_qty: String(formData.quantity),
        qty: String(formData.quantity),
        uom: String(formData.unitOfMeasure),
        buy_price: String(formData.buy_price),
        weight: "",
        barcode: String(formData.barcode),
        warranty: String(formData.warrantyYears),
        manufacturer: String(formData.manufacturer),
        remarks: String(formData.remarks || ""),
        month: String(formData.warrantyMonths),
      };

      if (isEditMode && selectedProduct?.prod_id) {
        await ProductService.update(selectedProduct.prod_id, payload);

        if (onUpdatedProduct) {
          await onUpdatedProduct();
        }

        setAlert({ type: "success", message: "Product updated successfully!", visible: true });
      } else {
        const response = await ProductService.create(payload);

        if (onAddProduct) {
          await onAddProduct(response?.data ?? response);
        }

        setAlert({ type: "success", message: "Product added successfully!", visible: true });
      }

      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 1500);
      onClose();
    } catch (err) {
      console.error("Save product error:", err);
      console.log("Validation errors:", err?.response?.data);

      const errors = err?.response?.data?.errors;
      const firstError = errors
        ? Object.values(errors).flat()[0]
        : err?.response?.data?.message || "Failed to save product!";

      setAlert({
        type: "error",
        message: firstError,
        visible: true,
      });

      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fieldProps = { iconBg, focusRing };
  const disabledAll = isViewMode || loading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ✕
        </button>

        <main className="min-h-screen bg-gray-50 py-2 px-2">
          {alert.visible && (
            <div
              className={`mb-6 px-5 py-4 rounded-lg shadow-md text-white transition-all duration-300 ${
                alert.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {alert.message}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-8">
              <div>
                <h2 className={`text-2xl font-bold ${primaryText}`}>
                  {isViewMode
                    ? `View Product for ${warehouse}`
                    : isEditMode
                    ? `Update Product for ${warehouse}`
                    : `Add Product for ${warehouse}`}
                </h2>
                <p className="text-gray-500 text-sm">
                  {isViewMode
                    ? "Product details in read-only mode"
                    : isEditMode
                    ? "Update the product details below"
                    : "Fill in the details below to add a new product"}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="modelName"
                    label="Model Name *"
                    value={formData.modelName}
                    onChange={handleChange}
                    disabled={disabledAll}
                    {...fieldProps}
                  />

                  <div className="relative flex flex-col">
                    <label htmlFor="category" className="text-gray-500 text-sm mb-1">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={disabledAll}
                      className={`h-12 px-4 border rounded-lg bg-white focus:ring-2 ${focusRing} focus:outline-none shadow-sm ${
                        disabledAll ? "cursor-not-allowed bg-gray-100" : ""
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((item) => (
                        <option
                          key={item.id}
                          value={item.category ?? item.name ?? item.category_name ?? ""}
                        >
                          {item.category ?? item.name ?? item.category_name ?? "Unnamed Category"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="manufacturer"
                    label="Manufacturer *"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    disabled={disabledAll}
                    {...fieldProps}
                  />
                  <InputField
                    name="buy_price"
                    label="Buying Price *"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.buy_price}
                    onChange={handleChange}
                    disabled={disabledAll}
                    {...fieldProps}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Inventory Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="barcode"
                    label="Barcode"
                    disabled={true}
                    value={formData.barcode}
                    onChange={handleChange}
                    {...fieldProps}
                  />
                  <InputField
                    name="quantity"
                    label="Quantity *"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    disabled={disabledAll}
                    {...fieldProps}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="unitOfMeasure"
                    label="Unit of Measure *"
                    value={formData.unitOfMeasure}
                    onChange={handleChange}
                    disabled={disabledAll}
                    {...fieldProps}
                  />
                  <div className="relative border rounded-xl p-5 pt-6 bg-gray-50">
                    <span className="absolute -top-3 left-4 bg-gray-50 px-2 text-sm text-gray-600 font-medium">
                      Warranty
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        name="warrantyMonths"
                        value={formData.warrantyMonths}
                        onChange={handleChange}
                        disabled={disabledAll}
                        className={`h-12 px-4 border rounded-lg bg-white focus:ring-2 ${selectFocus} focus:outline-none shadow-sm ${
                          disabledAll ? "cursor-not-allowed bg-gray-100" : ""
                        }`}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} Month{i !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>

                      <select
                        name="warrantyYears"
                        value={formData.warrantyYears}
                        onChange={handleChange}
                        disabled={disabledAll}
                        className={`h-12 px-4 border rounded-lg bg-white focus:ring-2 ${selectFocus} focus:outline-none shadow-sm ${
                          disabledAll ? "cursor-not-allowed bg-gray-100" : ""
                        }`}
                      >
                        {Array.from({ length: 6 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} Year{i !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Additional Information</h3>
                <TextareaField
                  name="remarks"
                  label="Remarks"
                  rows={2}
                  value={formData.remarks}
                  onChange={handleChange}
                  disabled={disabledAll}
                  {...fieldProps}
                />
                <TextareaField
                  name="description"
                  label="Product Description *"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={disabledAll}
                  {...fieldProps}
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 ${submitBg} text-white shadow-md border ${submitBorder} cursor-pointer transition-colors duration-200 hover:bg-transparent ${hoverText}`}
                >
                  {isViewMode ? "Close" : loading ? "Saving..." : isEditMode ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
