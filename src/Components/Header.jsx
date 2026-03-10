import { Menu, Bell, Settings, User, LogOut, Warehouse } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWarehouse } from "../context/WarehouseContext";
import { UsersService } from "../services/users.service";

export default function Header({ setSidebarOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { currentWarehouse } = useWarehouse();

  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const headerBg      = isCebu ? "bg-purple-600"          : "bg-orange-600";
  const hoverBtn      = isCebu ? "hover:bg-purple-500"    : "hover:bg-orange-500";
  const avatarText    = isCebu ? "text-purple-600"        : "text-orange-600";
  const dropdownBg    = isCebu ? "bg-purple-50"           : "bg-orange-50";
  const avatarBorder  = isCebu ? "border-purple-400"      : "border-orange-400";
  const avatarColor   = isCebu ? "text-purple-600"        : "text-orange-600";
  const hoverItem     = isCebu ? "hover:bg-purple-100"    : "hover:bg-orange-100";
  const badgeBg       = isCebu ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700";

  const handleNotificationsClick = () => alert("You have 3 new notifications!");
  const handleSettingsClick = () => alert("Redirecting to settings...");
  const handleProfileClick = () => navigate("/UserProfile");
  const handleSignOutClick = async () => {
  const confirmed = window.confirm("Are you sure you want to sign out?");
  if (!confirmed) return;

  try {
    try {
      await UsersService.logout();
    } catch (error) {
      console.error("Backend logout error:", error);
    }

    UsersService.logoutLocal();
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout error:", error);
    UsersService.logoutLocal();
    navigate("/login", { replace: true });
  }
};


  return (
    <header className={`${headerBg} text-white p-3 flex items-center justify-between shadow-md transition-colors duration-300`}>

      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className={`p-2 ${hoverBtn} rounded transition-colors`}
        >
          <Menu size={22} />
        </button>

        <div className="flex flex-col">
          {/* Active warehouse pill */}
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit mt-0.5 ${badgeBg}`}>
            <Warehouse size={10} />
            {isCebu ? "Cebu Warehouse" : "Main Warehouse"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          onClick={handleNotificationsClick}
          className={`p-2 ${hoverBtn} rounded transition-colors relative`}
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            3
          </span>
        </button>

        {/* Admin Profile */}
        <div
          className="relative"
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <button className={`flex items-center gap-2 p-2 ${hoverBtn} rounded transition-colors`}>
            <div className={`w-6 h-6 bg-white ${avatarText} rounded-full flex items-center justify-center`}>
              <User size={16} />
            </div>
            <span className="text-sm font-medium">Admin</span>
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 w-48 bg-white text-black rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-200 animate-fade-in">
              {/* Profile Info */}
              <div className={`px-4 py-3 ${dropdownBg} flex flex-col items-center gap-2`}>
                <div className={`w-16 h-16 bg-white ${avatarColor} rounded-full flex items-center justify-center border-2 ${avatarBorder}`}>
                  <User size={32} />
                </div>
                <p className="font-semibold text-gray-800">Admin Enye</p>
                {/* Warehouse badge inside dropdown */}
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeBg}`}>
                  <Warehouse size={10} />
                  {isCebu ? "Cebu Warehouse" : "Main Warehouse"}
                </span>
              </div>

              {/* Menu Options */}
              <div className="flex flex-col">
                <button
                  onClick={handleProfileClick}
                  className={`flex items-center gap-2 px-4 py-2 ${hoverItem} transition-colors`}
                >
                  <User size={18} /> Profile
                </button>
                <button
                  onClick={handleSignOutClick}
                  className={`flex items-center gap-2 px-4 py-2 ${hoverItem} text-red-600 transition-colors`}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={handleSettingsClick}
          className={`p-2 ${hoverBtn} rounded transition-colors`}
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}