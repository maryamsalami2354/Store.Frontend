// =============================================================================
// FILE: orderDetailsModal.jsx (بازطراحی کامل - جزئیات سفارش فروشنده)
// =============================================================================
import React, { useState } from 'react';
import { X, Package, MapPin, CreditCard, Truck, Clock, User, Phone, Mail, MessageSquare, ChevronDown, Send, Check, RotateCcw } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';
import 'react-lazy-load-image-component/src/effects/blur.css';

const statusConfig = {
    pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { label: 'در حال پردازش', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped: { label: 'ارسال شده', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    completed: { label: 'تکمیل شده', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const nextStatusOptions = {
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
};

const getProductImage = (item) => item?.image || item?.productImage || item?.imagePath || '/images/products/placeholder.jpg';

const OrderDetailsModal = ({ isOpen, order, onClose, onStatusChange, onAddNote }) => {
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [activeTab, setActiveTab] = useState('items');

    if (!order) return null;

    const status = statusConfig[order.status] || statusConfig.pending;
    const availableNextStatuses = nextStatusOptions[order.status] || [];

    const handleStatusSelect = (newStatus) => {
        onStatusChange?.(order.id, newStatus);
        setShowStatusDropdown(false);
    };

    const handleAddNote = () => {
        if (!noteText.trim()) {
            toast.error('متن یادداشت را وارد کنید');
            return;
        }
        onAddNote?.(order.id, { text: noteText, type: 'seller' });
        setNoteText('');
    };

    const tabs = [
        { key: 'items', label: 'اقلام سفارش', icon: Package },
        { key: 'customer', label: 'اطلاعات مشتری', icon: User },
        { key: 'shipping', label: 'آدرس و ارسال', icon: Truck },
        { key: 'payment', label: 'پرداخت', icon: CreditCard },
        { key: 'notes', label: 'یادداشت‌ها', icon: MessageSquare },
    ];

    const ActiveIcon = tabs.find(t => t.key === activeTab)?.icon || Package;

    return (
        <AnimatePresence>
            {isOpen && (
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
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111] rounded-2xl shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-20 p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                                            سفارش {order.id}
                                        </h3>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{order.date}</span>
                                        <span>{order.amount} تومان</span>
                                        <span>{order.items?.length || 0} کالا</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Change Status Button */}
                                    {availableNextStatuses.length > 0 && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors"
                                            >
                                                <RotateCcw size={16} />
                                                تغییر وضعیت
                                                <ChevronDown size={14} />
                                            </button>
                                            {showStatusDropdown && (
                                                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-30 overflow-hidden">
                                                    {availableNextStatuses.map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => handleStatusSelect(s)}
                                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                        >
                                                            <span className={`w-2 h-2 rounded-full ${statusConfig[s]?.color?.split(' ')[0]}`} />
                                                            {statusConfig[s]?.label || s}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-1 mt-4 -mb-5 overflow-x-auto scrollbar-hide">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-sm font-medium whitespace-nowrap transition-all ${
                                            activeTab === tab.key
                                                ? 'bg-gray-50 dark:bg-gray-900/50 text-[#002874] dark:text-[#4C6FB6] border-b-2 border-[#002874] dark:border-[#4C6FB6]'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Items Tab */}
                            {activeTab === 'items' && (
                                <div className="space-y-3">
                                    {order.items?.map((item, idx) => {
                                        const imageUrl = getProductImage(item);
                                        const itemTotal = parseInt(String(item.price || '0').replace(/[^\d]/g, '')) * (item.quantity || 1);
                                        return (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                <LazyLoadImage
                                                    src={imageUrl}
                                                    effect="blur"
                                                    wrapperClassName="w-16 h-16 block flex-shrink-0"
                                                    className="w-16 h-16 object-contain rounded-xl bg-white dark:bg-gray-800 p-2"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                                                        <span>قیمت واحد: {item.price} تومان</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                        <span>تعداد: {item.quantity}</span>
                                                        {item.discount > 0 && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                                <span className="text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">٪{item.discount}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-extrabold text-[#002874] dark:text-[#4C6FB6] mt-2">
                                                        {itemTotal.toLocaleString('fa-IR')} تومان
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Customer Tab */}
                            {activeTab === 'customer' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <div className="w-16 h-16 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 flex items-center justify-center text-2xl font-bold text-[#002874] dark:text-[#4C6FB6]">
                                            {order.customer?.name?.[0] || '؟'}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{order.customer?.name || 'نامشخص'}</h4>
                                            <div className="space-y-1 mt-2 text-sm">
                                                {order.customer?.phone && (
                                                    <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Phone size={14} className="text-gray-400" />
                                                        <span dir="ltr">{order.customer.phone}</span>
                                                    </p>
                                                )}
                                                {order.customer?.email && (
                                                    <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Mail size={14} className="text-gray-400" />
                                                        <span dir="ltr">{order.customer.email}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Tab */}
                            {activeTab === 'shipping' && (
                                <div className="space-y-4">
                                    <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Truck size={20} className="text-blue-600 dark:text-blue-400" />
                                            <h4 className="font-bold text-blue-700 dark:text-blue-300">اطلاعات ارسال</h4>
                                        </div>
                                        {order.trackingCode && (
                                            <div className="mb-3">
                                                <p className="text-xs text-blue-600 dark:text-blue-400">کد رهگیری</p>
                                                <p className="text-lg font-bold text-blue-700 dark:text-blue-300 dir-ltr">{order.trackingCode}</p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div><span className="text-blue-600 dark:text-blue-400">روش ارسال:</span> {order.shippingMethod || 'پست پیشتاز'}</div>
                                            <div><span className="text-blue-600 dark:text-blue-400">هزینه:</span> {(order.shippingCost || 0).toLocaleString('fa-IR')} تومان</div>
                                        </div>
                                    </div>

                                    <div className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl">
                                        <div className="flex items-center gap-3 mb-3">
                                            <MapPin size={20} className="text-[#002874] dark:text-[#4C6FB6]" />
                                            <h4 className="font-bold text-gray-900 dark:text-white">آدرس تحویل</h4>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{order.address?.full || 'ثبت نشده'}</p>
                                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                                            {order.address?.province && <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{order.address.province}</span>}
                                            {order.address?.city && <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{order.address.city}</span>}
                                            {order.address?.postalCode && <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">کد پستی: {order.address.postalCode}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Tab */}
                            {activeTab === 'payment' && (
                                <div className="space-y-4">
                                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <CreditCard size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                                            صورتحساب
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between py-2">
                                                <span className="text-gray-500">جمع اقلام</span>
                                                <span className="text-gray-900 dark:text-white font-medium">{order.amount} تومان</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span className="text-gray-500">هزینه ارسال</span>
                                                <span className="text-gray-900 dark:text-white font-medium">{(order.shippingCost || 0).toLocaleString('fa-IR')} تومان</span>
                                            </div>
                                            {order.discountTotal > 0 && (
                                                <div className="flex justify-between py-2 text-green-600 dark:text-green-400">
                                                    <span>تخفیف</span>
                                                    <span>-{order.discountTotal.toLocaleString('fa-IR')} تومان</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between py-3 border-t border-gray-200 dark:border-gray-700 font-extrabold text-base">
                                                <span className="text-gray-900 dark:text-white">مبلغ نهایی</span>
                                                <span className="text-[#002874] dark:text-[#4C6FB6]">{order.amount} تومان</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">روش پرداخت</h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {order.paymentMethod || 'درگاه بانکی'}
                                        </p>
                                        {order.paymentDate && (
                                            <p className="text-xs text-gray-500 mt-1">تاریخ پرداخت: {order.paymentDate}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Notes Tab */}
                            {activeTab === 'notes' && (
                                <div className="space-y-4">
                                    {/* Add Note */}
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <MessageSquare size={18} className="text-[#002874] dark:text-[#4C6FB6] mt-1" />
                                        <div className="flex-1">
                                            <textarea
                                                value={noteText}
                                                onChange={(e) => setNoteText(e.target.value)}
                                                placeholder="یادداشت خود را بنویسید..."
                                                rows={3}
                                                className="w-full p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent resize-none"
                                            />
                                            <button
                                                onClick={handleAddNote}
                                                className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-lg text-sm font-medium hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors"
                                            >
                                                <Send size={14} />
                                                ثبت یادداشت
                                            </button>
                                        </div>
                                    </div>

                                    {/* Existing Notes */}
                                    {order.notes?.length > 0 ? (
                                        <div className="space-y-3">
                                            {order.notes.map((note, idx) => (
                                                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium text-[#002874] dark:text-[#4C6FB6]">
                                                            {note.type === 'seller' ? 'یادداشت فروشنده' : 'یادداشت سیستم'}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{note.date}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{note.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            یادداشتی ثبت نشده است
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 p-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                بستن
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OrderDetailsModal;
