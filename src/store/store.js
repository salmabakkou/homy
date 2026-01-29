import { configureStore } from '@reduxjs/toolkit';
import housesReducer from './housesSlice';
import reservationsReducer from './reservationsSlice';

export const store = configureStore({
  reducer: {
    houses: housesReducer,
    reservations: reservationsReducer,
  },
});
