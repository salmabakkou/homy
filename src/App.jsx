import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import Home from "./pages/Home";
import Houses from "./pages/Houses";
import HouseDetails from "./pages/HouseDetails";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";

// Admin Pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import DashboardHome from "./admin/DashboardHome";
import AddHouse from "./admin/AddHouse";
import Reservations from "./admin/Reservations";

export default function App() {
  return (
      <BrowserRouter>
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

          {/* Ici on utilise AdminDashboard comme layout */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="addHouse" element={<AddHouse />} />   
            <Route path="reservations" element={<Reservations />} />
          </Route>

        </Routes>
      </BrowserRouter>
  );
}
