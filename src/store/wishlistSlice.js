import { createSlice } from '@reduxjs/toolkit';

// Clé dynamique basée sur l'utilisateur connecté ou 'guest'
const getWishlistKey = () => {
  const email = localStorage.getItem("user_email");
  return email ? `homy_wishlist_${email}` : 'homy_wishlist_guest';
};

const loadFavorites = () => {
  try {
    const key = getWishlistKey();
    const saved = localStorage.getItem(key);
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
    // Action pour recharger la wishlist (après une connexion/déconnexion)
    syncWishlist: (state) => {
      state.favorites = loadFavorites();
    },
    addFavorite: (state, action) => {
      if (!state.favorites.find(h => h.id === action.payload.id)) {
        state.favorites.push(action.payload);
        localStorage.setItem(getWishlistKey(), JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(h => h.id !== action.payload);
      localStorage.setItem(getWishlistKey(), JSON.stringify(state.favorites));
    },
    clearWishlist: (state) => {
      state.favorites = [];
      localStorage.removeItem(getWishlistKey());
    }
  },
});

export const { addFavorite, removeFavorite, clearWishlist, syncWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
