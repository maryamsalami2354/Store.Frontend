// src/components/seller/sellerProducts/OperationConfirmModal.jsx
import React from 'react';
import { X, AlertTriangle, Eye, Edit2, Trash2, Info } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const OperationConfirmModal = ({ isOpen, type, product, onClose, onConfirm }) => {
    if (!product) return null;

    const configs = {
        delete: {
            icon: AlertTriangle,
            iconBg: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
            title: 'حذف محصول',
            message: (product) => (
                <>
                    آیا از حذف محصول <strong>{product.name}</strong> اطمینان دارید؟
                </>
            ),
            warning: 'این عملیات قابل بازگشت نیست.',
            confirmText: 'حذف',
            confirmColor: 'bg-red-600 hover:bg-red-700',
            onAction: () => onConfirm?.(product),
        },
        edit: {
            icon: Edit2,
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            title: 'ویرایش محصول',
            message: (product) => (
                <>
                    در حال ویرایش محصول <strong>{product.name}</strong> هستید.
                </>
            ),
            warning: 'پس از ویرایش، تغییرات در فروشگاه اعمال خواهد شد.',
            confirmText: 'ادامه به ویرایش',
            confirmColor: 'bg-blue-600 hover:bg-blue-700',
            onAction: () => {
                window.location.href = `/seller/products/edit/${product.id}`;
            },
        },
        view: {
            icon: Eye,
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
            title: 'مشاهده محصول',
            message: (product) => (
                <>
                    در حال مشاهده محصول <strong>{product.name}</strong> در فروشگاه هستید.
                </>
            ),
            warning: 'این صفحه همان چیزی است که مشتریان می‌بینند.',
            confirmText: 'مشاهده در فروشگاه',
            confirmColor: 'bg-green-600 hover:bg-green-700',
            onAction: () => {
                window.location.href = `/product/${product.id}`;
            },
        },
        info: {
            icon: Info,
            iconBg: 'bg-gray-100 dark:bg-gray-900/30',
            iconColor: 'text-gray-600 dark:text-gray-400',
            title: 'جزئیات محصول',
            message: (product) => (
                <div className="space-y-2">
                    <p><strong>نام:</strong> {product.name}</p>
                    <p><strong>قیمت:</strong> {product.price} تومان</p>
                    <p><strong>موجودی:</strong> {product.stock || 0} عدد</p>
                    <p><strong>تخفیف:</strong> {product.discount || 0}%</p>
                    {product.oldPrice && <p><strong>قیمت قبلی:</strong> {product.oldPrice} تومان</p>}
                </div>
            ),
            warning: null,
            confirmText: 'بستن',
            confirmColor: 'bg-gray-600 hover:bg-gray-700',
            onAction: () => onClose?.(),
        },
    };

    const config = configs[type] || configs.info;
    const Icon = config.icon;

    const handleConfirm = () => {
        config.onAction();
        if (type !== 'edit' && type !== 'view') {
            onClose?.();
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
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${config.iconBg}`}>
                                    <Icon size={20} className={config.iconColor} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{config.title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="text-gray-700 dark:text-gray-300">
                                {config.message(product)}
                            </div>
                            {config.warning && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-start gap-1">
                                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                                    <span>{config.warning}</span>
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                            {type !== 'info' && (
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                >
                                    انصراف
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 py-2.5 rounded-xl text-white font-medium transition ${config.confirmColor}`}
                            >
                                {config.confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OperationConfirmModal;