import { useState } from "react";
import {
  Tag,
  List,
  User,
  Calendar,
  Hash,
} from "lucide-react";
import { RequestService } from "../services/request.service";

const icons = {
  intendedFor: Tag,
  toBeUsedFor: Tag,
  itemType: List,
  dateNeeded: Calendar,
  toBeReturnOn: Calendar,
  clientName: User,
  projectName: Tag,
  itemSuppliedBy: Tag,
  deliveryDate: Calendar,
  referenceNo: Hash,
  principalInvoice: Hash,
  drNo: Hash,
  warrantyClaimETA: Tag,
  replacementDate: Calendar,
  remarks: Tag,
};

function InputField({ name, label, type = "text", disabled, value, onChange, min, step }) {
  const Icon = icons[name] || Tag;
  const id = `input-${name}`;
  const hasValue = (value !== undefined && value !== "") || (type === "date" && value);

  return (
    <div className="relative w-full">
      <div className="absolute left-0 h-full flex items-center">
        <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
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
        className={`peer w-full pl-14 pr-4 border rounded-lg bg-gray-50 ${
          disabled ? "cursor-not-allowed bg-gray-100" : ""
        } focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm py-3 text-sm`}
      />
      <label
        htmlFor={id}
        className={`absolute left-14 bg-white px-1 text-gray-500 text-sm transition-all duration-200
        ${hasValue ? "-top-2 text-gray-600 text-sm" : "top-3 text-gray-400 text-sm"}
        peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm pointer-events-none`}
      >
        {label}
      </label>
    </div>
  );
}

function SelectField({ name, label, value, onChange, options }) {
  const Icon = icons[name] || Tag;
  const id = `select-${name}`;
  const hasValue = value && value !== "";

  return (
    <div className="relative w-full">
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 rounded-l-lg bg-orange-500">
        <Icon size={18} className="text-white" />
      </div>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="peer w-full pl-14 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm text-sm"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`absolute left-14 bg-white px-1 text-gray-500 text-sm transition-all duration-200
        ${hasValue ? "-top-2 text-gray-600 text-sm" : "top-3 text-gray-400 text-sm"}
        peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm pointer-events-none`}
      >
        {label}
      </label>
    </div>
  );
}

function TextareaField({ name, label, rows = 4, value, onChange }) {
  const Icon = icons[name] || Tag;
  const id = `textarea-${name}`;
  const hasValue = value !== "" && value !== undefined;

  return (
    <div className="relative w-full">
      <div className="absolute left-0 top-0 h-full flex items-center">
        <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
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
        className="peer w-full pl-14 pr-4 py-3 border rounded-lg bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm text-sm"
      />
      <label
        htmlFor={id}
        className={`absolute left-14 bg-white px-1 text-gray-500 text-sm transition-all duration-200
        ${hasValue ? "-top-2 text-gray-600 text-sm" : "top-3 text-gray-400 text-sm"}
        peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm pointer-events-none`}
      >
        {label}
      </label>
    </div>
  );
}

