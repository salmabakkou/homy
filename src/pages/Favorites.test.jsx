import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FavoritesPage from './Favorites';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '../store/wishlistSlice';
import { BrowserRouter } from 'react-router-dom';

const renderWithRedux = (component, initialState) => {
    const store = configureStore({
        reducer: {
            wishlist: wishlistReducer,
            reservations: (state = { data: [] }) => state,
        },
        preloadedState: {
            wishlist: initialState,
            reservations: { data: [] }
        }
    });
    return render(
        <Provider store={store}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </Provider>
    );
};

describe('Page Favorites', () => {
    it('affiche un message si la liste est vide', () => {
        renderWithRedux(<FavoritesPage />, { favorites: [] });
        expect(screen.getByText(/Pas de favoris pour le moment/i)).toBeInTheDocument();
    });

    it('affiche les maisons en favoris', () => {
        const mockFavorites = [
            { id: 1, title: 'Villa Royale', city: 'Marrakech', price: 5000000, mainImage: 'img.jpg' }
        ];
        renderWithRedux(<FavoritesPage />, { favorites: mockFavorites });
        expect(screen.getByText(/Villa Royale/i)).toBeInTheDocument();
    });
});
