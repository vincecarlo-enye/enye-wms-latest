import React, { useState, useMemo } from "react";
import { useWarehouse } from "../context/WarehouseContext";
import {
  Plus, Search, ChevronLeft, ChevronRight,
  Eye, Pencil, Trash2, X,
  Clipboard, Hash, Users, MapPin, Calendar, FileText, UserCheck, User,
} from "lucide-react";

export default function Deliver() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const titleColor    = isCebu ? "text-purple-600"                              : "text-orange-600";
  const headerBg      = isCebu ? "bg-purple-600"                                : "bg-orange-600";
  const hoverTh       = isCebu ? "hover:text-purple-200"                        : "hover:text-orange-200";
  const hoverRow      = isCebu ? "hover:bg-purple-50"                           : "hover:bg-orange-50";
  const cardBorder    = isCebu ? "border-purple-600"                            : "border-orange-600";
  const cardLabel     = isCebu ? "text-purple-600"                              : "text-orange-600";
  const addBtn        = isCebu
    ? "bg-purple-600 border-purple-600 hover:bg-transparent hover:text-purple-600"
    : "bg-orange-600 border-orange-600 hover:bg-transparent hover:text-orange-600";
  const searchFocus   = isCebu
    ? "focus:ring-purple-500 focus:border-purple-500"
    : "focus:ring-orange-500 focus:border-orange-500";
  const pgBorder      = isCebu ? "border-purple-300 hover:bg-purple-50"         : "border-orange-300 hover:bg-orange-50";
  const pgActive      = isCebu ? "bg-purple-600 text-white border-purple-600"   : "bg-orange-600 text-white border-orange-600";
  const iconBg        = isCebu ? "bg-purple-500"                                : "bg-orange-500";
  const inputFocus    = isCebu ? "focus:border-purple-500"                      : "focus:border-orange-500";
  const inputRing     = isCebu ? "focus:ring-purple-500"                        : "focus:ring-orange-500";
  const saveBtn       = isCebu ? "bg-purple-600 hover:bg-purple-700"            : "bg-orange-600 hover:bg-orange-700";
  const editHover     = isCebu ? "hover:text-purple-600"                        : "hover:text-orange-600";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const itemsPerPage = 5;

  const icons = {
    dr: Clipboard, ref: Hash, soldTo: Users,
    deliveredTo: MapPin, terms: Calendar,
    remarks: FileText, preparedBy: User, receivedBy: UserCheck,
  };

  const [formData, setFormData] = useState(() => ({
    dr: Math.floor(1000 + Math.random() * 9000).toString(),
    ref: "", soldTo: "", deliveredTo: "",
    terms: "", remarks: "", preparedBy: "", receivedBy: "",
  }));

  const [items, setItems] = useState([
    { id: 1, dr: "0001", ref: "6491", soldTo: "Salemaire Industrial Corp", deliveredTo: "2F Three Joroma Place Congressional Ave QC", terms: "30 Days", remarks: "-", date: "2018-05-07", type: "Regular", status: "Delivered", warehouse: "main" },
    { id: 2, dr: "0002", ref: "6790", soldTo: "SaleMaIre Toyota", deliveredTo: "Quezon City", terms: "Cash", remarks: "-", date: "2018-05-08", type: "Urgent", status: "Delivered", warehouse: "main" },
  ]);

  const headers = [
    { key: "dr", label: "D.R #" }, { key: "ref", label: "Ref #" },
    { key: "soldTo", label: "Sold To" }, { key: "deliveredTo", label: "Delivered To" },
    { key: "terms", label: "Terms" }, { key: "remarks", label: "Remarks" },
    { key: "date", label: "Date" }, { key: "type", label: "Type" },
    { key: "status", label: "Status" }, { key: "action", label: "Action" },
  ];

  const sortedItems = useMemo(() => {
    let sortable = [...items];
    if (sortConfig.key && sortConfig.key !== "action") {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? "";
        const bVal = b[sortConfig.key] ?? "";
        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return sortable;
  }, [items, sortConfig]);

  const filteredItems = sortedItems
    .filter((item) => item.warehouse === currentWarehouse)
    .filter((item) => Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    if (key === "action") return;
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700";
      case "pending":   return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default:          return "bg-gray-100 text-gray-700";
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDelivery = () => {
    const requiredFields = ["ref", "soldTo", "deliveredTo", "terms", "preparedBy", "receivedBy"];
    const hasEmpty = requiredFields.some((f) => !formData[f]);
    if (hasEmpty) {
      setAlert({ type: "error", message: "Please fill all required fields!", visible: true });
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
      return;
    }
    setItems([...items, { ...formData, id: Date.now(), status: "Pending", warehouse: currentWarehouse }]);
    setFormData({
      dr: Math.floor(1000 + Math.random() * 9000).toString(),
      ref: "", soldTo: "", deliveredTo: "",
      terms: "", remarks: "", preparedBy: "", receivedBy: "",
    });
    setAlert({ type: "success", message: "Delivery added successfully!", visible: true });
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
    setShowDeliverModal(false);
  };

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${titleColor}`}>Dispatch Lists</h2>
          <p className="text-gray-500 text-sm">
            Manage delivered items from {isCebu ? "Cebu" : "Main"} Warehouse
          </p>
        </div>
        <button
          onClick={() => setShowDeliverModal(true)}
          className={`flex items-center gap-2 text-white px-4 py-2 border transition w-full md:w-auto ${addBtn}`}
        >
          <Plus size={18} /> Deliver Item
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 max-w-md w-full relative">
        <input
          type="text"
          placeholder="Search deliver records..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 pr-10 transition ${searchFocus}`}
        />
        <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${headerBg} text-white`}>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  onClick={() => handleSort(header.key)}
                  className={`px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer transition ${hoverTh}`}
                >
                  {header.label}
                  {sortConfig.key === header.key && (
                    <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className={`transition ${hoverRow}`}>
                  {headers.map((header) => (
                    <td key={header.key} className="px-6 py-4 text-gray-700 text-sm">
                      {header.key === "status" ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      ) : header.key === "action" ? (
                        <div className="flex items-center gap-3">
                          <Eye className="text-gray-500 hover:text-blue-600 cursor-pointer transition" size={16} />
                          <Pencil className={`text-gray-500 ${editHover} cursor-pointer transition`} size={16} />
                          <Trash2 className="text-gray-500 hover:text-red-600 cursor-pointer transition" size={16} />
                        </div>
                      ) : (
                        item[header.key] || "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-6 text-gray-500">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 mt-4">
        {currentData.map((item) => (
          <div key={item.id} className={`bg-white shadow rounded p-4 flex flex-col gap-2 border-l-4 ${cardBorder}`}>
            {headers.map((header) => (
              <div key={header.key} className="flex justify-between text-sm">
                <span className={`font-semibold ${cardLabel}`}>{header.label}:</span>
                {header.key === "status" ? (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                ) : header.key === "action" ? (
                  <div className="flex items-center gap-2">
                    <Eye className="text-gray-500 hover:text-blue-600 cursor-pointer transition" size={16} />
                    <Pencil className={`text-gray-500 ${editHover} cursor-pointer transition`} size={16} />
                    <Trash2 className="text-gray-500 hover:text-red-600 cursor-pointer transition" size={16} />
                  </div>
                ) : (
                  item[header.key] || "-"
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-end items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border disabled:opacity-50 ${pgBorder}`}
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${currentPage === page ? pgActive : `bg-white ${pgBorder}`}`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border disabled:opacity-50 ${pgBorder}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Deliver Modal */}
      {showDeliverModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl overflow-y-auto max-h-[90vh] relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Deliver Item</h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">{formData.dr}</span>
            </div>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowDeliverModal(false)}
            >
              <X size={20} />
            </button>

            {alert.visible && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-white ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                {alert.message}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {[
                { name: "dr",          label: "Delivery Receipt (D.R) #", type: "text",     disabled: true },
                { name: "ref",         label: "Ref #",                    type: "text" },
                { name: "soldTo",      label: "Sold To *",                type: "text" },
                { name: "deliveredTo", label: "Delivered To *",           type: "text" },
                { name: "terms",       label: "Terms *",                  type: "text" },
                { name: "remarks",     label: "Remarks",                  type: "textarea" },
                { name: "preparedBy",  label: "Prepared By *",            type: "text" },
                { name: "receivedBy",  label: "Received By *",            type: "text" },
              ].map((field) => {
                const Icon = icons[field.name] || Clipboard;
                const hasValue = formData[field.name] !== "";
                return (
                  <div key={field.name} className="relative flex items-start">
                    <div className="absolute left-0 top-0 h-full flex items-center">
                      <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                        <Icon size={18} className="text-white" />
                      </div>
                    </div>
                    {field.type === "textarea" ? (
                      <textarea
                        value={formData[field.name]}
                        name={field.name}
                        onChange={handleFormChange}
                        rows={4}
                        className={`peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${inputRing} resize-none`}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.name]}
                        disabled={field.disabled}
                        name={field.name}
                        onChange={handleFormChange}
                        className={`peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg ${
                          field.disabled
                            ? "bg-gray-100 cursor-not-allowed text-gray-500"
                            : `bg-gray-50 focus:outline-none ${inputFocus}`
                        }`}
                      />
                    )}
                    <label
                      className={`absolute left-14 text-gray-500 text-sm transition-all duration-200 ${
                        hasValue
                          ? "-top-2 text-gray-600 text-sm bg-white px-1"
                          : "top-2.5 text-gray-400 text-base peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm"
                      }`}
                    >
                      {field.label}
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowDeliverModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDelivery}
                className={`px-6 py-2 rounded-lg text-white font-medium transition ${saveBtn}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}