export default function RequestForm() {
  const [purpose, setPurpose] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [warrantyFile, setWarrantyFile] = useState(null);
  const [productQtys, setProductQtys] = useState({});

  const [borrowReserveData, setBorrowReserveData] = useState({
    intendedFor: "",
    toBeUsedFor: "",
    itemType: "",
    dateNeeded: "",
    toBeReturnOn: "",
    remarks: "",
    selectedItems: [],
  });

  const [warrantyData, setWarrantyData] = useState({
    clientName: "",
    projectName: "",
    itemType: "",
    itemSuppliedBy: "",
    deliveryDate: "",
    referenceNo: "",
    principalInvoice: "",
    drNo: "",
    warrantyClaimETA: "",
    replacementDate: "",
    remarks: "",
    selectedItems: [],
  });

  const itemTypes = ["Electrical", "Mechanical", "Instrumentation", "Others"];

  const borrowProducts = [
    {
      name: "SIGNAL INPUT RUBBER SLEEVE",
      barcode: "02212238",
      stock: 200,
      brand: "SINRO",
      uom: "pcs",
    },
    {
      name: "C02-010-D-1",
      barcode: "01242801",
      stock: 1,
      brand: "DWYER",
      uom: "pcs",
    },
    {
      name: "PLATE ALARM 2",
      barcode: "09239689",
      stock: 4,
      brand: "LOCAL",
      uom: "pcs",
    },
    {
      name: "PLATE AT004 OPERATOR RM 80MM X20 M",
      barcode: "08256177",
      stock: 2,
      brand: "LOCAL",
      uom: "pcs",
    },
    {
      name: "IMC COUPLING CONN. THREADED 1",
      barcode: "11190331",
      stock: 10,
      brand: "LOCAL",
      uom: "pcs",
    },
  ];

  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
  };

  const handleBorrowReserveChange = (e) => {
    const { name, value } = e.target;
    setBorrowReserveData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWarrantyChange = (e) => {
    const { name, value } = e.target;
    setWarrantyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBorrowQtyChange = (barcode, value) => {
    setProductQtys((prev) => ({
      ...prev,
      [barcode]: Math.max(1, Number(value) || 1),
    }));
  };

  const addBorrowItem = (product) => {
    const qty = Number(productQtys[product.barcode] ?? 1);
    if (qty < 1) return;

    if (borrowReserveData.selectedItems.find((i) => i.barcode === product.barcode)) return;

    setBorrowReserveData((prev) => ({
      ...prev,
      selectedItems: [
        ...prev.selectedItems,
        {
          item: product.name,
          barcode: product.barcode,
          qty,
          uom: product.uom,
          brand: product.brand,
        },
      ],
    }));
  };

  const removeBorrowItem = (barcode) => {
    setBorrowReserveData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter((i) => i.barcode !== barcode),
    }));
  };

  const addWarrantyItem = () => {
    setWarrantyData((prev) => ({
      ...prev,
      selectedItems: [...prev.selectedItems, { item: "", barcode: "", qty: 1, uom: "" }],
    }));
  };

  const removeWarrantyItem = (index) => {
    setWarrantyData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter((_, i) => i !== index),
    }));
  };

  const handleWarrantyItemChange = (index, field, value) => {
    const newItems = [...warrantyData.selectedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setWarrantyData((prev) => ({ ...prev, selectedItems: newItems }));
  };

  const handleWarrantyFileChange = (e) => {
    setWarrantyFile(e.target.files?.[0] || null);
  };

  const resetBorrowReserve = () => {
    setBorrowReserveData({
      intendedFor: "",
      toBeUsedFor: "",
      itemType: "",
      dateNeeded: "",
      toBeReturnOn: "",
      remarks: "",
      selectedItems: [],
    });
    setSearchTerm("");
    setProductQtys({});
    setPurpose("");
  };

  const resetWarranty = () => {
    setWarrantyData({
      clientName: "",
      projectName: "",
      itemType: "",
      itemSuppliedBy: "",
      deliveryDate: "",
      referenceNo: "",
      principalInvoice: "",
      drNo: "",
      warrantyClaimETA: "",
      replacementDate: "",
      remarks: "",
      selectedItems: [],
    });
    setWarrantyFile(null);
    setPurpose("");
  };

  const handleBorrowReserveSubmit = async (e) => {
    e.preventDefault();

    if (
      !borrowReserveData.intendedFor.trim() ||
      !borrowReserveData.toBeUsedFor.trim() ||
      !borrowReserveData.itemType ||
      !borrowReserveData.dateNeeded ||
      !borrowReserveData.toBeReturnOn ||
      borrowReserveData.selectedItems.length === 0
    ) {
      alert("Please fill all required fields and add at least one item.");
      return;
    }

    const payload = {
      intended_for: borrowReserveData.intendedFor,
      to_be_used_for: borrowReserveData.toBeUsedFor,
      item_type: borrowReserveData.itemType,
      date_needed: borrowReserveData.dateNeeded,
      to_be_return_on: borrowReserveData.toBeReturnOn,
      remarks: borrowReserveData.remarks,
      items: borrowReserveData.selectedItems.map((item) => ({
        item: item.item,
        barcode: item.barcode,
        qty: item.qty,
        uom: item.uom,
        brand: item.brand ?? "",
      })),
    };

    try {
      setLoading(true);
      await RequestService.submitBorrowOrReserve(purpose, payload);
      alert(`${purpose === "borrow" ? "Borrow" : "Reserve"} request submitted!`);
      resetBorrowReserve();
    } catch (err) {
      console.error("Borrow/Reserve submit error:", err);
      alert(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to submit request."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWarrantySubmit = async (e) => {
    e.preventDefault();

    if (
      !warrantyData.clientName.trim() ||
      !warrantyData.projectName.trim() ||
      !warrantyData.itemType ||
      !warrantyData.itemSuppliedBy.trim() ||
      !warrantyData.deliveryDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      client_name: warrantyData.clientName,
      project_name: warrantyData.projectName,
      item_type: warrantyData.itemType,
      item_supplied_by: warrantyData.itemSuppliedBy,
      delivery_date: warrantyData.deliveryDate,
      reference_no: warrantyData.referenceNo,
      principal_invoice: warrantyData.principalInvoice,
      dr_no: warrantyData.drNo,
      warranty_claim_eta: warrantyData.warrantyClaimETA,
      replacement_date: warrantyData.replacementDate,
      remarks: warrantyData.remarks,
      items: warrantyData.selectedItems.map((item) => ({
        item: item.item,
        barcode: item.barcode,
        qty: item.qty,
        uom: item.uom,
      })),
    };

    try {
      setLoading(true);
      await RequestService.submitWarranty({ payload, file: warrantyFile });
      alert("Warranty claim submitted!");
      resetWarranty();
    } catch (err) {
      console.error("Warranty submit error:", err);
      alert(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to submit warranty."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <div>
          <h2 className="text-2xl font-bold text-orange-600">Request Form</h2>
        </div>

        <div className="flex flex-wrap gap-4 mt-3">
          <p className="text-sm text-gray-500 pt-2">Please select purpose:</p>
          {["borrow", "reserve", "warranty"].map((option) => {
            const label =
              option === "borrow"
                ? "Borrow"
                : option === "reserve"
                ? "Reserve"
                : "Warranty claim / Replacement";
            const isActive = purpose === option;

            return (
              <label
                key={option}
                className={`cursor-pointer px-4 py-2 rounded-lg font-semibold border transition-colors
                ${isActive ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-300"}
                hover:bg-orange-100 hover:border-orange-300`}
              >
                <input
                  type="radio"
                  name="purpose"
                  value={option}
                  checked={isActive}
                  onChange={handlePurposeChange}
                  className="hidden"
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      {(purpose === "borrow" || purpose === "reserve") && (
        <form onSubmit={handleBorrowReserveSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div className="text-gray-700 font-semibold text-sm">FOR BORROWED/RESERVED</div>

          <div className="flex flex-wrap gap-6 mb-3 text-xs font-semibold text-gray-700">
            <div className="flex flex-col flex-1 min-w-[280px]">
              <InputField
                name="intendedFor"
                label="Intended for*"
                value={borrowReserveData.intendedFor}
                onChange={handleBorrowReserveChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[280px]">
              <InputField
                name="toBeUsedFor"
                label="To be used for*"
                value={borrowReserveData.toBeUsedFor}
                onChange={handleBorrowReserveChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-700 font-semibold">
            <div className="flex flex-col">
              <SelectField
                name="itemType"
                label="Item type*"
                value={borrowReserveData.itemType}
                onChange={handleBorrowReserveChange}
                options={itemTypes}
              />
            </div>
            <div className="flex flex-col">
              <InputField
                name="dateNeeded"
                label="Date needed*"
                type="date"
                value={borrowReserveData.dateNeeded}
                onChange={handleBorrowReserveChange}
              />
            </div>
            <div className="flex flex-col">
              <InputField
                name="toBeReturnOn"
                label="To be return on*"
                type="date"
                value={borrowReserveData.toBeReturnOn}
                onChange={handleBorrowReserveChange}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="border border-gray-300 px-2 py-1 text-left">ITEM</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">BARCODE</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">QTY</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">UOM</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {borrowReserveData.selectedItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-3 text-gray-500">
                      No items added
                    </td>
                  </tr>
                )}
                {borrowReserveData.selectedItems.map(({ item, barcode, qty, uom }) => (
                  <tr key={barcode}>
                    <td className="border border-gray-300 px-2 py-1">{item}</td>
                    <td className="border border-gray-300 px-2 py-1">{barcode}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{qty}</td>
                    <td className="border border-gray-300 px-2 py-1">{uom}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeBorrowItem(barcode)}
                        className="text-red-600 hover:text-red-800 font-bold"
                        title="Remove item"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <label htmlFor="searchProduct" className="block font-semibold text-sm mb-1">
              Search
            </label>
            <input
              id="searchProduct"
              type="text"
              placeholder="Search item here"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="overflow-x-auto max-h-60 border border-gray-300 rounded shadow-sm">
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="border border-gray-300 px-2 py-1 text-left">Product Name</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Barcode</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Stock</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Brand</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">UOM</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Qty</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Add</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowProducts
                    .filter(
                      (product) =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((product) => (
                      <tr key={product.barcode}>
                        <td className="border border-gray-300 px-2 py-1">{product.name}</td>
                        <td className="border border-gray-300 px-2 py-1">{product.barcode}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center">{product.stock}</td>
                        <td className="border border-gray-300 px-2 py-1">{product.brand}</td>
                        <td className="border border-gray-300 px-2 py-1">{product.uom}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          <input
                            type="number"
                            min={1}
                            value={productQtys[product.barcode] ?? 1}
                            onChange={(e) => handleBorrowQtyChange(product.barcode, e.target.value)}
                            className="w-16 text-center border border-gray-300 rounded px-1 py-0"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => addBorrowItem(product)}
                            className="bg-orange-500 text-white px-2 rounded hover:bg-orange-600"
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <TextareaField
              name="remarks"
              label="Remarks"
              value={borrowReserveData.remarks}
              onChange={handleBorrowReserveChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white shadow-md border border-orange-600 cursor-pointer transition-colors duration-200 hover:bg-transparent hover:text-orange-600 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}

      {purpose === "warranty" && (
        <form onSubmit={handleWarrantySubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div className="text-gray-700 font-semibold text-sm">FOR WARRANTY/REPLACEMENT</div>

          <div className="flex flex-wrap gap-6 text-xs text-gray-700 font-semibold">
            <div className="flex-1 min-w-[220px] flex flex-col">
              <InputField
                name="clientName"
                label="Client Name *"
                value={warrantyData.clientName}
                onChange={handleWarrantyChange}
              />
            </div>

            <div className="flex-1 min-w-[220px] flex flex-col">
              <InputField
                name="projectName"
                label="Project Name *"
                value={warrantyData.projectName}
                onChange={handleWarrantyChange}
              />
            </div>

            <div className="flex-1 min-w-[180px] flex flex-col">
              <SelectField
                name="itemType"
                label="Item type *"
                value={warrantyData.itemType}
                onChange={handleWarrantyChange}
                options={itemTypes}
              />
            </div>

            <div className="flex-1 min-w-[180px] flex flex-col">
              <InputField
                name="itemSuppliedBy"
                label="Item Supplied by *"
                value={warrantyData.itemSuppliedBy}
                onChange={handleWarrantyChange}
              />
            </div>

            <div className="flex-1 min-w-[180px] flex flex-col">
              <InputField
                name="deliveryDate"
                label="Delivery Date *"
                type="date"
                value={warrantyData.deliveryDate}
                onChange={handleWarrantyChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-gray-700 font-semibold">
            {[
              { name: "referenceNo", label: "Reference No." },
              { name: "principalInvoice", label: "Principal Invoice" },
              { name: "drNo", label: "DR No." },
              { name: "warrantyClaimETA", label: "Warranty Claim ETA" },
              { name: "replacementDate", label: "Replacement Date", type: "date" },
            ].map(({ name, label, type }) => (
              <div key={name} className="flex-1 min-w-[180px] flex flex-col">
                <InputField
                  name={name}
                  label={label}
                  type={type || "text"}
                  value={warrantyData[name]}
                  onChange={handleWarrantyChange}
                />
              </div>
            ))}
          </div>

          <div className="overflow-x-auto max-h-60 border border-gray-300 rounded shadow-sm">
            <table className="w-full border-collapse border border-gray-300 text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="border border-gray-300 px-2 py-1 text-left">ITEM</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">BARCODE</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">QTY</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">UOM</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {warrantyData.selectedItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-3 text-gray-500">
                      No items added
                    </td>
                  </tr>
                )}
                {warrantyData.selectedItems.map(({ item, barcode, qty, uom }, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleWarrantyItemChange(idx, "item", e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded px-1 py-0"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={barcode}
                        onChange={(e) => handleWarrantyItemChange(idx, "barcode", e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded px-1 py-0"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) =>
                          handleWarrantyItemChange(idx, "qty", Math.max(1, parseInt(e.target.value, 10) || 1))
                        }
                        className="w-12 text-center text-xs border border-gray-300 rounded px-1 py-0"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={uom}
                        onChange={(e) => handleWarrantyItemChange(idx, "uom", e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded px-1 py-0"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeWarrantyItem(idx)}
                        className="text-red-600 hover:text-red-800 font-bold"
                        title="Remove item"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={addWarrantyItem}
              className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600"
            >
              + Add Item
            </button>
          </div>

          <div className="mt-6">
            <TextareaField
              name="remarks"
              label="Remarks"
              value={warrantyData.remarks}
              onChange={handleWarrantyChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Attach File
            </label>
            <input
              type="file"
              onChange={handleWarrantyFileChange}
              className="w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2 cursor-pointer
              file:mr-4 file:py-1 file:px-3 file:rounded file:border-0
              file:text-sm file:font-semibold file:bg-orange-500 file:text-white
              hover:file:bg-orange-600"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white shadow-md border border-orange-600 cursor-pointer transition-colors duration-200 hover:bg-transparent hover:text-orange-600 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
