// =============================================================================
// FILE: comparisonPage.jsx (اصلاح نهایی - افزودن محصول کار می‌کنه)
// =============================================================================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Trash2, BarChart2 } from 'react-feather';
import productsData from '../../../public/jsons/products.json';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import ComparisonPageSkeleton from '../skeleton/ComparisonPageSkeleton/ComparisonPageSkeleton';
import ComparisonEmpty from './comparisonEmpty';
import ComparisonAddProduct from './comparisonAddProduct';
import ComparisonTable from './comparisonTable';
import ComparisonActions from './comparisonActions';
import ComparisonFloatingButton from './comparisonFloatingButton';

const MAX_COMPARE = 4;

const ComparisonPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const allProducts = useMemo(() => productsData.products || [], []);

    // محصولات انتخاب‌شده از URL
    const selectedIds = useMemo(() => {
        const ids = searchParams.get('ids');
        return ids ? ids.split(',').map(Number).filter(Boolean).slice(0, MAX_COMPARE) : [];
    }, [searchParams]);

    const selectedProducts = useMemo(() => {
        return selectedIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
    }, [selectedIds, allProducts]);

    // اگر URL خالی بود ولی products داریم، چیزی نشون نده تا loaded بشه
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 400);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    // =========================================================================
    // HANDLERS
    // =========================================================================
    const handleAddProduct = useCallback((productId) => {
        if (selectedIds.includes(productId)) {
            toast.error('این محصول قبلاً اضافه شده');
            return;
        }
        if (selectedIds.length >= MAX_COMPARE) {
            toast.error(`حداکثر ${MAX_COMPARE} محصول قابل مقایسه است`);
            return;
        }
        const newIds = [...selectedIds, productId];
        setSearchParams({ ids: newIds.join(',') });
        setShowAddModal(false); // بستن مودال بعد از افزودن
        toast.success('محصول اضافه شد');
    }, [selectedIds, setSearchParams]);

    const handleRemoveProduct = useCallback((productId) => {
        const newIds = selectedIds.filter(id => id !== productId);
        if (newIds.length === 0) {
            setSearchParams({});
        } else {
            setSearchParams({ ids: newIds.join(',') });
        }
        toast.success('محصول حذف شد');
    }, [selectedIds, setSearchParams]);

    const handleClearAll = useCallback(() => {
        setSearchParams({});
        toast.success('همه محصولات حذف شدند');
    }, [setSearchParams]);

    // =========================================================================
    // DEBUG: چک کن ببین allProducts پره یا نه
    // =========================================================================
    console.log('allProducts length:', allProducts.length);
    console.log('selectedIds:', selectedIds);
    console.log('selectedProducts:', selectedProducts.length);
    console.log('showAddModal:', showAddModal);

    if (isLoading) return <ComparisonPageSkeleton />;

    // =========================================================================
    // RENDER: حالت خالی
    // =========================================================================
    if (!selectedProducts.length) {
        return (
            <>
                <ComparisonEmpty onAdd={() => setShowAddModal(true)} />

                {/* مودال افزودن محصول */}
                {showAddModal && (
                    <ComparisonAddProduct
                        allProducts={allProducts}
                        selectedIds={selectedIds}
                        onAdd={handleAddProduct}
                        onClose={() => setShowAddModal(false)}
                        max={MAX_COMPARE}
                    />
                )}
            </>
        );
    }

    // =========================================================================
    // RENDER: صفحه اصلی مقایسه
    // =========================================================================
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                <Breadcrumb items={[{ title: 'مقایسه محصولات', link: '/comparison', icon: BarChart2 }]} />

                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">
                        مقایسه محصولات
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddModal(true)}
                            disabled={selectedIds.length >= MAX_COMPARE}
                            className="px-4 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            افزودن محصول
                        </button>
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-1.5 px-4 py-2.5 border border-red-200 dark:border-red-800 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <Trash2 size={16} />
                            حذف همه
                        </button>
                    </div>
                </div>

                {/* جدول مقایسه */}
                <ComparisonTable
                    products={selectedProducts}
                    onRemove={handleRemoveProduct}
                />

                {/* دکمه‌های پایینی */}
                <ComparisonActions products={selectedProducts} />

                {/* دکمه شناور موبایل */}
                <ComparisonFloatingButton onClick={() => setShowAddModal(true)} count={selectedIds.length} max={MAX_COMPARE} />

            </div>

            {/* مودال افزودن محصول */}
            {showAddModal && (
                <ComparisonAddProduct
                    allProducts={allProducts}
                    selectedIds={selectedIds}
                    onAdd={handleAddProduct}
                    onClose={() => setShowAddModal(false)}
                    max={MAX_COMPARE}
                />
            )}
        </div>
    );
};

export default ComparisonPage;