// src/components/user/userAddresses/addressDeleteModal.jsx
import React from 'react';
import { X, AlertTriangle } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';

const AddressDeleteModal = ({ isOpen, address, onClose, onConfirm }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={18} className="text-red-500" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">حذف آدرس</h3>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                    </div>
                    <div className="p-5">
                        <p className="text-gray-700 dark:text-gray-300">آیا از حذف آدرس «{address?.title}» اطمینان دارید؟</p>
                    </div>
                    <div className="p-5 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">انصراف</button>
                        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition">حذف</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default AddressDeleteModal;