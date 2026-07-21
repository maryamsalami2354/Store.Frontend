import React from 'react';

const splitParagraphs = (text) => String(text || '')
    .split(/\r?\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

const ProductIntro = ({ product }) => {
    const paragraphs = splitParagraphs(product?.description);

    return (
        <div className="space-y-6">
            <h2 className="relative pb-3 text-2xl font-extrabold text-gray-900 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-24 before:rounded before:bg-[#002874] dark:text-white dark:before:bg-[#4C6FB6]">
                معرفی محصول
            </h2>

            <div className="space-y-4 text-justify leading-8 text-gray-700 dark:text-gray-300">
                {paragraphs.length > 0 ? (
                    paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">توضیحاتی برای این محصول ثبت نشده است.</p>
                )}
            </div>
        </div>
    );
};

export default ProductIntro;
