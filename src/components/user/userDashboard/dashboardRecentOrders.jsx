// src/components/user/userDashboard/dashboardRecentOrders.jsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Clock, Eye, ChevronLeft, X, Package, MapPin, CreditCard, Truck } from 'react-feather';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
    pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { label: 'در حال پردازش', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped: { label: 'ارسال شده', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    completed: { label: 'تحویل شده', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

// مودال جزئیات سفارش (نسخه کاربر - بدون یادداشت فروشنده و بخش مدیریت)
const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    const status = statusConfig[order.status] || statusConfig.pending;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111] rounded-2xl shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">جزئیات سفارش</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* وضعیت و تاریخ */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">وضعیت سفارش</p>
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">تاریخ ثبت</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">{order.date}</p>
                        </div>
                    </div>

                    {/* کد رهگیری (اگر ارسال شده) */}
                    {order.trackingCode && (
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                            <div className="flex items-center gap-2">
                                <Truck size={18} className="text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">کد رهگیری</p>
                                    <p className="text-base font-bold text-blue-600 dark:text-blue-400 dir-ltr">{order.trackingCode}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* آدرس ارسال */}
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <MapPin size={16} className="text-[#002874]  dark:text-[#4C6FB6]" /> آدرس ارسال
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{order.address?.full || '---'}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>{order.address?.province}</span>
                            <span>{order.address?.city}</span>
                            <span>{order.address?.postalCode}</span>
                        </div>
                    </div>

                    {/* اقلام سفارش */}
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Package size={16} className="text-[#002874]  dark:text-[#4C6FB6]" /> اقلام سفارش
                        </h4>
                        <div className="space-y-3">
                            {order.items?.map((item, idx) => (
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

                    {/* اطلاعات پرداخت */}
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <CreditCard size={16} className="text-[#002874]  dark:text-[#4C6FB6]" /> اطلاعات پرداخت
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">روش پرداخت:</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{order.paymentMethod || '---'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">هزینه ارسال:</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{(order.shippingCost || 0).toLocaleString('fa-IR')} تومان</span>
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

const DashboardRecentOrders = ({ orders, isLoading }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <Skeleton width={120} height={20} className="dark:!bg-gray-800 mb-4" />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="flex-1">
                            <Skeleton width={100} height={14} className="dark:!bg-gray-800 mb-2" />
                            <Skeleton width={150} height={12} className="dark:!bg-gray-800" />
                        </div>
                        <Skeleton width={80} height={24} borderRadius={9999} className="dark:!bg-gray-800" />
                    </div>
                ))}
            </div>
        );
    }

    if (!orders?.length) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">هنوز سفارشی ثبت نشده</p>
                <Link to="/" className="mt-4 inline-block text-sm text-[#002874]  dark:text-[#4C6FB6] hover:underline">
                    رفتن به فروشگاه
                </Link>
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
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">آخرین سفارشات</h2>
                    </div>
                    <Link to="/user/orders" className="text-xs text-[#002874]  dark:text-[#4C6FB6] hover:underline flex items-center gap-0.5">
                        مشاهده همه <ChevronLeft size={14} />
                    </Link>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {orders.slice(0, 5).map(order => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        return (
                            <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                <div>
                                    <p className="text-sm font-medium text-[#002874]  dark:text-[#4C6FB6]">{order.id}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-gray-500">{order.date}</span>
                                        <span className="text-xs text-gray-700 dark:text-gray-300">{order.amount} تومان</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#002874]  hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* مودال جزئیات */}
            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default DashboardRecentOrders;