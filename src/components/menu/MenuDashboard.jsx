import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../user/NavBar';
import MenuCard from './MenuCard';
import OrderDetails from './OrderDetails';
import CategoryToggle from './CategoryToggle';
import CheckoutSummary from './CheckoutSummary';
import OrderSuccess from './OrderSuccess';
import { ShoppingBag, Search } from 'lucide-react';
import '../../styles/menucss/MenuDashboard.css';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useMenu } from '../../context/MenuContext';

export default function MenuDashboard() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const { addOrder } = useOrders();
    const { getCart, addToCart, updateQty, removeFromCart, clearCart } = useCart();
    const { menus, shops } = useMenu();

    // Check if shop exists, is active and open; redirect if unavailable
    useEffect(() => {
        const currentShop = shops.find(s => s.vendorId.toString() === shopId.toString());

        // If shop is not found (deleted), inactive (disabled by admin),
        // or closed by vendor, send the user back to dashboard
        if (!currentShop || currentShop.isActive === false || currentShop.isOpen === false) {
            navigate('/dashboard', { replace: true });
        }
    }, [shops, shopId, navigate]);

    const sId = shopId.toString();
    const shopInfo = shops.find(s => s.vendorId.toString() === sId) || shops[0];
    const shopMenu = menus[sId] || menus['default'];

    const availableCategories = Object.keys(shopMenu.menu || {}).map(key => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1)
    }));

    const [activeCategory, setActiveCategory] = useState(availableCategories[0]?.id || 'food');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastOrderDetails, setLastOrderDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const cart = getCart(shopId);

    const handleAddToCart = (itemId) => {
        const categoryItems = shopMenu.menu[activeCategory] || [];
        const itemToAdd = categoryItems.find(item =>
            (item.itemId === itemId || item.itemId?.toString() === itemId?.toString())
        );
        if (!itemToAdd) return;
        addToCart(shopId, itemToAdd);
    };

    const handleUpdateQty = (itemId, delta) => {
        updateQty(shopId, itemId, delta);
    };

    const handleRemove = (itemId) => {
        removeFromCart(shopId, itemId);
    };

    const handleCheckout = () => {
        if (cart.length > 0) {
            setShowCheckout(true);
            setIsCartOpen(false);
        }
    };

    const handleConfirmOrder = (pickupSlot) => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const orderData = {
            vendorId: parseInt(shopId),
            items: cart.map(item => ({
                itemId: item.itemId,
                quantity: item.qty
            })),
            pickupSlot: pickupSlot,
            cartItems: cart,
            total: total,
            shopName: shopInfo.name,
            status: 'PAID'
        };

        const savedOrder = addOrder(orderData);

        setLastOrderDetails(savedOrder);
        clearCart(shopId);
        setShowCheckout(false);
        setShowSuccess(true);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setLastOrderDetails(null);
    };

    const getFilteredItems = () => {
        const categoryItems = (shopMenu.menu[activeCategory] || []).filter(item => item.available !== false);
        if (!searchQuery.trim()) return categoryItems;

        return categoryItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredItems = getFilteredItems();

    return (
        <div className="menu_dashboard_container">
            <NavBar />

            <div className={`menu_layout ${isSidebarCollapsed ? 'sidebar_is_collapsed' : 'sidebar_is_expanded'}`}>
                <main className="main_content">
                    <header className="header_section">
                        <div>
                            <h1>Welcome to {shopInfo.name}</h1>
                            <p>Choose the category</p>
                        </div>

                        <div className="search_bar">
                            <Search className="text_gray_400" size={20} />
                            <input
                                type="text"
                                placeholder="Spicy Pizza"
                                className="search_input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </header>

                    <div className="category_section">
                        <CategoryToggle
                            activeCategory={activeCategory}
                            setCategory={setActiveCategory}
                            categories={availableCategories}
                        />
                    </div>

                    <div className="section_title_row">
                        <h2 className="section_title">Choose your {activeCategory}</h2>
                    </div>

                    <div className="menu_grid">
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <MenuCard
                                    key={item.itemId}
                                    {...item}
                                    onAdd={handleAddToCart}
                                />
                            ))
                        ) : (
                            <div className="empty_category">
                                {searchQuery ? 'No items found matching your search.' : 'No items available in this category.'}
                            </div>
                        )}
                    </div>
                </main>

                <aside className={`right_sidebar_wrapper ${isCartOpen ? 'open_mobile' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <OrderDetails
                        cartItems={cart}
                        onUpdateQty={handleUpdateQty}
                        onRemove={handleRemove}
                        onClose={() => setIsCartOpen(false)}
                        onCheckout={handleCheckout}
                        isMobile={window.innerWidth <= 768}
                        shopName={shopInfo.name}
                        isCollapsed={isSidebarCollapsed}
                        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    />
                </aside>
            </div>

            {showCheckout && (
                <CheckoutSummary
                    cartItems={cart}
                    shopName={shopInfo.name}
                    onClose={() => setShowCheckout(false)}
                    onConfirm={handleConfirmOrder}
                />
            )}

            {showSuccess && lastOrderDetails && (
                <OrderSuccess
                    orderDetails={lastOrderDetails}
                    shopName={shopInfo.name}
                    onClose={handleCloseSuccess}
                />
            )}

            <button className="mobile_cart_fab" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag size={24} />
                <span className="cart_count">{cart.reduce((a, b) => a + b.qty, 0)}</span>
            </button>
        </div>
    );
}
