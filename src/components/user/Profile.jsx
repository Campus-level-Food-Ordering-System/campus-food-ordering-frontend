import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Camera, MapPin, Heart, Utensils, ArrowLeft, Edit2, X, Save, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import coverImg from '../../assets/profile-cover.png';
import avatarImg from '../../assets/avatar.png';
import '../../styles/profilecss/Profile.css';

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [orders, setOrders] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);
    const [loading, setLoading] = useState(true);

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        role: "",
        college: "",
        id: "",
        department: "",
        year: ""
    });

    const [avatarPreview, setAvatarPreview] = useState(() => {
        return localStorage.getItem('user_avatar') || avatarImg;
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    userService.getProfile(),
                    userService.getOrders()
                ]);
                
                const profile = profileRes.data.data;
                setProfileData({
                    name: profile.username || "Student",
                    email: profile.email || "",
                    role: profile.role || "User",
                    college: profile.collegeName || "N/A",
                    id: profile.id || "",
                    department: profile.department || "N/A",
                    year: profile.yearOfStudy ? profile.yearOfStudy + " Year" : "N/A"
                });

                setOrders(ordersRes.data.data || []);
            } catch (err) {
                console.error("Failed to fetch profile info:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleSaveProfile = (newData) => {
        setProfileData(newData);
        // Note: Ideally call an API to update user profile here
        setToastMsg("Profile updated locally!");
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleImageClick = () => fileInputRef.current.click();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
             const imageUrl = URL.createObjectURL(file);
             setAvatarPreview(imageUrl);
             localStorage.setItem('user_avatar', imageUrl);
             setToastMsg("Profile picture updated!");
             setTimeout(() => setToastMsg(null), 3000);
        }
    };

    // Calculate favorites
    const { favFood, favLocation } = useMemo(() => {
        if (!orders || orders.length === 0) return { favFood: "N/A", favLocation: "N/A" };
        
        let allItems = [];
        let allShops = [];
        
        orders.forEach(order => {
            allShops.push(order.vendorName || order.shopName);
            const items = order.items || order.cartItems || [];
            items.forEach(item => {
                allItems.push(item.itemName || item.name);
            });
        });

        const getMostFrequent = (arr) => {
            const counts = arr.reduce((acc, item) => { 
                if (item) acc[item] = (acc[item] || 0) + 1; 
                return acc; 
            }, {});
            if (Object.keys(counts).length === 0) return "N/A";
            return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        };
        return { favFood: getMostFrequent(allItems), favLocation: getMostFrequent(allShops) };
    }, [orders]);

    if (loading) {
        return <div className="profile-page"><NavBar /><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading profile...</div></div>;
    }

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
                    <ArrowLeft size={24} />
                </button>
            </div>

            <main className="profile-main-content centered-layout">
                <div className="card-container standalone-profile-card sidebar-card-animate">
                    
                    <button onClick={() => setIsEditOpen(true)} className="edit-profile-btn" title="Edit Profile">
                        <Edit2 size={18} />
                    </button>

                    <div className="profile-header-center">
                        <div onClick={handleImageClick} className="avatar-container animate-fade-in">
                            <div className="avatar-ring">
                                <img src={avatarPreview} alt="Profile" className="avatar-img" />
                            </div>
                            <div className="avatar-camera-badge">
                                <Camera size={14} />
                            </div>
                        </div>

                        <h1 className="user-name">{profileData.name}</h1>
                        <span className="user-role-badge">{profileData.role}</span>
                    </div>

                    <div className="section-divider"></div>

                    {/* Stats Section */}
                    <div className="profile-stats-wrapper">
                        <StatsCards campus={profileData.college} favLocation={favLocation} favFood={favFood} />
                    </div>

                    <div className="section-divider"></div>

                    <div className="user-info-list">
                        <ProfileRow label="User ID" value={profileData.id} />
                        <ProfileRow label="Email Address" value={profileData.email} truncate />
                        <ProfileRow label="College" value={profileData.college} />
                        <ProfileRow label="Department" value={profileData.department} />
                        <ProfileRow label="Year of Study" value={profileData.year} />
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