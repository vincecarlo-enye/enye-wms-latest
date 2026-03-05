export default function EmpWarrantyView({ selectedWarranty, onClose }) {
  if (!selectedWarranty) return null;

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-orange-600">ENYE</h1>
        <h2 className="text-lg font-semibold">
          WARRANTY CLAIM AND REPLACEMENT
        </h2>
      </div>

      {/* Top Information Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-6 text-sm mb-6">
        <div className="flex-1 space-y-1">
          <p>
            Client Name:{" "}
            <strong>{selectedWarranty.clientName}</strong>
          </p>
          <p>
            Warranty Claimed ETA:{" "}
            <strong>{selectedWarranty.warrantyETA || "N/A"}</strong>
          </p>
        </div>

        <div className="flex-1 space-y-1">
          <p>
            Project Name:{" "}
            <strong>{selectedWarranty.projectName}</strong>
          </p>
          <p>
            Ref No.:{" "}
            <strong>{selectedWarranty.refNo}</strong>
          </p>
        </div>

        <div className="flex-1 space-y-1">
          <p>
            Item Type:{" "}
            <strong>{selectedWarranty.itemType}</strong>
          </p>
          <p>
            Replacement Date:{" "}
            <strong>{selectedWarranty.replacementDate}</strong>
          </p>
        </div>

        <div className="flex-1 space-y-1 text-left sm:text-right">
          <p>
            SRF No:{" "}
            <strong>{selectedWarranty.srfNo}</strong>
          </p>
          <p>
            Delivery Date:{" "}
            <strong>{selectedWarranty.deliveryDate}</strong>
          </p>
          <p>
            Item Supplied By:{" "}
            <strong>{selectedWarranty.suppliedBy}</strong>
          </p>
          <p>
            D.R. No.:{" "}
            <strong>{selectedWarranty.drNo}</strong>
          </p>
        </div>
      </div>

      <hr className="mb-6" />

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-gray-300 text-sm table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-left">Barcode</th>
              <th className="border px-2 py-1 text-center">Quantity</th>
              <th className="border px-2 py-1 text-center">UOM</th>
            </tr>
          </thead>
          <tbody>
            {selectedWarranty.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">
                  {item.barcode || "N/A"}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.quantity}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.uom}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Remarks */}
      <div className="text-sm mb-6">
        <strong>Remarks:</strong>{" "}
        {selectedWarranty.remarks || "-"}
      </div>

      {/* Approval Section */}
      <div className="overflow-x-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">

          <div className="border p-3 flex-1 min-w-50">
            <div className="font-semibold mb-2">Requested by:</div>
            <div>{selectedWarranty.requestedBy}</div>
            <div>{selectedWarranty.requestedByRole}</div>
          </div>

          <div className="border p-3 flex-1 min-w-50">
            <div className="font-semibold mb-2">Noted by:</div>
            <div>{selectedWarranty.notedBy}</div>
          </div>

          <div className="border p-3 flex-1 min-w-50">
            <div className="font-semibold mb-2">
              Disapproved by Manager:
            </div>
            <div>{selectedWarranty.disapprovedBy}</div>
            <div className="mt-1">
              Remarks: {selectedWarranty.managerRemarks}
            </div>
            <div>{selectedWarranty.disapprovedDate}</div>
            <div>{selectedWarranty.managerRole}</div>
          </div>

          <div className="border p-3 flex-1 min-w-50">
            <div className="font-semibold mb-2">Received by PL:</div>
            <div>{selectedWarranty.receivedByPL}</div>
          </div>

          <div className="border p-3 flex-1 min-w-50">
            <div className="font-semibold mb-2">Approved by PL:</div>
            <div>{selectedWarranty.approvedByPL}</div>
          </div>

          <div className="border p-3 flex-1 min-w-50">
            <div className="font-semibold mb-2">
              Released/Reserved by:
            </div>
            <div>{selectedWarranty.releasedBy}</div>
          </div>

          <div className="border p-3 flex-1 min-w-50">
            <div className="font-semibold mb-2">Received by:</div>
            <div>{selectedWarranty.receivedBy}</div>
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
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