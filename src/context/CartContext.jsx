import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Structure: { shopId1: [items], shopId2: [items] }
    const [carts, setCarts] = useState(() => {
        const saved = localStorage.getItem('active_carts');
        const lastActivity = localStorage.getItem('cart_last_activity');

        if (saved && lastActivity) {
            const now = Date.now();
            const threeHoursInMs = 3 * 60 * 60 * 1000;

            if (now - parseInt(lastActivity) > threeHoursInMs) {
                localStorage.removeItem('active_carts');
                localStorage.removeItem('cart_last_activity');
                return {};
            }
            return JSON.parse(saved);
        }
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('active_carts', JSON.stringify(carts));
        // Update timestamp whenever cart changes
        localStorage.setItem('cart_last_activity', Date.now().toString());
    }, [carts]);

    const getCart = (shopId) => carts[shopId] || [];

    const addToCart = (shopId, itemToAdd) => {
        setCarts(prev => {
            const shopCart = prev[shopId] || [];
            const existing = shopCart.find(item => item.id === itemToAdd.id);

            let newCart;
            if (existing) {
                newCart = shopCart.map(item =>
                    item.id === itemToAdd.id ? { ...item, qty: item.qty + 1 } : item
                );
            } else {
                newCart = [...shopCart, { ...itemToAdd, qty: 1 }];
            }

            return { ...prev, [shopId]: newCart };
        });
    };

    const updateQty = (shopId, itemId, delta) => {
        setCarts(prev => {
            const shopCart = prev[shopId] || [];
            const newCart = shopCart.map(item =>
                item.id === itemId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
            );
            return { ...prev, [shopId]: newCart };
        });
    };

    const removeFromCart = (shopId, itemId) => {
        setCarts(prev => {
            const shopCart = prev[shopId] || [];
            const newCart = shopCart.filter(item => item.id !== itemId);
            return { ...prev, [shopId]: newCart };
        });
    };

    const clearCart = (shopId) => {
        setCarts(prev => {
            const { [shopId]: removed, ...rest } = prev;
            return rest;
        });
    };

    return (
        <CartContext.Provider value={{ getCart, addToCart, updateQty, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
