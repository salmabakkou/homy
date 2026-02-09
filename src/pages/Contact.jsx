import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiMessageSquare,
  FiSend
} from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  // ✅ VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nom obligatoire";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message obligatoire";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message trop court";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    toast.success("Message envoyé avec succès ✨");

    setFormData({
      name: "",
      email: "",
      message: ""
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-4 py-16">
      <div className="max-w-4xl mx-auto">

        {/* CARD */}
        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-8 md:p-12">

          {/* HEADER */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Contactez-nous
            </h1>
            <p className="text-gray-400 italic mt-2">
              Une question ? Un projet ? Parlons-en.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* NOM */}
            <div className="space-y-2">
              <label className="text-[10px] ml-2 uppercase font-bold tracking-widest text-gray-400 italic">
                Nom complet
              </label>
              <div className="relative">
                <FiUser className="absolute top-4 left-4 text-[#C3091C]" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs ml-2">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] ml-2 uppercase font-bold tracking-widest text-gray-400 italic">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute top-4 left-4 text-[#C3091C]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs ml-2">{errors.email}</p>
              )}
            </div>

            {/* MESSAGE */}
            <div className="space-y-2">
              <label className="text-[10px] ml-2 uppercase font-bold tracking-widest text-gray-400 italic">
                Message
              </label>
              <div className="relative">
                <FiMessageSquare className="absolute top-4 left-4 text-[#C3091C]" />
                <textarea
                  rows="5"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none resize-none"
                />
              </div>
              {errors.message && (
                <p className="text-red-500 text-xs ml-2">{errors.message}</p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-6 bg-[#C3091C] text-white rounded-4xl font-bold text-[11px] tracking-[0.4em] uppercase shadow-xl flex items-center justify-center gap-3"
            >
              <FiSend />
              Envoyer le message
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
