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
    <div className="min-h-screen bg-[#F9F9F9] p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-3xl font-black text-gray-900">
            Réservations
          </h1>
          <p className="text-gray-400 italic">
            Gestion des demandes clients
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-gray-400 italic">
            Chargement des réservations...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="py-20 text-center text-red-500">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && data.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic">
            Aucune réservation pour le moment
          </div>
        )}

        {/* TABLE */}
        {!loading && data.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

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
                {data.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* CLIENT */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <FiUser className="text-[#C3091C]" />
                        <div>
                          <p className="font-semibold">
                            {reservation.fullName}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FiMail />
                            {reservation.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* MAISON */}
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <FiHome className="text-gray-400" />
                        {reservation.houseTitle || "—"}
                      </div>
                    </td>

                    {/* DATES */}
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        {reservation.from} → {reservation.to}
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="p-5 font-bold">
                      {reservation.total} MAD
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  );
}
