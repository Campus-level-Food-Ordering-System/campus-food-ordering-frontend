import React, { useState } from 'react';
import {
    Camera,
    Pencil,
    MapPin,
    GraduationCap,
    BookOpen,
    Heart,
    Utensils,
    Pizza,
    Beef,
    Filter,
    Book,
    Monitor,
    Coffee,
    Shirt,
    ChevronRight,
    MessageSquare,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import coverImg from '../assets/profile-cover.png';
import avatarImg from '../assets/avatar.png';

import '../styles/profilecss/Profile.css';

const StatsCards = ({ isMobileView = false }) => (
    <div className={`${isMobileView
        ? "flex flex-col gap-3 mx-4"
        : "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        }`}>
        {/* Card 1: Campus */}
        <div className={`flex items-center gap-4 ${isMobileView ? "p-0" : "bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"}`}>
            <div className={`p-2.5 rounded-lg flex-shrink-0 ${isMobileView ? "bg-indigo-100 text-indigo-600" : "bg-indigo-50 text-indigo-600"}`}>
                <MapPin className="w-5 h-5" />
            </div>
            <div>
                {!isMobileView && <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Campus</p>}
                <p className="text-sm font-semibold text-gray-900 truncate">SKCT Main</p>
            </div>
        </div>

        {/* Card 2: Fav Location */}
        <div className={`flex items-center gap-4 ${isMobileView ? "p-0" : "bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"}`}>
            <div className={`p-2.5 rounded-lg flex-shrink-0 ${isMobileView ? "bg-blue-100 text-blue-600" : "bg-blue-50 text-blue-600"}`}>
                <Heart className="w-5 h-5" />
            </div>
            <div>
                {!isMobileView && <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Favourite Location</p>}
                <p className="text-sm font-semibold text-gray-900 truncate">Main Block Chat Coffee</p>
            </div>
        </div>

        {/* Card 3: Fav Food */}
        <div className={`flex items-center gap-4 ${isMobileView ? "p-0" : "bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"}`}>
            <div className={`p-2.5 rounded-lg flex-shrink-0 ${isMobileView ? "bg-purple-100 text-purple-600" : "bg-purple-50 text-purple-600"}`}>
                <Utensils className="w-5 h-5" />
            </div>
            <div>
                {!isMobileView && <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Favorite Food</p>}
                <p className="text-sm font-semibold text-gray-900 truncate">Chicken Burger</p>
            </div>
        </div>
    </div>
);

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showAllOrders, setShowAllOrders] = useState(false);

    // Sample Orders Data
    const initialOrders = [
        { id: 1, name: "Chicken Burger", date: "Oct 24, 2025", status: "Delivered", price: "₹120.00", icon: Utensils, statusColor: "green" },
        { id: 2, name: "Paneer Pizza", date: "Oct 12, 2025", status: "Delivering", price: "₹210.00", icon: Pizza, statusColor: "blue" },
        { id: 3, name: "Masala Chai", date: "Sep 30, 2025", status: "Preparing", price: "₹35.00", icon: Coffee, statusColor: "orange" },
        { id: 4, name: "Club Sandwich", date: "Aug 15, 2025", status: "Delivered", price: "₹90.00", icon: Utensils, statusColor: "green" },
    ];

    const extraOrders = [
        { id: 5, name: "Veg Momos", date: "Aug 10, 2025", status: "Delivered", price: "₹80.00", icon: Utensils, statusColor: "green" },
        { id: 6, name: "Cold Coffee", date: "Aug 05, 2025", status: "Cancelled", price: "₹60.00", icon: Coffee, statusColor: "red" },
        { id: 7, name: "French Fries", date: "Jul 28, 2025", status: "Delivered", price: "₹95.00", icon: Utensils, statusColor: "green" },
    ];

    const displayedOrders = showAllOrders ? [...initialOrders, ...extraOrders] : initialOrders;

    const displayName = user?.name || user?.email?.split('@')[0] || "Vindhan";
    const displayEmail = "studentuser1@skct";
    const displayRole = user?.role || "Published";
    const displayCollege = user?.college || "Sri Krishna College of Tech";
    const displayDept = user?.department || "CSE-A";
    const displayYear = user?.year || "2023-27 (III Year)"

    return (
        <div className="bg-gray-50 min-h-screen text-slate-800">
            <NavBar />

            {/* Top Banner (Food Spread Panorama) */}
            <div className="relative h-80 w-full overflow-hidden bg-gray-200">
                <img src={coverImg} alt="Cover" className="w-full h-full object-cover object-center animate-fade-in" />
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Back Button Overlay */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-6 left-6 p-2 bg-orange-500 hover:bg-orange-600 backdrop-blur-md rounded-full text-white transition-all z-20 hover:scale-110 active:scale-95"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Main Content Container --> */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar: Profile Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden profile-sidebar-card">
                            <div className="p-6 flex flex-col items-center pt-10">
                                {/* Profile Image */}
                                <div className="relative group cursor-pointer animate-profile-img">
                                    <div className="h-28 w-28 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-gray-900">
                                        <img src={avatarImg} alt="Profile" className="h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-orange-500 text-white p-1.5 rounded-full shadow-sm border-2 border-white transform transition-transform group-hover:scale-110">
                                        <Camera className="w-3.5 h-3.5" />
                                    </div>
                                </div>

                                {/* Name & Status */}
                                <h1 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">{displayName}</h1>
                                <span className="mt-2 inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600 ring-1 ring-inset ring-orange-500/10">
                                    {displayRole === 'vendor' ? 'Shop Owner' : 'Student'}
                                </span>

                                <div className="w-full mt-8 lg:hidden">
                                    <StatsCards isMobileView={true} />
                                </div>

                                <div className="w-10 h-1 bg-gray-100 rounded-full mt-6 mb-2"></div>
                            </div>

                            {/* Personal Information List */}
                            <div className="px-6 pb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-base font-medium text-gray-900">Personal Information</h2>

                                </div>

                                <div className="space-y-5">
                                    {/* ID */}
                                    <div className="flex justify-between items-center group">
                                        <span className="text-sm text-gray-500 font-normal">ID</span>
                                        <span className="text-base font-medium text-gray-800">727823TUCS034</span>
                                    </div>

                                    {/* Username */}
                                    <div className="flex justify-between items-center group">
                                        <span className="text-sm text-gray-500 font-normal">Username</span>
                                        <span className="text-base font-medium text-gray-800">@daanish_m</span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex justify-between items-start group">
                                        <span className="text-sm text-gray-500 font-normal mt-1">Email</span>
                                        <span className="text-base font-medium text-gray-800 text-right truncate max-w-[12rem]">{displayEmail}</span>
                                    </div>

                                    {/* College Name */}
                                    <div className="flex justify-between items-start group">
                                        <span className="text-sm text-gray-500 font-normal mt-1">College</span>
                                        <span className="text-base font-medium text-gray-800 text-right">{displayCollege}</span>
                                    </div>

                                    {/* Department */}
                                    <div className="flex justify-between items-center group">
                                        <span className="text-sm text-gray-500 font-normal">Department</span>
                                        <span className="text-base font-medium text-gray-800">{displayDept}</span>
                                    </div>

                                    {/* Year of Study */}
                                    <div className="flex justify-between items-center group">
                                        <span className="text-sm text-gray-500 font-normal">Year Of Study</span>
                                        <span className="text-base font-medium text-gray-800">{displayYear}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Dashboard/Orders */}
                    <div className="lg:col-span-8 pt-10 lg:pt-0">

                        {/* Desktop Only: Quick Stats Cards */}
                        <div className="hidden lg:block">
                            <StatsCards />
                        </div>



                        {/* My Orders Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden orders-section">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                                <div className="flex items-center gap-4">
                                    <nav className="flex p-1 bg-white/60 backdrop-blur-md border border-white/50 rounded-full shadow-sm" aria-label="Tabs">
                                        <div className="bg-white/90 text-orange-500 whitespace-nowrap py-1.5 px-8 text-sm font-bold rounded-full shadow-sm border border-orange-50">
                                            MY ORDERS
                                        </div>
                                    </nav>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all">
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-gray-100">
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Total</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {displayedOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-4 px-6 text-base text-gray-600">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                            <order.icon className="w-4 h-4" />
                                                        </div>
                                                        <span>{order.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-base text-gray-500">{order.date}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset 
                                                        ${order.statusColor === 'green' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                            order.statusColor === 'blue' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                                order.statusColor === 'orange' ? 'bg-orange-100 text-orange-600 ring-orange-500/20' :
                                                                    'bg-red-50 text-red-700 ring-red-600/20'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-base text-gray-900 font-medium text-right">{order.price}</td>
                                                <td className="py-4 px-6 text-right">
                                                    <button className="text-gray-400 hover:text-orange-500 transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <span className="text-sm text-gray-500">Showing {displayedOrders.length} recent orders</span>
                                <button
                                    onClick={() => setShowAllOrders(!showAllOrders)}
                                    className="text-sm font-medium text-orange-500 hover:text-orange-600 focus:outline-none"
                                >
                                    {showAllOrders ? "Show less" : "View all"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </main >

        </div >
    );
}
