import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import vendorService from '../../services/vendorService';
import '../../styles/vendorcss/VendorMenu.css';

export default function VendorMenu({ shopId }) {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'food',
        image: '🍽️',
    });

    const fetchMenu = async () => {
        try {
            const res = await vendorService.getMenu();
            setMenuItems(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch vendor menu", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddItem = async () => {
        try {
            const newItem = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                image: formData.image || '🍽️'
            };
            await vendorService.addMenuItem(newItem);
            fetchMenu();
            setFormData({ name: '', description: '', price: '', category: 'food', image: '🍽️' });
            setIsAddingItem(false);
        } catch (err) {
            console.error("Failed to add menu item", err);
            alert("Failed to add item.");
        }
    };

    const handleEditItem = async () => {
        try {
            const updatedData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                image: formData.image
            };
            await vendorService.updateMenuItem(editingItem.itemId || editingItem.id, updatedData);
            fetchMenu();
            setFormData({ name: '', description: '', price: '', category: 'food', image: '🍽️' });
            setEditingItem(null);
        } catch (err) {
            console.error("Failed to update menu item", err);
            alert("Failed to update item.");
        }
    };

    const handleDeleteItem = async (itemId) => {
        // We don't have delete API in vendor controller! Wait...
        // Let's just disable it if delete isn't available, or alert.
        alert("Deleting items is currently not supported by the backend API. Please toggle availability instead.");
    };

    const handleToggle = async (itemId, currentAvailability) => {
        try {
            await vendorService.toggleAvailability(itemId, { available: !currentAvailability });
            fetchMenu();
        } catch (err) {
            console.error("Failed to toggle availability", err);
            alert("Failed to toggle item availability.");
        }
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price ? item.price.toString() : '',
            category: item.category || 'food',
            image: item.image || '🍽️',
        });
        setIsAddingItem(false);
    };

    const cancelForm = () => {
        setIsAddingItem(false);
        setEditingItem(null);
        setFormData({ name: '', description: '', price: '', category: 'food', image: '🍽️' });
    };

    const isImageUrl = (url) => {
        return typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:image') || url.includes('.'));
    };

    if (loading) {
        return <div className="vendor_menu"><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading menu...</div></div>;
    }

    return (
        <div className="vendor_menu">
            <div className="menu_header">
                <h2>Menu Management</h2>
                <button
                    onClick={() => {
                        setIsAddingItem(true);
                        setEditingItem(null);
                    }}
                    className="add_item_btn"
                >
                    <Plus size={20} />
                    Add Item
                </button>
            </div>

            {(isAddingItem || editingItem) && (
                <div className="menu_form">
                    <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                    <div className="form_grid">
                        <div className="form_group">
                            <label>Item Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Burger"
                            />
                        </div>
                        <div className="form_group">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="150"
                            />
                        </div>
                        <div className="form_group full_width">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your item..."
                                rows="3"
                            />
                        </div>
                        <div className="form_group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange}>
                                <option value="food">Food</option>
                                <option value="beverages">Beverages</option>
                            </select>
                        </div>
                        <div className="form_group">
                            <label>Icon or Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="🍔 or https://..."
                            />
                        </div>
                    </div>
                    <div className="form_actions">
                        <button onClick={cancelForm} className="cancel_btn">
                            Cancel
                        </button>
                        <button
                            onClick={editingItem ? handleEditItem : handleAddItem}
                            className="save_btn"
                            disabled={!formData.name || !formData.price}
                        >
                            {editingItem ? 'Update Item' : 'Add Item'}
                        </button>
                    </div>
                </div>
            )}

            <div className="menu_grid">
                {menuItems.map((item) => (
                    <div key={item.id} className={`menu_item_card ${item.available === false ? 'unavailable' : ''}`}>
                        <div className="menu_item_header">
                            <div className="item_image_container">
                                {isImageUrl(item.image) ? (
                                    <img src={item.image} alt={item.name} className="item_img" />
                                ) : (
                                    <span className="item_icon">{item.image || '🍽️'}</span>
                                )}
                            </div>
                            <button
                                onClick={() => handleToggle(item.id, item.available)}
                                className="toggle_btn"
                                title={item.available !== false ? 'Disable item' : 'Enable item'}
                            >
                                {item.available !== false ? (
                                    <ToggleRight size={24} className="toggle_on" />
                                ) : (
                                    <ToggleLeft size={24} className="toggle_off" />
                                )}
                            </button>
                        </div>
                        <div className="menu_item_content">
                            <h3>{item.name}</h3>
                            <p className="item_description">
                                {item.description || "No description provided."}
                            </p>
                            <div className="item_meta">
                                <span className="item_category">{item.category || 'Food'}</span>
                                <span className="item_price">₹{item.price}</span>
                            </div>
                        </div>
                        <div className="menu_item_actions">
                            <button onClick={() => startEdit(item)} className="edit_btn">
                                <Edit2 size={16} />
                                Edit
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)} className="delete_btn">
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
