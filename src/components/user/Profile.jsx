import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Camera, MapPin, Heart, Utensils, Pizza, Filter,
    Coffee, ArrowLeft, Edit2, X, Save, ShoppingBag, 
    CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useAuth } from '../../context/AuthContext';
import coverImg from '../../assets/profile-cover.png';
import avatarImg from '../../assets/avatar.png';
import '../../styles/profilecss/Profile.css';

// --- MOCK DATA ---
const INITIAL_ORDERS = [
    { id: 1, name: "Chicken Burger", shop: "Main Block Chat", date: "Oct 24, 2025", status: "Delivered", price: "₹120.00", icon: Utensils, statusColor: "green" },
    { id: 2, name: "Paneer Pizza", shop: "Campus Pizza Corner", date: "Oct 12, 2025", status: "Delivering", price: "₹210.00", icon: Pizza, statusColor: "blue" },
    { id: 3, name: "Masala Chai", shop: "Main Block Chat", date: "Sep 30, 2025", status: "Preparing", price: "₹35.00", icon: Coffee, statusColor: "orange" },
    { id: 4, name: "Club Sandwich", shop: "Library Cafe", date: "Aug 15, 2025", status: "Delivered", price: "₹90.00", icon: Utensils, statusColor: "green" },
    { id: 5, name: "Veg Momos", shop: "Main Block Chat", date: "Aug 10, 2025", status: "Delivered", price: "₹80.00", icon: Utensils, statusColor: "green" },
    { id: 6, name: "Cold Coffee", shop: "Library Cafe", date: "Aug 05, 2025", status: "Cancelled", price: "₹60.00", icon: Coffee, statusColor: "red" },
    { id: 7, name: "Chicken Burger", shop: "Main Block Chat", date: "Jul 28, 2025", status: "Delivered", price: "₹120.00", icon: Utensils, statusColor: "green" },
];

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [orders] = useState(INITIAL_ORDERS);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterType, setFilterType] = useState('All');
    const [toastMsg, setToastMsg] = useState(null);
    const [visibleCount, setVisibleCount] = useState(4);

    const [profileData, setProfileData] = useState({
        name: user?.name || "Vindhan",
        email: user?.email || "studentuser1@skct.edu.in",
        role: user?.role || "Student",
        college: user?.college || "Sri Krishna College of Tech",
        id: "727823TUCS034",
        department: "CSE-A",
        year: "III Year"
    });

    const handleSaveProfile = (newData) => {
        setProfileData(newData);
        setToastMsg("Profile updated successfully!");
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleImageClick = () => fileInputRef.current.click();
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
             setToastMsg("Profile picture updated!");
             setTimeout(() => setToastMsg(null), 3000);
        }
    };

    const { favFood, favLocation } = useMemo(() => {
        if (!orders || orders.length === 0) return { favFood: "N/A", favLocation: "N/A" };
        const getMostFrequent = (arr, key) => {
            const counts = arr.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] || 0) + 1; return acc; }, {});
            if (Object.keys(counts).length === 0) return "N/A";
            return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        };
        return { favFood: getMostFrequent(orders, 'name'), favLocation: getMostFrequent(orders, 'shop') };
    }, [orders]);

    const visibleOrders = useMemo(() => {
        const filtered = filterType === 'All' ? orders : orders.filter(o => o.status === filterType);
        return filtered.slice(0, visibleCount);
    }, [orders, filterType, visibleCount]);

    const hasMoreOrders = visibleOrders.length < (filterType === 'All' ? orders.length : orders.filter(o => o.status === filterType).length);

    return (
        <div className="profile-page">
            <NavBar />
            
            {toastMsg && (
                <div className="toast-notification animate-slide-left">
                    <CheckCircle className="toast-icon-green" size={20} />
                    <span>{toastMsg}</span>
                </div>
            )}

            <EditProfileModal 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                userData={profileData}
                onSave={handleSaveProfile}
            />

            <input type="file" ref={fileInputRef} className="hidden-input" accept="image/*" onChange={handleFileChange} />

            <div className="profile-hero-banner">
                <img src={coverImg} alt="Cover" className="hero-img animate-fade-in" />
                <div className="hero-overlay"></div>
                <div className="hero-gradient"></div>
                <button onClick={() => navigate('/dashboard')} className="hero-back-btn">
                    <ArrowLeft size={20} />
                </button>
            </div>

            <main className="profile-main-content">
                <div className="profile-layout-grid">

                    {/* Left Sidebar */}
                    <div className="profile-sidebar">
                        <div className="card-container sidebar-card-animate">
                            <button onClick={() => setIsEditOpen(true)} className="edit-profile-btn">
                                <Edit2 size={18} />
                            </button>

                            <div className="sidebar-header">
                                <div onClick={handleImageClick} className="avatar-container animate-fade-in">
                                    <div className="avatar-ring">
                                        <img src={avatarImg} alt="Profile" className="avatar-img" />
                                    </div>
                                    <div className="avatar-camera-badge">
                                        <Camera size={14} />
                                    </div>
                                </div>

                                <h1 className="user-name">{profileData.name}</h1>
                                <span className="user-role-badge">{profileData.role}</span>

                                <div className="mobile-only-stats">
                                    <StatsCards campus={profileData.college} favLocation={favLocation} favFood={favFood} />
                                </div>
                                <div className="section-divider"></div>
                            </div>

                            <div className="user-info-list">
                                <ProfileRow label="ID" value={profileData.id} />
                                <ProfileRow label="Email" value={profileData.email} truncate />
                                <ProfileRow label="College" value={profileData.college} />
                                <ProfileRow label="Department" value={profileData.department} />
                                <ProfileRow label="Year" value={profileData.year} />
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="profile-content">
                        <div className="desktop-only-stats">
                            <StatsCards campus={profileData.college} favLocation={favLocation} favFood={favFood} />
                        </div>

                        <div className="card-container orders-section-animate">
                            <div className="orders-header">
                                <div className="orders-title">
                                    <ShoppingBag size={20} />
                                    <span>MY ORDERS</span>
                                </div>
                                <div className="filter-dropdown-container">
                                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`filter-btn ${isFilterOpen ? 'active' : ''}`}>
                                        <span>{filterType !== 'All' ? filterType : 'Filter'}</span>
                                        <Filter size={20} />
                                    </button>
                                    
                                    {isFilterOpen && (
                                        <>
                                            <div className="dropdown-backdrop" onClick={() => setIsFilterOpen(false)}></div>
                                            <div className="dropdown-menu animate-scale-up">
                                                {['All', 'Delivered', 'Delivering', 'Preparing', 'Cancelled'].map((status) => (
                                                    <button 
                                                        key={status} 
                                                        onClick={() => { setFilterType(status); setVisibleCount(4); setIsFilterOpen(false); }} 
                                                        className={`dropdown-item ${filterType === status ? 'selected' : ''}`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="table-responsive-wrapper">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Shop</th>
                                            <th>Status</th>
                                            <th className="align-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleOrders.length > 0 ? (
                                            visibleOrders.map((order) => (
                                                <tr key={order.id} className="order-row">
                                                    <td>
                                                    <div className="product-cell">
                                                        <div className="product-icon"><order.icon size={16} /></div>
                                                        <div className="product-info">
                                                            <span className="product-name">{order.name}</span>
                                                            <span className="mobile-date">{order.date}</span>
                                                        </div>
                                                    </div>
                                                    </td>
                                                    <td>
                                                    <div className="shop-cell">
                                                        <div className="shop-info">
                                                            <span>{order.shop}</span>
                                                            <span className="desktop-date">{order.date}</span>
                                                        </div>
                                                    </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${order.statusColor}`}>{order.status}</span>
                                                    </td>
                                                    <td className="price-cell align-right">{order.price}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="empty-table-msg">No orders found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination-footer">
                                {hasMoreOrders && (
                                    <button onClick={() => setVisibleCount(prev => prev + 5)} className="action-link-btn text-orange">
                                        Show More <ChevronDown size={16} />
                                    </button>
                                )}
                                {visibleCount > 4 && (
                                    <button onClick={() => setVisibleCount(4)} className="action-link-btn text-gray">
                                        Show Less <ChevronUp size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- HELPER COMPONENTS ---

const StatsCards = ({ campus, favLocation, favFood }) => (
    <div className="stats-grid">
        <StatCard icon={MapPin} label="Campus" value={campus} color="indigo" />
        <StatCard icon={Heart} label="Favorite Spot" value={favLocation} color="blue" />
        <StatCard icon={Utensils} label="Go-To Meal" value={favFood} color="purple" />
    </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
        <div className={`stat-icon-wrapper ${color}`}>
            <Icon size={20} />
        </div>
        <div className="stat-text">
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
        </div>
    </div>
);

const ProfileRow = ({ label, value, truncate = false }) => (
    <div className="info-row">
        <span className="info-label">{label}</span>
        <span className={`info-value ${truncate ? 'truncate-text' : ''}`}>{value}</span>
    </div>
);

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState(userData);
    useEffect(() => { setFormData(userData) }, [userData]);
    
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-container animate-scale-up">
                <div className="modal-header">
                    <h3>Edit Profile</h3>
                    <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <InputField label="Display Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                    <InputField label="Student ID" value={formData.id} onChange={v => setFormData({...formData, id: v})} />
                    <div className="modal-form-row">
                        <InputField label="Department" value={formData.department} onChange={v => setFormData({...formData, department: v})} />
                        <div className="input-group">
                            <label>Year</label>
                            <select value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="custom-input">
                                <option>I Year</option><option>II Year</option><option>III Year</option><option>IV Year</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-cancel">Cancel</button>
                    <button onClick={() => { onSave(formData); onClose(); }} className="btn-save">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, value, onChange }) => (
    <div className="input-group">
        <label>{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="custom-input" />
    </div>
);