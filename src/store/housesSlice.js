import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

/* =========================
   THUNKS (API CALLS)
========================= */

// GET
export const fetchHouses = createAsyncThunk(
  'houses/fetchHouses',
  async () => {
    const res = await api.get('/houses');
    return res.data;
  }
);

// POST (ADD)
export const addHouseThunk = createAsyncThunk(
  'houses/addHouse',
  async (houseData) => {
    const res = await api.post('/houses', houseData);
    return res.data;
  }
);

// PUT (EDIT)
export const updateHouseThunk = createAsyncThunk(
  'houses/updateHouse',
  async ({ id, houseData }) => {
    const res = await api.put(`/houses/${id}`, houseData);
    return res.data;
  }
);

// DELETE
export const deleteHouseThunk = createAsyncThunk(
  'houses/deleteHouse',
  async (id) => {
    await api.delete(`/houses/${id}`);
    return id;
  }
);

/* =========================
   SLICE
========================= */

const housesSlice = createSlice({
  name: 'houses',
  initialState: {
    data: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchHouses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHouses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addHouseThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addHouseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
        state.success = 'Maison ajoutée avec succès';
      })
      .addCase(addHouseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // UPDATE
      .addCase(updateHouseThunk.fulfilled, (state, action) => {
        state.data = state.data.map((house) =>
          house.id === action.payload.id ? action.payload : house
        );
        state.success = 'Maison modifiée avec succès';
      })

      // DELETE
      .addCase(deleteHouseThunk.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (house) => house.id !== action.payload
        );
        state.success = 'Maison supprimée avec succès';
      });
  },
});

export const { clearStatus } = housesSlice.actions;
export default housesSlice.reducer;
