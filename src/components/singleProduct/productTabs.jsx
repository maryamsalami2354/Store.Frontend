// src/components/singleProduct/productTabs.jsx
import React, { useState } from 'react';
import ProductIntro from './tabs/productIntro';
import ProductFullIntro from './tabs/productFullIntro';
import ProductSpecs from './tabs/productSpecs';
import ProductReviews from './tabs/productReviews';
import ProductFAQ from './tabs/productFAQ';

const TABS = [
    { id: 'intro', label: 'معرفی اجمالی' },
    { id: 'fullIntro', label: 'معرفی تکمیلی' },
    { id: 'specs', label: 'مشخصات فنی' },
    { id: 'reviews', label: 'نظرات' },
    { id: 'faq', label: 'پرسش و پاسخ' },
];

const ProductTabs = ({ product }) => {
    const [activeTab, setActiveTab] = useState('intro');

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Tab Header - Sticky */}
            <div className="sticky top-0 z-20 flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto bg-white dark:bg-[#111]">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 lg:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'border-[#002874] text-[#002874]  dark:border-[#4C6FB6] dark:text-[#4C6FB6]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 lg:p-6">
                {activeTab === 'intro' && <ProductIntro product={product} />}
                {activeTab === 'fullIntro' && <ProductFullIntro product={product} />}
                {activeTab === 'specs' && <ProductSpecs product={product} />}
                {activeTab === 'reviews' && <ProductReviews productId={product?.id} productName={product?.name} />}
                {activeTab === 'faq' && <ProductFAQ productId={product?.id} />}
            </div>
        </div>
    );
};

export default ProductTabs;