// =============================================================================
// FILE: userReturnDetail.jsx (کامل - با LazyLoadImage)
// =============================================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ChevronLeft, Clock, MessageSquare } from 'react-feather';
import { toast } from 'react-toastify';
import UserReturnDetailSkeleton from './userReturnDetailSkeleton';
import UserReturnDetailTimeline from './userReturnDetailTimeline';
import UserReturnDetailActions from './userReturnDetailActions';
import { getCatalogProducts } from '../../../services/catalogApi.js';
import 'react-lazy-load-image-component/src/effects/blur.css';

const UserReturnDetail = () => {
    const { id } = useParams();
    const [returnData, setReturnData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getCatalogProducts({ page: 1, pageSize: 200 });
                const products = response.products || [];
                const product = products[parseInt(id, 10) - 1] || products[0];

                if (!product) {
                    setReturnData(null);
                    return;
                }

                setReturnData({
                    id: parseInt(id, 10),
                    product,
                    reason: 'کالا آسیب دیده',
                    description: 'بسته محصول هنگام تحویل آسیب دیده بود و جعبه آن پاره شده است.',
                    status: 'pending',
                    requestDate: '۱۴۰۴/۰۲/۲۵',
                    trackingCode: `RET-${String(id).padStart(4, '0')}`,
                    refundAmount: product.price,
                    timeline: [
                        { date: '۱۴۰۴/۰۲/۲۵', title: 'ثبت درخواست', description: 'درخواست مرجوعی ثبت شد', done: true },
                        { date: '—', title: 'بررسی کارشناس', description: 'در انتظار بررسی', done: false },
                        { date: '—', title: 'تأیید یا رد', description: '', done: false },
                        { date: '—', title: 'بازگشت وجه', description: '', done: false },
                    ],
                });
            } catch {
                setReturnData(null);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const handleCancel = () => {
        toast.success('درخواست مرجوعی لغو شد');
    };

    if (isLoading) return <UserReturnDetailSkeleton />;
    if (!returnData) return <div className="text-center py-12 text-gray-500">اطلاعات یافت نشد</div>;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link to="/user/returns" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                    <ChevronLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">جزئیات مرجوعی</h1>
                    <p className="text-xs text-gray-500">{returnData.trackingCode}</p>
                </div>
            </div>

            {/* Product Card */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-start gap-4">
                    <div className="w-20 h-20 min-w-[80px] min-h-[80px] flex-shrink-0 rounded-xl bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center overflow-hidden">
                        <LazyLoadImage
                            src={returnData.product.image}
                            alt={returnData.product.name}
                            effect="blur"
                            wrapperClassName="w-full h-full flex items-center justify-center"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Link to={`/product/${returnData.product.id}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors line-clamp-1">
                            {returnData.product.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">قیمت: {returnData.refundAmount} تومان</p>
                        <p className="text-xs text-gray-500">تاریخ درخواست: {returnData.requestDate}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex-shrink-0">
                        <Clock size={12} />
                        در انتظار بررسی
                    </span>
                </div>
            </div>

            {/* Reason */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <MessageSquare size={16} className="text-[#002874] dark:text-[#4C6FB6]" />
                    دلیل مرجوعی
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{returnData.reason}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{returnData.description}</p>
            </div>

            {/* Timeline */}
            <UserReturnDetailTimeline timeline={returnData.timeline} />

            {/* Actions */}
            {returnData.status === 'pending' && (
                <UserReturnDetailActions onCancel={handleCancel} />
            )}
        </div>
    );
};

export default UserReturnDetail;