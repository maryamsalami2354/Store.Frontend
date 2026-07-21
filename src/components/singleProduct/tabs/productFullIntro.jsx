import React, { useMemo, useState } from 'react';

const splitParagraphs = (text) => String(text || '')
    .split(/\r?\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

const ProductFullIntro = ({ product }) => {
    const [expanded, setExpanded] = useState(false);
    const paragraphs = useMemo(() => splitParagraphs(product?.fullDescription), [product?.fullDescription]);
    const shouldCollapse = paragraphs.join(' ').length > 700;

    return (
        <div className="space-y-6">
            <h2 className="relative pb-3 text-2xl font-extrabold text-gray-900 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-24 before:rounded before:bg-[#002874] dark:text-white dark:before:bg-[#4C6FB6]">
                معرفی تکمیلی {product?.name || ''}
            </h2>

            {product?.image && (
                <div className="my-6 flex justify-center">
                    <img
                        src={product.image}
                        alt={product?.name}
                        className="max-h-80 max-w-full rounded-2xl border border-gray-200 object-contain shadow-lg dark:border-gray-800 sm:max-w-md lg:max-w-lg"
                    />
                </div>
            )}

            <div className={`relative space-y-4 text-justify leading-8 text-gray-700 dark:text-gray-300 ${shouldCollapse && !expanded ? 'max-h-[500px] overflow-hidden' : ''}`}>
                {paragraphs.length > 0 ? (
                    paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">معرفی تکمیلی برای این محصول ثبت نشده است.</p>
                )}

                {shouldCollapse && !expanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-[#111]" />
                )}
            </div>

            {shouldCollapse && (
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        className="rounded-xl bg-gray-100 px-8 py-3 text-sm font-medium text-gray-800 transition-all duration-200 hover:bg-[#002874] hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-[#4C6FB6]"
                    >
                        {expanded ? 'بستن متن' : 'ادامه مطلب'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductFullIntro;
