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

// ------------------ APP WRAPPER ------------------
function AppWrapper() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);

  // Persist session on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/session`, { withCredentials: true });
        if (res.data.loggedIn) setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setCheckingUser(false);
      }
    };
    fetchSession();
  }, []);

  if (checkingUser) return <p className="p-4 text-gray-600">Checking session...</p>;

  // Admin layout: show sidebar only for /dashboard routes
  const isAdminLayout = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isAdminLayout && <Navbar />}

      <Routes>
        {/* Public */}
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

        {/* Protected user pages */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute user={user}>
              <AccountSettings user={user} />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard routes */}
        <Route
          element={
            <ProtectedRoute user={user} role="admin">
              <Sidebar />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/orders" element={<Orders />} />
          <Route path="/dashboard/inventory" element={<Inventory />} />
          <Route path="/dashboard/users" element={<Users />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminLayout && <Footer />}
    </>
  );
}

// ------------------ MAIN APP ------------------
export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppWrapper />
      </CartProvider>
    </BrowserRouter>
  );
}
