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

    // Cross-tab Synchronization
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'order_history' && e.newValue) {
                setOrders(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addOrder = (order) => {
        const newOrder = {
            ...order,
            orderId: Math.floor(5000 + Math.random() * 1000), // Match vendor ID style
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            timestamp: new Date().toISOString(),
            status: 'PAID', // In MVP, we skip CREATED and go to PAID for demo
            vendorId: (order.vendorId || order.shopId)?.toString(),
            customerName: order.customerName || 'Student User'
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            (order.orderId === orderId || order.id === orderId)
                ? { ...order, status: newStatus }
                : order
        ));
    };

    const markAsCollected = (orderId) => {
        updateOrderStatus(orderId, 'COMPLETED');
    };

    const emergencyCancelOrder = (orderId, reason) => {
        setOrders(prev => prev.map(order =>
            (order.orderId === orderId || order.id === orderId)
                ? { ...order, status: 'CANCELLED', cancelReason: reason, cancelledBy: 'ADMIN', cancelledAt: new Date().toISOString() }
                : order
        ));
    };

    const cancelOrder = (orderId, reason = 'Cancelled by user') => {
        setOrders(prev => prev.map(order =>
            (order.orderId === orderId || order.id === orderId)
                ? { ...order, status: 'CANCELLED', cancelReason: reason, cancelledBy: 'USER', cancelledAt: new Date().toISOString() }
                : order
        ));
    };

    return (
        <OrderContext.Provider value={{
            orders,
            addOrder,
            updateOrderStatus,
            markAsCollected,
            emergencyCancelOrder,
            cancelOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders must be used within an OrderProvider');
    return context;
};
