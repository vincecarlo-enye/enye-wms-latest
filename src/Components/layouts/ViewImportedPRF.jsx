import React, { useEffect } from "react";

const ViewImportedPRF = ({ selectedPRF, onClose, autoPrint }) => {
  useEffect(() => {
    if (autoPrint && selectedPRF) {
      setTimeout(() => {
        window.print();
        onClose?.();
      }, 100);
    }
  }, [autoPrint, selectedPRF, onClose]);

  if (!selectedPRF) return null;

  return (
    <div className="bg-white w-full max-w-5xl mx-auto rounded shadow-lg overflow-hidden print:shadow-none">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 py-3 sm:px-6 print:hidden">
        <h2 className="text-lg font-semibold">View Imported PRF</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-8 text-sm text-gray-800">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <img
            src="/src/assets/images/enye.png"
            alt="Logo"
            className="h-10 mx-auto mb-2"
          />
          <h1 className="font-semibold underline text-base">
            Imported Purchase Requisition Form
          </h1>
        </div>

        {/* PRF Info Section */}
        <div className="mb-6">
          <div className="flex justify-end mb-8">
            <p><strong>PRF #:</strong> {selectedPRF.prfNo}</p>
          </div>

          {/* Top Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div><p><strong>CLIENT NAME:</strong> {selectedPRF.clientName}</p></div>
            <div><p><strong>PROJECT NAME:</strong> {selectedPRF.project}</p></div>
            <div><p><strong>P.O. #:</strong> {selectedPRF.poNo}</p></div>
            <div><p><strong>DATE:</strong> {selectedPRF.date || "-"}</p></div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><p><strong>DATE NEEDED:</strong> {selectedPRF.dateNeeded || "-"}</p></div>
            <div><p><strong>DELIVER TO:</strong> {selectedPRF.deliverTo || "-"}</p></div>
            <div><p><strong>SHIPPING INSTRUCTIONS:</strong> {selectedPRF.shippingInstructions || "-"}</p></div>
            <div><p><strong>TERMS:</strong> {selectedPRF.terms || "-"}</p></div>
          </div>

          {/* Item Type & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block font-semibold mb-1">Item Type:</label>
              <input
                type="text"
                value={selectedPRF.itemType || "Imported Item/s"}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed print:border-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email:</label>
              <input
                type="text"
                value={selectedPRF.email || "-"}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed print:border-none"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border border-gray-400 text-xs min-w-150">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">QTY</th>
                <th className="border px-2 py-1">BRANDS/SUPPLIER</th>
                <th className="border px-2 py-1">DESCRIPTION</th>
                <th className="border px-2 py-1">UNIT PRICE</th>
                <th className="border px-2 py-1">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {selectedPRF.items?.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1 text-center">{item.qty}</td>
                  <td className="border px-2 py-1">{item.brand}</td>
                  <td className="border px-2 py-1">{item.description}</td>
                  <td className="border px-2 py-1 text-center">{item.unitPrice}</td>
                  <td className="border px-2 py-1 text-center">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remarks & Total */}
        <div className="flex flex-col sm:flex-row justify-between mb-8 gap-2">
          <p><strong>REMARKS:</strong> {selectedPRF.remarks || "-"}</p>
          <p className="font-bold bg-yellow-300 px-2 text-center sm:text-left">
            TOTAL: {selectedPRF.total || 0}
          </p>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <p className="font-semibold border-b mb-2">Note/s From:</p>
        </div>

        {/* Approval Section */}
        <div className="border text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b">
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Requested By:</p>
              <p>{selectedPRF.requestedBy}</p>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Noted By:</p>
              <p>{selectedPRF.notedBy || "-"}</p>
            </div>
            <div className="p-2">
              <p className="font-semibold">Approved By:</p>
              <p>{selectedPRF.approvedBy || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4">
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Checked By PL:</p>
              <p>{selectedPRF.checkedBy || "-"}</p>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Approved By PL:</p>
              <p>{selectedPRF.approvedByPL || "-"}</p>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r p-2">
              <p className="font-semibold">Released By:</p>
              <p>{selectedPRF.releasedBy || "-"}</p>
            </div>
            <div className="p-2">
              <p className="font-semibold">Received By:</p>
              <p>{selectedPRF.receivedBy || "-"}</p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-8 print:hidden">
          <button onClick={() => window.print()} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded w-full sm:w-auto cursor-pointer transition">
            Print
          </button>
          <button
            onClick={onClose}
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded w-full sm:w-auto cursor-pointer transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewImportedPRF;