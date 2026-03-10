import { useState } from "react";
import { User, Mail, Lock, Smartphone, Phone, Users } from "lucide-react";
import { useWarehouse } from "../../context/WarehouseContext";

const userTypes = [
  "Administrator",
  "Warehouse Supervisor",
  "Warehouseman",
  "Sales",
  "Logistics",
  "Warehouse Supervisor-Cebu",
  "Warehouseman-Cebu",
];

export default function AddUserModal({ isOpen, onClose, onAddUser }) {
  const { currentWarehouse } = useWarehouse();
  const isCebu = currentWarehouse === "cebu";

  const iconBg = isCebu ? "bg-purple-500" : "bg-orange-500";
  const focusBorder = isCebu
    ? "focus:border-purple-500"
    : "focus:border-orange-500";
  const submitBg = isCebu ? "bg-purple-600" : "bg-orange-600";
  const submitBorder = isCebu ? "border-purple-600" : "border-orange-600";
  const hoverText = isCebu ? "hover:text-purple-600" : "hover:text-orange-600";
  const errorBorder = "focus:border-red-500";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    landlineNumber: "",
    userType: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
      landlineNumber: "",
      userType: "",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (getPasswordStrength(formData.password) < 3) {
      newErrors.password =
        "Password is too weak! Use 8+ chars, mix of upper/lowercase, numbers, and symbols.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.userType) newErrors.userType = "User type is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);

      await onAddUser(formData); // hintayin muna success

      resetForm();
      onClose();
    } catch (error) {
      console.error("Add user modal submit error:", error);

      const backendErrors = error?.response?.data?.errors;
      if (backendErrors) {
        const mappedErrors = {};

        if (backendErrors.firstname) mappedErrors.firstName = backendErrors.firstname[0];
        if (backendErrors.lastname) mappedErrors.lastName = backendErrors.lastname[0];
        if (backendErrors.email) mappedErrors.email = backendErrors.email[0];
        if (backendErrors.password) mappedErrors.password = backendErrors.password[0];
        if (backendErrors.mobile) mappedErrors.mobileNumber = backendErrors.mobile[0];
        if (backendErrors.landline) mappedErrors.landlineNumber = backendErrors.landline[0];
        if (backendErrors.role_type) mappedErrors.userType = backendErrors.role_type[0];

        setErrors(mappedErrors);
      } else {
        alert(error?.response?.data?.message || "Failed to create user.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getLabelClasses = (fieldName) => {
    const value = formData[fieldName];
    const isFocused = document.activeElement?.id === fieldName;

    return `absolute left-14 transition-all duration-200 ${
      value || isFocused
        ? "-top-2 text-gray-600 text-sm bg-white px-1"
        : "top-2.5 text-gray-400 text-base"
    }`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center border-b mb-6">
            ADD NEW USER
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["firstName", "lastName"].map((field, index) => (
                <div key={field} className="relative flex flex-col w-full">
                  <div className="relative flex items-center w-full">
                    <div className="absolute left-0 h-full flex items-center">
                      <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                        <User size={18} className="text-white" />
                      </div>
                    </div>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder=" "
                      className={`w-full pl-14 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none ${
                        errors[field]
                          ? `border-red-500 ${errorBorder}`
                          : `border-gray-300 ${focusBorder}`
                      }`}
                    />
                    <label htmlFor={field} className={getLabelClasses(field)}>
                      {index === 0 ? "First Name" : "Last Name"}
                    </label>
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="relative flex flex-col w-full">
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                    <Mail size={18} className="text-white" />
                  </div>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className={`w-full pl-14 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none ${
                    errors.email
                      ? `border-red-500 ${errorBorder}`
                      : `border-gray-300 ${focusBorder}`
                  }`}
                />
                <label htmlFor="email" className={getLabelClasses("email")}>
                  Email Address
                </label>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["password", "confirmPassword"].map((field, index) => (
                <div key={field} className="relative flex flex-col w-full">
                  <div className="relative flex items-center w-full">
                    <div className="absolute left-0 h-full flex items-center">
                      <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                        <Lock size={18} className="text-white" />
                      </div>
                    </div>
                    <input
                      type="password"
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder=" "
                      className={`w-full pl-14 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none ${
                        errors[field]
                          ? `border-red-500 ${errorBorder}`
                          : `border-gray-300 ${focusBorder}`
                      }`}
                    />
                    <label htmlFor={field} className={getLabelClasses(field)}>
                      {index === 0 ? "Password" : "Confirm Password"}
                    </label>
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                  )}

                  {field === "password" && formData.password && (
                    <div className="mt-2 ml-14">
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-2 transition-all duration-300 ${
                            getPasswordStrength(formData.password) <= 1
                              ? "w-1/6 bg-gray-500"
                              : getPasswordStrength(formData.password) === 2
                              ? "w-2/5 bg-red-500"
                              : getPasswordStrength(formData.password) === 3
                              ? "w-3/5 bg-orange-400"
                              : getPasswordStrength(formData.password) === 4
                              ? "w-4/5 bg-yellow-400"
                              : "w-full bg-green-500"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "mobileNumber",
                  icon: <Smartphone size={18} className="text-white" />,
                  label: "Mobile Number",
                },
                {
                  name: "landlineNumber",
                  icon: <Phone size={18} className="text-white" />,
                  label: "Landline Number",
                },
              ].map(({ name, icon, label }) => (
                <div key={name} className="relative flex flex-col w-full">
                  <div className="relative flex items-center w-full">
                    <div className="absolute left-0 h-full flex items-center">
                      <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                        {icon}
                      </div>
                    </div>
                    <input
                      type="text"
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder=" "
                      className={`w-full pl-14 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none ${
                        errors[name]
                          ? `border-red-500 ${errorBorder}`
                          : `border-gray-300 ${focusBorder}`
                      }`}
                    />
                    <label htmlFor={name} className={getLabelClasses(name)}>
                      {label}
                    </label>
                  </div>
                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="relative flex flex-col w-full">
              <div className="relative flex items-center w-full">
                <div className="absolute left-0 h-full flex items-center">
                  <div className={`${iconBg} h-full px-3 flex items-center rounded-l-lg`}>
                    <Users size={18} className="text-white" />
                  </div>
                </div>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className={`w-full pl-14 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none ${
                    errors.userType
                      ? `border-red-500 ${errorBorder}`
                      : `border-gray-300 ${focusBorder}`
                  }`}
                >
                  <option value=""></option>
                  {userTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <label htmlFor="userType" className={getLabelClasses("userType")}>
                  User Type
                </label>
              </div>
              {errors.userType && (
                <p className="text-red-500 text-xs mt-1">{errors.userType}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full ${submitBg} py-2 text-white border ${submitBorder} rounded transition-colors duration-200 hover:bg-transparent ${hoverText} disabled:opacity-50`}
            >
              {submitting ? "Adding User..." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
