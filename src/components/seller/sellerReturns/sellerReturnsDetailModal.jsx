// =============================================================================
// FILE: sellerReturnsDetailModal.jsx
// =============================================================================
import React from 'react';
import { X, Check, XCircle, Clock, User, Package, CreditCard, MessageSquare } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const SellerReturnsDetailModal = ({ returnData, statusMap, onClose, onApprove, onReject }) => {
    if (!returnData) return null;
    const st = statusMap[returnData.status] || statusMap.pending;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#111] z-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">جزئیات درخواست</h3>
                        <p className="text-xs text-gray-500">{returnData.trackingCode}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    {/* Product + Customer */}
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 min-w-[64px] min-h-[64px] flex-shrink-0 rounded-xl bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center overflow-hidden">
                            <LazyLoadImage src={returnData.product.image} alt={returnData.product.name} effect="blur" wrapperClassName="w-full h-full flex items-center justify-center" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{returnData.product.name}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><User size={12} />{returnData.customer}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} />{returnData.requestDate}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${st.color}`}>{st.label}</span>
                    </div>

                    {/* Amount */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"><CreditCard size={16} />مبلغ مرجوعی</span>
                        <span className="text-lg font-extrabold text-[#002874] dark:text-[#4C6FB6]">{returnData.refundAmount} تومان</span>
                    </div>

                    {/* Reason */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><MessageSquare size={16} className="text-[#002874] dark:text-[#4C6FB6]" />دلیل مرجوعی</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{returnData.reason}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{returnData.description}</p>
                    </div>
                </div>

                {/* Actions */}
                {returnData.status === 'pending' && (
                    <div className="flex gap-3 p-5 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-[#111]">
                        <button onClick={onReject} className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-200 dark:border-red-800 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <XCircle size={18} />
                            رد درخواست
                        </button>
                        <button onClick={onApprove} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors">
                            <Check size={18} />
                            تأیید درخواست
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerReturnsDetailModal;