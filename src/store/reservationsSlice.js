import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

/* =========================
   THUNKS
========================= */

// GET
export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async () => {
    const res = await api.get('/reservations');
    return res.data;
  }
);

// POST (ADD RESERVATION)
export const addReservationThunk = createAsyncThunk(
  'reservations/addReservation',
  async (reservationData) => {
    const res = await api.post('/reservations', reservationData);
    return res.data;
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState: {
    data: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearReservationStatus: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addReservationThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReservationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
        state.success = 'Réservation confirmée';
      })
      .addCase(addReservationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearReservationStatus } = reservationsSlice.actions;
export default reservationsSlice.reducer;
