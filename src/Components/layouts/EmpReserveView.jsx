import React from "react";

export default function EmpReserveView({ selectedReserve, onClose }) {
  if (!selectedReserve) return null;

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-orange-600">ENYE</h1>
        <h2 className="text-lg font-semibold">Reserved Item Details</h2>
      </div>

      {/* Responsive Info Grid */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4 text-sm">
        <div className="flex-1">
          <p>
            Intended for: <strong>{selectedReserve.intendedFor}</strong>
          </p>
          <p>
            Item type: <strong>{selectedReserve.itemType}</strong>
          </p>
        </div>
        <div className="flex-1">
          <p>
            Used for: <strong>{selectedReserve.usedFor}</strong>
          </p>
          <p>
            Reserved Date: <strong>{selectedReserve.reservedDate}</strong>
          </p>
        </div>
        <div className="flex-1 text-left sm:text-right">
          <p>
            SRF No: <strong>{selectedReserve.srfNo}</strong>
          </p>
          {/* Reserved list typically doesn't have return date; remove or add if needed */}
          {/* <p>
            To be returned on: <strong>{selectedReserve.returnedOn || "-"}</strong>
          </p> */}
        </div>
      </div>

      <hr className="mb-6" />

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-gray-300 text-sm table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">Item</th>
              <th className="border px-2 py-1 text-left">Barcode</th>
              <th className="border px-2 py-1 text-center">Quantity</th>
              <th className="border px-2 py-1 text-center">UOM</th>
              <th className="border px-2 py-1 text-left">Notes</th>
              <th className="border px-2 py-1 text-left">Release/Reserve</th>
            </tr>
          </thead>
          <tbody>
            {(selectedReserve.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.productName}</td>
                <td className="border px-2 py-1">{item.barcode}</td>
                <td className="border px-2 py-1 text-center">{item.quantity}</td>
                <td className="border px-2 py-1 text-center">{item.uom}</td>
                <td className="border px-2 py-1">{item.notes}</td>
                <td className="border px-2 py-1">{item.releaseOrReserve || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Remarks Section */}
      <div className="text-sm mb-6">
        <strong>Remarks:</strong>{" "}
        {selectedReserve.remarks || "-"}
      </div>

      {/* Approval Section */}
      <div className="overflow-x-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          {[
            { title: "Requested by", value: selectedReserve.requestedBy },
            { title: "Noted by", value: selectedReserve.notedBy || "Immediate Supervisor" },
            { title: "Approved by", value: selectedReserve.approvedBy || "Department Manager" },
            { title: "Received by PL", value: selectedReserve.receivedByPL || "Logistics" },
            { title: "Approved by PL", value: selectedReserve.approvedByPL || "Logistics Manager" },
            { title: "Released/Reserved by", value: selectedReserve.releasedBy || "Logistics" },
            { title: "Received by", value: selectedReserve.receivedBy || "Employee" },
          ].map((item, idx) => (
            <div key={idx} className="border p-3 flex-1 min-w-37.5">
              <div className="font-semibold mb-2">{item.title}:</div>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Print
        </button>

        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
        >
          Close
        </button>
      </div>
    </>
  );
}
