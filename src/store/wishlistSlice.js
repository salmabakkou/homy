import { createSlice } from '@reduxjs/toolkit';

const WISHLIST_KEY = 'homy_favorites';

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    return [];
  }
};

const initialState = {
  favorites: loadFavorites(),
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.find(h => h.id === action.payload.id)) {
        state.favorites.push(action.payload);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(h => h.id !== action.payload);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.favorites));
    }
  },
});

export const { addFavorite, removeFavorite } = wishlistSlice.actions;
export default wishlistSlice.reducer;
