import React, { createContext, useContext, useState, useEffect } from 'react';
import { SHOP_MENUS, SHOPS_LIST } from '../data/mockData';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menus, setMenus] = useState(() => {
        const saved = localStorage.getItem('shop_menus');
        let initialMenus = saved ? JSON.parse(saved) : SHOP_MENUS;

        // Migration/Cleanup: If Shop 1 has 4 Veg Burgers (testing leftovers), reset it
        const shop1 = initialMenus["1"];
        if (shop1 && shop1.menu.food.filter(i => i.name === 'Veg Burger').length > 1) {
            initialMenus["1"] = SHOP_MENUS["1"];
        }

        // Migration: Ensure all keys are strings
        const normalized = {};
        Object.keys(initialMenus).forEach(key => {
            normalized[key.toString()] = initialMenus[key];
        });
        return normalized;
    });

    const [shops, setShops] = useState(() => {
        const saved = localStorage.getItem('shops_list');
        const initialShops = saved ? JSON.parse(saved) : SHOPS_LIST;
        // Data Migration/Healing: Ensure vendorId, isActive, and isOpen exist
        return initialShops.map(shop => ({
            ...shop,
            vendorId: (shop.vendorId || shop.id)?.toString(),
            isActive: shop.isActive !== undefined ? shop.isActive : true,
            isOpen: shop.isOpen !== undefined ? shop.isOpen : false
        }));
    });

    useEffect(() => {
        localStorage.setItem('shop_menus', JSON.stringify(menus));
    }, [menus]);

    useEffect(() => {
        localStorage.setItem('shops_list', JSON.stringify(shops));
    }, [shops]);

    // Cross-tab Synchronization
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'shop_menus' && e.newValue) {
                setMenus(JSON.parse(e.newValue));
            }
            if (e.key === 'shops_list' && e.newValue) {
                setShops(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateShopProfile = (shopId, updatedData) => {
        const sId = shopId.toString();
        setShops(prev => prev.map(shop => {
            if (shop.vendorId.toString() === sId || shop.id?.toString() === sId) {
                const newState = { ...shop, ...updatedData };
                // If deactivated by admin, force closed
                if (updatedData.isActive === false) {
                    newState.isOpen = false;
                }
                return newState;
            }
            return shop;
        }));

        if (updatedData.description || updatedData.name) {
            setMenus(prev => {
                const shopData = prev[sId] || prev['default'];
                return {
                    ...prev,
                    [sId]: {
                        ...shopData,
                        name: updatedData.name || shopData.name,
                        description: updatedData.description || shopData.description
                    }
                };
            });
        }
    };

    const updateMenuItem = (shopId, itemId, updatedData) => {
        const sId = shopId.toString();
        setMenus(prev => {
            const shopData = prev[sId] || prev['default'];
            const { category: newCategory } = updatedData;

            // Deep clone to avoid mutations
            let newMenu = {
                food: [...(shopData.menu.food || [])],
                beverages: [...(shopData.menu.beverages || [])]
            };

            // Find the item and its current category
            let currentCategory = null;
            let itemIndex = -1;

            if ((itemIndex = newMenu.food.findIndex(i => i.itemId.toString() === itemId.toString())) !== -1) {
                currentCategory = 'food';
            } else if ((itemIndex = newMenu.beverages.findIndex(i => i.itemId.toString() === itemId.toString())) !== -1) {
                currentCategory = 'beverages';
            }

            if (itemIndex === -1) return prev; // Not found

            const item = newMenu[currentCategory][itemIndex];
            const updatedItem = { ...item, ...updatedData };

            // Handle Category Change
            if (newCategory && newCategory !== currentCategory) {
                // Remove from old
                newMenu[currentCategory].splice(itemIndex, 1);
                // Add to new
                newMenu[newCategory].push(updatedItem);
            } else {
                // Just update in place
                newMenu[currentCategory][itemIndex] = updatedItem;
            }

            return {
                ...prev,
                [sId]: {
                    ...shopData,
                    menu: newMenu
                }
            };
        });
    };

    const addMenuItem = (shopId, category, newItem) => {
        const sId = shopId.toString();
        setMenus(prev => {
            const shopData = prev[sId] || prev['default'];
            const itemWithId = {
                ...newItem,
                itemId: Math.floor(Math.random() * 10000)
            };

            return {
                ...prev,
                [sId]: {
                    ...shopData,
                    menu: {
                        ...shopData.menu,
                        [category]: [...(shopData.menu[category] || []), itemWithId]
                    }
                }
            };
        });
    };

    const removeMenuItem = (shopId, itemId) => {
        const sId = shopId.toString();
        setMenus(prev => {
            const shopData = prev[sId] || prev['default'];
            const filterOut = (list) => (list || []).filter(item =>
                (item.itemId.toString() !== itemId.toString())
            );

            return {
                ...prev,
                [sId]: {
                    ...shopData,
                    menu: {
                        food: filterOut(shopData.menu.food),
                        beverages: filterOut(shopData.menu.beverages)
                    }
                }
            };
        });
    };

    const toggleAvailability = (shopId, itemId) => {
        const sId = shopId.toString();
        setMenus(prev => {
            const shopData = prev[sId] || prev['default'];
            const findAndToggle = (list) => (list || []).map(item =>
                (item.itemId.toString() === itemId.toString())
                    ? { ...item, available: item.available === false ? true : false }
                    : item
            );

            return {
                ...prev,
                [sId]: {
                    ...shopData,
                    menu: {
                        food: findAndToggle(shopData.menu.food),
                        beverages: findAndToggle(shopData.menu.beverages)
                    }
                }
            };
        });
    };

    const addVendor = (vendorData) => {
        const newId = (shops.length > 0 ? Math.max(...shops.map(s => parseInt(s.vendorId))) + 1 : 1).toString();

        // 1. Add to Shops List
        const newShop = {
            id: newId,
            vendorId: newId,
            name: vendorData.name,
            location: vendorData.location || 'Campus Center',
            rating: 0,
            image: vendorData.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',
            isActive: true,
            isOpen: false,
            isNew: true
        };
        setShops(prev => [...prev, newShop]);

        // 2. Initialize Empty Menu
        setMenus(prev => ({
            ...prev,
            [newId]: {
                name: vendorData.name,
                description: 'New shop on the platform',
                menu: { food: [], beverages: [] }
            }
        }));

        // 3. Generate Credentials & Store for Login Simulation
        const generatedEmail = `${vendorData.name.toLowerCase().replace(/\s+/g, '')}@campuseats.com`;
        const generatedPassword = `Pass@${Math.floor(1000 + Math.random() * 9000)}`;

        const accounts = JSON.parse(localStorage.getItem('vendor_accounts') || '{}');
        accounts[newId] = {
            email: generatedEmail,
            password: generatedPassword,
            name: vendorData.name
        };
        localStorage.setItem('vendor_accounts', JSON.stringify(accounts));

        return { email: generatedEmail, password: generatedPassword };
    };

    const getVendorCredentials = (vendorId) => {
        const accounts = JSON.parse(localStorage.getItem('vendor_accounts') || '{}');
        return accounts[vendorId.toString()];
    };

    const toggleShopStatus = (shopId) => {
        const sId = shopId.toString();
        setShops(prev => prev.map(shop =>
            (shop.vendorId.toString() === sId || shop.id?.toString() === sId)
                ? { ...shop, isOpen: shop.isActive ? !shop.isOpen : false }
                : shop
        ));
    };

    const deleteVendor = (shopId) => {
        const sId = shopId.toString();

        // Remove from shops
        setShops(prev => prev.filter(s => s.vendorId.toString() !== sId));

        // Remove from menus
        setMenus(prev => {
            const newMenus = { ...prev };
            delete newMenus[sId];
            return newMenus;
        });

        // Cleanup credentials (informational, since we don't have lookup by ID easily here)
        const accounts = JSON.parse(localStorage.getItem('vendor_accounts') || '{}');
        Object.keys(accounts).forEach(email => {
            if (accounts[email].vendorId.toString() === sId) {
                delete accounts[email];
            }
        });
        localStorage.setItem('vendor_accounts', JSON.stringify(accounts));
    };

    return (
        <MenuContext.Provider value={{
            menus,
            shops,
            updateShopProfile,
            updateMenuItem,
            addMenuItem,
            removeMenuItem,
            toggleAvailability,
            addVendor,
            deleteVendor,
            toggleShopStatus,
            getVendorCredentials
        }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) throw new Error('useMenu must be used within a MenuProvider');
    return context;
};
