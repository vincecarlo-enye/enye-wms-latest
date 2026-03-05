export default function EmpBorrowView({ selectedBorrow, onClose }) {
  if (!selectedBorrow) return null;

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-orange-600">ENYE</h1>
        <h2 className="text-lg font-semibold">Borrow</h2>
      </div>

      {/* Responsive Info Grid */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4 text-sm">
        <div className="flex-1">
          <p>Intended for: <strong>{selectedBorrow.intendedFor}</strong></p>
          <p>Item type: <strong>{selectedBorrow.itemType}</strong></p>
        </div>
        <div className="flex-1">
          <p>To be used for: <strong>{selectedBorrow.usedFor}</strong></p>
          <p>Date needed: <strong>{selectedBorrow.borrowedDate}</strong></p>
        </div>
        <div className="flex-1 text-left sm:text-right">
          <p>SRF No: <strong>{selectedBorrow.srfNo}</strong></p>
          <p>To be returned on: <strong>{selectedBorrow.returnedOn || "-"}</strong></p>
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
            {selectedBorrow.items.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.productName}</td>
                <td className="border px-2 py-1">{item.barcode}</td>
                <td className="border px-2 py-1 text-center">{item.quantity}</td>
                <td className="border px-2 py-1 text-center">{item.uom}</td>
                <td className="border px-2 py-1">{item.notes}</td>
                <td className="border px-2 py-1"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm mb-6">
        <strong>Remarks:</strong> THIS IS FOR TESTING ONLY
      </div>

      {/* Approval Section */}
      <div className="overflow-x-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          {[
            { title: "Requested by", value: selectedBorrow.requestedBy },
            { title: "Noted by", value: "Immediate Supervisor" },
            { title: "Approved by", value: "Department Manager" },
            { title: "Received by PL", value: "Logistics" },
            { title: "Approved by PL", value: "Logistics Manager" },
            { title: "Released/Reserved by", value: "Logistics" },
            { title: "Received by", value: "Employee" },
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
