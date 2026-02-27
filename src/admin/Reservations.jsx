import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservations } from "../store/reservationsSlice";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  FiCalendar,
  FiUser,
  FiHome,
  FiMail,
} from "react-icons/fi";

export default function Reservations() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.reservations
  );

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#FDFCF9] p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#C3091C] leading-tight uppercase tracking-tight">
            Réservations
          </h1>
          <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mt-3 font-bold uppercase tracking-[0.4em] text-[10px]">
            Suivi et gestion des requêtes clients
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C3091C] mb-4"></div>
            <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
              Chargement en cours...
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center py-32 text-[#C3091C] font-bold uppercase tracking-[0.4em] text-[10px]">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
              Aucune réservation pour le moment
            </div>
          </div>
        )}

        {/* LIST / TABLE */}
        {!loading && data.length > 0 && (
          <div className="pb-10">
            {/* Vue mobile & tablette (Cartes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
              {[...data].reverse().map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                      <FiUser className="text-[#C3091C]" />
                    </div>
                    <div>
                      <p className="font-bold text-[13px]">{reservation.fullName}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 lowercase tracking-normal">
                        <FiMail size={10} /> {reservation.email?.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">Maison</span>
                      <span className="font-semibold text-gray-700 text-right">{reservation.houseTitle || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">Dates</span>
                      <span className="font-semibold text-gray-700">{reservation.from} au {reservation.to}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">Total</span>
                      <span className="text-[#C3091C] font-black">{reservation.total} MAD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vue Desktop (Tableau) */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-widest">
                  <tr>
                    <th className="p-5 text-left">Client</th>
                    <th className="p-5 text-left">Maison</th>
                    <th className="p-5 text-left">Dates</th>
                    <th className="p-5 text-left">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {[...data].reverse().map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <FiUser className="text-[#C3091C]" />
                          <div>
                            <p className="font-semibold text-[13px]">{reservation.fullName}</p>
                            <p className="text-[11px] text-gray-400 flex items-center gap-1 lowercase tracking-normal">
                              <FiMail /> {reservation.email?.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-[13px]">
                          <FiHome className="text-gray-400" />
                          {reservation.houseTitle || "—"}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCalendar className="text-gray-400" />
                          {reservation.from} → {reservation.to}
                        </div>
                      </td>
                      <td className="p-5 font-bold text-[#C3091C]">
                        {reservation.total} MAD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
