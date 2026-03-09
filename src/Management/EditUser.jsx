import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import defaultIcon from "../assets/images/enye-logo.png";
import { useWarehouse } from "../context/WarehouseContext";
import { UsersService } from "../services/users.service";

const Avatar = ({ src, size = 200, onChange, borderColor }) => {
  const borderWidth = Math.max(size * 0.008, 6);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <input
        type="file"
        accept="image/*"
        id="avatarInput"
        className="hidden"
        onChange={onChange}
      />
      <label
        htmlFor="avatarInput"
        className="cursor-pointer rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
        style={{
          width: size,
          height: size,
          boxSizing: "border-box",
          border: `${borderWidth}px solid ${borderColor}`,
          backgroundColor: "#f3f4f6",
        }}
      >
        <img
          src={src}
          alt="Avatar"
          className="rounded-full object-cover"
          style={{ width: "100%", height: "100%" }}
        />
      </label>
    </div>
  );
};

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const primaryBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const primaryText = isCebu ? "text-purple-600" : "text-orange-600";
  const primaryBorder = isCebu ? "border-purple-600" : "border-orange-600";
  const hoverPrimaryText = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";
  const focusRing = isCebu ? "focus:ring-purple-500" : "focus:ring-orange-500";
  const avatarBorderHex = isCebu ? "#A855F7" : "#EA580C";

  const [user, setUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    landline: "",
    userType: "",
    avatar: null,
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const inputClass = `mt-1 block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${focusRing} shadow-sm`;

  const loadUser = async () => {
    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      const data = await UsersService.show(id); // { id, firstname, lastname, email, mobile, landline, role_type, ... }

      setUser((prev) => ({
        ...prev,
        id: data.id,
        firstName: data.firstname || data.first_name || "",
        lastName: data.lastname || data.last_name || "",
        email: data.email || "",
        contact: data.mobile || data.mobile_number || "",
        landline: data.landline || data.landline_number || "",
        userType: data.role_type || data.type || "",
        avatar: prev.avatar, // avatar upload kung may separate endpoint
      }));
    } catch (error) {
      console.error("Load user error:", error);
      setIsError(true);
      setMessage(
        error?.response?.data?.message || "Failed to load user. Please go back and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
      // upload to backend kung may avatar endpoint
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      setSaving(true);

      await UsersService.update(id, {
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        mobile: user.contact,
        landline: user.landline,
        role_type: user.userType,
      });

      setMessage("User updated successfully!");
      setIsError(false);
    } catch (error) {
      console.error("Update user error:", error);
      setIsError(true);
      setMessage(
        error?.response?.data?.message || "Failed to update user. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-sm">Loading user...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 mt-8">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl px-4">
        {/* Left Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center justify-center w-full md:w-1/3 transition-transform hover:scale-105">
          <Avatar
            src={user.avatar || defaultIcon}
            size={200}
            onChange={handleAvatarChange}
            borderColor={avatarBorderHex}
          />

          <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-4">
            {user.firstName || user.lastName
              ? `${user.firstName} ${user.lastName}`
              : "User"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {user.email || "No email"}
          </p>

          <button
            onClick={() => navigate(-1)}
            className={`w-full px-8 py-3 bg-gray-500 text-white 
               shadow-md border border-gray-600
               cursor-pointer 
               transition-colors duration-200 
               hover:bg-transparent hover:text-gray-700`}
          >
            Back to Users
          </button>
        </div>

        {/* Right Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full md:w-2/3 transition-transform hover:scale-105">
          <h2 className={`text-3xl font-bold mb-6 ${primaryText}`}>
            EDIT USER
          </h2>

          {message && (
            <div
              className={`mb-4 text-center text-sm ${
                isError ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </div>
          )}

          <div className="relative">
            <div className="transition-all duration-500 ease-in-out opacity-100 transform translate-x-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={user.contact}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Landline Number
                  </label>
                  <input
                    type="tel"
                    name="landline"
                    value={user.landline}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    User Type / Role
                  </label>
                  <input
                    type="text"
                    name="userType"
                    value={user.userType}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full px-8 py-3 ${primaryBg} text-white shadow-md border ${primaryBorder} cursor-pointer transition-colors duration-200 hover:bg-transparent ${hoverPrimaryText} disabled:opacity-60`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
