import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('order_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('order_history', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (order) => {
        const newOrder = {
            ...order,
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            timestamp: new Date().toISOString(),
            status: 'pending' // pending or collected
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const markAsCollected = (orderId) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: 'collected' } : order
        ));
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, markAsCollected }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders must be used within an OrderProvider');
    return context;
};
