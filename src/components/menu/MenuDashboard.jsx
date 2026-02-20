import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Search } from 'lucide-react';

import NavBar from '../user/NavBar';
import MenuCard from './MenuCard';
import OrderDetails from './OrderDetails';
import CategoryToggle from './CategoryToggle';
import CheckoutSummary from './CheckoutSummary';
import OrderSuccess from './OrderSuccess';

import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useMenu } from '../../context/MenuContext';

import '../../styles/menucss/MenuDashboard.css';

export default function MenuDashboard() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const { addOrder } = useOrders();
  const { getCart, addToCart, updateQty, removeFromCart, clearCart } = useCart();
  const { menus, shops } = useMenu();

  /* ==============================
     SHOP VALIDATION (OLD LOGIC)
  ============================== */
  useEffect(() => {
    const currentShop = shops.find(
      s => s.vendorId.toString() === shopId?.toString()
    );

    if (!currentShop || currentShop.isActive === false || currentShop.isOpen === false) {
      navigate('/dashboard', { replace: true });
    }
  }, [shops, shopId, navigate]);

  const sId = shopId?.toString();
  const shopInfo = shops.find(s => s.vendorId.toString() === sId) || shops[0];
  const shopMenu = menus[sId] || menus['default'] || { menu: {} };

  /* ==============================
     CATEGORY + SEARCH
  ============================== */
  const availableCategories = Object.keys(shopMenu.menu || {}).map(key => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  const [activeCategory, setActiveCategory] = useState(
    availableCategories[0]?.id || 'food'
  );
  const [searchQuery, setSearchQuery] = useState('');

  /* ==============================
     CART + UI STATES
  ============================== */
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const cart = getCart(shopId);

  /* ==============================
     HANDLERS
  ============================== */
  const handleAddToCart = (clickedId) => {
    const categoryItems = shopMenu.menu[activeCategory] || [];

    // Find the exact item using either id or itemId
    const itemToAdd = categoryItems.find(
      item =>
        (item.itemId && item.itemId.toString() === clickedId?.toString()) ||
        (item.id && item.id.toString() === clickedId?.toString())
    );

    if (itemToAdd) {
      const validCartItem = {
        ...itemToAdd,
        itemId: itemToAdd.itemId || itemToAdd.id
      };
      
      addToCart(shopId, validCartItem);
    }
  };

  const handleUpdateQty = (itemId, delta) => {
    updateQty(shopId, itemId, delta);
  };

  const handleRemove = itemId => {
    removeFromCart(shopId, itemId);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      setShowCheckout(true);
      setIsCartOpen(false);
    }
  };

  const handleConfirmOrder = pickupSlot => {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const orderData = {
      vendorId: parseInt(shopId),
      items: cart.map(item => ({
        itemId: item.itemId,
        quantity: item.qty
      })),
      pickupSlot,
      cartItems: cart,
      total,
      shopName: shopInfo?.name,
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

  /* ==============================
     FILTERED MENU
  ============================== */
  const filteredItems = (shopMenu.menu[activeCategory] || [])
    .filter(item => item.available !== false)
    .filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  /* ==============================
     UI
  ============================== */
  return (
    <div className="menu-dashboard-container">
      <NavBar />

      <main className={`menu-layout ${isCollapsed ? 'collapsed' : ''}`}>
        <section className="menu-section">
          {/* HEADER */}
          <div className="shop-header-card">
            <button
              className="back-btn"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={20} />
            </button>

            <div className="shop-header-info">
              <h1>{shopInfo?.name || 'Campus Shop'}</h1>
              <p>{shopInfo?.description || 'Delicious food available'}</p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <CategoryToggle
            activeCategory={activeCategory}
            setCategory={setActiveCategory}
            categories={availableCategories}
          />

          {/* MENU GRID */}
          <div className="menu-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <MenuCard
                  key={item.itemId || item.id}
                  id={item.itemId || item.id}       
                  itemId={item.itemId || item.id}  
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  category={activeCategory}
                  onAdd={handleAddToCart}
                />
              ))
            ) : (
              <div className="empty-category">
                {searchQuery
                  ? 'No items found matching your search.'
                  : 'No items available in this category.'}
              </div>
            )}
          </div>
        </section>

        {/* CART SIDEBAR */}
        <aside className={`order-sidebar ${isCartOpen ? 'open-mobile' : ''}`}>
          <OrderDetails
            cartItems={cart}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
            isMobile={window.innerWidth <= 768}
            shopName={shopInfo?.name}
            isCollapsed={isCollapsed}
            toggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </aside>
      </main>

      {/* CHECKOUT */}
      {showCheckout && (
        <CheckoutSummary
          cartItems={cart}
          shopName={shopInfo?.name}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleConfirmOrder}
        />
      )}

      {/* SUCCESS */}
      {showSuccess && lastOrderDetails && (
        <OrderSuccess
          orderDetails={lastOrderDetails}
          shopName={shopInfo?.name}
          onClose={handleCloseSuccess}
        />
      )}

      {/* MOBILE FAB */}
      <button
        className="mobile-cart-fab"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingBag />
        <span className="cart-count">
          {cart.reduce((a, b) => a + b.qty, 0)}
        </span>
      </button>
    </div>
  );
}
