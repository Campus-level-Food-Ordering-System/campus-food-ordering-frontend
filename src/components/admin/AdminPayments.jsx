import React, { useMemo } from 'react';
import {
    CreditCard,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const AdminPayments = () => {
    const { orders } = useOrders();

    // Derive payments from orders
    const payments = useMemo(() => {
        return orders.map(order => ({
            id: `PAY-${order.id}`,
            orderId: order.orderId || order.id,
            customer: order.customerName,
            amount: order.total,
            method: 'Pay at Counter',
            status: order.status === 'CANCELLED' ? 'REFUNDED' : 'SUCCESS',
            timestamp: order.timestamp
        }));
    }, [orders]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'SUCCESS': return { color: '#10b981', bg: '#ecfdf5' };
            case 'REFUNDED': return { color: '#ef4444', bg: '#fef2f2' };
            default: return { color: '#64748b', bg: '#f1f5f9' };
        }
    };

    const exportToCSV = () => {
        if (payments.length === 0) {
            alert('No payment data to export');
            return;
        }

        // Define CSV headers
        const headers = ['Transaction ID', 'Order ID', 'Customer', 'Amount (₹)', 'Payment Method', 'Status', 'Date'];

        // Convert payments to CSV rows
        const rows = payments.map(pay => [
            pay.id,
            pay.orderId,
            pay.customer,
            parseFloat(pay.amount).toFixed(2),
            pay.method,
            pay.status,
            new Date(pay.timestamp).toLocaleString()
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `payment-ledger-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="admin_section payment_logs">
            <div className="section_header">
                <div className="header_text">
                    <h3>Financial Ledger</h3>
                    <p>Track all platform transactions and payouts</p>
                </div>
                <button className="add_btn_primary" style={{ background: '#64748b' }} onClick={exportToCSV}>
                    <Download size={20} />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="payment_table_container">
                <table className="admin_orders_table">
                    <thead>
                        <tr>
                            <th>Txn ID</th>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty_table_cell">
                                    <div className="empty_state">
                                        <CreditCard size={48} />
                                        <p>No transactions recorded yet</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            payments.map((pay) => {
                                const style = getStatusStyle(pay.status);
                                return (
                                    <tr key={pay.id}>
                                        <td><div className="txn_id"><FileText size={14} /> {pay.id.substring(0, 12)}...</div></td>
                                        <td>#{pay.orderId}</td>
                                        <td>{pay.customer}</td>
                                        <td><strong>₹{parseFloat(pay.amount).toFixed(2)}</strong></td>
                                        <td>{pay.method}</td>
                                        <td>
                                            <span className="status_badge" style={{ backgroundColor: style.bg, color: style.color }}>
                                                {pay.status === 'SUCCESS' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {pay.status}
                                            </span>
                                        </td>
                                        <td>{new Date(pay.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPayments;
