import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import logo from "../assets/logo.png";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Supprime l’erreur quand l'utilisateur tape
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire";
    } else if (formData.password.length < 4) {
      newErrors.password = "Minimum 4 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

    // 👇 ICI
    if (
      formData.email === ADMIN_EMAIL &&
      formData.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem("role", "admin");
      localStorage.setItem("user_email", formData.email);
      toast.success("Connexion réussie");
      navigate("/admin");
    } else {
      localStorage.setItem("role", "user");
      localStorage.setItem("user_email", formData.email);
      toast.success("Connexion réussie");
      navigate("/");
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute w-125 h-125 bg-[#C3091C]/10 rounded-full blur-3xl -top-32 -left-32"></div>

      <div className="w-full max-w-md bg-white shadow-2xl rounded-[2.5rem] p-10 relative z-10">

        {/* Retour */}
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-[#C3091C] text-xs uppercase tracking-widest mb-8 transition"
        >
          <FiArrowLeft />
          Retour à l’accueil
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Homy" className="h-10 mb-4" />
          <h1 className="text-xl md:text-2xl font-serif font-black tracking-widest text-[#C3091C] uppercase leading-tight text-center">
            Connexion
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-xs text-gray-500 ml-2">
              Email
            </label>

            <div className="relative mt-2">
              <FiMail className="absolute top-4 left-4 text-[#C3091C]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-4 pl-12 rounded-2xl text-sm outline-none border ${errors.email
                  ? "border-red-400"
                  : "border-gray-200 focus:border-[#C3091C]"
                  }`}
                placeholder="votre@email.com"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mt-2 ml-2">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-500 ml-2">
              Mot de passe
            </label>

            <div className="relative mt-2">
              <FiLock className="absolute top-4 left-4 text-[#C3091C]" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-4 pl-12 rounded-2xl text-sm outline-none border ${errors.password
                  ? "border-red-400"
                  : "border-gray-200 focus:border-[#C3091C]"
                  }`}
                placeholder="••••••••"
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-2 ml-2">
                {errors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#C3091C] hover:bg-[#a50716] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-xs shadow-lg transition-all duration-500"
          >
            Se connecter
          </button>

        </form>
      </div>
    </div>
  );
}
