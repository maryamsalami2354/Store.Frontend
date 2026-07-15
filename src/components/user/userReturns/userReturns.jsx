// =============================================================================
// FILE: userReturns.jsx
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import productsData from '../../../../public/jsons/products.json';
import UserReturnsFilterBar from './userReturnsFilterBar';
import UserReturnsCard from './userReturnsCard';
import UserReturnsEmpty from './userReturnsEmpty';
import UserReturnsSkeleton from './userReturnsSkeleton';
import ProductsPagination from '../../seller/sellerProducts/productsPagination';

const ITEMS_PER_PAGE = 6;

const statusMap = {
    pending: { label: 'در انتظار بررسی', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
    approved: { label: 'تأیید شده', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    rejected: { label: 'رد شده', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
    completed: { label: 'تکمیل شده', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
};

const UserReturns = () => {
    const [returns, setReturns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadReturns = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const allProducts = productsData.products || [];
            const sample = allProducts.slice(0, 8).map((p, idx) => ({
                id: idx + 1,
                product: p,
                reason: ['کالا آسیب دیده', 'انصراف از خرید', 'مغایرت با توضیحات', 'کیفیت نامناسب'][idx % 4],
                status: ['pending', 'approved', 'rejected', 'completed'][idx % 4],
                requestDate: new Date(Date.now() - Math.random() * 15 * 86400000).toLocaleDateString('fa-IR'),
                trackingCode: `RET-${String(idx + 1).padStart(4, '0')}`,
                refundAmount: p.price,
            }));
            setReturns(sample);
            setIsLoading(false);
        };
        loadReturns();
    }, []);

    const filteredReturns = useMemo(() => {
        let result = [...returns];
        if (filterStatus !== 'all') {
            result = result.filter(r => r.status === filterStatus);
        }
        switch (sortBy) {
            case 'oldest': result.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate)); break;
            case 'amount': result.sort((a, b) => parseInt(b.refundAmount.replace(/[^\d]/g, '')) - parseInt(a.refundAmount.replace(/[^\d]/g, ''))); break;
            default: result.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
        }
        return result;
    }, [returns, filterStatus, sortBy]);

    const totalPages = Math.ceil(filteredReturns.length / ITEMS_PER_PAGE);
    const paginatedReturns = filteredReturns.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [filterStatus, sortBy]);

    const handleCancel = (id) => {
        setReturns(prev => prev.filter(r => r.id !== id));
        toast.success('درخواست مرجوعی لغو شد');
    };

    if (isLoading) return <UserReturnsSkeleton />;

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">درخواست‌های مرجوعی</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filteredReturns.length} درخواست</p>
                </div>
            </div>

            <UserReturnsFilterBar
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            {filteredReturns.length === 0 ? (
                <UserReturnsEmpty hasFilter={filterStatus !== 'all'} />
            ) : (
                <>
                    <div className="space-y-3">
                        {paginatedReturns.map(ret => (
                            <UserReturnsCard
                                key={ret.id}
                                returnData={ret}
                                statusMap={statusMap}
                                onCancel={() => handleCancel(ret.id)}
                            />
                        ))}
                    </div>
                    {filteredReturns.length > ITEMS_PER_PAGE && (
                        <ProductsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default UserReturns;