import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { API_URL } from '../config';

const Navbar = ({ setUser }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Fetch session on page load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${API_URL}/session`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.loggedIn && data.user.role === "customer") {
          setUserData(data.user);
          setUser?.(data.user);
        } else {
          setUserData(null);
          setUser?.(null);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
        setUserData(null);
        setUser?.(null);
      }
    };
    fetchSession();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUserData(null);
      setUser?.(null);
      navigate("/"); // redirect home after logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          <span className="font-semibold text-lg text-gray-800">
            Camarcl Plants & Flowers
          </span>
        </Link>

        {/* NAV LINKS */}
        <ul className="hidden md:flex space-x-6 font-medium text-gray-700">
          <li><Link to="/" className="hover:text-green-600">Home</Link></li>
          <li><Link to="/shop" className="hover:text-green-600">Shop</Link></li>
          <li><Link to="/about" className="hover:text-green-600">About</Link></li>
          <li><Link to="/contact" className="hover:text-green-600">Contact</Link></li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search plants..."
              className="border border-gray-300 rounded-full pl-10 pr-3 py-1.5 text-sm"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-green-600">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH AREA */}
          {userData ? (
            <div className="flex items-center gap-4">
              <span className="text-green-700 font-medium">Hi, {userData.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/register")} className="hover:text-green-600">
                Register
              </button>
              <button onClick={() => navigate("/login")} className="hover:text-green-600">
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
