import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import TransferredItems from "./Pages/TransferredItems";
import EditUser from "./Management/EditUser";
import ProtectedRoute from "./Components/ProtectedRoute";

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
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        {!isLoginPage && isLoggedIn && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            !isLoginPage && isLoggedIn && sidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          {!isLoginPage && isLoggedIn && (
            <Header setSidebarOpen={setSidebarOpen} />
          )}

          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <WarehouseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Pages/AddCategory"
              element={
                <ProtectedRoute>
                  <AddCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/StockItems"
              element={
                <ProtectedRoute>
                  <StockItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/DefectiveItems"
              element={
                <ProtectedRoute>
                  <DefectiveItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddRestockItems"
              element={
                <ProtectedRoute>
                  <AddRestockItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/RestockedItems"
              element={
                <ProtectedRoute>
                  <RestockedItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Deliver"
              element={
                <ProtectedRoute>
                  <Deliver />
                </ProtectedRoute>
              }
            />
            <Route
              path="/DeliverItems"
              element={
                <ProtectedRoute>
                  <DeliverItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Transfer"
              element={
                <ProtectedRoute>
                  <Transfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/RequestForm"
              element={
                <ProtectedRoute>
                  <RequestForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/BorrowList"
              element={
                <ProtectedRoute>
                  <BorrowList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ReserveList"
              element={
                <ProtectedRoute>
                  <ReserveList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ReplacementList"
              element={
                <ProtectedRoute>
                  <ReplacementList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/EmpBorrowList"
              element={
                <ProtectedRoute>
                  <EmpBorrowList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/EmpReserveList"
              element={
                <ProtectedRoute>
                  <EmpReserveList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/EmpWarrantyList"
              element={
                <ProtectedRoute>
                  <EmpWarrantyList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ProductWarranty"
              element={
                <ProtectedRoute>
                  <ProductWarranty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CreatePRF"
              element={
                <ProtectedRoute>
                  <CreatePRF />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MyPRF"
              element={
                <ProtectedRoute>
                  <MyPRF />
                </ProtectedRoute>
              }
            />
            <Route
              path="/RequestedPRF"
              element={
                <ProtectedRoute>
                  <RequestedPRF />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ImportedPRF"
              element={
                <ProtectedRoute>
                  <ImportedPRF />
                </ProtectedRoute>
              }
            />
            <Route
              path="/LocalPRF"
              element={
                <ProtectedRoute>
                  <LocalPRF />
                </ProtectedRoute>
              }
            />
            <Route
              path="/EmployeePRF"
              element={
                <ProtectedRoute>
                  <EmployeePRF />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserManagement"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/EditUser/:id"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddUser"
              element={
                <ProtectedRoute>
                  <AddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ActivityLogs"
              element={
                <ProtectedRoute>
                  <ActivityLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserProfile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/OutOfStock"
              element={
                <ProtectedRoute>
                  <OutOfStock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/TransferredItems"
              element={
                <ProtectedRoute>
                  <TransferredItems />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
            />
          </Routes>

          {!isLoginPage && isLoggedIn && <Footer />}
        </div>
      </div>
    </div>
  );
}

export default App;
