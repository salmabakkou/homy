import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchHouses } from "../store/housesSlice";
import { fetchReservations } from "../store/reservationsSlice";
import {
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize,
  FiHome,
  FiInfo
} from "react-icons/fi";

import {
  FaSpinner,
  FaBed,
  FaBath
} from "react-icons/fa";
import toast from "react-hot-toast";

/* =========================================
   PAGE PRINCIPALE
========================================= */

export default function HouseDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const houses = useSelector((state) => state.houses.data || []);
  const loading = useSelector((state) => state.houses.loading);
  const reservations = useSelector((state) => state.reservations.data || []);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchHouses());
    dispatch(fetchReservations());
  }, [dispatch]);

  const house = houses.find((h) => String(h.id) === String(id));

  if (loading && !house) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C3091C] mb-4"></div>
      <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
        Chargement en cours...
      </div>
    </div>
  );

  if (!house) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9]">
      <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
        Aucune propriété trouvée
      </div>
    </div>
  );

  // Combiner les images : principale + secondaires
  const allImages = [house.mainImage, ...(house.images || [])];

  const nextImg = () => setCurrentIdx((prev) => (prev + 1) % allImages.length);
  const prevImg = () => setCurrentIdx((prev) => (prev - 1 + allImages.length) % allImages.length);

  // 1. Récupération de la date locale
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // 2. Extraire UNIQUEMENT les réservations liées à cette maison
  const houseReservations = reservations.filter(res => String(res.houseId) === String(house.id));

  // 3. Chercher si la maison a une réservation "ACTIVE" pour la date d'aujourd'hui
  const activeReservation = houseReservations.find(res => res.from <= today && res.to >= today);

  // 4. Déterminer le statut final strict et la date de libération si occupé
  const currentStatus = activeReservation ? 'reserved' : 'available';
  const displayReservedTo = activeReservation ? activeReservation.to : null;

  const handleBooking = () => {
    const userEmail = localStorage.getItem("user_email");
    if (!userEmail) {
      toast.error("Veuillez vous connecter pour effectuer une réservation");
      navigate("/admin/login");
      return;
    }
    navigate(`/checkout/${house.id}`);
  };

  return (
    <div className="bg-[#FDFCF9] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

        {/* 1. TITRE ET LOCALISATION */}
        <div className="mb-8">
          <h1 className="text-xl md:text-3xl font-serif font-black text-[#C3091C] leading-tight uppercase tracking-tight">
            {house.title}
          </h1>
          <p className="flex items-center gap-2 text-gray-400 mt-3 font-medium uppercase tracking-[0.3em] text-[10px]">
            <FiMapPin className="text-[#C3091C]" /> {house.address} • {house.city}
          </p>
        </div>

        {/* 2. GALERIE PHOTOS */}
        <div className="grid lg:grid-cols-4 gap-4 mb-10 overflow-hidden">
          <div className="lg:col-span-3 relative h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-xl group bg-gray-100">
            <img
              src={allImages[currentIdx]}
              className="w-full h-full object-cover transition-all duration-700"
              alt="Main"
            />
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={prevImg} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-lg hover:bg-[#C3091C] hover:text-white transition-all transform hover:scale-110"><FiChevronLeft size={24} /></button>
              <button onClick={nextImg} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-lg hover:bg-[#C3091C] hover:text-white transition-all transform hover:scale-110"><FiChevronRight size={24} /></button>
            </div>
            <div className="absolute top-6 left-6 font-black text-[9px] uppercase tracking-widest text-white bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
              Photo {currentIdx + 1} / {allImages.length}
            </div>
          </div>

          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 scrollbar-none h-[120px] lg:h-[550px]">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`relative cursor-pointer shrink-0 w-32 md:w-40 lg:w-full h-full lg:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${currentIdx === idx ? 'border-[#D4AF37] shadow-lg' : 'border-transparent opacity-50 hover:opacity-100 scale-95'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 3. LIGNE ACTION : DÉTAILS + BOUTON/PRIX */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm mb-12">

          {/* Détails à gauche */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 md:gap-12">
            <div className="flex items-center gap-3">
              <FaBed className="text-[#C3091C]" size={18} />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Chambres</span>
                <span className="font-serif font-bold text-base sm:text-lg">{house.rooms}</span>
              </div>
            </div>
            <div className="hidden sm:block w-[1px] h-10 bg-gray-100" />
            <div className="flex items-center gap-3">
              <FaBath className="text-[#C3091C]" size={16} />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bains</span>
                <span className="font-serif font-bold text-base sm:text-lg">{house.bathrooms}</span>
              </div>
            </div>
            <div className="hidden sm:block w-[1px] h-10 bg-gray-100" />
            <div className="flex items-center gap-3">
              <FiMaximize className="text-[#C3091C]" size={16} />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Surface</span>
                <span className="font-serif font-bold text-base sm:text-lg">{house.surface} m²</span>
              </div>
            </div>
          </div>

          {/* Bouton et Prix à droite */}
          <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
            {currentStatus === 'available' ? (
              <button
                onClick={handleBooking}
                className="bg-[#C3091C] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-lg hover:bg-black transition-all duration-500 active:scale-95 w-full md:w-auto"
              >
                Réserver maintenant
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-200 text-gray-400 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] cursor-not-allowed w-full md:w-auto"
              >
                Déjà réservé {displayReservedTo ? `jusqu'au ${displayReservedTo}` : ""}
              </button>
            )}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Prix Total:</span>
              <span className="text-2xl font-serif font-black text-[#C3091C] tracking-tighter">
                {house.price.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">MAD <span className="text-[8px] opacity-70">/ nuit</span></span>
            </div>
          </div>
        </div>

        {/* 4. DESCRIPTION */}
        <div className="mb-16 space-y-6">
          <h2 className="text-2xl font-serif font-medium text-gray-900 border-b border-gray-100 pb-4">
            À propos de ce bien
          </h2>
          <div className="leading-relaxed text-gray-600 text-lg font-light w-full">
            {house.description}
          </div>
        </div>

        {/* 5. PARTIE AI */}
        <ProximiteSection
          address={house.address}
          city={house.city}
        />

      </div>
    </div>
  );
}

/* =========================================
   SECTION PROXIMITÉ IA
========================================= */

function ProximiteSection({ address, city }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheKey = `ai_proximity_${address}`;

  useEffect(() => {
    if (!address) return;

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setData(JSON.parse(cached));
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    const fetchAI = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("Clé API Gemini manquante dans le fichier .env");
        }

        const prompt = `Tu es un expert local au Maroc. Localisation : "${address}${city ? `, ${city}` : ""}". Retourne UNIQUEMENT un JSON valide : {"categories": [{"title": "Nom catégorie", "items": [{"name": "Nom réel", "distance": "X km", "description": "Description courte utile"}]}]}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        if (!res.ok) throw new Error(`Erreur API (${res.status})`);

        const result = await res.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Réponse vide");

        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const first = cleaned.indexOf("{");
        const last = cleaned.lastIndexOf("}");
        if (first === -1 || last === -1) throw new Error("Format JSON invalide");

        const jsonString = cleaned.slice(first, last + 1);
        const parsed = JSON.parse(jsonString);

        setData(parsed);
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
      } catch (err) {
        console.error("AI Error:", err.message);
        setError("Bons plans temporairement indisponibles.");
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, [address, city]);

  return (
    <div className="mt-12">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
        <FiMapPin />
        Bons plans à proximité
      </h3>

      <div className="bg-[#FDFCF9] p-8 rounded-[2rem] border border-gray-100">
        {loading && (
          <div className="flex items-center gap-3 text-gray-400 italic">
            <FaSpinner className="animate-spin" />
            Analyse du quartier par l'IA...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-gray-400 text-sm italic">
            <FiInfo />
            {error}
          </div>
        )}

        {data?.categories?.map((category, i) => (
          <div key={i} className="mb-10 last:mb-0">
            <h4 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-widest">
              {category.title}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {category.items?.map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition">
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                    <span className="text-xs text-[#C3091C] font-bold">{item.distance}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
