import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../../../public/jsons/products.json';

const CategorySubCategories = ({ subcategories }) => {
    const allProducts = useMemo(() => productsData.products || [], []);

    if (!subcategories || subcategories.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">زیردسته‌ها</h3>
            <div className="flex flex-wrap gap-2">
                {subcategories.map(sub => {
                    const count = allProducts.filter(p => p.categoryId === sub.id).length;
                    return (
                        <Link
                            key={sub.id}
                            to={`/category/${sub.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-[#002874]/30 hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-all"
                        >
                            <span>{sub.name}</span>
                            {count > 0 && <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full text-gray-500">{count}</span>}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySubCategories;