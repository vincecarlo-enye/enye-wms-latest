import React, { useState, useEffect } from "react";
import { useWarehouse } from "../context/WarehouseContext";
import {
  Plus, Search, ChevronLeft, ChevronRight,
  Eye, Pencil, Trash2, X,
  Clipboard, Hash, Users, MapPin, Calendar, FileText, UserCheck, User,
} from "lucide-react";
import { DispatchService } from "../services/dispatch.service";

const ITEMS_PER_PAGE = 5;

export default function Deliver() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const titleColor = isCebu ? "text-purple-600" : "text-orange-600";
  const headerBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const hoverTh = isCebu ? "hover:text-purple-200" : "hover:text-orange-200";
  const hoverRow = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const cardBorder = isCebu ? "border-purple-600" : "border-orange-600";
  const cardLabel = isCebu ? "text-purple-600" : "text-orange-600";
  const addBtn = isCebu
    ? "bg-purple-600 border-purple-600 hover:bg-transparent hover:text-purple-600"
    : "bg-orange-600 border-orange-600 hover:bg-transparent hover:text-orange-600";
  const searchFocus = isCebu
    ? "focus:ring-purple-500 focus:border-purple-500"
    : "focus:ring-orange-500 focus:border-orange-500";
  const pgBorder = isCebu ? "border-purple-300 hover:bg-purple-50" : "border-orange-300 hover:bg-orange-50";
  const pgActive = isCebu ? "bg-purple-600 text-white border-purple-600" : "bg-orange-600 text-white border-orange-600";
  const iconBg = isCebu ? "bg-purple-500" : "bg-orange-500";
  const inputFocus = isCebu ? "focus:border-purple-500" : "focus:border-orange-500";
  const inputRing = isCebu ? "focus:ring-purple-500" : "focus:ring-orange-500";
  const saveBtn = isCebu ? "bg-purple-600 hover:bg-purple-700" : "bg-orange-600 hover:bg-orange-700";
  const editHover = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const createEmptyForm = () => ({
    dr: Math.floor(1000 + Math.random() * 9000).toString(),
    ref: "",
    soldTo: "",
    deliveredTo: "",
    terms: "",
    remarks: "",
    preparedBy: "",
    receivedBy: "",
  });

  const [formData, setFormData] = useState(createEmptyForm());

  const headers = [
    { key: "dr", label: "D.R #" },
    { key: "ref", label: "Ref #" },
    { key: "soldTo", label: "Sold To" },
    { key: "deliveredTo", label: "Delivered To" },
    { key: "terms", label: "Terms" },
    { key: "remarks", label: "Remarks" },
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const mapDispatchItem = (item) => ({
    id: item.dispatch_id ?? item.id,
    dr: item.dr_no ?? "-",
    ref: item.ref_no ?? "-",
    soldTo: item.sold_to ?? "-",
    deliveredTo: item.del_to ?? "-",
    terms: item.terms ?? "-",
    remarks: item.remarks ?? "-",
    date: item.date ?? "-",
    type: item.type ?? "Regular",
    status:
      item.status ??
      (Number(item.stat) === 1
        ? "Delivered"
        : Number(item.stat) === 0
          ? "Pending"
          : Number(item.stat) === 2
            ? "Cancelled"
            : "Pending"),
    preparedBy: item.prepared_by ?? "",
    receivedBy: item.received_by ?? "",
    warehouse: item.warehouse ?? currentWarehouse,
  });

  const fetchDispatches = async () => {
    try {
      const data = await DispatchService.list({
        search,
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
        warehouse: currentWarehouse,
        mode: "deliver",
      });


      const rows = Array.isArray(data?.data) ? data.data : [];
      setItems(rows.map(mapDispatchItem));
      setTotalItems(data?.total || 0);
      setLastPage(data?.last_page || 1);
    } catch (err) {
      console.error("Error fetching dispatches:", err);
      setItems([]);
      setTotalItems(0);
      setLastPage(1);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, [search, currentPage, currentWarehouse, sortConfig]);

  useEffect(() => {
    if (!showDeliverModal) return;

    if ((modalMode === "edit" || modalMode === "view") && selectedItem) {
      setFormData({
        dr: selectedItem.dr || "",
        ref: selectedItem.ref || "",
        soldTo: selectedItem.soldTo || "",
        deliveredTo: selectedItem.deliveredTo || "",
        terms: selectedItem.terms || "",
        remarks: selectedItem.remarks || "",
        preparedBy: selectedItem.preparedBy || "",
        receivedBy: selectedItem.receivedBy || "",
      });
    } else {
      setFormData(createEmptyForm());
    }
  }, [showDeliverModal, modalMode, selectedItem]);

  const totalPages = lastPage || Math.ceil(totalItems / ITEMS_PER_PAGE);

  const getPagination = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleSort = (key) => {
    if (key === "action") return;

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";

    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleFormChange = (e) => {
    if (modalMode === "view") return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowDeliverModal(false);
    setSelectedItem(null);
    setModalMode("create");
    setFormData(createEmptyForm());
  };

  const handleSaveDelivery = async () => {
    if (modalMode === "view") {
      closeModal();
      return;
    }

    const requiredFields = ["ref", "soldTo", "deliveredTo", "terms", "preparedBy", "receivedBy"];
    const hasEmpty = requiredFields.some((f) => !String(formData[f] ?? "").trim());

    if (hasEmpty) {
      setAlert({ type: "error", message: "Please fill all required fields!", visible: true });
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        mode: "deliver",
        dr_no: String(formData.dr),
        ref_no: String(formData.ref),
        sold_to: String(formData.soldTo),
        del_to: String(formData.deliveredTo),
        terms: String(formData.terms),
        remarks: String(formData.remarks || ""),
        prepared_by: String(formData.preparedBy),
        received_by: String(formData.receivedBy),
        warehouse: currentWarehouse,
      };



      if (modalMode === "edit" && selectedItem?.id) {
        await DispatchService.update(selectedItem.id, payload);
        setAlert({ type: "success", message: "Delivery updated successfully!", visible: true });
      } else {
        await DispatchService.create(payload);
        setAlert({ type: "success", message: "Delivery added successfully!", visible: true });
      }

      await fetchDispatches();
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 2500);
      closeModal();
    } catch (err) {
      console.error("Save delivery error:", err);
      const errors = err?.response?.data?.errors;
      const firstError = errors
        ? Object.values(errors).flat()[0]
        : err?.response?.data?.message || "Failed to save delivery!";

      setAlert({ type: "error", message: firstError, visible: true });
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setModalMode("view");
    setShowDeliverModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalMode("edit");
    setShowDeliverModal(true);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this dispatch?")) return;

    try {
      await DispatchService.cancel(id);
      await fetchDispatches();
    } catch (err) {
      console.error("Cancel dispatch error:", err);
    }
  };

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${titleColor}`}>Dispatch Lists</h2>
          <p className="text-gray-500 text-sm">
            Manage delivered items from {isCebu ? "Cebu" : "Main"} Warehouse
          </p>
        </div>

        <button
          onClick={() => {
            setModalMode("create");
            setSelectedItem(null);
            setShowDeliverModal(true);
          }}
          className={`flex items-center gap-2 text-white px-4 py-2 border transition w-full md:w-auto ${addBtn}`}
        >
          <Plus size={18} /> Deliver Item
        </button>
      </div>

      <div className="mb-4 max-w-md w-full relative">
        <input
          type="text"
          placeholder="Search deliver records..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 pr-10 transition ${searchFocus}`}
        />
        <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
      </div>

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
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className={`transition ${hoverRow}`}>
                  {headers.map((header) => (
                    <td key={header.key} className="px-6 py-4 text-gray-700 text-sm">
                      {header.key === "status" ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      ) : header.key === "action" ? (
                        <div className="flex items-center gap-3">
                          <Eye
                            className="text-gray-500 hover:text-blue-600 cursor-pointer transition"
                            size={16}
                            onClick={() => handleView(item)}
                          />
                          <Pencil
                            className={`text-gray-500 ${editHover} cursor-pointer transition`}
                            size={16}
                            onClick={() => handleEdit(item)}
                          />
                          <Trash2
                            className="text-gray-500 hover:text-red-600 cursor-pointer transition"
                            size={16}
                            onClick={() => handleCancel(item.id)}
                          />
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
                <td colSpan={headers.length} className="text-center py-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4 mt-4">
        {items.length > 0 ? (
          items.map((item) => (
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
                      <Eye
                        className="text-gray-500 hover:text-blue-600 cursor-pointer transition"
                        size={16}
                        onClick={() => handleView(item)}
                      />
                      <Pencil
                        className={`text-gray-500 ${editHover} cursor-pointer transition`}
                        size={16}
                        onClick={() => handleEdit(item)}
                      />
                      <Trash2
                        className="text-gray-500 hover:text-red-600 cursor-pointer transition"
                        size={16}
                        onClick={() => handleCancel(item.id)}
                      />
                    </div>
                  ) : (
                    item[header.key] || "-"
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">No records found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-end items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border disabled:opacity-50 ${pgBorder}`}
          >
            <ChevronLeft size={16} />
          </button>

          {getPagination().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${currentPage === page ? pgActive : `bg-white ${pgBorder}`
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border disabled:opacity-50 ${pgBorder}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {showDeliverModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl overflow-y-auto max-h-[90vh] relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {modalMode === "view" ? "View Delivery" : modalMode === "edit" ? "Edit Delivery" : "Deliver Item"}
              </h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {formData.dr}
              </span>
            </div>

            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={closeModal}
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
                { name: "dr", label: "Delivery Receipt (D.R) #", type: "text", disabled: true },
                { name: "ref", label: "Ref #", type: "text" },
                { name: "soldTo", label: "Sold To *", type: "text" },
                { name: "deliveredTo", label: "Delivered To *", type: "text" },
                { name: "terms", label: "Terms *", type: "text" },
                { name: "remarks", label: "Remarks", type: "textarea" },
                { name: "preparedBy", label: "Prepared By *", type: "text" },
                { name: "receivedBy", label: "Received By *", type: "text" },
              ].map((field) => {
                const Icon = icons[field.name] || Clipboard;
                const hasValue = formData[field.name] !== "";
                const readOnly = modalMode === "view" || field.disabled;

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
                        disabled={modalMode === "view"}
                        className={`peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${inputRing} resize-none ${modalMode === "view" ? "cursor-not-allowed bg-gray-100" : ""
                          }`}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.name]}
                        disabled={readOnly}
                        name={field.name}
                        onChange={handleFormChange}
                        className={`peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg ${readOnly
                          ? "bg-gray-100 cursor-not-allowed text-gray-500"
                          : `bg-gray-50 focus:outline-none ${inputFocus}`
                          }`}
                      />
                    )}

                    <label
                      className={`absolute left-14 text-gray-500 text-sm transition-all duration-200 ${hasValue
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
                onClick={closeModal}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>

              {modalMode !== "view" && (
                <button
                  onClick={handleSaveDelivery}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition ${saveBtn}`}
                >
                  {loading ? "Saving..." : modalMode === "edit" ? "Update" : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
