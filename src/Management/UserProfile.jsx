import React, { useState } from "react";
import { User } from "lucide-react";
import defaultIcon from '../assets/images/enye-logo.png';
import { useWarehouse } from "../context/WarehouseContext";

const Avatar = ({ src, size = 200, onChange, borderColor }) => {
  const borderWidth = Math.max(size * 0.008, 6);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <input type="file" accept="image/*" id="avatarInput" className="hidden" onChange={onChange} />
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

const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const UserProfile = () => {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const primaryBg         = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const primaryText       = isCebu ? "text-purple-600"        : "text-orange-600";
  const primaryBorder     = isCebu ? "border-purple-600"      : "border-orange-600";
  const hoverPrimaryText  = isCebu ? "hover:text-purple-600"  : "hover:text-orange-600";
  const focusRing         = isCebu ? "focus:ring-purple-500"  : "focus:ring-orange-500";
  const avatarBorderHex   = isCebu ? "#A855F7"                : "#EA580C";

  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    contact: "+1234567890",
    password: "",
    confirmPassword: "",
    oldPassword: "",
    newPassword: "",
    avatar: null,
  });

  const [message, setMessage] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isChangingPassword) {
      if (user.newPassword !== user.confirmPassword) {
        setMessage("New passwords do not match!");
        return;
      }
      if (getPasswordStrength(user.newPassword) < 3) {
        setMessage("Password is too weak! Use at least 8 chars, mix of upper/lowercase, numbers, and symbols.");
        return;
      }
      console.log("Password changed:", user);
      setMessage("Password changed successfully!");
      setIsChangingPassword(false);
      setUser((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } else {
      console.log("Profile updated:", user);
      setMessage("Profile updated successfully!");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const inputClass = `mt-1 block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${focusRing} shadow-sm`;

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

          <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-4">Admin Enye</h2>

          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className={`w-full px-8 py-3 ${primaryBg} text-white 
               shadow-md border ${primaryBorder}
               cursor-pointer 
               transition-colors duration-200 
               hover:bg-transparent 
               ${hoverPrimaryText}`}
          >
            {isChangingPassword ? "Update Info" : "Change Password"}
          </button>
        </div>

        {/* Right Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full md:w-2/3 transition-transform hover:scale-105">
          <h2 className={`text-3xl font-bold mb-6 ${primaryText}`}>
            {isChangingPassword ? "CHANGE PASSWORD" : "USER PROFILE"}
          </h2>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 text-center text-sm ${
                isChangingPassword &&
                (user.newPassword !== user.confirmPassword ||
                  getPasswordStrength(user.newPassword) < 3)
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {message}
            </div>
          )}

          <div className="relative">
            {/* Profile Form */}
            {!isChangingPassword && (
              <div className="transition-all duration-500 ease-in-out opacity-100 transform translate-x-0">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">First Name</label>
                    <input type="text" name="firstName" value={user.firstName} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                    <input type="text" name="lastName" value={user.lastName} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                      type="email" name="email" value={user.email} disabled
                      className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                    <input type="tel" name="contact" value={user.contact} onChange={handleChange} className={inputClass} required />
                  </div>
                  <button
                    type="submit"
                    className={`w-full px-8 py-3 ${primaryBg} text-white shadow-md border ${primaryBorder} cursor-pointer transition-colors duration-200 hover:bg-transparent ${hoverPrimaryText}`}
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            )}

            {/* Change Password Form */}
            {isChangingPassword && (
              <div className="transition-all duration-500 ease-in-out opacity-100 transform translate-x-0">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Old Password</label>
                    <input type="password" name="oldPassword" value={user.oldPassword} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">New Password</label>
                    <input type="password" name="newPassword" value={user.newPassword} onChange={handleChange} className={inputClass} required />

                    {/* Password strength bar */}
                    {user.newPassword && (
                      <>
                        <div className="mt-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-2 transition-all duration-300 ${
                              getPasswordStrength(user.newPassword) === 1
                                ? "w-1/6 bg-gray-500"
                                : getPasswordStrength(user.newPassword) === 2
                                ? "w-2/5 bg-red-500"
                                : getPasswordStrength(user.newPassword) === 3
                                ? "w-3/5 bg-orange-400"
                                : getPasswordStrength(user.newPassword) === 4
                                ? "w-4/5 bg-yellow-400"
                                : getPasswordStrength(user.newPassword) === 5
                                ? "w-full bg-green-500"
                                : "w-0"
                            }`}
                          />
                        </div>
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                          <li className={user.newPassword.length >= 8 ? "text-green-600" : ""}>• At least 8 characters</li>
                          <li className={/[a-z]/.test(user.newPassword) ? "text-green-600" : ""}>• Lowercase letter</li>
                          <li className={/[A-Z]/.test(user.newPassword) ? "text-green-600" : ""}>• Uppercase letter</li>
                          <li className={/[0-9]/.test(user.newPassword) ? "text-green-600" : ""}>• Number</li>
                          <li className={/[^A-Za-z0-9]/.test(user.newPassword) ? "text-green-600" : ""}>• Special symbol (e.g., !@#$%)</li>
                        </ul>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div className="flex justify-between gap-2">
                    <button
                      type="submit"
                      className={`w-full px-8 py-3 ${primaryBg} text-white hover:bg-transparent ${hoverPrimaryText} transition-colors duration-200 border ${primaryBorder} cursor-pointer`}
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;