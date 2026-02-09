import React, { useState } from 'react';
import {
    Store,
    Plus,
    Trash2,
    MapPin,
    CheckCircle,
    X,
    Copy,
    Key,
    AlertTriangle
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';

const AdminVendors = () => {
    const { shops, addVendor, deleteVendor, updateShopProfile, getVendorCredentials } = useMenu();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCredentials, setShowCredentials] = useState(null);
    const [viewingCreds, setViewingCreds] = useState(null);
    const [newVendor, setNewVendor] = useState({ name: '', location: '', image: '' });

    const handleAddVendor = (e) => {
        e.preventDefault();
        const credentials = addVendor(newVendor);
        setShowCredentials({ ...credentials, name: newVendor.name });
        setShowAddModal(false);
        setNewVendor({ name: '', location: '', image: '' });
    };

    const handleDeleteVendor = (id, name) => {
        if (window.confirm(`Are you sure you want to permanently delete "${name}"? This will remove all their menu data and orders.`)) {
            deleteVendor(id);
        }
    };

    const toggleVendorStatus = (id, currentStatus) => {
        updateShopProfile(id, { isActive: !currentStatus });
    };

    const handleViewCredentials = (id, name) => {
        const creds = getVendorCredentials(id);
        if (creds) {
            setViewingCreds({ ...creds, name });
        } else {
            alert('No credentials found for this vendor. They may have been created before this feature was added.');
        }
    };

    // Three-dot menu removed; actions available via dedicated buttons

    return (
        <div className="admin_section vendor_management">
            <div className="section_header">
                <div className="header_text">
                    <h3>Platform Vendors</h3>
                    <p>Manage shop partnerships and access</p>
                </div>
                <button
                    className="add_btn_primary"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={20} />
                    <span>Add New Vendor</span>
                </button>
            </div>

            <div className="vendor_grid">
                {shops.map((shop) => (
                    <div key={shop.vendorId} className={`vendor_admin_card ${!shop.isActive ? 'disabled' : ''}`}>
                        <div className="vendor_card_image">
                            <img src={shop.image} alt={shop.name} />
                            {!shop.isActive && <div className="disabled_overlay">Inactive</div>}
                            <button
                                className={`status_toggle_btn ${shop.isActive ? 'active' : ''}`}
                                onClick={() => toggleVendorStatus(shop.vendorId, shop.isActive)}
                                title={shop.isActive ? 'Disable Vendor' : 'Enable Vendor'}
                            >
                                <div className="toggle_dot" />
                            </button>
                        </div>

                        <div className="vendor_card_body">
                            <div className="vendor_card_main">
                                <h4>{shop.name}</h4>
                                <div className="vendor_meta">
                                    <MapPin size={14} />
                                    <span>{shop.location}</span>
                                </div>
                            </div>

                            <div className="vendor_card_footer">
                                <div className="vendor_stats_mini">
                                    <div className="mini_stat">
                                        <span className="label">ID</span>
                                        <span className="value">#{shop.vendorId}</span>
                                    </div>
                                </div>
                                <div className="vendor_card_actions">
                                    <button
                                        className="action_icon_btn delete"
                                        onClick={() => handleDeleteVendor(shop.vendorId, shop.name)}
                                        title="Delete Vendor"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        className="action_icon_btn"
                                        title="View Login Details"
                                        onClick={() => handleViewCredentials(shop.vendorId, shop.name)}
                                    >
                                        <Key size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Vendor Modal */}
            {showAddModal && (
                <div className="admin_modal_overlay">
                    <div className="admin_modal_content slide_up">
                        <div className="modal_header">
                            <h3>Onboard New Vendor</h3>
                            <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddVendor} className="admin_modal_form">
                            <div className="form_group_admin">
                                <label>Shop Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Campus Grill"
                                    required
                                    value={newVendor.name}
                                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                                />
                            </div>
                            <div className="form_group_admin">
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Block A, Ground Floor"
                                    required
                                    value={newVendor.location}
                                    onChange={(e) => setNewVendor({ ...newVendor, location: e.target.value })}
                                />
                            </div>
                            <div className="form_group_admin">
                                <label>Image URL (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={newVendor.image}
                                    onChange={(e) => setNewVendor({ ...newVendor, image: e.target.value })}
                                />
                            </div>
                            <div className="modal_footer">
                                <button type="button" className="cancel_btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="confirm_btn">Create & Generate Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Premium Credentials Modal */}
            {(showCredentials || viewingCreds) && (
                <div className="admin_modal_overlay premium_overlay">
                    <div className="admin_modal_content credentials_modal slide_up premium_modal">
                        {/* Decorative Header Background */}
                        <div className="modal_decorative_header"></div>

                        <div className="modal_header relative_z">
                            <h3 className="premium_header_title">
                                {showCredentials ? '🎉 Vendor Onboarded!' : '🔐 Access Credentials'}
                            </h3>
                            <button
                                onClick={() => { setShowCredentials(null); setViewingCreds(null); }}
                                className="close_btn_premium"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="premium_body">
                            <div className="status_icon_wrapper">
                                {showCredentials
                                    ? <div className="icon_circle success"><CheckCircle size={32} color="#10b981" /></div>
                                    : <div className="icon_circle info"><Key size={32} color="#6366f1" /></div>
                                }
                            </div>

                            <div className="premium_text_center">
                                <h4 className="premium_vendor_name">
                                    {(showCredentials || viewingCreds).name}
                                </h4>
                                <p className="premium_vendor_desc">
                                    {showCredentials
                                        ? 'Account created successfully. Share these details securely.'
                                        : 'Sensitive login information for this vendor.'}
                                </p>
                            </div>

                            <div className="credentials_card">
                                <div className="cred_row">
                                    <div className="cred_label">
                                        <div className="icon_box"><Store size={14} /></div>
                                        <span>Login Email</span>
                                    </div>
                                    <div className="cred_input_group">
                                        <code className="cred_text">{(showCredentials || viewingCreds).email}</code>
                                        <button
                                            className="copy_btn"
                                            onClick={() => navigator.clipboard.writeText((showCredentials || viewingCreds).email)}
                                            title="Copy Email"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="cred_divider"></div>

                                <div className="cred_row">
                                    <div className="cred_label">
                                        <div className="icon_box"><Key size={14} /></div>
                                        <span>Password</span>
                                    </div>
                                    <div className="cred_input_group">
                                        <code className="cred_text">{(showCredentials || viewingCreds).password}</code>
                                        <button
                                            className="copy_btn"
                                            onClick={() => navigator.clipboard.writeText((showCredentials || viewingCreds).password)}
                                            title="Copy Password"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {showCredentials && (
                            <div className="security_notice">
                                <AlertTriangle size={14} />
                                <span>Please ensure the vendor changes their password after first login.</span>
                            </div>
                        )}

                        <div className="premium_modal_footer">
                            <button
                                className="premium_done_btn"
                                onClick={() => { setShowCredentials(null); setViewingCreds(null); }}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendors;
