import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Layouts
import UserLayout from './layouts/UserLayout';

// User Pages
import Home from "./pages/Home";
import Houses from "./pages/Houses";
import HouseDetails from "./pages/HouseDetails";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";

// Admin Pages
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import DashboardHome from "./admin/DashboardHome";
import AddHouse from "./admin/AddHouse";
import Reservations from "./admin/Reservations";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            border: '1px solid #f3f4f6',
            padding: '16px 24px',
            color: '#1f2937',
            background: '#ffffff',
            borderRadius: '9999px',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            whiteSpace: 'nowrap',
            maxWidth: 'none',
          },
          success: {
            icon: null,
            style: {
              color: '#10b981',
              border: '1px solid #10b981',
            },
          },
          error: {
            icon: null,
            style: {
              color: '#C3091C',
              border: '1px solid #C3091C',
            },
          },
        }}
      />
      <Routes>

        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/maisons" element={<Houses />} />
          <Route path="/maisons/:id" element={<HouseDetails />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/favoris" element={<Favorites />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="addHouse" element={<AddHouse />} />
          <Route path="reservations" element={<Reservations />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}
