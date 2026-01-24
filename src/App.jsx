import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Houses from "./pages/Houses";
import HouseDetails from "./pages/HouseDetails";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddHouse from "./admin/AddHouse";
import Reservations from "./admin/Reservations";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maisons" element={<Houses />} />
        <Route path="/maisons/:id" element={<HouseDetails />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/favoris" element={<Favorites />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/ajouter" element={<AddHouse />} />
        <Route path="/admin/reservations" element={<Reservations />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

