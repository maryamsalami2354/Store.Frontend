// src/components/seller/sellerProducts/ProductsList.jsx
import React from 'react';
import ProductCard from './productCard.jsx';

// اسکلتون‌ها را داخل همین فایل می‌گذاریم (برای جلوگیری از فایل اضافی)
const TableSkeleton = () => (
    <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                    {['تصویر', 'نام محصول', 'دسته‌بندی', 'قیمت', 'موجودی', 'تخفیف', 'وضعیت', 'عملیات'].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                        <td className="px-4 py-3"><div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="flex gap-2"><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" /><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" /><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" /></div></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

const MobileSkeleton = () => (
    <div className="md:hidden space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mt-2" />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                </div>
            </div>
        ))}
    </div>
);

const ProductsList = ({ isLoading, products, categories, onDelete, onEdit, onView }) => {
    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.name : 'نامشخص';
    };

    if (isLoading) {
        return (
            <>
                <TableSkeleton />
                <MobileSkeleton />
            </>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">محصولی یافت نشد</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">تصویر</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">نام محصول</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">دسته‌بندی</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">قیمت</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">موجودی</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">تخفیف</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">وضعیت</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                variant="row"
                                product={product}
                                categoryName={getCategoryName(product.categoryId)}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        variant="card"
                        product={product}
                        categoryName={getCategoryName(product.categoryId)}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </>
    );
};

export default ProductsList;