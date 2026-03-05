import { useState, useMemo } from "react";
import { Plus, Search, Pencil, ChevronLeft, ChevronRight, X, Tag, Layers, Clock, Edit3, Barcode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefectiveItem from "../assets/js/DefectiveItems.json";

// Icon mapping
const icons = {
  barcode: Barcode,
  modelName: Tag,
  quantity: Layers,
  isItem: Tag,
  dateArrival: Clock,
  dateReported: Clock,
  remarks: Edit3,
};

// Reusable InputField
function InputField({ id, name, label, type = "text", value, onChange, disabled, min, step }) {
  const Icon = icons[name] || Tag;
  const hasValue = value !== "" && value !== undefined;

  return (
    <div className="relative flex items-center mb-3">
      <div className="absolute left-0 h-full flex items-center">
        <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
          <Icon size={18} className="text-white" />
        </div>
      </div>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        step={step}
        placeholder=" "
        className={`peer w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-50 ${disabled ? "cursor-not-allowed bg-gray-100" : ""} focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm`}
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

// Reusable TextareaField
function TextareaField({ id, name, label, value, onChange, rows = 4 }) {
  const Icon = icons[name] || Tag;
  const hasValue = value !== "" && value !== undefined;

  return (
    <div className="relative flex items-start mb-3">
      <div className="absolute left-0 inset-y-0 flex items-center">
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
        className="peer w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
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

// Reusable SelectField
function SelectField({ id, name, label, value, onChange, options }) {
  const Icon = icons[name] || Tag;
  const hasValue = value !== "" && value !== undefined;

  return (
    <div className="relative flex items-center mb-3">
      <div className="absolute left-0 h-full flex items-center">
        <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
          <Icon size={18} className="text-white" />
        </div>
      </div>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="peer w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>

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

// Main Component
export default function DefectiveItems() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(DefectiveItem);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    barcode: "",
    modelName: "",
    quantity: 1,
    isItem: "with D.R. #",
    dateArrival: "",
    dateReported: "",
    remarks: "",
  });

  const itemsPerPage = 5;
  const Navigate = useNavigate();

  // Filter items based on search
  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [items, search]
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveEdit = () => {
    if (editingItem?.index === undefined) return;
    const updated = [...items];
    updated[editingItem.index] = { ...editingItem };
    setItems(updated);
    setEditingItem(null);
  };

  const handleSaveNewItem = () => {
    setItems([...items, newItem]);
    setShowAddModal(false);
    setNewItem({
      barcode: "",
      modelName: "",
      quantity: 1,
      isItem: "with D.R. #",
      dateArrival: "",
      dateReported: "",
      remarks: "",
    });
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-600">Defective Items</h2>
          <p className="text-gray-500 text-sm">Manage your defective products</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 cursor-pointer border border-orange-600 hover:bg-transparent hover:text-orange-600 transition"
        >
          <Plus size={18} /> Add Defective Item
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 max-w-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search model or barcode..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_2fr_2fr_2fr_1fr] bg-orange-600 text-white text-sm font-semibold uppercase px-4 py-2">
          <div>Model Name</div>
          <div>Barcode</div>
          <div>Quantity</div>
          <div>Date Arrival Replace</div>
          <div>Date Reported</div>
          <div>Remarks</div>
          <div>Action</div>
        </div>
        <div className="divide-y divide-gray-200">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr_2fr_1fr_2fr_2fr_2fr_1fr] px-4 py-3 hover:bg-orange-50 transition items-center"
              >
                <div>{item.modelName}</div>
                <div>{item.barcode}</div>
                <div>{item.quantity}</div>
                <div>{item.dateArrival}</div>
                <div>{item.dateReported}</div>
                <div>{item.remarks}</div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setEditingItem({ ...item, index: idx })}
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 col-span-7">No defective items found.</div>
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item, idx) => (
            <div key={idx} className="bg-white shadow rounded p-4 hover:bg-orange-50 transition space-y-1">
              <div>
                <span className="font-semibold">Model:</span> {item.modelName}
              </div>
              <div>
                <span className="font-semibold">Barcode:</span> {item.barcode}
              </div>
              <div>
                <span className="font-semibold">Quantity:</span> {item.quantity}
              </div>
              <div>
                <span className="font-semibold">Date Arrival:</span> {item.dateArrival}
              </div>
              <div>
                <span className="font-semibold">Date Reported:</span> {item.dateReported}
              </div>
              <div>
                <span className="font-semibold">Remarks:</span> {item.remarks}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingItem({ ...item, index: idx })}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">No defective items found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === idx + 1 ? "bg-orange-600 text-white border-orange-600" : "bg-white hover:bg-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-lg p-10 relative shadow-lg space-y-5">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setEditingItem(null)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl text-orange-600 font-bold mb-4">Edit Defective Item</h3>

            <InputField id="edit-barcode" name="barcode" label="Barcode" value={editingItem.barcode} onChange={(e) => setEditingItem({ ...editingItem, barcode: e.target.value })} disabled />
            <InputField id="edit-modelName" name="modelName" label="Model Name" value={editingItem.modelName} onChange={(e) => setEditingItem({ ...editingItem, modelName: e.target.value })} disabled />
            <InputField id="edit-quantity" name="quantity" label="Quantity" type="number" value={editingItem.quantity} onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })} disabled />
            <InputField id="edit-dateArrival" name="dateArrival" label="Date Arrival" value={editingItem.dateArrival} onChange={(e) => setEditingItem({ ...editingItem, dateArrival: e.target.value })} />
            <InputField id="edit-dateReported" name="dateReported" label="Date Reported" value={editingItem.dateReported} onChange={(e) => setEditingItem({ ...editingItem, dateReported: e.target.value })} />
            <TextareaField id="edit-remarks" name="remarks" label="Remarks" value={editingItem.remarks} onChange={(e) => setEditingItem({ ...editingItem, remarks: e.target.value })} />

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-gray-600 text-white cursor-pointer border border-gray-600 hover:bg-transparent hover:text-gray-600">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-orange-600 text-white cursor-pointer border border-orange-600 hover:bg-transparent hover:text-orange-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-lg p-10 relative shadow-lg space-y-5">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setShowAddModal(false)}>
              <X size={20} />
            </button>
            <h3 className="text-xl text-orange-600 font-bold mb-4">Add Defective Item</h3>

            <InputField id="new-barcode" name="barcode" label="Barcode" value={newItem.barcode} onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })} />
            <InputField id="new-modelName" name="modelName" label="Model Name" value={newItem.modelName} onChange={(e) => setNewItem({ ...newItem, modelName: e.target.value })} />
            <InputField id="new-quantity" name="quantity" label="Quantity" type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} />
            <SelectField id="new-isItem" name="isItem" label="Is this Item?" value={newItem.isItem} onChange={(e) => setNewItem({ ...newItem, isItem: e.target.value })} options={["with D.R. #", "without D.R. #"]} />
            <InputField id="new-dateArrival" name="dateArrival" label="Date Arrival Replace" value={newItem.dateArrival} onChange={(e) => setNewItem({ ...newItem, dateArrival: e.target.value })} />
            <InputField id="new-dateReported" name="dateReported" label="Date Reported" value={newItem.dateReported} onChange={(e) => setNewItem({ ...newItem, dateReported: e.target.value })} />
            <TextareaField id="new-remarks" name="remarks" label="Remarks" value={newItem.remarks} onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })} />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-600 text-white cursor-pointer border border-gray-600 hover:bg-transparent hover:text-gray-600">
                Cancel
              </button>
              <button onClick={handleSaveNewItem} className="px-4 py-2 bg-orange-600 text-white cursor-pointer border border-orange-600 hover:bg-transparent hover:text-orange-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
