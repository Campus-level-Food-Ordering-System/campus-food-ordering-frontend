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
import userService from '../../services/userService';

import '../../styles/menucss/MenuDashboard.css';

export default function MenuDashboard() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const { addOrder } = useOrders();
  const { getCart, addToCart, updateQty, removeFromCart, clearCart } = useCart();

  const [shopInfo, setShopInfo] = useState(null);
  const [shopMenu, setShopMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorRes, menuRes] = await Promise.all([
          userService.getVendors(),
          userService.getVendorMenu(shopId)
        ]);
        
        const vendors = vendorRes.data.data || [];
        const currentShop = vendors.find(s => s.vendorId.toString() === shopId);
        
        if (!currentShop || currentShop.isActive === false || currentShop.isOpen === false) {
          navigate('/dashboard', { replace: true });
          return;
        }

        setShopInfo(currentShop);
        setShopMenu(menuRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch menu data", error);
        navigate('/dashboard', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shopId, navigate]);

  const availableCategories = [{ id: 'all', label: 'All Items' }];
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const cart = getCart(shopId);

  const handleAddToCart = (clickedId) => {
    const itemToAdd = shopMenu.find(
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

  const handleConfirmOrder = async (pickupSlot) => {
    try {
      const orderRequest = {
        vendorId: parseInt(shopId),
        items: cart.map(item => ({
          itemId: item.itemId || item.id,
          quantity: item.qty
        })),
        pickupSlot
      };
      
      const resOrder = await userService.createOrder(orderRequest);
      const savedOrder = resOrder.data.data;

      // Now create payment for this order
      const resPayment = await userService.createPayment({ orderId: savedOrder.id });
      const paymentData = resPayment.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummykey",
        amount: paymentData.amount * 100,
        currency: "INR",
        name: "Campus Food",
        description: "Order Payment",
        order_id: paymentData.paymentId,
        handler: async function (response) {
          try {
            await userService.verifyPayment({
              orderId: savedOrder.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            // Payment successful, show success
            const localOrder = {
                ...savedOrder,
                cartItems: cart,
                shopName: shopInfo?.name,
                status: 'PAID'
            };
            
            addOrder(localOrder);
            setLastOrderDetails(localOrder);
            clearCart(shopId);
            setShowCheckout(false);
            setShowSuccess(true);
          } catch (verifyErr) {
            console.error("Payment verification failed", verifyErr);
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#ea580c"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
          alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error("Failed to create order or payment", err);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setLastOrderDetails(null);
  };

  const filteredItems = shopMenu
    .filter(item => item.available !== false)
    .filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return <div className="menu-dashboard-container"><NavBar /><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading menu...</div></div>;
  }

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

            <div className="shop-header-info" >
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
