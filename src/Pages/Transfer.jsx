import { useState, useMemo } from "react";
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
  CheckCircle
} from "lucide-react";
import transferData from "../assets/js/Transfer.json"; // JSON file with dummy transfer items

export default function Transfer() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(transferData);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [newItem, setNewItem] = useState({
    ptf: "",
    ref: "",
    purpose: "",
    from: "",
    to: "Warehouse - Cebu",
    dateNeeded: "",
    client: "",
    po: "",
    remarks: "",
    preparedBy: "",
    approvedBy: "",
    requestDate: "",
    type: ""
  });

  const itemsPerPage = 5;

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

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

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

  const filteredItems = sortedItems.filter(item =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    if (key === "action") return;
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const handleSaveTransferItem = () => {
    setItems([...items, newItem]);
    setShowTransferModal(false);
    setNewItem({
      ptf: "",
      ref: "",
      purpose: "",
      from: "",
      to: "Warehouse - Cebu",
      dateNeeded: "",
      client: "",
      po: "",
      remarks: "",
      preparedBy: "",
      approvedBy: "",
      requestDate: "",
      type: ""
    });
  };

  const openTransferModal = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const todayStr = `${dd}${mm}${yyyy}`;

    let lastNumber = 0;
    if (items.length > 0) {
      const ptfNumbers = items
        .map(item => item.ptf?.split("-")[0])
        .filter(Boolean)
        .map(num => parseInt(num, 10));
      lastNumber = Math.max(...ptfNumbers);
    }

    const nextNumber = String(lastNumber + 1).padStart(4, "0"); // e.g., 0006
    const ptfNumber = `${nextNumber}-${todayStr}`;
    const requestDate = `${yyyy}-${mm}-${dd}`;

    setNewItem({
      ptf: ptfNumber,
      ref: "",
      purpose: "",
      from: "",
      to: "Warehouse - Cebu",
      dateNeeded: "",
      client: "",
      po: "",
      remarks: "",
      preparedBy: "",
      approvedBy: "",
      requestDate: requestDate,
      type: ""
    });

    setShowTransferModal(true);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-600">Transfer Items</h2>
          <p className="text-gray-500 text-sm">Manage your transfer request</p>
        </div>
        <button
          onClick={openTransferModal}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 border border-orange-600 cursor-pointer transition-colors duration-200 hover:bg-transparent hover:text-orange-600"
        >
          <Plus size={18} /> Transfer Item
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-105">
        <div className="relative">
          <input
            type="text"
            placeholder="Search PTF, REF, or Purpose..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 pr-10"
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Table for desktop */}
<div className="hidden sm:block bg-white rounded-lg shadow overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-orange-600 text-white font-semibold">
      <tr>
        {headers.map(header => (
          <th
            key={header.key}
            onClick={() => handleSort(header.key)}
            className="px-4 py-2 text-left cursor-pointer hover:text-orange-800 transition"
          >
            {header.label}
            {sortConfig.key === header.key && (
              <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
            )}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {paginatedItems.length > 0 ? (
        paginatedItems.map((item, idx) => (
          <tr key={idx} className="hover:bg-gray-50 transition">
            {headers.map(header => (
              <td key={header.key} className="px-4 py-2 text-gray-700">
                {header.key === "action" ? (
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition">
                      <Eye size={16} /> View
                    </button>
                    <button className="flex items-center gap-1 text-red-600 hover:text-red-800 transition">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                ) : item[header.key] || "-"}
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

{/* Card layout for mobile */}
<div className="sm:hidden flex flex-col gap-4">
  {paginatedItems.length > 0 ? (
    paginatedItems.map((item, idx) => (
      <div key={idx} className="bg-white p-4 rounded-lg shadow">
        {headers.map(header => (
          <div key={header.key} className="flex justify-between mb-2">
            <span className="text-gray-500 font-medium">{header.label}</span>
            {header.key === "action" ? (
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition">
                  <Eye size={16} /> View
                </button>
                <button className="flex items-center gap-1 text-red-600 hover:text-red-800 transition">
                  <X size={16} /> Cancel
                </button>
              </div>
            ) : (
              <span className="text-gray-700">{item[header.key] || "-"}</span>
            )}
          </div>
        ))}
      </div>
    ))
  ) : (
    <div className="text-center py-6 text-gray-500">No transfer items found.</div>
  )}
</div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-end items-center gap-2 p-4 border-t bg-gray-50">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded border ${currentPage === idx + 1 ? "bg-orange-600 text-white border-orange-600" : "bg-white hover:bg-gray-100"}`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      {/* Transfer Item Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl overflow-y-auto max-h-[90vh] relative transition-transform transform scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Transfer Item</h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">{newItem.ptf}</span>
            </div>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowTransferModal(false)}
            >
              <X size={20} />
            </button>

            {/* Form Fields */}
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
              ].map(field => {
                const Icon = fieldIcons[field.key];

                return (
                  <div key={field.key} className="relative flex items-center">
                    {/* Icon */}
                    <div className="absolute left-0 h-full flex items-center">
                      <div className="bg-orange-500 h-full px-3 flex items-center rounded-l-lg">
                        <Icon size={18} className="text-white" />
                      </div>
                    </div>

                    {/* Input */}
                    <input
                      type={field.type}
                      value={newItem[field.key]}
                      disabled={field.disabled}
                      onChange={e => setNewItem({ ...newItem, [field.key]: e.target.value })}
                      placeholder=" "
                      className={`
                        peer w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg
                        ${field.disabled
                          ? "bg-gray-100 cursor-not-allowed text-gray-500"
                          : "bg-gray-50 focus:outline-none focus:border-orange-500"
                        }
                      `}
                    />

                    {/* Floating Label */}
                    <label
                      className={`
                        absolute left-14 text-gray-500 text-sm transition-all duration-200
                        ${field.disabled || newItem[field.key] || field.type === "date"
                          ? "-top-2 text-gray-600 text-sm bg-white px-1"
                          : "top-2.5 text-gray-400 text-base peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm"
                        }
                      `}
                    >
                      {field.label}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTransferItem}
                className="px-6 py-2 rounded-lg bg-linear-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition"
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