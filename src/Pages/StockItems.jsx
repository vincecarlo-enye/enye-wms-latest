import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWarehouse } from "../context/WarehouseContext";
import { Edit3, Eye, Trash2 } from "lucide-react";
import AddProduct from "./AddProducts";
import {
  ProductListService,
  ProductService,
} from "../services/productslist.service";
import { CategoryService } from "../services/category.service";

const ITEMS_PER_PAGE = 5;

const StockItems = () => {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";
  const navigate = useNavigate();
  const location = useLocation();

  const titleColor = isCebu ? "text-purple-600" : "text-orange-600";
  const headerBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const hoverRow = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const tabActive = isCebu ? "text-purple-600" : "text-orange-600";
  const tabBar = isCebu ? "bg-purple-600" : "bg-orange-600";
  const tabHover = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";
  const searchFocus = isCebu
    ? "border-purple-300 focus:ring-purple-500 focus:border-purple-500"
    : "border-orange-300 focus:ring-orange-500 focus:border-orange-500";
  const pgBorder = isCebu
    ? "border-purple-300 hover:bg-purple-100"
    : "border-orange-300 hover:bg-orange-100";
  const pgActive = isCebu
    ? "bg-purple-600 text-white border-purple-600"
    : "bg-orange-600 text-white border-orange-600";
  const editIcon = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";

  const [activeMenu, setActiveMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stockItems, setStockItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const getNonEmptyValue = (...values) => {
    for (const value of values) {
      if (value !== null && value !== undefined && value !== "") {
        return value;
      }
    }
    return null;
  };

  const toSafeNumber = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.list({ page: 1, perPage: 1000 });

      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      const mapped = rows
        .map((item) => item.category ?? item.name ?? item.category_name ?? "")
        .filter(Boolean);

      setMenuItems(mapped);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setMenuItems([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentWarehouse]);

  // NEW: basahin barcode mula URL at gawing search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const barcodeFromUrl = params.get("barcode") || "";

    if (barcodeFromUrl) {
      setSearch(barcodeFromUrl);
      setCurrentPage(1);
    }
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      const data = await ProductListService.list({
        search,
        category: activeMenu || "",
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
      });

      setStockItems(data?.data || []);
      setTotalItems(data?.total || 0);
      setLastPage(data?.last_page || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setStockItems([]);
      setTotalItems(0);
      setLastPage(1);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeMenu, search, currentPage, currentWarehouse]);

  const handleAddProduct = async () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalMode("create");
    await fetchProducts();
  };

  const handleUpdatedProduct = async () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalMode("create");
    await fetchProducts();
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await ProductService.remove(id);
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const totalPages = lastPage || Math.ceil(totalItems / ITEMS_PER_PAGE);

  const getPagination = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <h1 className={`text-3xl font-bold ${titleColor}`}>
          {isCebu ? "Cebu Items" : "Stock Items"}
        </h1>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/OutOfStock")}
            className="bg-red-600 text-white px-4 py-2 border border-red-600 hover:bg-transparent hover:text-red-600 transition"
          >
            Out of Stock List
          </button>

          <button
            onClick={() => {
              setModalMode("create");
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 border border-green-600 hover:bg-transparent hover:text-green-600 transition"
          >
            Add Products
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {menuItems.map((item) => {
          const isActive = activeMenu === item;

          return (
            <button
              key={item}
              onClick={() => {
                setActiveMenu(isActive ? null : item);
                setCurrentPage(1);
              }}
              className={`relative px-4 py-2 font-medium text-gray-600 cursor-pointer group ${
                isActive ? tabActive : tabHover
              }`}
            >
              {item}
              <span
                className={`absolute left-0 bottom-0 h-0.5 ${tabBar} transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition w-full md:w-64 ${searchFocus}`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className={`${headerBg} text-white`}>
            <tr>
              {[
                "ID",
                "Model Name",
                "Description",
                "Quantity",
                "Manufacturer",
                "Buying Price",
                "Total Price",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className={`px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider ${
                    col === "Actions"
                      ? "text-center"
                      : "truncate max-w-[150px]"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {stockItems.length > 0 ? (
              stockItems.map((item) => {
                const quantityRaw = getNonEmptyValue(item.qty, item.barcode_qty);
                const quantity = toSafeNumber(quantityRaw);
                const buyPrice = toSafeNumber(item.buy_price);
                const backendTotal = toSafeNumber(item.total_buy_price);

                const computedTotal =
                  buyPrice !== null && quantity !== null
                    ? buyPrice * quantity
                    : null;

                const finalTotal =
                  backendTotal !== null && backendTotal > 0
                    ? backendTotal
                    : computedTotal;

                return (
                  <tr key={item.prod_id} className={`transition ${hoverRow}`}>
                    <td className="px-6 py-4">{item.prod_id}</td>
                    <td className="px-6 py-4">{item.prod_name}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate">
                      {item.prod_desc}
                    </td>
                    <td className="px-6 py-4">{quantityRaw ?? "N/A"}</td>
                    <td className="px-6 py-4">
                      {item.manufacturer || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {buyPrice !== null
                        ? `$${buyPrice.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {finalTotal !== null
                        ? `$${finalTotal.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <Edit3
                        size={18}
                        className={`text-gray-500 ${editIcon} cursor-pointer transition`}
                        onClick={() => handleEdit(item)}
                      />
                      <Eye
                        size={18}
                        className="text-gray-500 hover:text-gray-900 cursor-pointer transition"
                        onClick={() => handleView(item)}
                      />
                      <Trash2
                        size={18}
                        className="text-gray-500 hover:text-red-600 cursor-pointer transition"
                        onClick={() => handleDelete(item.prod_id)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500"
                >
                  No stock items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-end items-center mt-6 space-x-2">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 ${pgBorder}`}
          >
            Previous
          </button>

          {getPagination().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${
                currentPage === page ? pgActive : pgBorder
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 ${pgBorder}`}
          >
            Next
          </button>
        </div>
      )}

      <AddProduct
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
          setModalMode("create");
        }}
        onAddProduct={handleAddProduct}
        onUpdatedProduct={handleUpdatedProduct}
        warehouse={currentWarehouse}
        mode={modalMode}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default StockItems;
