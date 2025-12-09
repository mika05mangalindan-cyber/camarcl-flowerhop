import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Sidebar from "./layouts/Sidebar.jsx";

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
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Inventory from "./pages/Inventory.jsx";
import Users from "./pages/Users.jsx";


import { CartProvider } from "./context/CartContext";

axios.defaults.withCredentials = true;
const API_URL = process.env.REACT_APP_API_URL;

// --- Protected Route ---
const ProtectedRoute = ({ children, user, role, checkingUser }) => {
  if (checkingUser) return <p className="p-4 text-gray-600">Checking session...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role.toLowerCase() !== role.toLowerCase()) return <Navigate to="/" replace />;
  return children;
};

function AppWrapper() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/session`, { withCredentials: true });
        if (res.data.loggedIn) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
        setUser(null);
      } finally {
        setCheckingUser(false);
      }
    };
    fetchSession();
  }, []);

  const isAdmin = user?.role === "admin";
  const isAdminRoute =
    isAdmin &&
    (location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/account-settings"));

  if (checkingUser) return <p className="p-4 text-gray-600">Checking session...</p>;

  return (
    <>
      {/* Navbar only for customers / public */}
      {!isAdminRoute && <Navbar user={user} setUser={setUser} />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Auth */}
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Admin protected routes */}
        <Route
          element={
            <ProtectedRoute user={user} role="admin" checkingUser={checkingUser}>
              <Sidebar />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/dashboard/products" element={<Products user={user} />} />
          <Route path="/dashboard/orders" element={<Orders user={user} />} />
          <Route path="/dashboard/inventory" element={<Inventory user={user} />} />
          <Route path="/dashboard/users" element={<Users user={user} />} />
        </Route>

        {/* Profile & account settings for any logged-in user */}
        <Route
          element={<ProtectedRoute user={user} checkingUser={checkingUser} />}
        >
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/account-settings" element={<AccountSettings user={user} />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute && <Footer />}
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
