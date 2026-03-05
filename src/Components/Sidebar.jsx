import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/images/enye_r.png";
import { useNavigate } from "react-router-dom";
import { useWarehouse } from "../context/WarehouseContext";

import {
  LayoutDashboard, Folder, Box, RefreshCw,
  Truck, Clipboard, Shield, FileText,
  User, Settings, ChevronDown, ChevronUp, House, Warehouse
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const sidebarRef = useRef();
  const [openMenus, setOpenMenus] = useState({});
  const itemRef = useRef();
  const navigate = useNavigate();
  const { currentWarehouse } = useWarehouse();

  const isCebu = currentWarehouse === "cebu";

  // ── Theming ────────────────────────────────────────────────────────────────
  const avatarBg       = isCebu ? "bg-purple-400"   : "bg-orange-600";
  const activeBg       = isCebu ? "bg-slate-800"   : "bg-gray-800";
  const hoverBg        = isCebu ? "hover:bg-slate-800" : "hover:bg-gray-800";
  const sidebarBg      = isCebu ? "bg-slate-900"   : "bg-gray-900";
  const borderColor    = isCebu ? "border-slate-800" : "border-gray-700";
  const labelColor     = isCebu ? "text-slate-300" : "text-gray-400";
 

  const toggleMenu = (menuName, ref) => {
    setOpenMenus((prev) => {
      const isAlreadyOpen = prev[menuName];
      const newState = {};
      Object.keys(prev).forEach((key) => (newState[key] = false));
      newState[menuName] = !isAlreadyOpen;
      if (!isAlreadyOpen && ref?.current) {
        setTimeout(() => {
          ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      }
      return newState;
    });
  };

  // ── Main Warehouse Menu ────────────────────────────────────────────────────
  const mainMenu = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Categories", path: "/Categories", icon: Folder },
    {
      name: "Products",
      icon: Box,
      submenu: [
        { name: "Stock Items", path: "/StockItems" },
        { name: "Defective Items", path: "/DefectiveItems" },
      ],
    },
    { name: "Restock", path: "/RestockedItems", icon: RefreshCw },
    {
      name: "Dispatch",
      icon: Truck,
      submenu: [
        { name: "Deliver", path: "/Deliver" },
        { name: "Transfer", path: "/Transfer" },
      ],
    },
    {
      name: "Stock Request",
      icon: Clipboard,
      submenu: [
        { name: "Request Form", path: "/RequestForm" },
        { name: "Borrow List", path: "/BorrowList" },
        { name: "Reserve List", path: "/ReserveList" },
        { name: "War/Rep List", path: "/ReplacementList" },
        { name: "Employee Borrow List", path: "/EmpBorrowList" },
        { name: "Employee Reserve List", path: "/EmpReserveList" },
        { name: "Employee War/Rep List", path: "/EmpWarrantyList" },
      ],
    },
    { name: "Warranty", path: "/ProductWarranty", icon: Shield },
    {
      name: "PRF Management",
      icon: FileText,
      submenu: [
        { name: "Create PRF", path: "/CreatePRF" },
        { name: "My PRF", path: "/MyPRF" },
        { name: "PL PRF Request", path: "/RequestedPRF" },
        { name: "PRF Imported", path: "/ImportedPRF" },
        { name: "PRF Local", path: "/LocalPRF" },
        { name: "PRF Employee Request", path: "/EmployeePRF" },
      ],
    },
    { name: "User Management", path: "/UserManagement", icon: User },
    { name: "Logs", path: "/ActivityLogs", icon: Clipboard },
    { name: "Settings", path: "/UserProfile", icon: Settings },
  ];

  // ── Cebu Warehouse Menu ────────────────────────────────────────────────────
  const cebuMenu = [
    { name: "Cebu Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Categories", path: "/Categories", icon: Folder },
    {
      name: "Products",
      icon: Box,
      submenu: [
        { name: "Cebu Items", path: "/StockItems" },
        { name: "Transferred Items", path: "/TransferredItems" },
      ],
    },
    { name: "Restock", path: "/RestockedItems", icon: RefreshCw },
    {
      name: "Dispatch",
      icon: Truck,
      submenu: [
        { name: "Deliver", path: "/Deliver" },
      ],
    },
    {
      name: "Stock Request",
      icon: Clipboard,
      submenu: [
        { name: "Borrow", path: "/BorrowList" },
        { name: "Reserve", path: "/ReserveList" },
      ],
    },
    { name: "Warranty", path: "/ProductWarranty", icon: Shield },
    { name: "User Management", path: "/UserManagement", icon: User },
    { name: "Logs", path: "/ActivityLogs", icon: Clipboard },
    { name: "Settings", path: "/UserProfile", icon: Settings },
  ];

  const menuItems = isCebu ? cebuMenu : mainMenu;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded transition ${
      isActive ? activeBg : hoverBg
    }`;

  const subLinkClass = ({ isActive }) =>
    `p-2 rounded text-sm transition-all duration-200 ${
      isActive ? activeBg : `${hoverBg} hover:translate-x-1`
    }`;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 bottom-0 w-64
          ${sidebarBg} text-white z-40
          transform transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div
          className="h-15 flex items-center justify-center bg-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="ENYE" className="h-full object-contain" />
        </div>

        {/* User Info */}
        <div className={`p-4 border-b ${borderColor} flex items-center gap-3`}>
          <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center`}>
            <User size={18} />
          </div>
          <div>
            <p className="font-semibold">Admin Enye</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto flex-1 scrollbar-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">

          {/* Home link */}
          <NavLink to="/" className={navLinkClass}>
            <House size={20} />
            <span className="text-sm">Enye Systems</span>
          </NavLink>

          <p className={`${labelColor} uppercase text-xs font-semibold mb-2`}>
            Main Navigation
          </p>

          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const showUsefulLinksLabel = item.name === "User Management";

            if (showUsefulLinksLabel) {
              return (
                <div key={index}>
                  <p className={`${labelColor} uppercase text-xs font-semibold mb-2 mt-8 border-t ${borderColor} pt-4`}>
                    Useful Links
                  </p>
                  <NavLink to={item.path} className={navLinkClass}>
                    <Icon size={20} />
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                </div>
              );
            }

            if (item.submenu) {
              const isOpen = openMenus[item.name];
              return (
                <div key={index} ref={itemRef}>
                  <button
                    onClick={() => toggleMenu(item.name, itemRef)}
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded ${hoverBg} cursor-pointer transition`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  <div
                    className={`
                      ml-7 overflow-hidden transform transition-all duration-300 ease-in-out
                      ${isOpen ? "max-h-96 opacity-100 translate-y-0 mt-1" : "max-h-0 opacity-0 -translate-y-2"}
                    `}
                  >
                    <div className="flex flex-col gap-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          onClick={() => setOpenMenus((prev) => ({ ...prev, [item.name]: false }))}
                          className={subLinkClass}
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink key={index} to={item.path} className={navLinkClass}>
                <Icon size={20} />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}