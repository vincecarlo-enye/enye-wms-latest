export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-1000 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto p-6 shadow-lg rounded"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
  
}
