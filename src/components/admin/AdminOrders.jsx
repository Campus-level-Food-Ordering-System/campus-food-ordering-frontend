import React, { useState } from 'react';
import {
    Search,
    Filter,
    ChevronRight,
    Clock,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Package,
    ArrowLeft,
    ShoppingBag
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const AdminOrders = () => {
    const { orders, emergencyCancelOrder } = useOrders();
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
        const matchesSearch =
            order.orderId?.toString().includes(searchQuery) ||
            order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shopName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusInfo = (status) => {
        const config = {
            PAID: { label: 'New', color: '#6366f1', bg: '#f5f3ff', icon: Clock },
            PREPARING: { label: 'Preparing', color: '#f59e0b', bg: '#fffbeb', icon: Package },
            READY_FOR_PICKUP: { label: 'Ready', color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2 },
            COMPLETED: { label: 'Collected', color: '#64748b', bg: '#f1f5f9', icon: CheckCircle2 },
            CANCELLED: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', icon: XCircle },
        };
        return config[status] || { label: status, color: '#64748b', bg: '#f8fafc', icon: Clock };
    };

    const handleCancelSubmit = (e) => {
        e.preventDefault();
        if (selectedOrder) {
            emergencyCancelOrder(selectedOrder.orderId || selectedOrder.id, cancelReason);
            setShowCancelModal(false);
            setCancelReason('');
            // Close the drawer to see the updated orders list
            setSelectedOrder(null);
        }
    };

    return (
        <div className="admin_section orders_oversight">
            <div className="orders_control_bar">
                <div className="search_box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer, or Shop..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter_group">
                    <Filter size={18} />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="ALL">All Statuses</option>
                        <option value="PAID">New Orders</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY_FOR_PICKUP">Ready</option>
                        <option value="COMPLETED">Collected</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="orders_table_wrapper">
                <table className="admin_orders_table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date & Time</th>
                            <th>Customer</th>
                            <th>Shop</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty_table_cell">
                                    <div className="empty_state">
                                        <ShoppingBag size={48} />
                                        <p>No orders matching your filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => {
                                const status = getStatusInfo(order.status);
                                const StatusIcon = status.icon;
                                return (
                                    <tr key={order.id} onClick={() => setSelectedOrder(order)} className="clickable_row">
                                        <td><strong>#{order.orderId || order.id}</strong></td>
                                        <td>
                                            <div className="time_info">
                                                <span>{new Date(order.timestamp).toLocaleDateString()}</span>
                                                <span className="sub_text">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td>{order.customerName}</td>
                                        <td>{order.shopName || `Shop ${order.vendorId}`}</td>
                                        <td>₹{parseFloat(order.total).toFixed(2)}</td>
                                        <td>
                                            <span className="status_badge" style={{ backgroundColor: status.bg, color: status.color }}>
                                                <StatusIcon size={14} />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="view_details_link">
                                                Details <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Drawer-style Overlay */}
            {selectedOrder && (
                <div className="admin_drawer_overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="admin_drawer" onClick={e => e.stopPropagation()}>
                        <div className="drawer_header">
                            <button className="back_btn" onClick={() => setSelectedOrder(null)}>
                                <ArrowLeft size={20} />
                            </button>
                            <h3>Order #{(selectedOrder.orderId || selectedOrder.id)}</h3>
                            <button className="close_btn" onClick={() => setSelectedOrder(null)}><XCircle size={20} /></button>
                        </div>

                        <div className="drawer_body">
                            <div className="drawer_status_banner" style={{ background: getStatusInfo(selectedOrder.status).bg }}>
                                <span style={{ color: getStatusInfo(selectedOrder.status).color }}>
                                    Status: {getStatusInfo(selectedOrder.status).label}
                                </span>
                            </div>

                            <section className="drawer_section">
                                <h4>Customer Details</h4>
                                <div className="detail_item">
                                    <span>Name</span>
                                    <strong>{selectedOrder.customerName}</strong>
                                </div>
                                <div className="detail_item">
                                    <span>Payment Method</span>
                                    <strong>Pay at Counter</strong>
                                </div>
                            </section>

                            <section className="drawer_section">
                                <h4>Items Summary</h4>
                                <div className="drawer_items_list">
                                    {(selectedOrder.cartItems || []).map((item, idx) => (
                                        <div key={idx} className="drawer_item">
                                            <span>{item.qty}x {item.name}</span>
                                            <span>₹{(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="drawer_total">
                                    <span>Total Amount Paid</span>
                                    <strong>₹{parseFloat(selectedOrder.total).toFixed(2)}</strong>
                                </div>
                            </section>

                            {selectedOrder.status === 'CANCELLED' && (
                                <section className="drawer_section cancellation_log">
                                    <h4>Cancellation Details</h4>
                                    <div className="alert_box danger">
                                        <AlertTriangle size={18} />
                                        <div>
                                            <strong>Reason:</strong> {selectedOrder.cancelReason || 'N/A'}
                                        </div>
                                    </div>
                                    <p className="cancel_time">Cancelled on {new Date(selectedOrder.cancelledAt).toLocaleString()}</p>
                                </section>
                            )}

                            {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'COMPLETED' && (
                                <div className="drawer_actions">
                                    <button
                                        className="emergency_cancel_btn"
                                        onClick={() => setShowCancelModal(true)}
                                    >
                                        <AlertTriangle size={18} />
                                        Emergency Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Emergency Cancel Modal */}
            {showCancelModal && (
                <div className="admin_modal_overlay">
                    <div className="admin_modal_content slide_up" onClick={e => e.stopPropagation()}>
                        <div className="modal_header">
                            <h3 style={{ color: '#ef4444' }}>Emergency Cancellation</h3>
                            <button onClick={() => setShowCancelModal(false)}><XCircle size={20} /></button>
                        </div>
                        <p className="modal_description">
                            You are about to cancel a PAID order. This action will notify the vendor and student.
                        </p>
                        <div className="admin_modal_form">
                            <div className="form_group_admin">
                                <label>Reason for Cancellation</label>
                                <textarea
                                    className="admin_textarea"
                                    placeholder="e.g. Technical error, Out of stock, System maintenance..."
                                    required
                                    rows={4}
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                            </div>
                            <div className="modal_footer">
                                <button type="button" className="cancel_btn" onClick={() => setShowCancelModal(false)}>Back</button>
                                <button
                                    type="button"
                                    className="confirm_btn danger_bg"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!cancelReason.trim()) {
                                            alert('Please enter a cancellation reason');
                                            return;
                                        }
                                        handleCancelSubmit(e);
                                    }}
                                >
                                    Confirm Cancellation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
