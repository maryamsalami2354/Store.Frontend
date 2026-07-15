// =============================================================================
// FILE: compareModal.jsx (اصلاح‌شده - هدایت به صفحه مقایسه)
// =============================================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';

const CompareModal = ({ isOpen, onClose, product }) => {
    const navigate = useNavigate();

    if (!product) return null;

    const handleGoToComparison = () => {
        onClose();
        navigate(`/comparison?ids=${product.id}`);
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
                        className="relative w-full max-w-lg bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >

                        {/* Header */}
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#002874]/10 dark:bg-[#4C6FB6]/20">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#002874] dark:text-[#4C6FB6]">
                                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">مقایسه محصول</h3>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 p-3">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>

                            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {product.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                این محصول را با سایر محصولات مقایسه کنید تا بهترین انتخاب را داشته باشید.
                            </p>

                            <button
                                onClick={handleGoToComparison}
                                className="w-full py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors flex items-center justify-center gap-2"
                            >
                                رفتن به صفحه مقایسه
                                <ArrowLeft size={16} />
                            </button>

                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">
                                می‌توانید تا ۴ محصول را با هم مقایسه کنید
                            </p>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CompareModal;