import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import MenuCard from '../components/menu/MenuCard';
import OrderDetails from '../components/menu/OrderDetails';
import CategoryToggle from '../components/menu/CategoryToggle';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import '../styles/menucss/MenuDashboard.css';
import { SHOP_MENUS } from '../data/mockData'; //  Dataset of shop menus


export default function MenuDashboard() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  // We use the ID from URL to get data, or fallback to default
  const currentShop = SHOP_MENUS[shopId] || SHOP_MENUS['default'];

  const [activeCategory, setActiveCategory] = useState('food');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Reset cart when shop changes (optional, keeps orders separate)
  useEffect(() => {
    setCart([]);
  }, [shopId]);

  const handleAddToCart = (id) => {
    const categoryItems = currentShop.menu[activeCategory];
    const itemToAdd = categoryItems.find(item => item.id === id);

    if (!itemToAdd) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...itemToAdd, qty: 1 }];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const handleRemove = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
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

          <CategoryToggle
            activeCategory={activeCategory}
            setCategory={setActiveCategory}
          />

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
            isMobile={window.innerWidth <= 768}
          />
        </aside>
      </main>

      {/* Mobile Floating Cart Button */}
      <button className="mobile-cart-fab" onClick={() => setIsCartOpen(true)}>
        <ShoppingBag />
        <span className="cart-count">{cart.reduce((a, b) => a + b.qty, 0)}</span>
      </button>
    </div>
  );
}