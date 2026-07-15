// src/components/singleProduct/modals/shareModal.jsx
import React from 'react';
import { X, Copy, ChevronLeft } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ShareModal = ({ isOpen, onClose, product }) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = encodeURIComponent(`${product?.name} - ${product?.price} تومان`);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        toast.success('لینک کپی شد');
    };

    const shareLinks = [
        {
            name: 'واتساپ',
            href: `https://wa.me/?text=${text}%20${url}`,
            bg: 'hover:bg-green-50 dark:hover:bg-green-900/20',
            textColor: 'text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400',
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
            svg: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                </svg>
            ),
        },
        {
            name: 'تلگرام',
            href: `https://t.me/share/url?url=${url}&text=${text}`,
            bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
            textColor: 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            svg: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.424-.168.56-.5.747-.822.765-.7.064-1.23-.463-1.908-.908-1.06-.695-1.66-1.128-2.688-1.806-1.188-.783-.418-1.214.26-1.916.178-.184 3.282-3.007 3.342-3.264.007-.032.014-.152-.056-.215-.07-.063-.174-.041-.248-.024-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.48-.428-.009-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.79.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.12.098.153.228.168.32.015.092.017.184.01.276z"/>
                </svg>
            ),
        },
        {
            name: 'ایمیل',
            href: `mailto:?subject=${encodeURIComponent(product?.name)}&body=${url}`,
            bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
            textColor: 'text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400',
            iconBg: 'bg-orange-100 dark:bg-orange-900/30',
            iconColor: 'text-orange-600 dark:text-orange-400',
            svg: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M22 4l-10 8L2 4"/>
                </svg>
            ),
        },
    ];

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
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-sm bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">اشتراک‌گذاری محصول</h3>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                <X size={18} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="p-5 space-y-2">
                            {shareLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${link.bg}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${link.iconBg} ${link.iconColor}`}>
                                        {link.svg}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium transition-colors ${link.textColor}`}>
                                            {link.name}
                                        </p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500">اشتراک در {link.name}</p>
                                    </div>
                                    <ChevronLeft size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 transition-colors" />
                                </a>
                            ))}

                            <button
                                onClick={handleCopyLink}
                                className="group w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-400">
                                    <Copy size={18} />
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#002874]  dark:group-hover:text-[#4C6FB6] transition-colors">
                                        کپی لینک
                                    </p>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;