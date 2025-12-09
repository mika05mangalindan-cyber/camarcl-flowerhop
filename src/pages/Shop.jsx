// src/pages/Shop.jsx

// import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";
import { API_URL } from './config';

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext"; // your cart context

// const API_URL = process.env.REACT_APP_API_URL;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5500/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data); // assuming your API returns { products: [...] }
      } catch (err) {
        console.error(err);
        setError("Error loading products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-700 text-lg font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shop</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {products.length > 0 ? (
  products.map((p) => (
    <div key={p.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
      {/* Image */}
      <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden rounded mb-3">
        <img
          src={p.image_url ? (p.image_url.startsWith("http") ? p.image_url : `${API_URL}${p.image_url}`) : "/placeholder-plant.png"}
          alt={p.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <h3 className="font-semibold">{p.name}</h3>
      <p className="text-sm text-gray-600">{p.category}</p>

      <div className="mt-2 flex items-center justify-between">
        <p className="font-semibold text-green-700">₱{p.price}</p>
        <p className="text-sm text-gray-500">Stock: {p.stock}</p>
      </div>

      <div className="mt-4">
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          onClick={() => addToCart(p)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No products available</p>
            )}

        </div>
      </div>
    </div>
  );
}
