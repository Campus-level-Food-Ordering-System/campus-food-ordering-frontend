// --- DASHBOARD DATA ---
export const SHOPS_LIST = [
  { 
    id: 1, 
    name: 'Main Block Chat Coffee', 
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80', 
    isOpen: true,
    description: 'Fresh coffee & snacks',
    rating: 4.5
  },
  { 
    id: 2, 
    name: 'PG Block Chat Coffee', 
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    description: 'Delicious treats',
    rating: 4.2
  },
  { 
    id: 3, 
    name: 'Parking Chat Coffee', 
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80', 
    isOpen: true,
    description: 'Fresh coffee & snacks',
    rating: 4.8
  },
  { 
    id: 4, 
    name: 'Hostel Chat Coffee', 
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    isOpen: false,
    description: 'Delicious treats',
    rating: 3.9
  }
];

// --- MENU DATA ---
export const SHOP_MENUS = {
  1: {
    name: 'Main Block Chat Coffee',
    description: 'Fresh coffee & snacks',
    menu: {
      food: [
        { id: 101, name: 'Veg Burger', price: 4.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
        { id: 102, name: 'Cheese Sandwich', price: 3.50, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80' },
      ],
      beverages: [
        { id: 103, name: 'Cold Coffee', price: 2.50, image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&w=300&q=80' },
        { id: 104, name: 'Masala Tea', price: 1.50, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80' },
      ]
    }
  },
  2: {
    name: 'PG Block Chat Coffee',
    description: 'Delicious treats & Puffs',
    menu: {
      food: [
        { id: 201, name: 'Egg Puff', price: 1.20, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80' },
        { id: 202, name: 'Chicken Roll', price: 2.80, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=300&q=80' },
      ],
      beverages: [
        { id: 203, name: 'Fresh Lime Soda', price: 1.80, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80' },
      ]
    }
  },
  // Default fallback for IDs 3, 4, etc.
  default: {
    name: 'Campus Shop',
    description: 'General Menu',
    menu: { food: [], beverages: [] }
  }
};