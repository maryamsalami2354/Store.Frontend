// src/components/singleProduct/tabs/productSpecs.jsx
import React from 'react';
import { Cpu, Monitor, Anchor, Maximize2, Layers, Truck, Clock, Hash, Shield, Zap, Wifi, Battery, Camera, HardDrive } from 'react-feather';

const ProductSpecs = ({ product }) => {
    const specsGroups = [
        {
            title: 'مشخصات کلی',
            icon: Cpu,
            items: [
                { label: 'نوع محصول', value: product?.categoryId === 1 ? 'گوشی موبایل' : 'کالای دیجیتال' },
                { label: 'برند', value: product?.brandName || 'نامشخص' },
                { label: 'کد محصول', value: product?.sku || `SKU-${product?.id}` },
                { label: 'وضعیت', value: product?.status === 'active' ? 'فعال' : 'غیرفعال' },
                { label: 'مدل', value: product?.name?.split(' ').slice(0, 3).join(' ') || '---' },
                { label: 'کشور سازنده', value: 'چین' },
                { label: 'تاریخ عرضه', value: '۱۴۰۳/۰۶/۱۵' },
            ]
        },
        {
            title: 'مشخصات فیزیکی',
            icon: Anchor,
            items: [
                { label: 'وزن', value: product?.weight ? `${product.weight} کیلوگرم` : '۰.۲۵ کیلوگرم' },
                { label: 'ابعاد', value: product?.dimensions ? `${product.dimensions.length}×${product.dimensions.width}×${product.dimensions.height} سانتی‌متر` : '۱۵×۸×۳ سانتی‌متر' },
                { label: 'جنس بدنه', value: 'پلاستیک فشرده - فلز' },
                { label: 'مقاومت', value: 'مقاوم در برابر ضربه و خط و خش' },
                { label: 'تعداد رنگ', value: product?.colors?.length ? `${product.colors.length} رنگ` : '۳ رنگ' },
                { label: 'نوع بسته‌بندی', value: 'جعبه مقوایی مقاوم' },
            ]
        },
        {
            title: 'مشخصات فنی',
            icon: Zap,
            items: [
                { label: 'پردازنده', value: 'Snapdragon 8 Gen 3' },
                { label: 'حافظه RAM', value: '۱۲ گیگابایت' },
                { label: 'حافظه داخلی', value: '۲۵۶ گیگابایت' },
                { label: 'پشتیبانی از کارت حافظه', value: 'MicroSD تا ۱ ترابایت' },
                { label: 'سیستم عامل', value: 'Android 14' },
                { label: 'باتری', value: '۵۰۰۰ میلی‌آمپر ساعت' },
                { label: 'شارژ سریع', value: 'پشتیبانی از ۶۷ وات' },
                { label: 'نوع شارژ', value: 'USB Type-C' },
            ]
        },
        {
            title: 'صفحه نمایش',
            icon: Monitor,
            items: [
                { label: 'نوع صفحه نمایش', value: 'Super AMOLED' },
                { label: 'اندازه', value: '۶.۷ اینچ' },
                { label: 'رزولوشن', value: '۱۴۴۰×۳۲۰۰ پیکسل' },
                { label: 'نرخ نوسازی', value: '۱۲۰ هرتز تطبیقی' },
                { label: 'حداکثر روشنایی', value: '۲۰۰۰ نیت' },
                { label: 'محافظ صفحه', value: 'Gorilla Glass Victus 2' },
            ]
        },
        {
            title: 'دوربین',
            icon: Camera,
            items: [
                { label: 'دوربین اصلی', value: '۲۰۰ مگاپیکسل' },
                { label: 'دوربین فوق عریض', value: '۱۲ مگاپیکسل' },
                { label: 'دوربین تله‌فوتو', value: '۵۰ مگاپیکسل' },
                { label: 'دوربین سلفی', value: '۳۲ مگاپیکسل' },
                { label: 'فیلمبرداری', value: '8K@30fps, 4K@60fps' },
                { label: 'لرزشگیر', value: 'OIS + EIS' },
            ]
        },
        {
            title: 'ارتباطات',
            icon: Wifi,
            items: [
                { label: 'شبکه بی‌سیم', value: 'Wi-Fi 6E' },
                { label: 'بلوتوث', value: 'نسخه ۵.۴' },
                { label: 'NFC', value: 'پشتیبانی می‌شود' },
                { label: 'GPS', value: 'Dual Band GPS' },
                { label: 'شبکه موبایل', value: '5G' },
                { label: 'تعداد سیم کارت', value: 'دو سیم کارت' },
            ]
        },
        {
            title: 'ارسال و گارانتی',
            icon: Truck,
            items: [
                { label: 'روش ارسال', value: product?.shipping?.freeShipping ? 'رایگان' : `${product?.shipping?.shippingCost?.toLocaleString('fa-IR') || '۳۵,۰۰۰'} تومان` },
                { label: 'زمان تحویل', value: product?.shipping?.deliveryTime || '۳ تا ۵ روز کاری' },
                { label: 'گارانتی', value: '۱۸ ماهه' },
                { label: 'خدمات پس از فروش', value: '۷ روز بازگشت کالا' },
                { label: 'ارسال فوری', value: 'تهران - امروز' },
                { label: 'نوع ارسال', value: 'پیک / پست / تیپاکس' },
            ]
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white relative pb-3 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-24 before:bg-[#002874] dark:before:bg-[#4C6FB6] before:rounded">
                مشخصات فنی
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specsGroups.map((group, groupIdx) => {
                    const GroupIcon = group.icon;
                    return (
                        <div
                            key={groupIdx}
                            className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
                                <div className="p-2 rounded-xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20">
                                    <GroupIcon size={18} className="text-[#002874]  dark:text-[#4C6FB6]" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{group.title}</h3>
                            </div>

                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                {group.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#002874] dark:bg-[#4C6FB6] flex-shrink-0"></div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200 text-left">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductSpecs;