// src/components/seller/sellerReviews/reviewReplyModal.jsx
import React, { useState } from 'react';
import { X, Send } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewReplyModal = ({ isOpen, review, onClose, onReply }) => {
    const [replyText, setReplyText] = useState(review?.reply?.text || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        onReply(review.id, replyText);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-lg bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">پاسخ به نظر {review?.customer?.name}</h3>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                <p className="text-sm text-gray-600 dark:text-gray-400">{review?.text}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">متن پاسخ</label>
                                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6]" required />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">انصراف</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#002874] text-white flex items-center justify-center gap-2"><Send size={16} /> ارسال پاسخ</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReviewReplyModal;