// =============================================================================
// FILE: sellerReturns.jsx (اصلاح‌شده - Fuse.js + صفحه‌بندی)
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Fuse from 'fuse.js';
import SellerReturnsFilterBar from './sellerReturnsFilterBar';
import SellerReturnsCard from './sellerReturnsCard';
import SellerReturnsEmpty from './sellerReturnsEmpty';
import SellerReturnsSkeleton from './sellerReturnsSkeleton';
import SellerReturnsDetailModal from './sellerReturnsDetailModal';
import ProductsPagination from '../sellerProducts/productsPagination';
import { getCatalogProducts } from '../../../services/catalogApi.js';

const ITEMS_PER_PAGE = 8;

const statusMap = {
    pending: { label: 'در انتظار بررسی', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
    approved: { label: 'تأیید شده', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    rejected: { label: 'رد شده', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
    completed: { label: 'تکمیل شده', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
};

const SellerReturns = () => {
    const [returns, setReturns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReturn, setSelectedReturn] = useState(null);

    useEffect(() => {
        const load = async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            const allProducts = [];
            const reasons = ['کالا آسیب دیده', 'مغایرت با توضیحات', 'کیفیت نامناسب', 'ارسال کالای اشتباه', 'انصراف از خرید'];
            const customers = ['علی محمدی', 'سارا رضایی', 'محمد کریمی', 'مریم حسینی'];

            const sample = allProducts.slice(0, 8).map((p, idx) => ({
                id: idx + 1,
                product: p,
                customer: customers[idx % 4],
                reason: reasons[idx % 5],
                status: ['pending', 'pending', 'approved', 'rejected', 'completed'][idx % 5],
                requestDate: new Date(Date.now() - (idx + 1) * 2 * 86400000).toLocaleDateString('fa-IR'),
                trackingCode: `RET-${String(idx + 1).padStart(4, '0')}`,
                refundAmount: p.price,
                description: 'مشتری توضیح داده که محصول با مشکل مواجه شده است.',
            }));
            setReturns(sample);
            setIsLoading(false);
        };
        load();
    }, []);

    // Fuse.js برای جستجو
    const fuse = useMemo(() => {
        return new Fuse(returns, {
            keys: ['customer', 'trackingCode', 'product.name', 'reason'],
            threshold: 0.3,
        });
    }, [returns]);

    const filtered = useMemo(() => {
        let result = searchQuery.trim() ? fuse.search(searchQuery.trim()).map(r => r.item) : [...returns];

        if (filterStatus !== 'all') result = result.filter(r => r.status === filterStatus);

        switch (sortBy) {
            case 'oldest': result.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate)); break;
            case 'amount': result.sort((a, b) => parseInt(String(b.refundAmount).replace(/[^\d]/g, '')) - parseInt(String(a.refundAmount).replace(/[^\d]/g, ''))); break;
            default: result.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
        }
        return result;
    }, [returns, filterStatus, sortBy, searchQuery, fuse]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [filterStatus, sortBy, searchQuery]);

    const handleAction = (id, action) => {
        setReturns(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
        toast.success(action === 'approved' ? 'درخواست تأیید شد' : 'درخواست رد شد');
        setSelectedReturn(null);
    };

    if (isLoading) return <SellerReturnsSkeleton />;

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">درخواست‌های مرجوعی</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filtered.length} درخواست</p>
                </div>
            </div>

            <SellerReturnsFilterBar
                filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                sortBy={sortBy} setSortBy={setSortBy}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            />

            {filtered.length === 0 ? (
                <SellerReturnsEmpty hasFilter={filterStatus !== 'all' || !!searchQuery} />
            ) : (
                <>
                    <div className="space-y-3">
                        {paginated.map(ret => (
                            <SellerReturnsCard
                                key={ret.id}
                                returnData={ret}
                                statusMap={statusMap}
                                onView={() => setSelectedReturn(ret)}
                            />
                        ))}
                    </div>
                    {filtered.length > ITEMS_PER_PAGE && (
                        <ProductsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                </>
            )}

            {selectedReturn && (
                <SellerReturnsDetailModal
                    returnData={selectedReturn}
                    statusMap={statusMap}
                    onClose={() => setSelectedReturn(null)}
                    onApprove={() => handleAction(selectedReturn.id, 'approved')}
                    onReject={() => handleAction(selectedReturn.id, 'rejected')}
                />
            )}
        </div>
    );
};

export default SellerReturns;