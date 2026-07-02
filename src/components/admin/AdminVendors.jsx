import React, { useState, useEffect } from 'react';
import { Store, Plus, Trash2, MapPin, CheckCircle, X, Copy, Key, AlertTriangle } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminVendors = () => {
    const [shops, setShops] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCredentials, setShowCredentials] = useState(null);
    const [viewingCreds, setViewingCreds] = useState(null);
    const [newVendor, setNewVendor] = useState({ name: '', location: '', image: '' });
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            const res = await adminService.getVendors();
            setShops(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch vendors", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleAddVendor = (e) => {
        e.preventDefault();
        // Mocked because backend doesn't have a create vendor endpoint with password generation yet
        alert("Vendor creation requires backend implementation.");
        setShowAddModal(false);
    };

    const handleDeleteVendor = (id, name) => {
        if (window.confirm(`Are you sure you want to permanently delete "${name}"? This action is not supported by the backend yet.`)) {
            alert("Deleting vendors is not supported by the current backend API.");
        }
    };

    const toggleVendorStatus = async (id, currentStatus) => {
        try {
            await adminService.toggleVendorStatus(id, { active: !currentStatus });
            fetchVendors(); // Refresh list
        } catch (err) {
            console.error("Failed to toggle vendor status", err);
            alert("Failed to update vendor status");
        }
    };

    const handleViewCredentials = (id, name) => {
        alert('Credentials cannot be viewed securely once created.');
    };

    if (loading) {
        return <div className="admin_section"><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading vendors...</div></div>;
    }

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
                            <div style={{width: '100%', height: '120px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Store size={40} color="#94a3b8" />
                            </div>
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
                                <h4>{shop.vendorName}</h4>
                                <div className="vendor_meta">
                                    <MapPin size={14} />
                                    <span>Campus Location</span>
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
                                        onClick={() => handleDeleteVendor(shop.vendorId, shop.vendorName)}
                                        title="Delete Vendor"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        className="action_icon_btn"
                                        title="View Login Details"
                                        onClick={() => handleViewCredentials(shop.vendorId, shop.vendorName)}
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
        </div>
    );
};

export default AdminVendors;
