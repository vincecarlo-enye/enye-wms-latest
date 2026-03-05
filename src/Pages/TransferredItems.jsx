import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ClipboardList,
  FileText,
  User,
  Calendar,
  CheckCircle,
  PackageCheck,
  Copy,
  FileSpreadsheet,
  FileDown,
  FileText as PdfIcon,
  Printer
} from "lucide-react";
import TransferredItemsData from "../assets/js/TransferrredItems.json";

const icons = {
  ptfNo: ClipboardList,
  poNumber: FileText,
  client: User,
  purpose: FileText,
  dateNeeded: Calendar,
  approvedBy: User,
  status: CheckCircle,
};

function ViewField({ label, value, name }) {
  const Icon = icons[name] || FileText;
  return (
    <div className="relative flex items-center mb-3">
      <div className="absolute left-0 h-full flex items-center">
        <div className="bg-purple-600 h-full px-3 flex items-center rounded-l-lg">
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <input
        value={value}
        disabled
        className="w-full pl-14 pr-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed shadow-sm"
      />
      <label className="absolute left-14 -top-2 bg-white px-1 text-sm text-gray-600">
        {label}
      </label>
    </div>
  );
}

export default function TransferredItems() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(TransferredItemsData);
  const [viewItem, setViewItem] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryPage, setSummaryPage] = useState(1);
  const [receiveItem, setReceiveItem] = useState(null);
  const summaryItemsPerPage = 10;

  // ── Export Utilities ───────────────────────────────────────────────────────
  const headers = ["PTF No", "Client", "Barcode", "Product", "Brand", "Quantity", "Reserve Date"];

  const getExportData = () =>
    paginatedSummaryItems.map((item) => [
      item.ptfNo, item.client, item.barcode,
      item.product, item.brand, item.quantity, item.reserveDate,
    ]);

  const handleCopy = async () => {
    const rows = getExportData();
    const text = headers.join("\t") + "\n" + rows.map((row) => row.join("\t")).join("\n");
    await navigator.clipboard.writeText(text);
  };

  const handleCSV = () => {
    const rows = getExportData();
    const csv = headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transfer-summary.csv"; a.click();
  };

  const handleExcel = () => {
    const rows = getExportData();
    let table = "<table border='1'><tr>";
    headers.forEach((h) => (table += `<th>${h}</th>`));
    table += "</tr>";
    rows.forEach((row) => {
      table += "<tr>";
      row.forEach((cell) => (table += `<td>${cell}</td>`));
      table += "</tr>";
    });
    table += "</table>";
    const blob = new Blob([table], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transfer-summary.xls"; a.click();
  };

  const handlePDF = () => {
    const rows = getExportData();
    let html = `<h2>Transfer Summary</h2><table border="1" cellspacing="0" cellpadding="5"><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
    const blob = new Blob([html], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transfer-summary.pdf"; a.click();
  };

  const handlePrint = () => window.print();

  // ── Data ──────────────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const allSummaryItems = useMemo(() => {
    return items.flatMap((transfer) =>
      (transfer.summary || []).map((summaryItem) => ({
        ptfNo: transfer.ptfNo,
        client: transfer.client,
        ...summaryItem,
      }))
    );
  }, [items]);

  const summaryTotalPages = Math.ceil(allSummaryItems.length / summaryItemsPerPage);
  const paginatedSummaryItems = allSummaryItems.slice(
    (summaryPage - 1) * summaryItemsPerPage,
    summaryPage * summaryItemsPerPage
  );

  const handleOpenSummary = () => { setSummaryPage(1); setShowSummary(true); };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    return filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleConfirmReceive = () => {
    const updated = items.map((item) =>
      item.ptfNo === receiveItem.ptfNo ? { ...item, status: "Received" } : item
    );
    setItems(updated);
    setReceiveItem(null);
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-600">Transferred Stock Items</h2>
          <p className="text-gray-500 text-sm">Manage transferred product items</p>
        </div>
        <button
          onClick={handleOpenSummary}
          className="px-5 py-2 bg-purple-600 text-white hover:bg-transparent hover:text-purple-600 border border-purple-600 transition"
        >
          View Transfer Summary
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 max-w-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search PTF, PO, client..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-purple-600 text-white text-sm uppercase">
            <tr>
              <th className="px-4 py-4 text-left">PTF No.</th>
              <th className="px-4 py-4 text-left">PO #</th>
              <th className="px-4 py-4 text-left">Client</th>
              <th className="px-4 py-4 text-left">Purpose</th>
              <th className="px-4 py-4 text-left">Date Needed</th>
              <th className="px-4 py-4 text-left">Approved By</th>
              <th className="px-4 py-4 text-left">Status</th>
              <th className="px-4 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-purple-50 transition">
                  <td className="px-4 py-3">{item.ptfNo}</td>
                  <td className="px-4 py-3">{item.poNumber}</td>
                  <td className="px-4 py-3">{item.client}</td>
                  <td className="px-4 py-3">{item.purpose}</td>
                  <td className="px-4 py-3">{item.dateNeeded}</td>
                  <td className="px-4 py-3">{item.approvedBy}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === "Received" ? "bg-green-100 text-green-600"
                      : item.status === "Transfer" ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setViewItem({ ...item })} className="text-blue-500 hover:text-blue-800 cursor-pointer">
                        <Eye size={20} />
                      </button>
                      {item.status !== "Received" && (
                        <button onClick={() => setReceiveItem(item)} className="text-green-500 hover:text-green-800 cursor-pointer">
                          <PackageCheck size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No transferred items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedItems.map((item, idx) => (
          <div key={idx} className="bg-white shadow rounded p-4 hover:bg-purple-50 transition space-y-1 border-l-4 border-purple-600">
            <div><strong>PTF:</strong> {item.ptfNo}</div>
            <div><strong>PO:</strong> {item.poNumber}</div>
            <div><strong>Client:</strong> {item.client}</div>
            <div><strong>Purpose:</strong> {item.purpose}</div>
            <div><strong>Date Needed:</strong> {item.dateNeeded}</div>
            <div><strong>Status:</strong> {item.status}</div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setViewItem({ ...item })} className="text-purple-600">
                <Eye size={16} />
              </button>
              {item.status !== "Received" && (
                <button onClick={() => handleConfirmReceive(idx)} className="text-green-600 text-sm">
                  Received
                </button>
              )}
            </div>
          </div>
        ))}
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
                currentPage === idx + 1
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white hover:bg-gray-100"
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

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setViewItem(null)}>
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-4">List of Product Stock Items</h2>
            <div className="border border-black mb-6">
              <div className="grid grid-cols-3 border-b border-black">
                <div className="p-3 border-r border-black"><strong>PTF # :</strong> {viewItem.ptfNo}</div>
                <div className="p-3 border-r border-black"><strong>PTF Date :</strong> {viewItem.dateNeeded}</div>
                <div className="p-3"><strong>Purpose :</strong> {viewItem.purpose}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-3 border-r border-black"><strong>PO # :</strong> {viewItem.poNumber}</div>
                <div className="p-3 border-r border-black"><strong>Client :</strong> {viewItem.client}</div>
                <div className="p-3"><strong>Remarks :</strong> {viewItem.remarks || "-"}</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-black border-collapse text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2 text-left">Barcode</th>
                    <th className="border p-2 text-left">Product</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-center">Quantity</th>
                    <th className="border p-2 text-right">Buy price</th>
                    <th className="border p-2 text-right">Total price</th>
                    <th className="border p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {viewItem.summary?.length > 0 ? (
                    viewItem.summary.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border p-2">{item.barcode}</td>
                        <td className="border p-2">{item.product}</td>
                        <td className="border p-2">{item.description}</td>
                        <td className="border p-2">{item.category}</td>
                        <td className="border p-2 text-center">
                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">{item.quantity}</span>
                        </td>
                        <td className="border p-2 text-right">$ {item.buyPrice}</td>
                        <td className="border p-2 text-right">$ {item.totalPrice}</td>
                        <td className="border p-2 text-center">{viewItem.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="text-center p-4">No items found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewItem(null)}
                className="px-4 py-2 bg-purple-600 text-white border border-purple-600 hover:bg-transparent hover:text-purple-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden" onClick={() => setShowSummary(false)}>
              <X size={22} />
            </button>
            <h3 className="text-2xl font-bold text-purple-600 mb-6">Transfer Summary</h3>
            <div className="overflow-x-auto print:overflow-visible print:max-h-none">
              {/* Export Buttons */}
              <div className="flex gap-6 mb-4 print:hidden">
                {[
                  { fn: handleCopy,  Icon: Copy,           label: "COPY"  },
                  { fn: handleCSV,   Icon: FileDown,        label: "CSV"   },
                  { fn: handleExcel, Icon: FileSpreadsheet, label: "EXCEL" },
                  { fn: handlePDF,   Icon: PdfIcon,         label: "PDF"   },
                  { fn: handlePrint, Icon: Printer,         label: "PRINT" },
                ].map(({ fn, Icon, label }) => (
                  <button key={label} onClick={fn} className="flex flex-col items-center text-gray-700 hover:text-purple-600">
                    <Icon size={22} />
                    <span className="text-xs mt-1">{label}</span>
                  </button>
                ))}
              </div>

              <table className="w-full border border-black border-collapse">
                <thead className="bg-purple-600 text-white text-sm uppercase">
                  <tr>
                    <th className="p-2 border">PTF No</th>
                    <th className="p-2 border">Client</th>
                    <th className="p-2 border">Barcode</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Brand</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Reserve Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allSummaryItems.length > 0 ? (
                    paginatedSummaryItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-purple-50">
                        <td className="p-2 border">{item.ptfNo}</td>
                        <td className="p-2 border">{item.client}</td>
                        <td className="p-2 border">{item.barcode}</td>
                        <td className="p-2 border">{item.product}</td>
                        <td className="p-2 border">{item.brand}</td>
                        <td className="p-2 border text-center">{item.quantity}</td>
                        <td className="p-2 border">{item.reserveDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center p-4 text-gray-500">No summary data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {summaryTotalPages > 1 && (
              <div className="flex justify-end items-center mt-4 gap-2 flex-wrap">
                <button onClick={() => setSummaryPage((prev) => Math.max(prev - 1, 1))} disabled={summaryPage === 1} className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                {[...Array(summaryTotalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSummaryPage(idx + 1)}
                    className={`px-3 py-1 rounded border ${
                      summaryPage === idx + 1
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button onClick={() => setSummaryPage((prev) => Math.min(prev + 1, summaryTotalPages))} disabled={summaryPage === summaryTotalPages} className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <div className="text-gray-600 font-semibold">
                Showing: {paginatedSummaryItems.length} data/s <br />
                Total Summary Items: {allSummaryItems.length}
              </div>
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 py-2 bg-purple-600 text-white hover:bg-transparent hover:text-purple-600 border border-purple-600 cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {receiveItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setReceiveItem(null)}>
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-4">List of Product Stock Items</h2>
            <div className="border border-black mb-6">
              <div className="grid grid-cols-3 border-b border-black">
                <div className="p-3 border-r border-black"><strong>PTF # :</strong> {receiveItem.ptfNo}</div>
                <div className="p-3 border-r border-black"><strong>PTF Date :</strong> {receiveItem.dateNeeded}</div>
                <div className="p-3"><strong>Purpose :</strong> {receiveItem.purpose}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-3 border-r border-black"><strong>PO # :</strong> {receiveItem.poNumber}</div>
                <div className="p-3 border-r border-black"><strong>Client :</strong> {receiveItem.client}</div>
                <div className="p-3"><strong>Remarks :</strong> {receiveItem.remarks || "-"}</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-black border-collapse text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2 text-left">Barcode</th>
                    <th className="border p-2 text-left">Product</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-center">Quantity</th>
                    <th className="border p-2 text-right">Buy price</th>
                    <th className="border p-2 text-right">Total price</th>
                    <th className="border p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {receiveItem.summary?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{item.barcode}</td>
                      <td className="border p-2">{item.product}</td>
                      <td className="border p-2">{item.description}</td>
                      <td className="border p-2">{item.category}</td>
                      <td className="border p-2 text-center">
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">{item.quantity}</span>
                      </td>
                      <td className="border p-2 text-right">$ {item.buyPrice}</td>
                      <td className="border p-2 text-right">$ {item.totalPrice}</td>
                      <td className="border p-2 text-center">Transfer</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  const confirmReceive = window.confirm("Are you sure you want to mark this as RECEIVED?");
                  if (confirmReceive) handleConfirmReceive();
                }}
                className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-lg font-semibold"
              >
                RECEIVED
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}