import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import '../../styles/vendorcss/VendorMenu.css';
import { useMenu } from '../../context/MenuContext';

export default function VendorMenu({ shopId }) {
    const { menus, addMenuItem, updateMenuItem, removeMenuItem, toggleAvailability } = useMenu();

    // Combine food and beverages for the vendor's view
    const shopData = menus[shopId] || menus[shopId?.toString()] || menus['default'];
    const menuItems = [...(shopData.menu?.food || []), ...(shopData.menu?.beverages || [])];

    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'food',
        image: '🍽️',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddItem = () => {
        const newItem = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            available: true,
            image: formData.image || '🍽️'
        };
        addMenuItem(shopId, formData.category, newItem);
        setFormData({ name: '', description: '', price: '', category: 'food', image: '🍽️' });
        setIsAddingItem(false);
    };

    const handleEditItem = () => {
        const updatedData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.image
        };
        updateMenuItem(shopId, editingItem.itemId, updatedData);
        setFormData({ name: '', description: '', price: '', category: 'food', image: '🍽️' });
        setEditingItem(null);
    };

    const handleDeleteItem = (itemId) => {
        removeMenuItem(shopId, itemId);
    };

    const handleToggle = (itemId) => {
        toggleAvailability(shopId, itemId);
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category || 'food',
            image: item.image,
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
                    <div key={item.itemId} className={`menu_item_card ${item.available === false ? 'unavailable' : ''}`}>
                        <div className="menu_item_header">
                            <div className="item_image_container">
                                {isImageUrl(item.image) ? (
                                    <img src={item.image} alt={item.name} className="item_img" />
                                ) : (
                                    <span className="item_icon">{item.image}</span>
                                )}
                            </div>
                            <button
                                onClick={() => handleToggle(item.itemId)}
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
                                <span className="item_category">{item.category}</span>
                                <span className="item_price">₹{item.price}</span>
                            </div>
                        </div>
                        <div className="menu_item_actions">
                            <button onClick={() => startEdit(item)} className="edit_btn">
                                <Edit2 size={16} />
                                Edit
                            </button>
                            <button onClick={() => handleDeleteItem(item.itemId)} className="delete_btn">
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
