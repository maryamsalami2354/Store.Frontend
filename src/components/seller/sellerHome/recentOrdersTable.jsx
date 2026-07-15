// src/components/seller/SellerHome/RecentOrdersTable.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    ChevronLeft, CheckCircle, Clock, Truck, AlertCircle, XCircle,
    Eye, X, MapPin, Phone, Mail, Package as PackageIcon, CreditCard ,User
} from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import ordersData from '../../../../public/jsons/sellerOrders.json';

const statusConfig = {
    completed: { label: 'تکمیل شده', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    processing: { label: 'در حال پردازش', icon: Clock, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    shipped: { label: 'ارسال شده', icon: Truck, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
    pending: { label: 'در انتظار', icon: AlertCircle, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
    cancelled: { label: 'لغو شده', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
};

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    const status = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = status.icon;
    const customerInfo = {
        phone: order.phone || '۰۹۱۲۳۴۵۶۷۸۹',
        email: order.email || 'customer@example.com',
        address: order.address || 'تهران، خیابان ولیعصر، کوچه شهید احمدی، پلاک ۱۲',
    };
    const orderItems = order.items || [
        { name: 'گوشی شیائومی ۱۳T', quantity: 1, price: '۱۸,۵۰۰,۰۰۰' },
        { name: 'قاب محافظ', quantity: 2, price: '۳۵۰,۰۰۰' }
    ];
    const paymentInfo = {
        method: order.paymentMethod || 'درگاه بانکی (ملت)',
        refCode: order.refCode || `REF-${order.id}-۱۴۰۲`,
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111] rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${status.color}`}>
                            <StatusIcon size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">جزئیات سفارش</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                <div className="p-5 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">وضعیت سفارش</p>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                                <StatusIcon size={16} /> {status.label}
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">تاریخ ثبت</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">{order.date}</p>
                        </div>
                    </div>
                    {/* اطلاعات مشتری */}
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <div className="p-1 rounded-lg bg-[#002874]/10 dark:bg-[#4C6FB6]/20">
                                <User size={14} className="text-[#002874]  dark:text-[#4C6FB6]" />
                            </div>
                            اطلاعات مشتری
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <User size={12} className="text-gray-500" />
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                {typeof order.customer === 'object' ? order.customer?.name : order.customer}
            </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <Phone size={12} className="text-gray-500" />
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300 dir-ltr">
                {order.customer?.phone || '---'}
            </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <Mail size={12} className="text-gray-500" />
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                {order.customer?.email || '---'}
            </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <div className="p-1 rounded-lg bg-[#002874]/10 dark:bg-[#4C6FB6]/20"><PackageIcon size={14} className="text-[#002874]  dark:text-[#4C6FB6]" /></div>
                            محصولات سفارش داده شده
                        </h4>
                        <div className="space-y-3">
                            {orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">تعداد: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.price} تومان</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <div className="p-1 rounded-lg bg-[#002874]/10 dark:bg-[#4C6FB6]/20"><CreditCard size={14} className="text-[#002874]  dark:text-[#4C6FB6]" /></div>
                            اطلاعات پرداخت
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">روش پرداخت:</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{paymentInfo.method}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">کد پیگیری:</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300 dir-ltr">{paymentInfo.refCode}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-base font-bold text-gray-900 dark:text-white">جمع کل:</span>
                                <span className="text-lg font-bold text-[#002874]  dark:text-[#4C6FB6]">{order.amount} تومان</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 p-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                    <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-[#002874] text-white font-medium hover:bg-[#001d5a] transition">
                        بستن
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const RecentOrdersTable = () => {
    const [newOrders, setNewOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            await new Promise(resolve => setTimeout(resolve, 0.1));
            const filtered = ordersData.orders.filter(order => order.isNew === true);
            setNewOrders(filtered.slice(0, 5));
            setIsLoading(false);
        };
        loadOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">سفارشات جدید</h2>
                        <Skeleton width={24} height={20} borderRadius={9999} className="dark:!bg-gray-800" />
                    </div>
                    <Skeleton width={100} height={16} className="dark:!bg-gray-800" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">شماره</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مشتری</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">تاریخ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مبلغ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">وضعیت</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">جزئیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {[...Array(4)].map((_, i) => (
                            <tr key={i}>
                                <td className="px-4 py-3"><Skeleton width={70} height={16} className="dark:!bg-gray-800" /></td>
                                <td className="px-4 py-3"><Skeleton width={100} height={16} className="dark:!bg-gray-800" /></td>
                                <td className="px-4 py-3"><Skeleton width={80} height={12} className="dark:!bg-gray-800" /></td>
                                <td className="px-4 py-3"><Skeleton width={90} height={16} className="dark:!bg-gray-800" /></td>
                                <td className="px-4 py-3"><Skeleton width={80} height={24} borderRadius={9999} className="dark:!bg-gray-800" /></td>
                                <td className="px-4 py-3 text-center"><Skeleton width={24} height={24} borderRadius={8} className="dark:!bg-gray-800" /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (newOrders.length === 0) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">سفارش جدیدی موجود نیست</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">سفارشات جدید</h2>
                        <span className="px-2 py-0.5 text-xs bg-[#002874] text-white rounded-full">{newOrders.length}</span>
                    </div>
                    <Link to="/seller/orders" className="text-xs text-[#002874]  dark:text-[#4C6FB6] hover:underline flex items-center gap-0.5">
                        مشاهده همه <ChevronLeft size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">شماره</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مشتری</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">تاریخ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مبلغ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">وضعیت</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">جزئیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {newOrders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig.pending;
                            const StatusIcon = status.icon;
                            return (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                    <td className="px-4 py-3 text-sm font-medium text-[#002874]  dark:text-[#4C6FB6]">{order.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {typeof order.customer === 'object' ? order.customer?.name : order.customer}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{order.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{order.amount} تومان</td>
                                    <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={12} /> {status.label}
                    </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#002874]  dark:text-gray-400 dark:hover:text-[#4C6FB6] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                            title="مشاهده جزئیات"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            <AnimatePresence>
                {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            </AnimatePresence>
        </>
    );
};

export default RecentOrdersTable;