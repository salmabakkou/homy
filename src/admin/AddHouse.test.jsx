import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddHouse from './AddHouse';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import housesReducer from '../store/housesSlice';

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    }
}));

const renderWithRedux = (component) => {
    const store = configureStore({
        reducer: {
            houses: housesReducer,
            wishlist: (state = { favorites: [] }) => state,
            reservations: (state = { data: [] }) => state,
        },
    });
    return render(<Provider store={store}>{component}</Provider>);
};

describe('Composant AddHouse', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche les messages d\'erreur quand on soumet un formulaire vide', () => {
        renderWithRedux(<AddHouse />);

        const submitBtn = screen.getByText(/ENREGISTRER LA PROPRIÉTÉ/i);
        fireEvent.click(submitBtn);

        // Vérifier les erreurs sur les champs obligatoires
        expect(screen.getByText(/Titre requis/i)).toBeInTheDocument();
        expect(screen.getByText(/Ville requise/i)).toBeInTheDocument();
        expect(screen.getByText(/Adresse requise/i)).toBeInTheDocument();
        expect(screen.getByText(/Prix requis/i)).toBeInTheDocument();
        expect(screen.getByText(/Surface requise/i)).toBeInTheDocument();
    });

    it('efface le message d\'erreur lors de la saisie', async () => {
        renderWithRedux(<AddHouse />);

        fireEvent.click(screen.getByText(/ENREGISTRER LA PROPRIÉTÉ/i));
        expect(screen.getByText(/Titre requis/i)).toBeInTheDocument();

        const titleInput = screen.getByLabelText(/Titre/i);
        fireEvent.change(titleInput, { target: { value: 'Nouvelle Villa', name: 'title' } });

        expect(screen.queryByText(/Titre requis/i)).not.toBeInTheDocument();
    });
});
