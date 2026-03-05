import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import WarehouseDashboard from "./Pages/WarehouseDashboard";
import Categories from "./Pages/Categories";
import AddCategory from "./Pages/AddCategory";
import StockItems from "./Pages/StockItems";
import DefectiveItems from "./Pages/DefectiveItems";
import AddRestockItems from "./Pages/AddRestockItems";
import RestockedItems from "./Pages/RestockedItems";
import Deliver from "./Pages/Deliver";
import DeliverItems from "./Pages/DeliverItems";
import Transfer from "./Pages/Transfer";
import RequestForm from "./Pages/RequestForm";
import BorrowList from "./Pages/BorrowList";
import ReserveList from "./Pages/ReserveList";
import ReplacementList from "./Pages/ReplacementList";
import EmpBorrowList from "./Pages/EmpBorrowList";
import EmpReserveList from "./Pages/EmpReserveList";
import EmpWarrantyList from "./Pages/EmpWarrantyList";
import ProductWarranty from "./Pages/ProductWarranty";
import MyPRF from "./Pages/MyPRF";
import CreatePRF from "./Pages/CreatePRF";
import RequestedPRF from "./Pages/RequestedPRF";
import ImportedPRF from "./Pages/ImportedPRF";
import LocalPRF from "./Pages/LocalPRF";
import EmployeePRF from "./Pages/EmployeePRF";
import UserManagement from "./Management/UserManagement";
import AddUser from "./Components/layouts/AddUser";
import ActivityLogs from "./Pages/ActivityLogs";
import UserProfile from "./Management/UserProfile";
import Login from "./Management/Auth/Login";
import OutOfStock from "./Pages/OutOfStock";
import Footer from "./Components/Footer";
import { WarehouseProvider } from "./context/WarehouseContext";
import TransferredItems from "./Pages/TransferredItems";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLoginPage = location.pathname.toLowerCase() === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        {/* Only show sidebar if not login */}
        {!isLoginPage && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Main content area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            !isLoginPage && sidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          {/* Only show header if not login */}
          {!isLoginPage && <Header setSidebarOpen={setSidebarOpen} />}

          {/* Page content */}
          <Routes>
            <Route path="/" element={<WarehouseDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Categories" element={<Categories />} />
            <Route path="/Pages/AddCategory" element={<AddCategory />} />
            <Route path="/StockItems" element={<StockItems />} />
            <Route path="/DefectiveItems" element={<DefectiveItems />} />
            <Route path="/AddRestockItems" element={<AddRestockItems />} />
            <Route path="/RestockedItems" element={<RestockedItems />} />
            <Route path="/Deliver" element={<Deliver />} />
            <Route path="/DeliverItems" element={<DeliverItems />} />
            <Route path="/Transfer" element={<Transfer />} />
            <Route path="/RequestForm" element={<RequestForm />} />
            <Route path="/BorrowList" element={<BorrowList />} />
            <Route path="/ReserveList" element={<ReserveList />} />
            <Route path="/ReplacementList" element={<ReplacementList />} />
            <Route path="/EmpBorrowList" element={<EmpBorrowList />} />
            <Route path="/EmpReserveList" element={<EmpReserveList />} />
            <Route path="/EmpWarrantyList" element={<EmpWarrantyList />} />
            <Route path="/ProductWarranty" element={<ProductWarranty />} />
            <Route path="/CreatePRF" element={<CreatePRF />} />
            <Route path="/MyPRF" element={<MyPRF />} />
            <Route path="/RequestedPRF" element={<RequestedPRF />} />
            <Route path="/ImportedPRF" element={<ImportedPRF />} />
            <Route path="/LocalPRF" element={<LocalPRF />} />
            <Route path="/EmployeePRF" element={<EmployeePRF />} />
            <Route path="/UserManagement" element={<UserManagement />} />
            <Route path="/AddUser" element={<AddUser />} />
            <Route path="/ActivityLogs" element={<ActivityLogs />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/OutOfStock" element={<OutOfStock />} />
            <Route path="/TransferredItems" element={<TransferredItems />} />
          </Routes>

          {!isLoginPage && <Footer />}
        </div>
      </div>
    </div>
  );
}

export default App;