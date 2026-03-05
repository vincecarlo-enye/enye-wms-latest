import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import categoriesData from "../assets/js/Categories.json";
import AddCategoryModal from "./AddCategory";
import { useWarehouse } from "../context/WarehouseContext";

const ITEMS_PER_PAGE = 5;

export default function Categories() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const titleColor  = isCebu ? "text-purple-600"                              : "text-orange-600";
  const headerBg    = isCebu ? "bg-purple-600"                                : "bg-orange-600";
  const hoverRow    = isCebu ? "hover:bg-purple-50"                           : "hover:bg-orange-50";
  const addBtn      = isCebu
    ? "bg-purple-600 border-purple-600 hover:bg-transparent hover:text-purple-600"
    : "bg-orange-600 border-orange-600 hover:bg-transparent hover:text-orange-600";
  const searchFocus = isCebu
    ? "border-purple-300 focus:ring-purple-500 focus:border-purple-500"
    : "border-orange-300 focus:ring-orange-500 focus:border-orange-500";
  const pgBorder    = isCebu ? "border-purple-300 hover:bg-purple-100"        : "border-orange-300 hover:bg-orange-100";
  const pgActive    = isCebu ? "bg-purple-600 text-white border-purple-600"   : "bg-orange-600 text-white border-orange-600";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState({ main: categoriesData, cebu: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategory = (newCategory) => {
    const categoryWithDate = { ...newCategory, createdAt: new Date().toISOString() };
    setCategories((prev) => ({
      ...prev,
      [currentWarehouse]: [categoryWithDate, ...prev[currentWarehouse]],
    }));
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString.replace(" ", "T"));
    return date.toLocaleString();
  };

  const filteredData = useMemo(() => {
    return categories[currentWarehouse].filter(
      (cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, categories, currentWarehouse]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${titleColor}`}>Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 text-white px-4 py-2 border transition ${addBtn}`}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="overflow-x-auto">
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search..."
            className={`px-4 py-2 m-6 border rounded-lg focus:outline-none focus:ring-2 transition w-64 ${searchFocus}`}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Table */}
        <table className="min-w-full border border-gray-200">
          <thead className={`${headerBg} text-white`}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((category, index) => (
                <tr key={index} className={`transition ${hoverRow}`}>
                  <td className="px-6 py-4 font-medium text-gray-800">{category.name}</td>
                  <td className="px-6 py-4 text-gray-600">{category.description}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{formatDateTime(category.createdAt)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="text-blue-600 hover:text-blue-800 transition"><Pencil size={18} /></button>
                      <button className="text-red-600 hover:text-red-800 transition"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > ITEMS_PER_PAGE && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${pgBorder}`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  currentPage === page ? pgActive : pgBorder
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${pgBorder}`}
          >
            Next
          </button>
        </div>
      )}

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCategory={handleAddCategory}
        warehouse={currentWarehouse}
      />
    </div>
  );
}