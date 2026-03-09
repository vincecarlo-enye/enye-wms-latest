import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddCategoryModal from "./AddCategory";
import CategoryModal from "./CategoryModal";
import { useWarehouse } from "../context/WarehouseContext";
import { CategoryService } from "../services/category.service";

const ITEMS_PER_PAGE = 5;

export default function Categories() {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theme ─────────────────────────────
  const titleColor = isCebu ? "text-purple-600" : "text-orange-600";
  const headerBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const hoverRow = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const addBtn = isCebu
    ? "bg-purple-600 border-purple-600 hover:bg-transparent hover:text-purple-600"
    : "bg-orange-600 border-orange-600 hover:bg-transparent hover:text-orange-600";
  const searchFocus = isCebu
    ? "border-purple-300 focus:ring-purple-500 focus:border-purple-500"
    : "border-orange-300 focus:ring-orange-500 focus:border-orange-500";
  const pgBorder = isCebu
    ? "border-purple-300 hover:bg-purple-100"
    : "border-orange-300 hover:bg-orange-100";
  const pgActive = isCebu
    ? "bg-purple-600 text-white border-purple-600"
    : "bg-orange-600 text-white border-orange-600";

  // ── State ─────────────────────────────
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ── Fetch Categories ──────────────────
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.list({
        search,
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
      });

      const apiData = res?.data ?? [];
      const lastPage = res?.last_page ?? 1;

      setCategories(apiData);
      setTotalPages(lastPage);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search, currentPage]);

  // ── Handle Add/Edit ──────────────────
  const handleSubmitCategory = async ({ name, description, id }) => {
    try {
      if (id) {
        await CategoryService.update(id, { category: name, description });
      } else {
        await CategoryService.create({ category: name, description });
      }
      fetchCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  // ── Delete Category ───────────────────
  const handleDelete = async (id) => {
    console.log("Deleting category with ID:", id);
    if (!confirm("Delete this category?")) return;

    try {
      await CategoryService.remove(id);
      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  // ── Format Date ───────────────────────
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${titleColor}`}>Categories</h1>
        <button
          onClick={() => setModalOpen(true)}
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <table className="min-w-full border border-gray-200">
          <thead className={`${headerBg} text-white`}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Date</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">Loading...</td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.cat_id} className={`transition ${hoverRow}`}>
                  <td className="px-6 py-4 font-medium text-gray-800">{category.category}</td>
                  <td className="px-6 py-4 text-gray-600">{category.description}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{formatDateTime(category.date)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEditClick(category)} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(category.cat_id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm border rounded-md ${pgBorder}`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm border rounded-md ${currentPage === page ? pgActive : pgBorder}`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm border rounded-md ${pgBorder}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedCategory(null); }}
        warehouse={currentWarehouse}
        initialData={selectedCategory}
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
}