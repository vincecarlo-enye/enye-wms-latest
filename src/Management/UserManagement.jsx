import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/modal/Modal";
import AddUserModal from "../Components/layouts/AddUser";
import { useWarehouse } from "../context/WarehouseContext";

const UserManagement = () => {
  const navigate = useNavigate();
  const { currentWarehouse } = useWarehouse();

  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const primaryBg        = isCebu ? "bg-purple-500"          : "bg-orange-500";
  const primaryBorder    = isCebu ? "border-purple-600"      : "border-orange-600";
  const hoverPrimaryText = isCebu ? "hover:text-purple-600"  : "hover:text-orange-600";
  const tableHeaderBg    = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const hoverRowBg       = isCebu ? "hover:bg-purple-50"     : "hover:bg-orange-50";
  const cardBorder       = isCebu ? "border-purple-200"      : "border-orange-200";
  const badgeBg          = isCebu ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700";
  const cardLabelColor   = isCebu ? "text-purple-600"        : "text-orange-600";

  const [userList, setUserList] = useState([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = (newUser) => {
    const userWithId = {
      ...newUser,
      userId: `USR-${Date.now()}`,
    };
    setUserList((prev) => [...prev, userWithId]);
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return userList;
    return userList.filter(
      (user) =>
        user.userId?.toLowerCase().includes(search.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.mobileNumber?.toLowerCase().includes(search.toLowerCase()) ||
        user.landlineNumber?.toLowerCase().includes(search.toLowerCase()) ||
        user.userType?.toLowerCase().includes(search.toLowerCase())
    );
  }, [userList, search]);

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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">

            <thead className={`${tableHeaderBg} text-white`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">First Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Mobile Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Landline Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">User Type</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500 text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredData.map((user) => (
                  <tr key={user.userId} className={`${hoverRowBg} transition`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.userId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.firstName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.mobileNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.landlineNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.userType}</td>
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
                          onClick={() => navigate(`/EditUser/${user.userId}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 text-xs rounded border border-red-600 bg-red-600 text-white hover:bg-transparent hover:text-red-600 transition"
                          onClick={() => console.log("Delete user", user.userId)}
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

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No users found.</div>
          ) : (
            filteredData.map((user) => (
              <div key={user.userId} className={`bg-white rounded-lg shadow border ${cardBorder} p-4`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-800">{user.userId}</span>
                  <span className={`px-2 py-1 text-xs rounded font-semibold ${badgeBg}`}>
                    {user.userType}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div><span className={`font-semibold ${cardLabelColor}`}>Name:</span> {user.firstName} {user.lastName}</div>
                  <div><span className={`font-semibold ${cardLabelColor}`}>Email:</span> {user.email}</div>
                  <div><span className={`font-semibold ${cardLabelColor}`}>Mobile:</span> {user.mobileNumber}</div>
                  <div><span className={`font-semibold ${cardLabelColor}`}>Landline:</span> {user.landlineNumber}</div>
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
                    onClick={() => navigate(`/EditUser/${user.userId}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 py-1 text-xs rounded border border-red-600 bg-red-600 text-white hover:bg-transparent hover:text-red-600 transition"
                    onClick={() => console.log("Delete user", user.userId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

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
            <div className="space-y-2">
              <div>User Id: {selectedUser.userId}</div>
              <div>Name: {selectedUser.firstName} {selectedUser.lastName}</div>
              <div>Email: {selectedUser.email}</div>
              <div>Mobile Number: {selectedUser.mobileNumber}</div>
              <div>Landline Number: {selectedUser.landlineNumber}</div>
              <div>User Type: {selectedUser.userType}</div>
            </div>
          )}
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2"
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