import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Camera, MapPin, Heart, Utensils, Pizza, Filter,
    Coffee, ArrowLeft, Edit2, X, Save, ShoppingBag, CheckCircle, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import coverImg from '../assets/profile-cover.png';
import avatarImg from '../assets/avatar.png';
import '../styles/profilecss/Profile.css';

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
    
    // --- STATE ---
    const [orders, setOrders] = useState(INITIAL_ORDERS);
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

    // --- HANDLERS ---
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

    // --- MEMOIZED CALCULATIONS ---
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
        <div className="profile-container">
            <NavBar />
            
            {toastMsg && (
                <div className="fixed top-24 right-5 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-left">
                    <CheckCircle className="text-green-400 w-5 h-5" />
                    <span className="text-sm font-medium">{toastMsg}</span>
                </div>
            )}

            <EditProfileModal 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                userData={profileData}
                onSave={handleSaveProfile}
            />

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            {/* Banner */}
            <div className="profile-banner">
                <img src={coverImg} alt="Cover" className="banner-img animate-fade-in" />
                <div className="banner-overlay"></div>
                <div className="banner-gradient"></div>
                <button onClick={() => navigate('/dashboard')} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Main Content */}
            <main className="profile-main">
                <div className="profile-grid">

                    {/* Left Sidebar */}
                    <div className="profile-sidebar-col">
                        <div className="sidebar-card profile-sidebar-card">
                            <button onClick={() => setIsEditOpen(true)} className="edit-icon-btn">
                                <Edit2 size={18} />
                            </button>

                            <div className="p-6 flex flex-col items-center pt-10">
                                <div onClick={handleImageClick} className="avatar-wrapper animate-profile-img">
                                    <div className="avatar-ring">
                                        <img src={avatarImg} alt="Profile" className="avatar-img" />
                                    </div>
                                    <div className="camera-badge">
                                        <Camera className="w-3.5 h-3.5" />
                                    </div>
                                </div>

                                <h1 className="profile-name">{profileData.name}</h1>
                                <span className="profile-role-badge">{profileData.role}</span>

                                <div className="w-full mt-8 lg:hidden">
                                    <StatsCards isMobileView={true} campus={profileData.college} favLocation={favLocation} favFood={favFood} />
                                </div>
                                <div className="divider"></div>
                            </div>

                            <div className="info-list">
                                <ProfileRow label="ID" value={profileData.id} />
                                <ProfileRow label="Email" value={profileData.email} truncate />
                                <ProfileRow label="College" value={profileData.college} />
                                <ProfileRow label="Department" value={profileData.department} />
                                <ProfileRow label="Year" value={profileData.year} />
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="profile-content-col">
                        <div className="hidden lg:block">
                            <StatsCards campus={profileData.college} favLocation={favLocation} favFood={favFood} />
                        </div>

                        {/* Orders Section */}
                        <div className="orders-card orders-section">
                            <div className="orders-header">
                                <div className="orders-title">
                                    <ShoppingBag size={20} />
                                    <span>MY ORDERS</span>
                                </div>
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsFilterOpen(!isFilterOpen)} 
                                        className={`filter-btn ${isFilterOpen ? 'active' : 'inactive'}`}
                                    >
                                        <span>{filterType !== 'All' ? filterType : 'Filter'}</span>
                                        <Filter className="w-5 h-5" />
                                    </button>
                                    
                                    {isFilterOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                            <div className="dropdown-menu animate-scale-up-origin-tr">
                                                {['All', 'Delivered', 'Delivering', 'Preparing', 'Cancelled'].map((status) => (
                                                    <button 
                                                        key={status} 
                                                        onClick={() => { setFilterType(status); setVisibleCount(4); setIsFilterOpen(false); }} 
                                                        className={`dropdown-item ${filterType === status ? 'selected' : 'default'}`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-x-auto flex-1">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Shop</th>
                                            <th>Status</th>
                                            <th className="text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleOrders.length > 0 ? (
                                            visibleOrders.map((order) => (
                                                <tr key={order.id} className="table-row">
                                                    <td className="product-cell">
                                                        <div className="product-icon"><order.icon className="w-4 h-4" /></div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-800">{order.name}</span>
                                                            <span className="text-xs text-gray-400 md:hidden">{order.date}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-sm text-gray-500">
                                                        <div className="flex flex-col">
                                                            <span>{order.shop}</span>
                                                            <span className="text-xs text-gray-400 hidden md:block">{order.date}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${order.statusColor}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-base font-medium text-right">{order.price}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-10 text-center text-gray-400 italic">No orders found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {hasMoreOrders && (
                                <div className="show-more-container">
                                    <button onClick={() => setVisibleCount(prev => prev + 5)} className="show-more-btn">
                                        Show More <ChevronDown size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- HELPER COMPONENTS ---
const StatsCards = ({ isMobileView = false, campus, favLocation, favFood }) => (
    <div className={isMobileView ? "flex flex-col gap-3 mx-4" : "stats-grid"}>
        <StatCard icon={MapPin} label="Campus" value={campus} color="indigo" />
        <StatCard icon={Heart} label="Favorite Spot" value={favLocation} color="blue" />
        <StatCard icon={Utensils} label="Go-To Meal" value={favFood} color="purple" />
    </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
        <div className={`stat-icon ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
        </div>
    </div>
);

const ProfileRow = ({ label, value, truncate = false }) => (
    <div className="info-row">
        <span className="info-label">{label}</span>
        <span className={`info-value ${truncate ? 'truncate max-w-[12rem]' : ''}`}>{value}</span>
    </div>
);

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState(userData);
    useEffect(() => { setFormData(userData) }, [userData]);
    if (!isOpen) return null;
    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content animate-scale-up">
                <div className="modal-header">
                    <h3 className="text-lg font-bold text-gray-800">Edit Profile</h3>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <InputField label="Display Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                    <InputField label="Student ID" value={formData.id} onChange={v => setFormData({...formData, id: v})} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Department" value={formData.department} onChange={v => setFormData({...formData, department: v})} />
                        <div className="form-group">
                            <label>Year</label>
                            <select value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="form-input bg-white">
                                <option>I Year</option><option>II Year</option><option>III Year</option><option>IV Year</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-cancel">Cancel</button>
                    <button onClick={() => { onSave(formData); onClose(); }} className="btn-save"><Save size={16} /> Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, value, onChange }) => (
    <div className="form-group">
        <label>{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="form-input" />
    </div>
);