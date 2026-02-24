import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchHouses } from "../store/housesSlice";
import { FiMapPin } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

/* =========================================
   SECTION PROXIMITÉ IA (ROBUSTE)
========================================= */

function ProximiteSection({ address, city }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheKey = `ai_proximity_${address}`;

  useEffect(() => {
    if (!address) return;

    // 🔹 Vérifier cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setData(JSON.parse(cached));
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    const prompt = `
Tu es un expert local au Maroc.

Localisation : "${address}${city ? `, ${city}` : ""}".

Retourne UNIQUEMENT un JSON valide :

{
  "categories": [
    {
      "title": "Nom catégorie",
      "items": [
        {
          "name": "Nom réel",
          "distance": "X km",
          "description": "Description courte utile"
        }
      ]
    }
  ]
}
`;

const fetchAI = async () => {
  if (loading) return; // 🔥 empêche double appel

  setLoading(true);
  setError(null);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1500
          }
        })
      }
    );

    // 🔥 GESTION SPÉCIALE 429
    if (res.status === 429) {
      throw new Error("Quota dépassé. Réessayez dans quelques minutes.");
    }

    if (!res.ok) {
      throw new Error(`Erreur API (${res.status})`);
    }

    const result = await res.json();

    const text =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Réponse vide");
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");

    if (first === -1 || last === -1) {
      throw new Error("Format JSON invalide");
    }

    const jsonString = cleaned.slice(first, last + 1);

    let parsed;

    try {
      parsed = JSON.parse(jsonString);
    } catch {
      throw new Error("JSON cassé par l'IA");
    }

    setData(parsed);
    localStorage.setItem(cacheKey, JSON.stringify(parsed));

  } catch (err) {
    console.error(err);

    setError(
      err.message.includes("Quota")
        ? err.message
        : "Impossible de générer les bons plans."
    );
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

      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
        {loading && (
          <div className="flex items-center gap-3 text-gray-400">
            <FaSpinner className="animate-spin" />
            Analyse des environs...
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {data?.categories?.map((category, i) => (
          <div key={i} className="mb-10">
            <h4 className="font-bold text-xs uppercase text-gray-600 mb-4">
              {category.title}
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              {category.items?.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-sm">
                      {item.name}
                    </p>
                    <span className="text-xs text-red-600 font-bold">
                      {item.distance}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================
   PAGE PRINCIPALE
========================================= */

export default function HouseDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const houses = useSelector((state) => state.houses.data || []);
  const loading = useSelector((state) => state.houses.loading);

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  const house = houses.find((h) => String(h.id) === String(id));

  if (loading && !house) return <p>Chargement...</p>;
  if (!house) return <p>Maison introuvable</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-2">
        {house.title}
      </h1>

      <p className="text-gray-500 mb-6">
        {house.address}
      </p>

      <img
        src={house.mainImage}
        alt="house"
        className="w-full h-96 object-cover rounded-3xl mb-10"
      />

      <p className="text-gray-600 mb-10">
        {house.description}
      </p>

      <ProximiteSection
        address={house.address}
        city={house.city}
      />

      <div className="mt-12">
        <button
          onClick={() => navigate(`/checkout/${house.id}`)}
          className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:opacity-90"
        >
          Réserver maintenant
        </button>
      </div>
    </div>
  );
}