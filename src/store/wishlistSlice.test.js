import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { addFavorite, removeFavorite, clearWishlist } from './wishlistSlice';

describe('wishlistSlice reducer', () => {
    const initialState = {
        favorites: [],
    };

    beforeEach(() => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
        });
    });

    it('devrait retourner l\'état initial', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual({
            favorites: [],
        });
    });

    it('devrait ajouter un favori s\'il n\'existe pas', () => {
        const house = { id: 1, title: 'Villa Luxe' };
        const nextState = reducer(initialState, addFavorite(house));
        expect(nextState.favorites).toHaveLength(1);
        expect(nextState.favorites[0]).toEqual(house);
    });

    it('ne devrait pas ajouter un doublon', () => {
        const house = { id: 1, title: 'Villa Luxe' };
        const stateWithOne = { favorites: [house] };
        const nextState = reducer(stateWithOne, addFavorite(house));
        expect(nextState.favorites).toHaveLength(1);
    });

    it('devrait supprimer un favori', () => {
        const house = { id: 1, title: 'Villa Luxe' };
        const stateWithOne = { favorites: [house] };
        const nextState = reducer(stateWithOne, removeFavorite(1));
        expect(nextState.favorites).toHaveLength(0);
    });

    it('devrait vider la wishlist', () => {
        const stateWithItems = { favorites: [{ id: 1 }, { id: 2 }] };
        const nextState = reducer(stateWithItems, clearWishlist());
        expect(nextState.favorites).toHaveLength(0);
    });
});
