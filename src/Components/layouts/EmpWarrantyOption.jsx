import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";

export default function EmpWarrantyOption({
  selectedWarranty,
  onClose,
  onApprove,
  onProcess,
  onReserveOrRelease,
  onDisapprove,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  if (!selectedWarranty) return null;

  const handleOpenDialog = (type) => {
    setActionType(type);
    setReason("");
    setError(false);
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }

    switch (actionType) {
      case "APPROVED":
        onApprove(selectedWarranty, reason);
        break;
      case "PROCESS":
        onProcess(selectedWarranty, reason);
        break;
      case "RESERVE_RELEASE":
        onReserveOrRelease(selectedWarranty, reason);
        break;
      case "DISAPPROVED":
        onDisapprove(selectedWarranty, reason);
        break;
      default:
        break;
    }

    setOpenDialog(false);
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-orange-600">ENYE</h1>
        <h2 className="text-lg font-semibold">Warranty Claim and Replacement</h2>
      </div>

      {/* Info Grid */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4 text-sm">
        <div className="flex-1">
          <p>
            Client Name: <strong>{selectedWarranty.clientName}</strong>
          </p>
          <p>
            Project Name: <strong>{selectedWarranty.projectName}</strong>
          </p>
          <p>
            Item Type: <strong>{selectedWarranty.itemType}</strong>
          </p>
        </div>
        <div className="flex-1">
          <p>
            Item Supplied By: <strong>{selectedWarranty.suppliedBy}</strong>
          </p>
          <p>
            Reference/P.O. No.: <strong>{selectedWarranty.poNo}</strong>
          </p>
        </div>
        <div className="flex-1 text-left sm:text-right">
          <p>
            Warranty Claim ETA: <strong>{selectedWarranty.warrantyClaimETA}</strong>
          </p>
          <p>
            D.R. No.: <strong>{selectedWarranty.drNo}</strong>
          </p>
          <p>
            Delivery Date: <strong>{selectedWarranty.deliveryDate}</strong>
          </p>
          <p>
            Replacement Date: <strong>{selectedWarranty.replacementDate}</strong>
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
                <td className="border px-2 py-1">{item.barcode || "N/A"}</td>
                <td className="border px-2 py-1 text-center">{item.quantity}</td>
                <td className="border px-2 py-1 text-center">{item.uom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Remarks */}
      <div className="text-sm mb-6">
        <strong>Remarks:</strong> {selectedWarranty.remarks || "-"}
      </div>

      {/* Approval Section */}
      <div className="overflow-x-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          {[
            { title: "Requested by", value: selectedWarranty.requestedBy },
            { title: "Noted by", value: "Immediate Supervisor" },
            { title: "Approved by", value: "Department Manager" },
            { title: "Received by PL", value: "Logistics" },
            { title: "Approved by PL", value: "Logistics Manager" },
            { title: "Released/Reserved by", value: "Logistics" },
            { title: "Received by", value: "Employee" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border p-3 flex-1 min-w-[200px] text-center"
            >
              <div className="font-semibold mb-2">{item.title}:</div>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 flex-wrap">
        <button
          onClick={() => handleOpenDialog("APPROVED")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Approve
        </button>

        <button
          onClick={() => handleOpenDialog("PROCESS")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
        >
          On Process
        </button>

        <button
          onClick={() => handleOpenDialog("RESERVE_RELEASE")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Reserve/Release
        </button>

        <button
          onClick={() => handleOpenDialog("DISAPPROVED")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
        >
          Disapprove
        </button>

        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
        >
          Close
        </button>
      </div>

      {/* Material UI Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{actionType} Confirmation</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to {actionType.toLowerCase()} this request?
          </Alert>
          <TextField
            label="Reason"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(false);
            }}
            error={error}
            helperText={error ? "Reason is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}