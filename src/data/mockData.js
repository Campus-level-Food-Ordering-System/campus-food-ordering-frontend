// --- DASHBOARD DATA ---
export const SHOPS_LIST = [
  {
    vendorId: 1,
    name: 'Main Block Chat Coffee',
    location: 'Main Block, Ground Floor',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    description: 'Fresh coffee & snacks',
    rating: 4.5
  },
  {
    vendorId: 2,
    name: 'PG Block Chat Coffee',
    location: 'PG Block, 1st Floor',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    description: 'Delicious treats',
    rating: 4.2
  },
  {
    vendorId: 3,
    name: 'Parking Chat Coffee',
    location: 'Parking Area, Near Gate',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    description: 'Fresh coffee & snacks',
    rating: 4.8
  },
  {
    vendorId: 4,
    name: 'Hostel Chat Coffee',
    location: 'Hostel Complex, Block B',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    isOpen: false,
    description: 'Delicious treats',
    rating: 3.9
  }
];

// --- MENU DATA ---
export const SHOP_MENUS = {
  "1": {
    name: 'Main Block Chat Coffee',
    description: 'Fresh coffee & snacks',
    menu: {
      food: [
        { itemId: '101', name: 'Veg Burger', price: 4.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80', available: true, category: 'food', description: 'Classic veg patty with fresh lettuce' },
        { itemId: '102', name: 'Paneer Wrap', price: 5.50, image: 'https://images.unsplash.com/photo-1648682851403-149b1a5666f2?auto=format&fit=crop&w=300&q=80', available: true, category: 'food', description: 'Grilled paneer with crunchy veggies' },
      ],
      beverages: [
        { itemId: '103', name: 'Cold Coffee', price: 2.50, image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&w=300&q=80', available: true, category: 'beverages', description: 'Creamy cold brewed coffee' },
        { itemId: '104', name: 'Hot Masala Tea', price: 1.50, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80', available: true, category: 'beverages', description: 'Traditional spiced Indian tea' },
      ]
    }
  },
  "2": {
    name: 'PG Block Chat Coffee',
    description: 'Delicious treats & Puffs',
    menu: {
      food: [
        { itemId: 201, name: 'Egg Puff', price: 1.20, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80', available: true },
        { itemId: 202, name: 'Chicken Roll', price: 2.80, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=300&q=80', available: true },
      ],
      beverages: [
        { itemId: 203, name: 'Fresh Lime Soda', price: 1.80, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80', available: true },
      ]
    }
  },
  default: {
    name: 'Campus Shop',
    description: 'General Menu',
    menu: { food: [], beverages: [] }
  }
};