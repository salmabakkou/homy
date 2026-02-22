import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchHouses } from "../store/housesSlice";
import {
  FiMaximize,
  FiHeart,
  FiWifi,
  FiShield,
  FiMapPin,
} from "react-icons/fi";
import { FaBed, FaBath, FaCar, FaSpinner } from "react-icons/fa";

/* =========================================
   Composant : Section "À proximité" (IA Gemini Flash)
   Cible le modèle : gemini-flash-latest
   ========================================= */
function ProximiteSection({ address, city, title, description }) {
  const [analyse, setAnalyse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheKey = `proximite_ai_gemini_flash_${address}`;

  const handleRefresh = () => {
    localStorage.removeItem(cacheKey);
    setAnalyse(null);
    setError(null);
  };

  useEffect(() => {
    if (!address || analyse !== null) return;

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setAnalyse(cached);
      return;
    }

    const prompt = `
        Tu es un expert en conciergerie haut de gamme au Maroc. 
        Localisation cible : "${address}${city ? `, ${city}` : ""}" (Maroc).
        Style de la propriété : "${title || ""}".
        
        Rédige EXACTEMENT 5 recommandations de lieux RÉELS, prestigieux et ouverts au public à proximité immédiate.
        Chaque recommandation doit être riche, précise (Nom Propre obligatoire) et informative.
        
        STRUCTURE (5 lignes, une par catégorie, commence par l'émoji) :
        🏛️ Histoire & Culture : [Nom d'un monument/musée] - [Distance] - [Description de son importance]
        🍴 Table d'Exception : [Nom d'un restaurant réputé] - [Distance] - [Spécialité et ambiance]
        💪 Bien-être & Vitalité : [Nom d'un club de sport ou spa] - [Distance] - [Services premium]
        🏖️ Évasion & Nature : [Nom d'une plage ou site naturel] - [Distance] - [Vue ou expérience unique]
        ✨ Le Secret Local : [Lieu unique ou pépite méconnue] - [Distance] - [Pourquoi y aller]

        Consignes strictes :
        - UTILISE DES NOMS PROPRES RÉELS vérifiables.
        - Ne donne QUE les 5 lignes demandées.
        - Pas de texte avant ou après.
      `;

    const run = async () => {
      setLoading(true);
      setError(null);

      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!geminiKey) {
        setError("Clé API manquante. Veuillez configurer VITE_GEMINI_API_KEY dans votre fichier .env");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (response.status === 429) {
          throw new Error("Quota atteint (429). L'IA est surchargée. Réessayez dans 60 secondes ou utilisez une autre clé.");
        }

        if (!response.ok) {
          throw new Error(`Erreur API (${response.status}). Vérifiez votre connexion ou votre clé.`);
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (text) {
          setAnalyse(text);
          localStorage.setItem(cacheKey, text);
        } else {
          throw new Error("L'IA n'a pas pu générer de recommandations pour cette adresse.");
        }
      } catch (err) {
        console.error("Gemini Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [address, analyse, cacheKey, city, title, description]);

  return (
    <div className="mt-8">
      <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 italic flex items-center gap-2">
        <FiMapPin size={10} />
        À proximité — Expertise Conciergerie IA
        {!loading && analyse && (
          <span className="ml-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-blue-50 text-blue-400 border border-blue-100">
            ✦ Premium
          </span>
        )}
        {!loading && (analyse || error) && (
          <button
            onClick={handleRefresh}
            className="ml-auto text-[8px] text-gray-300 hover:text-gray-500 italic transition-colors"
          >
            ↺ Actualiser
          </button>
        )}
      </h3>

      <div className="p-8 bg-gradient-to-br from-[#fafafa] to-[#fdfdfd] rounded-3xl border border-dashed border-gray-200 min-h-[100px]">
        {loading && (
          <div className="flex items-center gap-3 text-gray-400 text-[11px] italic">
            <FaSpinner className="animate-spin" size={13} />
            Conciergerie IA : Exploration des adresses prestigieuses...
          </div>
        )}

        {!loading && error && (
          <p className="text-[11px] text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 italic">
            {error}
          </p>
        )}

        {!loading && analyse && (
          <div className="space-y-6">
            {analyse
              .split("\n")
              .filter((l) => l.trim().length > 5)
              .slice(0, 5)
              .map((line, i) => (
                <div key={i} className="flex items-start gap-4">
                  <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                    {line.trim()}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Page principale ---- */
export default function HouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const houses = useSelector((state) => state.houses.data || []);
  const loading = useSelector((state) => state.houses.loading);

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  const house = houses.find((h) => String(h.id) === String(id));

  // ⏳ Chargement en cours
  if (loading && !house) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Chargement de la propriété…
        </p>
      </div>
    );
  }

  // ❌ Maison introuvable après chargement
  if (!loading && !house) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Propriété introuvable.
        </p>
        <button
          onClick={() => navigate("/maisons")}
          className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-800 transition"
        >
          Retour aux maisons
        </button>
      </div>
    );
  }

  if (!house) return null;

  const isReserved = house.status === "reserved";
  const extraImages = house.images?.slice(0, 4) || [];

  return (
    <div className="max-w-287.5 mx-auto px-6 py-10 bg-white text-slate-900 font-sans">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-sm">
              {house.type || "Propriété"}
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight italic">
              {house.address}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 leading-tight">
            {house.title}
          </h1>
        </div>

        <button className="p-2.5 rounded-full border border-gray-100 hover:shadow-sm transition-all group cursor-pointer">
          <FiHeart
            className="text-gray-300 group-hover:text-[#C3091C] group-hover:fill-[#C3091C] transition-colors"
            size={18}
          />
        </button>
      </div>

      {/* --- GALERIE --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-95 mb-12 overflow-hidden rounded-3xl">
        <div className="col-span-12 md:col-span-7 h-full overflow-hidden cursor-pointer">
          <img
            src={house.mainImage}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            alt="Principale"
          />
        </div>

        <div className="hidden md:grid md:col-span-5 grid-cols-2 gap-2">
          {extraImages.map((img, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-2xl cursor-pointer h-full">
              <img
                src={img}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                alt={`Détail ${idx}`}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* --- CONTENU --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* GAUCHE */}
        <div className="lg:col-span-7 flex flex-col space-y-12">

          {/* STATS */}
          <div className="flex justify-between items-center pb-8 border-b border-gray-100 px-2">
            <Stat icon={<FiMaximize />} label="Surface" value={`${house.surface} m²`} />
            <Stat icon={<FaBed />} label="Chambres" value={house.rooms} />
            <Stat icon={<FaBath />} label="Bains" value={house.bathrooms} />
          </div>

          {/* ÉQUIPEMENTS */}
          <div className="py-4 border-b border-gray-100">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Equip icon={<FiWifi />} label="Wifi haut débit" />
              <Equip icon={<FaCar />} label="Parking privé" />
              <Equip icon={<FiShield />} label="Conciergerie 24/7" />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <p className="text-[15px] text-gray-600 leading-relaxed text-justify">
              {house.description}
            </p>
          </div>

          {/* PROXIMITÉ IA */}
          <ProximiteSection
            address={house.address}
            city={house.city}
            title={house.title}
            description={house.description}
          />

        </div>

        {/* DROITE : RÉSERVATION */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-linear-to-br from-white to-[#f7f7f7] rounded-[2.5rem] p-10 border border-gray-100 shadow-xl space-y-8">

            <div className="text-center space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Prix par nuit
              </p>
              <span className="text-4xl font-black tracking-tighter">
                {house.price} <span className="text-sm text-gray-400">MAD</span>
              </span>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

            <button
              onClick={() => navigate(`/checkout/${house.id}`)}
              disabled={isReserved}
              className={`w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.35em] transition-all
                ${isReserved
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900 shadow-2xl hover:scale-[1.02]"
                }
              `}
            >
              {isReserved ? "Actuellement réservé" : "Réserver maintenant"}
            </button>

            {!isReserved && (
              <p className="text-center text-[9px] text-gray-400 italic tracking-wide">
                Aucun paiement immédiat • Confirmation rapide
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---- Small Components ---- */

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#C3091C]">
        {icon}
      </div>
      <div>
        <p className="text-[8px] font-bold text-gray-400 uppercase italic">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

function Equip({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-tight">
      <span className="text-[#C3091C]">{icon}</span> {label}
    </div>
  );
}