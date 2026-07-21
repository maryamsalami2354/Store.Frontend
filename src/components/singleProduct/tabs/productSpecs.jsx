import React from 'react';
import { Cpu } from 'react-feather';

const normalizeSpecificationGroups = (product) => {
    if (Array.isArray(product?.technicalSpecifications) && product.technicalSpecifications.length > 0) {
        return product.technicalSpecifications
            .map((group) => ({
                title: group.title || 'مشخصات فنی',
                items: Array.isArray(group.items)
                    ? group.items
                        .map((item) => ({
                            label: item.label || item.key || '',
                            value: item.value || '',
                        }))
                        .filter((item) => item.label && item.value)
                    : [],
            }))
            .filter((group) => group.items.length > 0);
    }

    const attributes = Array.isArray(product?.attributes)
        ? product.attributes.filter((item) => item?.key && item?.value)
        : [];

    if (attributes.length === 0) return [];

    return [{
        title: 'ویژگی‌های محصول',
        items: attributes.map((item) => ({
            label: item.key,
            value: item.value,
        })),
    }];
};

const ProductSpecs = ({ product }) => {
    const specsGroups = normalizeSpecificationGroups(product);

    return (
        <div className="space-y-6">
            <h2 className="relative pb-3 text-2xl font-extrabold text-gray-900 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-24 before:rounded before:bg-[#002874] dark:text-white dark:before:bg-[#4C6FB6]">
                مشخصات فنی
            </h2>

            {specsGroups.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                    مشخصات فنی برای این محصول ثبت نشده است.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {specsGroups.map((group, groupIdx) => (
                        <div
                            key={`${group.title}-${groupIdx}`}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50"
                        >
                            <div className="flex items-center gap-3 border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
                                <div className="rounded-xl bg-[#002874]/10 p-2 dark:bg-[#4C6FB6]/20">
                                    <Cpu size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{group.title}</h3>
                            </div>

                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                {group.items.map((item, itemIdx) => (
                                    <div
                                        key={`${item.label}-${itemIdx}`}
                                        className="flex items-center justify-between gap-4 p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#002874] dark:bg-[#4C6FB6]" />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                                        </div>
                                        <span className="min-w-0 text-left text-xs font-medium text-gray-800 dark:text-gray-200">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductSpecs;
