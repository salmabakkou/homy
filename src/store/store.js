import { configureStore } from '@reduxjs/toolkit';
import housesReducer from './housesSlice';

export const store = configureStore({
  reducer: {
    houses: housesReducer,
  },
});
