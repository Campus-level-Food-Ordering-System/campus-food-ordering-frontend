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
        { id: 105, name: 'Chicken Puffs', price: 2.50, image: 'https://images.squarespace-cdn.com/content/v1/5ea3b22556f3d073f3d9cae4/3943fd05-6658-4ad2-ad3c-2d3109457bd4/IMG_7463.jpg' },
        { id: 106, name: 'Veg Samosa', price: 1.50, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80' },
        { id: 110, name: 'Parotta', price: 1.80, image: 'https://i0.wp.com/www.chitrasfoodbook.com/wp-content/uploads/2015/02/kerala-parotta.jpg?w=1200&ssl=1' },
      ],
      beverages: [
        { id: 103, name: 'Cold Coffee', price: 2.50, image: 'https://www.sharmispassions.com/wp-content/uploads/2020/02/iced-coffee-recipe.jpg' },
        { id: 104, name: 'Masala Tea', price: 1.50, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80' },
        { id: 107, name: 'Appy Fizz', price: 1.50, image: 'https://5.imimg.com/data5/LU/GQ/TR/SELLER-12622749/mango-juice.jpg' },
        { id: 108, name: 'O\'cean Electrolyte', price: 2.00, image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2025/7/31/b4b77497-7f15-414e-a76f-3362ba9423e6_15788_1.png' },
        { id: 109, name: 'Chocolate Milkshake', price: 3.00, image: 'https://www.sharmispassions.com/wp-content/uploads/2012/07/chocolate-milkshake1.jpg' },
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