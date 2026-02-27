import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { addReservationThunk } from "../store/reservationsSlice";
import { updateHouseThunk } from "../store/housesSlice";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiUser,
  FiMail,
  FiChevronDown,
  FiCheckCircle,
  FiMapPin
} from 'react-icons/fi';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const houses = useSelector((state) => state.houses.data || []);
  const house = houses.find((h) => String(h.id) === String(id));

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    guests: "1 Adulte",
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];

  const nights = useMemo(() => {
    if (!formData.from || !formData.to) return 0;
    const fromDate = new Date(formData.from);
    const toDate = new Date(formData.to);
    const diff = (toDate - fromDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }, [formData.from, formData.to]);

  const total = nights * Number(house?.price || 0);

  if (!house) return (
    <div className="p-20 text-center animate-pulse tracking-widest text-[10px] text-gray-400 uppercase">
      Chargement de l'univers Homy...
    </div>
  );

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Nom complet obligatoire";

    if (!formData.email.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.phone.trim())
      newErrors.phone = "Téléphone obligatoire";

    if (!formData.from)
      newErrors.from = "Date d'arrivée obligatoire";

    if (!formData.to)
      newErrors.to = "Date de départ obligatoire";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    const reservationData = {
      ...formData,
      houseId: house.id,
      houseTitle: house.title,
      total,
      nights,
      status: "pending"
    };

    try {
      // ✅ Envoi vers n8n
      const response = await fetch(import.meta.env.VITE_N8N_CHECK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error("Erreur webhook");
      }

      // ✅ Enregistrer la réservation (MockAPI)
      await dispatch(addReservationThunk(reservationData)).unwrap();

      // ✅ AUTOMATION : Mettre à jour le statut de la maison immédiatement
      await dispatch(updateHouseThunk({
        id: house.id,
        houseData: {
          ...house,
          status: 'reserved',
          reservedFrom: formData.from,
          reservedTo: formData.to
        }
      })).unwrap();

      toast.success("Demande de réservation transmise et maison occupée");
      navigate("/");

    } catch (error) {
      console.error("Erreur checkout :", error);
      toast.error("Une erreur est survenue");
    }
  };


  return (
    <div className="w-full min-h-screen bg-[#FDFCF9] py-10 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* GAUCHE */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-10">
            <div className="bg-white rounded-[3rem] p-5 shadow-2xl shadow-gray-200/50 border border-gray-50">
              <div className="aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden mb-6 relative group">
                <img
                  src={house.mainImage}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt={house.title}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
              </div>

              <div className="px-4 pb-2 flex flex-col items-center text-center">
                <span className="text-[#D4AF37] font-black tracking-[0.4em] uppercase text-[9px] mb-3">
                  Séjour Exclusif
                </span>

                <h1 className="text-lg font-serif font-medium text-gray-900 uppercase tracking-widest leading-snug mb-4">
                  {house.title}
                </h1>

                <div className="w-12 h-[1px] bg-gray-200 mb-4" />

                <div className="flex flex-col items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <FiMapPin className="text-[#C3091C]" size={12} />
                    <span>{house.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DROITE */}
          <div className="w-full lg:w-2/3 bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#C3091C] leading-tight uppercase tracking-tight">
                Réserver ce Bien
              </h2>
            </div>

            <div className="space-y-8">

              {/* NOM */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic tracking-wider">
                  Nom complet & Prénom
                </label>
                <div className="relative">
                  <FiUser className="absolute top-4 left-4 text-[#C3091C]" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs ml-2">{errors.fullName}</p>}
              </div>

              {/* EMAIL + TELEPHONE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic tracking-wider">
                    Email de contact
                  </label>
                  <div className="relative">
                    <FiMail className="absolute top-4 left-4 text-[#C3091C]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs ml-2">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic tracking-wider">
                    Téléphone
                  </label>
                  <div className="relative">
                    <FiUser className="absolute top-4 left-4 text-[#C3091C]" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs ml-2">{errors.phone}</p>}
                </div>

              </div>

              {/* DATES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic tracking-wider">
                    Date d'arrivée
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute top-4 left-4 text-[#C3091C]" />
                    <input
                      type="date"
                      min={today}
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                    />
                  </div>
                  {errors.from && <p className="text-red-500 text-xs ml-2">{errors.from}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic tracking-wider">
                    Date de départ
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute top-4 left-4 text-[#C3091C]" />
                    <input
                      type="date"
                      min={formData.from || today}
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                    />
                  </div>
                  {errors.to && <p className="text-red-500 text-xs ml-2">{errors.to}</p>}
                </div>
              </div>

              {/* VOYAGEURS */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic tracking-wider">
                  Voyageurs
                </label>
                <div className="relative">
                  <FiUser className="absolute top-4 left-4 text-[#C3091C]" />
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none appearance-none cursor-pointer"
                  >
                    <option>1 Adulte</option>
                    <option>2 Adultes</option>
                    <option>Famille / Groupe</option>
                  </select>
                  <FiChevronDown className="absolute top-4 right-4 text-gray-400" />
                </div>
              </div>

              {/* RECAP */}
              <div className="pt-6 border-t border-dashed border-gray-200">
                <span className="text-gray-400 italic font-medium">
                  {house.price} MAD x {nights} nuits
                </span>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                      Total séjour
                    </p>
                    <p className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">
                      Taxes incluses
                    </p>
                  </div>
                  <div className="text-4xl font-black text-[#C3091C] tracking-tighter">
                    {total} <span className="text-xs text-gray-400">MAD</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-6 bg-[#C3091C] text-white rounded-4xl font-bold text-[11px] tracking-[0.4em] uppercase shadow-xl"
              >
                Confirmer mon séjour
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
