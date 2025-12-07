// import React, { useState, useEffect } from "react";
// import { useLocation, Routes, Route } from "react-router-dom";
// import axios from "axios";
// import Login from "./Login";
// import Dashboard from "./Dashboard";
// import Home from "./Home";
// import Shop from "./Shop";

// const API_URL = process.env.REACT_APP_API_URL;
// axios.defaults.withCredentials = true;

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [checkingAdmin, setCheckingAdmin] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     if (location.pathname.startsWith("/admin")) {
//       setCheckingAdmin(true);
//       axios
//         .get(`${API_URL}/dashboard`)
//         .then((res) => setUser(res.data.user))
//         .catch(() => setUser(null))
//         .finally(() => setCheckingAdmin(false));
//     }
//   }, [location.pathname]);

//   if (checkingAdmin) return null;

//   return (
//     <Routes>
//       {/* Public pages */}
//       <Route path="/" element={<Home />} />
//       <Route path="/shop" element={<Shop />} />

//       {/* Admin pages */}
//       <Route
//         path="/admin/*"
//         element={user ? <Dashboard user={user} /> : <Login onLogin={setUser} />}
//       />
//     </Routes>
//   );
// }
