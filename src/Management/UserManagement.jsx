import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/modal/Modal";
import AddUserModal from "../Components/layouts/AddUser";
import { useWarehouse } from "../context/WarehouseContext";
import { UsersService } from "../services/users.service";

const UserManagement = () => {
  const navigate = useNavigate();
  const { currentWarehouse } = useWarehouse();

  const isCebu = currentWarehouse === "cebu";

  const primaryBg = isCebu ? "bg-purple-500" : "bg-orange-500";
  const primaryBorder = isCebu ? "border-purple-600" : "border-orange-600";
  const hoverPrimaryText = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";
  const tableHeaderBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const hoverRowBg = isCebu ? "hover:bg-purple-50" : "hover:bg-orange-50";
  const cardBorder = isCebu ? "border-purple-200" : "border-orange-200";
  const badgeBg = isCebu
    ? "bg-purple-100 text-purple-700"
    : "bg-orange-100 text-orange-700";
  const cardLabelColor = isCebu ? "text-purple-600" : "text-orange-600";

  const [userList, setUserList] = useState([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  // Adjusted to match sample API: firstname, lastname, mobile, role_type
  const normalizeUser = (row) => {
    const name = row.name || "";
    const [first, ...rest] = name.split(" ");
    const fallbackLast = rest.join(" ");

    return {
      id: row.id,
      userId: row.emp_id_no ? row.emp_id_no : `USR-${row.id}`,
      firstName: row.firstname ? row.firstname : first,
      lastName: row.lastname ? row.lastname : fallbackLast,
      email: row.email || "",
      mobileNumber: row.mobile || "",
      landlineNumber: row.landline || "",
      userType: row.role_type || row.type || row.role || "",
      raw: row,
    };
  };


  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await UsersService.list({
        page,
        per_page: perPage,
        search: search || undefined,
      });

      const rows = Array.isArray(res.data) ? res.data : res.data?.data || [];

      setUserList(rows.map(normalizeUser));

      setPagination({
        current_page: res.current_page ?? 1,
        last_page: res.last_page ?? 1,
        total: res.total ?? rows.length,
      });
    } catch (error) {
      console.error("Fetch users error:", error);
      setUserList([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search]);

  const handleAddUser = async (newUser) => {
    try {
      const created = await UsersService.create({
        emp_id_no: newUser.userId || "",
        firstname: newUser.firstName,
        lastname: newUser.lastName,
        username: newUser.username || newUser.email,
        email: newUser.email,
        password: newUser.password,
        dept_shname: newUser.department || "",
        mobile: newUser.mobileNumber,
        landline: newUser.landlineNumber,
        notify_type: newUser.notifyType || "",
        role_type: newUser.userType,
      });

      setUserList((prev) => [normalizeUser(created), ...prev]);
      setIsAddUserOpen(false);
    } catch (error) {
      console.error("Create user error:", error);
      console.log("Validation response:", error?.response?.data);

      const errors = error?.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)?.[0]?.[0];
        alert(firstError || "Validation failed.");
      } else {
        alert(error?.response?.data?.message || "Failed to create user.");
      }
    }
  };



  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete user ${user.userId}?`)) return;
    try {
      await UsersService.destroy(user.id);
      setUserList((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Delete user error:", error);
      alert(
        error?.response?.data?.message ||
        "Failed to delete user. Please try again."
      );
    }
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return userList;
    const s = search.toLowerCase();
    return userList.filter(
      (user) =>
        user.userId?.toLowerCase().includes(s) ||
        user.firstName?.toLowerCase().includes(s) ||
        user.lastName?.toLowerCase().includes(s) ||
        user.email?.toLowerCase().includes(s) ||
        user.mobileNumber?.toLowerCase().includes(s) ||
        user.landlineNumber?.toLowerCase().includes(s) ||
        user.userType?.toLowerCase().includes(s)
    );
  }, [userList, search]);

  const totalPages = pagination.last_page || 1;

  const getPaginationItems = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }
    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const paginationItems = getPaginationItems(pagination.current_page, totalPages);

  const handlePageChange = (newPage) => {
    if (!newPage || newPage === "..." || newPage < 1 || newPage > totalPages) {
      return;
    }
    setPage(newPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm border-b">
        <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
        <button
          onClick={() => setIsAddUserOpen(true)}
          className={`${primaryBg} text-white px-4 py-2 border ${primaryBorder} cursor-pointer transition-colors duration-200 hover:bg-transparent ${hoverPrimaryText}`}
        >
          Add New
        </button>
      </header>

      {/* Search */}
      <div className="p-4 bg-white border-b flex justify-end">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${tableHeaderBg} text-white`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Mobile Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Landline Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredData.map((user) => (
                  <tr
                    key={user.id || user.userId}
                    className={`${hoverRowBg} transition`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {user.userId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.firstName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.mobileNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.landlineNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.userType}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 py-1 text-xs rounded border border-blue-600 bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 transition"
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </button>
                        <button
                          className="px-3 py-1 text-xs rounded border border-yellow-500 bg-yellow-500 text-white hover:bg-transparent hover:text-yellow-600 transition"
                          onClick={() => navigate(`/EditUser/${user.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 text-xs rounded border border-red-600 bg-red-600 text-white hover:bg-transparent hover:text-red-600 transition"
                          onClick={() => handleDeleteUser(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center py-6 text-gray-500">
              Loading users...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No users found.</div>
          ) : (
            filteredData.map((user) => (
              <div
                key={user.id || user.userId}
                className={`bg-white rounded-lg shadow border ${cardBorder} p-4`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {user.userId}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded font-semibold ${badgeBg}`}
                  >
                    {user.userType}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>
                    <span className={`font-semibold ${cardLabelColor}`}>
                      Name:
                    </span>{" "}
                    {user.firstName} {user.lastName}
                  </div>
                  <div>
                    <span className={`font-semibold ${cardLabelColor}`}>
                      Email:
                    </span>{" "}
                    {user.email}
                  </div>
                  <div>
                    <span className={`font-semibold ${cardLabelColor}`}>
                      Mobile:
                    </span>{" "}
                    {user.mobileNumber}
                  </div>
                  <div>
                    <span className={`font-semibold ${cardLabelColor}`}>
                      Landline:
                    </span>{" "}
                    {user.landlineNumber}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    className="flex-1 py-1 text-xs rounded border border-blue-600 bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 transition"
                    onClick={() => setSelectedUser(user)}
                  >
                    View
                  </button>
                  <button
                    className="flex-1 py-1 text-xs rounded border border-yellow-500 bg-yellow-500 text-white hover:bg-transparent hover:text-yellow-600 transition"
                    onClick={() => navigate(`/EditUser/${user.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 py-1 text-xs rounded border border-red-600 bg-red-600 text-white hover:bg-transparent hover:text-red-600 transition"
                    onClick={() => handleDeleteUser(user)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-end items-center gap-2 mt-4 p-2 bg-gray-50 border-t border-orange-200">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 rounded border border-orange-300 bg-white disabled:opacity-50"
            >
              Prev
            </button>

            {paginationItems.map((item, index) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-500 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item)}
                  className={`px-3 py-1 rounded border ${pagination.current_page === item
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white border-orange-300 hover:bg-orange-100"
                    }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === totalPages}
              className="px-3 py-1 rounded border border-orange-300 bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Add User Modal */}
        <AddUserModal
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onAddUser={handleAddUser}
        />
      </main>

      {/* View Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          {selectedUser && (
            <div className="space-y-2 text-sm">
              <div>User Id: {selectedUser.userId}</div>
              <div>
                Name: {selectedUser.firstName} {selectedUser.lastName}
              </div>
              <div>Email: {selectedUser.email}</div>
              <div>Mobile Number: {selectedUser.mobileNumber}</div>
              <div>Landline Number: {selectedUser.landlineNumber}</div>
              <div>User Type: {selectedUser.userType}</div>
            </div>
          )}
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setSelectedUser(null)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
