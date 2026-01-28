import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import MenuCard from './menu/MenuCard';
import OrderDetails from './menu/OrderDetails';
import CategoryToggle from './menu/CategoryToggle';
import CheckoutSummary from './menu/CheckoutSummary';
import OrderSuccess from './menu/OrderSuccess';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import '../styles/menucss/MenuDashboard.css';
import { SHOP_MENUS } from '../data/mockData'; //  Dataset of shop menus
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';


export default function MenuDashboard() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const { addOrder } = useOrders();
    const { getCart, addToCart, updateQty, removeFromCart, clearCart } = useCart();

    // We use the ID from URL to get data, or fallback to default
    const currentShop = SHOP_MENUS[shopId] || SHOP_MENUS['default'];

    const [activeCategory, setActiveCategory] = useState('food');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastOrderDetails, setLastOrderDetails] = useState(null);

    const cart = getCart(shopId);

    const handleAddToCart = (id) => {
        const categoryItems = currentShop.menu[activeCategory];
        const itemToAdd = categoryItems.find(item => item.id === id);
        if (!itemToAdd) return;
        addToCart(shopId, itemToAdd);
    };

    const handleUpdateQty = (id, delta) => {
        updateQty(shopId, id, delta);
    };

    const handleRemove = (id) => {
        removeFromCart(shopId, id);
    };

    const handleCheckout = () => {
        if (cart.length > 0) {
            setShowCheckout(true);
            setIsCartOpen(false); // Close mobile cart sidebar if open
        }
    };

    const handleConfirmOrder = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const orderData = {
            cartItems: cart,
            total: total,
            shopName: currentShop.name,
            shopId: shopId
        };

        // Save to global history
        const savedOrder = addOrder(orderData);

        setLastOrderDetails(savedOrder);
        clearCart(shopId); // Clear only this shop's cart
        setShowCheckout(false);
        setShowSuccess(true);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setLastOrderDetails(null);
    };

    return (
        <div className="menu-dashboard-container">
            <NavBar />

            <main className="menu-layout">
                {/* Left Side: Menu Content */}
                <section className="menu-section">

                    {/* 3. DISPLAY SHOP NAME HEADER */}
                    <div className="shop-header-card">
                        <button className="gaaaa-back-btn" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft size={20} />
                        </button>
                        <div className="shop-header-info">
                            <h1>{currentShop.name}</h1>
                            <p>{currentShop.description}</p>
                        </div>
                    </div>

                    <div className="category-section" style={{ marginTop: '20px' }}>
                        <CategoryToggle
                            activeCategory={activeCategory}
                            setCategory={setActiveCategory}
                        />
                    </div>

                    <div className="menu-grid">
                        {/* Render items from the CURRENT shop */}
                        {currentShop.menu[activeCategory]?.length > 0 ? (
                            currentShop.menu[activeCategory].map(item => (
                                <MenuCard
                                    key={item.id}
                                    {...item}
                                    onAdd={handleAddToCart}
                                />
                            ))
                        ) : (
                            <div className="empty-category">No items available in this category.</div>
                        )}
                    </div>
                </section>

                {/* Right Side: Order Details */}
                <aside className={`order-sidebar ${isCartOpen ? 'open-mobile' : ''}`}>
                    <OrderDetails
                        cartItems={cart}
                        onUpdateQty={handleUpdateQty}
                        onRemove={handleRemove}
                        onClose={() => setIsCartOpen(false)}
                        onCheckout={handleCheckout}
                        isMobile={window.innerWidth <= 768}
                    />
                </aside>
            </main>

            {/* Checkout Overlay */}
            {showCheckout && (
                <CheckoutSummary
                    cartItems={cart}
                    shopName={currentShop.name}
                    onClose={() => setShowCheckout(false)}
                    onConfirm={handleConfirmOrder}
                />
            )}

            {/* Success Overlay */}
            {showSuccess && lastOrderDetails && (
                <OrderSuccess
                    orderDetails={lastOrderDetails}
                    shopName={currentShop.name}
                    onClose={handleCloseSuccess}
                />
            )}

            {/* Mobile Floating Cart Button */}
            <button className="mobile-cart-fab" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag />
                <span className="cart-count">{cart.reduce((a, b) => a + b.qty, 0)}</span>
            </button>
        </div>
    );
}
