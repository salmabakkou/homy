import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [], // <-- important, sinon undefined
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.find(h => h.id === action.payload.id)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(h => h.id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = wishlistSlice.actions;
export default wishlistSlice.reducer;
