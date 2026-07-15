import React from 'react';
import CustomSelect from '../common/customSelect/customSelect';
const CategoryFilterSidebar = ({
                                   brands = [],
                                   tempFilters,
                                   onTempChange,
                                   onApply,
                                   onClear,
                                   totalResults,
                                   isMobile,
                               }) => {
    const handleBrandToggle = (brandId) => {
        const newBrands = tempFilters.brands.includes(brandId)
            ? tempFilters.brands.filter(id => id !== brandId)
            : [...tempFilters.brands, brandId];
        onTempChange({ brands: newBrands });
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">فیلترها</h3>
                <button onClick={onClear} className="text-xs text-red-500 hover:text-red-600">حذف همه</button>
            </div>

            {/* برند */}
            <div>
                <h4 className="text-sm font-medium mb-2">برند</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map(brand => (
                        <label key={brand.id} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={tempFilters.brands.includes(brand.id)}
                                onChange={() => handleBrandToggle(brand.id)}
                                className="rounded text-[#002874] focus:ring-[#002874]"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{brand.name}</span>
                            <span className="text-xs text-gray-400 mr-auto">({brand.productCount})</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* قیمت */}
            <div>
                <h4 className="text-sm font-medium mb-2">محدوده قیمت</h4>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="از"
                        value={tempFilters.minPrice}
                        onChange={e => onTempChange({ minPrice: e.target.value })}
                        className="w-full p-2 text-xs rounded-lg border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    <span>-</span>
                    <input
                        type="text"
                        placeholder="تا"
                        value={tempFilters.maxPrice}
                        onChange={e => onTempChange({ maxPrice: e.target.value })}
                        className="w-full p-2 text-xs rounded-lg border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                </div>
            </div>

            {/* وضعیت */}
            <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={tempFilters.onlyInStock}
                        onChange={e => onTempChange({ onlyInStock: e.target.checked })}
                        className="rounded text-[#002874] focus:ring-[#002874]"
                    />
                    <span className="text-gray-700 dark:text-gray-300">فقط کالاهای موجود</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                    <input
                        type="checkbox"
                        checked={tempFilters.onlyDiscounted}
                        onChange={e => onTempChange({ onlyDiscounted: e.target.checked })}
                        className="rounded text-[#002874] focus:ring-[#002874]"
                    />
                    <span className="text-gray-700 dark:text-gray-300">فقط تخفیف‌دار</span>
                </label>
            </div>

            <button
                onClick={onApply}
                className="w-full py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors"
            >
                اعمال فیلترها
            </button>

            <p className="text-[10px] text-gray-500 text-center">
                {totalResults.toLocaleString('fa-IR')} محصول یافت شد
            </p>
        </div>
    );
};

export default CategoryFilterSidebar;