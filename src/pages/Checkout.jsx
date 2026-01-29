import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { addReservationThunk } from "../store/reservationsSlice";
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
  });

  // ✅ ERREURS
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

  // ✅ VALIDATION SIMPLE
  const validate = () => {
    const newErrors = {};

    if (!formData.from) newErrors.from = "Date d'arrivée obligatoire";
    if (!formData.to) newErrors.to = "Date de départ obligatoire";
    if (!formData.fullName.trim()) newErrors.fullName = "Nom complet obligatoire";

    if (!formData.email.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    try {
      await dispatch(addReservationThunk({ 
        ...formData, 
        houseId: house.id, 
        total, 
        nights, 
        status: "pending" 
      })).unwrap();

      toast.success("Demande de réservation transmise");
      navigate("/");
    } catch {
      // ✅ correction erreur ESLint
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] py-10 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* GAUCHE : VISUEL */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-10">
            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100">
              <div className="aspect-square w-full rounded-4xl overflow-hidden mb-6 shadow-inner">
                <img 
                  src={house.mainImage} 
                  className="w-full h-full object-cover" 
                  alt={house.title} 
                />
              </div>
              <div className="px-2 pb-4">
                <span className="text-[#C3091C] font-serif text-2xl tracking-widest uppercase font-bold">
                  Homy
                </span>
                <h1 className="text-xl font-black text-gray-900 uppercase mt-1 tracking-tight">
                  {house.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-400 italic text-xs mt-2">
                  <FiMapPin className="text-[#C3091C]" />
                  <span>{house.address}</span>
                </div>
              </div>
            </div>

            {/* BADGES */}
            {/* <div className="mt-6 px-6 space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <FiCheckCircle className="text-green-500" /> Annulation flexible
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <FiCheckCircle className="text-green-500" /> Confirmation immédiate
              </div>
            </div> */}
          </div>

          {/* DROITE : FORMULAIRE */}
          <div className="w-full lg:w-2/3 bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Finaliser ma demande
              </h2>
            </div>

            <div className="space-y-8">

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
                      onChange={(e) => setFormData({...formData, from: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, to: e.target.value})}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                    />
                  </div>
                  {errors.to && <p className="text-red-500 text-xs ml-2">{errors.to}</p>}
                </div>
              </div>

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
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs ml-2">{errors.fullName}</p>}
              </div>

              {/* EMAIL + GUESTS */}
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
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs ml-2">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic tracking-wider">
                    Voyageurs
                  </label>
                  <div className="relative">
                    <FiUser className="absolute top-4 left-4 text-[#C3091C]" />
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none appearance-none cursor-pointer"
                    >
                      <option>1 Adulte</option>
                      <option>2 Adultes</option>
                      <option>Famille / Groupe</option>
                    </select>
                    <FiChevronDown className="absolute top-4 right-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* RÉCAP */}
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
