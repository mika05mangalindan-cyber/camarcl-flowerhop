import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import CartPage from "./pages/CartPage.jsx";
import Checkout from "./pages/Checkout.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Policies from "./pages/Policies.jsx";
import FAQ from "./pages/FAQ.jsx";
import Profile from "./pages/Profile.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Sidebar from "./layouts/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Inventory from "./pages/Inventory.jsx";
import Users from "./pages/Users.jsx";

import { CartProvider } from "./context/CartContext";

axios.defaults.withCredentials = true;
const API_URL = process.env.REACT_APP_API_URL;

// ProtectedRoute wrapper
const ProtectedRoute = ({ children, user, role }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role.toLowerCase() !== role.toLowerCase()) return <Navigate to="/" replace />;
  return children;
};

function AppWrapper() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);

  // Fetch user on app mount to persist login
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/session`, { withCredentials: true })
      .then((res) => setUser(res.data.user || null))
      .catch(() => setUser(null))
      .finally(() => setCheckingUser(false));
  }, []);

  if (checkingUser) return <p className="p-4 text-gray-600">Checking session...</p>;

  // Determine layout
  // Include /profile and /account-settings in admin layout
  const isAdminLayout = location.pathname.startsWith("/dashboard") ||
                        location.pathname === "/profile" ||
                        location.pathname === "/account-settings";

  return (
    <>
      {!isAdminLayout && <Navbar />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected / Admin layout */}
        <Route
          element={
            <ProtectedRoute user={user}>
              <Sidebar />
            </ProtectedRoute>
          }
        >
          {/* Dashboard/Admin */}
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/orders" element={<Orders />} />
          <Route path="/dashboard/inventory" element={<Inventory />} />
          <Route path="/dashboard/users" element={<Users />} />

          {/* Profile / Account Settings under admin layout */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminLayout && <Footer />}
    </>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppWrapper />
      </CartProvider>
    </BrowserRouter>
  );
}
