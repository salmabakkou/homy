import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiMaximize,
  FiHeart,
  FiWifi,
  FiShield,
} from "react-icons/fi";
import { FaBed, FaBath, FaCar } from "react-icons/fa";

export default function HouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const houses = useSelector((state) => state.houses.data || []);
  const house = houses.find((h) => String(h.id) === String(id));

  if (!house)
    return (
      <div className="text-center py-20 font-sans tracking-widest text-gray-400 uppercase text-[10px]">
        Chargement...
      </div>
    );

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
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl cursor-pointer h-full"
            >
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

          {/* PROXIMITÉ */}
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 italic">
              À proximité
            </h3>
            <div className="p-8 bg-[#fafafa] rounded-3xl border border-dashed border-gray-200">
              <p className="text-[11px] text-gray-400 italic font-medium">
                [ Analyse des environs par IA ]
              </p>
            </div>
          </div>
        </div>

        {/* DROITE : RÉSERVATION PREMIUM */}
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
                ${
                  isReserved
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
        <p className="text-[8px] font-bold text-gray-400 uppercase italic">
          {label}
        </p>
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
