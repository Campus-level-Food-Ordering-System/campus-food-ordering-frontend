import React, { useState, useEffect } from 'react';
import { Store, Mail, Phone, MapPin, Clock, Edit2, Save } from 'lucide-react';
import '../../styles/vendorcss/VendorProfile.css';

export default function VendorProfile({ shopId, profile }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        shopName: '',
        email: 'vendor@campuseats.com',
        phone: '+91 98765 43210',
        address: 'Main Campus Building, Ground Floor',
        openingTime: '08:00 AM',
        closingTime: '08:00 PM',
        description: 'Serving delicious and hygienic food to students and staff.',
    });

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                shopName: profile.vendorName || 'CampusEats Vendor',
            }));
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Backend doesn't support updating profile fields yet
        alert("Updating profile details is not fully supported by the backend yet.");
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                shopName: profile.vendorName || 'CampusEats Vendor',
            }));
        }
        setIsEditing(false);
    };

    return (
        <div className="vendor_profile">
            <div className="profile_header">
                <div className="profile_title">
                    <h2>Vendor Profile</h2>
                    <p>Manage your shop information</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="edit_profile_btn">
                        <Edit2 size={18} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="edit_actions">
                        <button onClick={handleCancel} className="cancel_btn">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="save_btn">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="profile_content">
                <div className="profile_card">
                    <div className="profile_icon">
                        <Store size={48} />
                    </div>

                    <div className="profile_fields">
                        <div className="profile_field">
                            <label>
                                <Store size={18} />
                                Shop Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="shopName"
                                    value={formData.shopName}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{formData.shopName}</p>
                            )}
                        </div>

                        <div className="profile_field">
                            <label>
                                <Mail size={18} />
                                Email
                            </label>
                            <p>{formData.email}</p>
                        </div>

                        <div className="profile_field">
                            <label>
                                <Phone size={18} />
                                Phone
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{formData.phone}</p>
                            )}
                        </div>

                        <div className="profile_field">
                            <label>
                                <MapPin size={18} />
                                Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{formData.address}</p>
                            )}
                        </div>

                        <div className="profile_field_group">
                            <div className="profile_field">
                                <label>
                                    <Clock size={18} />
                                    Opening Time
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="openingTime"
                                        value={formData.openingTime}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{formData.openingTime}</p>
                                )}
                            </div>

                            <div className="profile_field">
                                <label>
                                    <Clock size={18} />
                                    Closing Time
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="closingTime"
                                        value={formData.closingTime}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{formData.closingTime}</p>
                                )}
                            </div>
                        </div>

                        <div className="profile_field">
                            <label>Description</label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                />
                            ) : (
                                <p>{formData.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
