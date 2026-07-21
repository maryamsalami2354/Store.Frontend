// =============================================================================
// FILE: orderDetailsModal.jsx (اصلاح‌شده - نمایش کامل)
// =============================================================================
import React, { useEffect, useState } from 'react';
import { X, Package, MapPin, CreditCard, Truck, Clock, Edit3, Save } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';
import 'react-lazy-load-image-component/src/effects/blur.css';

const statusConfig = {
    pending: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { label: 'در انتظار ارسال', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped: { label: 'در حال ارسال', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    completed: { label: 'تحویل داده شد', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const getProductImage = (item) => item?.image || item?.productImage || item?.imagePath || '/images/products/placeholder.jpg';

const getAddressForm = (order) => ({
    recipientName: order?.recipientName || order?.customer?.name || '',
    recipientPhone: order?.recipientPhone || order?.customer?.phone || '',
    shippingAddress: order?.address?.full || '',
});

const OrderDetailsModal = ({ isOpen, order, onClose, onUpdateAddress }) => {
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState(getAddressForm(order));
    const [isSavingAddress, setIsSavingAddress] = useState(false);

    useEffect(() => {
        setAddressForm(getAddressForm(order));
        setIsEditingAddress(false);
    }, [order?.id, isOpen]);

    if (!order) return null;

    const status = statusConfig[order.status] || statusConfig.pending;
    const canEditAddress = Boolean(order.canEditShippingAddress) && typeof onUpdateAddress === 'function';

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddressForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelAddressEdit = () => {
        setAddressForm(getAddressForm(order));
        setIsEditingAddress(false);
    };

    const handleSaveAddress = async () => {
        if (!addressForm.recipientName.trim() || !addressForm.recipientPhone.trim() || !addressForm.shippingAddress.trim()) {
            toast.error('نام گیرنده، شماره تماس و آدرس ارسال الزامی است');
            return;
        }

        setIsSavingAddress(true);
        try {
            await onUpdateAddress(order, {
                recipientName: addressForm.recipientName.trim(),
                recipientPhone: addressForm.recipientPhone.trim(),
                shippingAddress: addressForm.shippingAddress.trim(),
            });
            setIsEditingAddress(false);
        } catch (error) {
            toast.error(error.message || 'خطا در ویرایش آدرس سفارش');
        } finally {
            setIsSavingAddress(false);
        }
    };

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
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111] rounded-2xl shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">سفارش {order.id}</h3>
                                <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* وضعیت + مبلغ */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                    <p className="text-xs text-gray-500 mb-1">وضعیت سفارش</p>
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                    <p className="text-xs text-gray-500 mb-1">مبلغ کل</p>
                                    <p className="text-lg font-extrabold text-[#002874] dark:text-[#4C6FB6]">
                                        {order.amount} تومان
                                    </p>
                                </div>
                            </div>

                            {/* کد رهگیری */}
                            {order.trackingCode && (
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-center gap-3">
                                    <Truck size={20} className="text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">کد رهگیری</p>
                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 dir-ltr">{order.trackingCode}</p>
                                    </div>
                                </div>
                            )}

                            {/* آدرس */}
                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <MapPin size={16} className="text-[#002874] dark:text-[#4C6FB6]" /> آدرس ارسال
                                    </h4>
                                    {canEditAddress && !isEditingAddress && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingAddress(true)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                        >
                                            <Edit3 size={14} />
                                            ویرایش
                                        </button>
                                    )}
                                </div>
                                {isEditingAddress ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <label className="space-y-1.5">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">نام گیرنده</span>
                                                <input
                                                    name="recipientName"
                                                    value={addressForm.recipientName}
                                                    onChange={handleAddressChange}
                                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                                                />
                                            </label>
                                            <label className="space-y-1.5">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">شماره تماس گیرنده</span>
                                                <input
                                                    name="recipientPhone"
                                                    value={addressForm.recipientPhone}
                                                    onChange={handleAddressChange}
                                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm dir-ltr text-left dark:border-gray-700 dark:bg-gray-900"
                                                />
                                            </label>
                                        </div>
                                        <label className="block space-y-1.5">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">آدرس کامل</span>
                                            <textarea
                                                name="shippingAddress"
                                                value={addressForm.shippingAddress}
                                                onChange={handleAddressChange}
                                                rows={3}
                                                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm leading-7 dark:border-gray-700 dark:bg-gray-900"
                                            />
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={handleSaveAddress}
                                                disabled={isSavingAddress}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[#002874] px-4 py-2 text-sm text-white transition hover:bg-[#001d5a] disabled:opacity-60"
                                            >
                                                <Save size={15} />
                                                {isSavingAddress ? 'در حال ذخیره...' : 'ذخیره آدرس'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancelAddressEdit}
                                                disabled={isSavingAddress}
                                                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                            >
                                                انصراف
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{order.address?.full || 'آدرس ثبت نشده'}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                            {order.recipientName && <span>گیرنده: {order.recipientName}</span>}
                                            {order.recipientPhone && <span className="dir-ltr">{order.recipientPhone}</span>}
                                            {order.address?.province && <span>{order.address.province}</span>}
                                            {order.address?.city && <span>{order.address.city}</span>}
                                            {order.address?.postalCode && <span>کد پستی: {order.address.postalCode}</span>}
                                        </div>
                                        {!canEditAddress && (
                                            <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-gray-900/60">
                                                بعد از قرار گرفتن سفارش در وضعیت در حال ارسال، امکان ویرایش آدرس وجود ندارد.
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* اقلام سفارش */}
                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                                    <Package size={16} className="text-[#002874] dark:text-[#4C6FB6]" />
                                    اقلام سفارش ({order.items?.length || 0} کالا)
                                </h4>
                                <div className="space-y-3">
                                    {order.items?.map((item, idx) => {
                                        const imageUrl = getProductImage(item);
                                        return (
                                            <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                <LazyLoadImage
                                                    src={imageUrl}
                                                    effect="blur"
                                                    wrapperClassName="w-14 h-14 block flex-shrink-0"
                                                    className="w-14 h-14 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-gray-500">{item.price} تومان</span>
                                                        <span className="text-xs text-gray-400">×</span>
                                                        <span className="text-xs text-gray-500">{item.quantity} عدد</span>
                                                        {item.discount > 0 && (
                                                            <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">٪{item.discount}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1">
                                                        {(parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity).toLocaleString('fa-IR')} تومان
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* صورتحساب */}
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                                    <CreditCard size={16} className="text-[#002874] dark:text-[#4C6FB6]" /> صورتحساب
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">جمع اقلام:</span>
                                        <span className="text-gray-700 dark:text-gray-300">{order.amount} تومان</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">هزینه ارسال:</span>
                                        <span className="text-gray-700 dark:text-gray-300">{(order.shippingCost || 0).toLocaleString('fa-IR')} تومان</span>
                                    </div>
                                    {order.discountTotal > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">تخفیف:</span>
                                            <span className="text-green-600 dark:text-green-400">-{order.discountTotal.toLocaleString('fa-IR')} تومان</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-bold">
                                        <span className="text-gray-900 dark:text-white">مبلغ نهایی:</span>
                                        <span className="text-[#002874] dark:text-[#4C6FB6]">{order.amount} تومان</span>
                                    </div>
                                </div>
                            </div>

                            {/* روش پرداخت */}
                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                    <CreditCard size={16} className="text-[#002874] dark:text-[#4C6FB6]" /> روش پرداخت
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {order.paymentMethod || 'پرداخت اینترنتی - درگاه بانکی'}
                                </p>
                            </div>

                            {/* تاریخچه وضعیت */}
                            {order.history?.length > 0 && (
                                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                                        <Clock size={16} className="text-[#002874] dark:text-[#4C6FB6]" /> تاریخچه وضعیت
                                    </h4>
                                    <div className="space-y-3">
                                        {order.history.map((h, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig[h.status]?.color || 'bg-gray-100'}`}>
                                                    <Clock size={14} />
                                                </div>
                                                <div className="flex-1 flex items-center justify-between">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {statusConfig[h.status]?.label || h.status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{h.date} - {h.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 p-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl bg-[#002874]  text-white font-medium hover:bg-[#001d5a] transition-colors"
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
