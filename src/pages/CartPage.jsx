// src/pages/CartPage.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function CartPage() {
  const { cartItems, removeFromCart, total, clearCart } = useCart();

  // Ensure each cart item has quantity (default to 1) before sending to checkout
  const sanitizedCartItems = cartItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity || 1,
    imageUrl: item.imageUrl || "/placeholder-plant.png"
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {sanitizedCartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-3"
              >
                <div className="flex items-center gap-3">
                  {item.image_url ? (
                    <img
                      src={
                        item.image_url.startsWith("http")
                          ? item.image_url
                          : `${API_URL}${item.image_url}`
                      }
                      alt={item.product_name || item.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <img
                      src="/placeholder-plant.png"
                      alt={item.product_name || item.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                  )}
                  <div>
                    <h2 className="font-semibold">{item.product_name || item.name}</h2>
                    <p>
                      ₱{item.price} x {item.quantity || 1}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}


          <div className="flex justify-between mt-4 text-lg font-semibold">
            <span>Total:</span>
            <span>₱{total.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={clearCart}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            >
              Clear Cart
            </button>

            <Link
              to="/checkout"
              state={{ cartItems: sanitizedCartItems, total }} // pass sanitized items to checkout
              className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-all"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
