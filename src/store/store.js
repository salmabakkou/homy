import { configureStore } from '@reduxjs/toolkit';
import housesReducer from './housesSlice';
import reservationsReducer from './reservationsSlice';
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
  reducer: {
    houses: housesReducer,
    reservations: reservationsReducer,
    wishlist: wishlistReducer,
  },
});
