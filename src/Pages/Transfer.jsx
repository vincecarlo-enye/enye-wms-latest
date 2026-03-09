import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Building2,
  Warehouse,
  Hash,
  Calendar,
  User,
  FileText,
  ClipboardList,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";
import { DispatchService } from "../services/dispatch.service";

const ITEMS_PER_PAGE = 5;

export default function Transfer() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const titleColor = isCebu ? "text-purple-600" : "text-orange-600";
  const headerBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const addBtn = isCebu
    ? "bg-purple-600 border-purple-600 hover:bg-transparent hover:text-purple-600"
    : "bg-orange-600 border-orange-600 hover:bg-transparent hover:text-orange-600";
  const searchFocus = isCebu
    ? "focus:border-purple-500 focus:ring-purple-500"
    : "focus:border-orange-500 focus:ring-orange-500";
  const iconBg = isCebu ? "bg-purple-500" : "bg-orange-500";
  const saveBtn = isCebu
    ? "bg-purple-600 hover:bg-purple-700"
    : "bg-orange-600 hover:bg-orange-700";
  const pgActive = isCebu
    ? "bg-purple-600 text-white border-purple-600"
    : "bg-orange-600 text-white border-orange-600";
  const pgBorder = isCebu
    ? "border-purple-300 hover:bg-purple-50"
    : "border-orange-300 hover:bg-orange-50";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [newItem, setNewItem] = useState({
    ptf: "",
    ref: "",
    purpose: "",
    from: "",
    to: isCebu ? "Warehouse - Cebu" : "Warehouse - Main",
    dateNeeded: "",
    client: "",
    po: "",
    remarks: "",
    preparedBy: "",
    approvedBy: "",
    requestDate: "",
    type: "",
  });

  const headers = [
    { key: "ptf", label: "PTF #" },
    { key: "ref", label: "REF #" },
    { key: "purpose", label: "Purpose" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "dateNeeded", label: "Date Needed" },
    { key: "requestDate", label: "Request Date" },
    { key: "type", label: "Type" },
    { key: "action", label: "Action" },
  ];

  const mapTransferItem = (item) => ({
    id: item.dispatch_id ?? item.id,
    ptf: item.ptf_no
      ? `${item.ptf_no}${item.date ? `-${String(item.date).replace(/-/g, "")}` : ""}`
      : "-",
    ptfRaw: item.ptf_no ?? "",
    ref: item.ref_no ?? "-",
    purpose: item.purpose ?? "-",
    from: item.pull_from ?? "-",
    to: item.pull_to ?? "-",
    dateNeeded: item.date_needed ?? "-",
    requestDate: item.date ?? "-",
    type: item.type ?? "-",
    remarks: item.remarks ?? "",
    client: item.client ?? "",
    po: item.po_no ?? "",
    preparedBy: item.prepared_by ?? "",
    approvedBy: item.approved_by ?? "",
    warehouse: item.warehouse ?? currentWarehouse,
  });

  const fetchTransfers = async () => {
    try {
      const data = await DispatchService.list({
        search,
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
        warehouse: currentWarehouse,
        mode: "transfer",
      });

      const rows = Array.isArray(data?.data) ? data.data : [];
      setItems(rows.map(mapTransferItem));
      setTotalItems(data?.total || 0);
      setLastPage(data?.last_page || 1);
    } catch (err) {
      console.error("Error fetching transfer items:", err);
      setItems([]);
      setTotalItems(0);
      setLastPage(1);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [search, currentPage, currentWarehouse]);

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

  const handleSaveTransferItem = async () => {
    const required = ["ref", "purpose", "from", "to", "dateNeeded", "preparedBy", "approvedBy", "type"];
    const hasEmpty = required.some((key) => !String(newItem[key] ?? "").trim());

    if (hasEmpty) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ptf_no: String(newItem.ptf.split("-")[0] || newItem.ptf),
        ref_no: String(newItem.ref),
        purpose: String(newItem.purpose),
        pull_from: String(newItem.from),
        pull_to: String(newItem.to),
        date_needed: String(newItem.dateNeeded),
        client: String(newItem.client || ""),
        po_no: String(newItem.po || ""),
        remarks: String(newItem.remarks || ""),
        prepared_by: String(newItem.preparedBy),
        approved_by: String(newItem.approvedBy),
        date: String(newItem.requestDate),
        type: String(newItem.type),
        warehouse: currentWarehouse,
        stat: 1,
        items: [],
      };



      await DispatchService.create(payload);
      setShowTransferModal(false);
      await fetchTransfers();
    } catch (err) {
      console.error("Save transfer error:", err);
      alert(err?.response?.data?.message || "Failed to save transfer item.");
    } finally {
      setLoading(false);
    }
  };

  const openTransferModal = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const todayStr = `${dd}${mm}${yyyy}`;
    const requestDate = `${yyyy}-${mm}-${dd}`;

    let lastNumber = 0;
    if (items.length > 0) {
      const ptfNumbers = items
        .map((item) => item.ptfRaw)
        .filter(Boolean)
        .map((num) => parseInt(num, 10))
        .filter((num) => !Number.isNaN(num));
      lastNumber = ptfNumbers.length ? Math.max(...ptfNumbers) : 0;
    }

    const nextNumber = String(lastNumber + 1).padStart(4, "0");
    const ptfNumber = `${nextNumber}-${todayStr}`;

    setNewItem({
      ptf: ptfNumber,
      ref: "",
      purpose: "",
      from: "",
      to: isCebu ? "Warehouse - Cebu" : "Warehouse - Main",
      dateNeeded: "",
      client: "",
      po: "",
      remarks: "",
      preparedBy: "",
      approvedBy: "",
      requestDate,
      type: "Transfer",
    });

    setModalMode("create");
    setSelectedItem(null);
    setShowTransferModal(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setModalMode("view");
    setNewItem({
      ptf: item.ptf || "",
      ref: item.ref || "",
      purpose: item.purpose || "",
      from: item.from || "",
      to: item.to || "",
      dateNeeded: item.dateNeeded || "",
      client: item.client || "",
      po: item.po || "",
      remarks: item.remarks || "",
      preparedBy: item.preparedBy || "",
      approvedBy: item.approvedBy || "",
      requestDate: item.requestDate || "",
      type: item.type || "",
    });
    setShowTransferModal(true);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this transfer?")) return;

    try {
      await DispatchService.cancel(id);
      await fetchTransfers();
    } catch (err) {
      console.error("Cancel transfer error:", err);
      alert(err?.response?.data?.message || "Failed to cancel transfer.");
    }
  };

  const fieldIcons = {
    from: Building2,
    to: Warehouse,
    ref: Hash,
    dateNeeded: Calendar,
    client: User,
    po: FileText,
    purpose: ClipboardList,
    remarks: MessageSquare,
    preparedBy: User,
    approvedBy: CheckCircle,
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${titleColor}`}>Transfer Items</h2>
          <p className="text-gray-500 text-sm">Manage your transfer request</p>
        </div>

        <button
          onClick={openTransferModal}
          className={`flex items-center gap-2 text-white px-4 py-2 border cursor-pointer transition-colors duration-200 ${addBtn}`}
        >
          <Plus size={18} /> Transfer Item
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-[420px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search PTF, REF, or Purpose..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none pr-10 ${searchFocus}`}
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="hidden sm:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${headerBg} text-white font-semibold`}>
            <tr>
              {headers.map((header) => (
                <th key={header.key} className="px-4 py-2 text-left">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  {headers.map((header) => (
                    <td key={header.key} className="px-4 py-2 text-gray-700">
                      {header.key === "action" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(item)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                          >
                            <Eye size={16} /> View
                          </button>
                          {item.type !== "Received" && (
                            <button
                              onClick={() => handleCancel(item.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                            >
                              <X size={16} /> Cancel
                            </button>
                          )}
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
                  No transfer items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              {headers.map((header) => (
                <div key={header.key} className="flex justify-between mb-2 gap-3">
                  <span className="text-gray-500 font-medium">{header.label}</span>
                  {header.key === "action" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                      >
                        <Eye size={16} /> View
                      </button>
                      {item.type !== "Received" && (
                        <button
                          onClick={() => handleCancel(item.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                        >
                          <X size={16} /> Cancel
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-700 text-right">{item[header.key] || "-"}</span>
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">No transfer items found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-end items-center gap-2 p-4 border-t bg-gray-50 mt-4 rounded-b-lg">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded bg-white border disabled:opacity-50 ${pgBorder}`}
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
            className={`p-2 rounded bg-white border disabled:opacity-50 ${pgBorder}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {showTransferModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl overflow-y-auto max-h-[90vh] relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {modalMode === "view" ? "View Transfer Item" : "Transfer Item"}
              </h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {newItem.ptf}
              </span>
            </div>

            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowTransferModal(false)}
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 gap-4">
              {[
                { key: "from", label: "From", type: "text", disabled: false },
                { key: "to", label: "To", type: "text", disabled: true },
                { key: "ref", label: "REF #", type: "text", disabled: false },
                { key: "dateNeeded", label: "Date Needed", type: "date", disabled: false },
                { key: "client", label: "Client", type: "text", disabled: false },
                { key: "po", label: "PO #", type: "text", disabled: false },
                { key: "purpose", label: "Purpose", type: "text", disabled: false },
                { key: "remarks", label: "Remarks", type: "text", disabled: false },
                { key: "preparedBy", label: "Prepared By", type: "text", disabled: false },
                { key: "approvedBy", label: "Approved By", type: "text", disabled: false },
              ].map((field) => {
                const Icon = fieldIcons[field.key];
                const readOnly = modalMode === "view" || field.disabled;

                return (
                  <div key={field.key} className="relative flex items-center">
                    <div className="absolute left-0 h-full flex items-center">
                      <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                        <Icon size={18} className="text-white" />
                      </div>
                    </div>

                    <input
                      type={field.type}
                      value={newItem[field.key]}
                      disabled={readOnly}
                      onChange={(e) => setNewItem({ ...newItem, [field.key]: e.target.value })}
                      placeholder=" "
                      className={`peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg ${readOnly
                        ? "bg-gray-100 cursor-not-allowed text-gray-500"
                        : "bg-gray-50 focus:outline-none"
                        }`}
                    />

                    <label
                      className={`absolute left-14 text-gray-500 text-sm transition-all duration-200 ${readOnly || newItem[field.key] || field.type === "date"
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
                onClick={() => setShowTransferModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>

              {modalMode !== "view" && (
                <button
                  onClick={handleSaveTransferItem}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition ${saveBtn}`}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
