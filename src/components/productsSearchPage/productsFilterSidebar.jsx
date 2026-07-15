import React, { useState } from 'react';
import { ChevronDown, Star, RotateCcw, Check } from 'react-feather';

const ProductsFilterSidebar = ({
                                   categories = [],
                                   brands = [],
                                   tempFilters = {
                                       categories: [],
                                       brands: [],
                                       minPrice: '',
                                       maxPrice: '',
                                       onlyAvailable: false,
                                       onlyDiscounted: false,
                                       onlyAmazing: false,
                                       minRating: ''
                                   },
                                   onTempFilterChange,
                                   onApply,
                                   onClearAll,
                                   totalResults = 0,
                               }) => {
    const [expandedSections, setExpandedSections] = useState({
        categories: false,
        brands: false,
        price: false,
        availability: false,
        rating: false,
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCategoryChange = (categoryId) => {
        const newCategories = tempFilters.categories.includes(String(categoryId))
            ? tempFilters.categories.filter(id => id !== String(categoryId))
            : [...tempFilters.categories, String(categoryId)];
        onTempFilterChange({ categories: newCategories });
    };

    const handleBrandChange = (brandId) => {
        const newBrands = tempFilters.brands.includes(String(brandId))
            ? tempFilters.brands.filter(id => id !== String(brandId))
            : [...tempFilters.brands, String(brandId)];
        onTempFilterChange({ brands: newBrands });
    };

    const SectionHeader = ({ title, section, count }) => (
        <button
            onClick={() => toggleSection(section)}
            className="flex items-center justify-between w-full py-2.5 text-sm font-bold text-gray-900 dark:text-white hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors"
        >
      <span className="flex items-center gap-2">
        {title}
          {count > 0 && (
              <span className="text-[10px] bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] px-1.5 py-0.5 rounded-full">
            {count}
          </span>
          )}
      </span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${expandedSections[section] ? 'rotate-180' : ''}`} />
        </button>
    );

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">فیلترها</h3>
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                    <RotateCcw size={14} />
                    حذف همه
                </button>
            </div>

            {/* Scrollable Filters */}
            <div className="overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800" style={{ maxHeight: 'calc(100vh - 280px)' }}>

                {/* Categories */}
                <div className="p-4">
                    <SectionHeader title="دسته‌بندی" section="categories" count={tempFilters.categories.length} />
                    <div className={`mt-2 space-y-1.5 overflow-hidden transition-all duration-300 ${expandedSections.categories ? 'max-h-44 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="overflow-y-auto max-h-36 space-y-1.5">
                            {categories.slice(0, 10).map(cat => (
                                <label key={cat.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={tempFilters.categories.includes(String(cat.id))}
                                        onChange={() => handleCategoryChange(cat.id)}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#002874] dark:text-[#4C6FB6] flex-shrink-0"
                                    />
                                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Brands */}
                <div className="p-4">
                    <SectionHeader title="برند" section="brands" count={tempFilters.brands.length} />
                    <div className={`mt-2 space-y-1.5 overflow-hidden transition-all duration-300 ${expandedSections.brands ? 'max-h-44 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="overflow-y-auto max-h-36 space-y-1.5">
                            {brands.slice(0, 12).map(brand => (
                                <label key={brand.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={tempFilters.brands.includes(String(brand.id))}
                                        onChange={() => handleBrandChange(brand.id)}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#002874] dark:text-[#4C6FB6] flex-shrink-0"
                                    />
                                    {brand.logo && <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain rounded flex-shrink-0" />}
                                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{brand.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="p-4">
                    <SectionHeader title="محدوده قیمت" section="price" count={(tempFilters.minPrice || tempFilters.maxPrice) ? 1 : 0} />
                    <div className={`mt-2 space-y-3 overflow-hidden transition-all duration-300 ${expandedSections.price ? 'max-h-44 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex items-center gap-1.5">
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] text-gray-500 mb-1 block">از</label>
                                <input
                                    type="number"
                                    value={tempFilters.minPrice}
                                    onChange={(e) => onTempFilterChange({ minPrice: e.target.value })}
                                    placeholder="۰"
                                    className="w-full p-2 text-xs rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            <span className="text-gray-400 mt-4">-</span>
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] text-gray-500 mb-1 block">تا</label>
                                <input
                                    type="number"
                                    value={tempFilters.maxPrice}
                                    onChange={(e) => onTempFilterChange({ maxPrice: e.target.value })}
                                    placeholder="۵۰م"
                                    className="w-full p-2 text-xs rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {[
                                { label: 'زیر ۱م', min: '', max: '1000000' },
                                { label: '۱-۵م', min: '1000000', max: '5000000' },
                                { label: '۵-۱۰م', min: '5000000', max: '10000000' },
                                { label: '۱۰-۲۰م', min: '10000000', max: '20000000' },
                                { label: '+۲۰م', min: '20000000', max: '' },
                            ].map((range, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onTempFilterChange({ minPrice: range.min, maxPrice: range.max })}
                                    className={`text-[10px] px-2 py-1 rounded-lg transition-colors ${
                                        tempFilters.minPrice === range.min && tempFilters.maxPrice === range.max
                                            ? 'bg-[#002874] dark:bg-[#4C6FB6] text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#002874]/10'
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div className="p-4">
                    <SectionHeader title="وضعیت" section="availability" count={(tempFilters.onlyAvailable || tempFilters.onlyDiscounted || tempFilters.onlyAmazing) ? 1 : 0} />
                    <div className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ${expandedSections.availability ? 'max-h-36 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {[
                            { key: 'onlyAvailable', label: 'فقط کالاهای موجود' },
                            { key: 'onlyDiscounted', label: 'فقط تخفیف‌دار' },
                            { key: 'onlyAmazing', label: 'فقط شگفت‌انگیز' }
                        ].map(item => (
                            <label key={item.key} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={tempFilters[item.key]}
                                    onChange={(e) => onTempFilterChange({ [item.key]: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#002874] dark:text-[#4C6FB6] flex-shrink-0"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div className="p-4">
                    <SectionHeader title="حداقل امتیاز" section="rating" count={tempFilters.minRating ? 1 : 0} />
                    <div className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ${expandedSections.rating ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {[4, 3, 2, 1].map(rating => (
                            <button
                                key={rating}
                                onClick={() => onTempFilterChange({ minRating: tempFilters.minRating === String(rating) ? '' : String(rating) })}
                                className={`flex items-center gap-2 w-full py-2 px-3 rounded-lg transition-colors ${
                                    tempFilters.minRating === String(rating)
                                        ? 'bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6]'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                                    ))}
                                </div>
                                <span className="text-xs">و بالاتر</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Apply Button - Sticky Bottom */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] rounded-b-2xl">
                <button
                    onClick={onApply}
                    className="w-full py-3 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors flex items-center justify-center gap-2"
                >
                    <Check size={18} />
                    اعمال فیلترها
                </button>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-2">
                    {totalResults.toLocaleString('fa-IR')} محصول
                </p>
            </div>
        </div>
    );
};

export default ProductsFilterSidebar;