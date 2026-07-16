// =============================================================================
// FILE: privacyContent.jsx
// =============================================================================
import React, { useState } from 'react';
import { ChevronDown, Shield, Lock, Eye, User, Database, Bell, Globe, Trash2, Clock, AlertCircle } from 'react-feather';

const sections = [
    {
        id: 1,
        icon: User,
        title: 'اطلاعاتی که جمع‌آوری می‌کنیم',
        color: 'from-blue-500 to-blue-600',
        content: [
            { subtitle: 'اطلاعات حساب کاربری', text: 'نام، نام خانوادگی، شماره موبایل، ایمیل و آدرس هنگام ثبت‌نام یا ثبت سفارش.' },
            { subtitle: 'اطلاعات تراکنش', text: 'سوابق خرید، مبالغ پرداختی، روش پرداخت. اطلاعات بانکی شما نزد ما ذخیره نمی‌شود.' },
            { subtitle: 'اطلاعات فنی', text: 'آدرس IP، نوع مرورگر، سیستم عامل، صفحات بازدیدشده و مدت زمان بازدید.' },
            { subtitle: 'اطلاعات موقعیت مکانی', text: 'با اجازه شما، موقعیت تقریبی برای پیشنهاد فروشگاه‌های نزدیک و محاسبه هزینه ارسال.' },
        ],
    },
    {
        id: 2,
        icon: Eye,
        title: 'نحوه استفاده از اطلاعات',
        color: 'from-green-500 to-green-600',
        content: [
            { subtitle: 'پردازش سفارشات', text: 'برای ثبت، پیگیری و ارسال سفارشات شما.' },
            { subtitle: 'ارتباط با مشتری', text: 'ارسال اعلان‌ها، تأییدیه‌های سفارش و پاسخ به سوالات پشتیبانی.' },
            { subtitle: 'بهبود خدمات', text: 'تحلیل رفتار کاربران برای بهبود تجربه کاربری و پیشنهاد محصولات مرتبط.' },
            { subtitle: 'بازاریابی', text: 'با اجازه شما، ارسال خبرنامه، تخفیف‌ها و پیشنهادات ویژه.' },
        ],
    },
    {
        id: 3,
        icon: Shield,
        title: 'امنیت اطلاعات',
        color: 'from-purple-500 to-purple-600',
        content: [
            { subtitle: 'رمزنگاری SSL', text: 'تمامی ارتباطات بین مرورگر شما و سرورهای ما با پروتکل SSL رمزنگاری می‌شود.' },
            { subtitle: 'عدم ذخیره اطلاعات بانکی', text: 'اطلاعات کارت بانکی مستقیماً به درگاه پرداخت ارسال می‌شود و نزد ما ذخیره نمی‌گردد.' },
            { subtitle: 'محدودیت دسترسی', text: 'فقط کارکنان مجاز به اطلاعات کاربران دسترسی دارند و این دسترسی‌ها لاگ می‌شود.' },
            { subtitle: 'بروزرسانی امنیتی', text: 'سرورهای ما به‌طور مداوم پچ‌های امنیتی دریافت می‌کنند و تست نفوذ می‌شوند.' },
        ],
    },
    {
        id: 4,
        icon: Database,
        title: 'ذخیره‌سازی و حذف اطلاعات',
        color: 'from-orange-500 to-orange-600',
        content: [
            { subtitle: 'مدت ذخیره‌سازی', text: 'اطلاعات شما تا زمانی که حساب کاربری فعال دارید نگهداری می‌شود.' },
            { subtitle: 'حق حذف', text: 'شما می‌توانید در هر زمان درخواست حذف کامل اطلاعات خود را از طریق پشتیبانی ثبت کنید.' },
            { subtitle: 'پشتیبان‌گیری', text: 'از اطلاعات به‌صورت روزانه پشتیبان‌گیری می‌شود و در سرورهای امن نگهداری می‌گردد.' },
        ],
    },
    {
        id: 5,
        icon: Globe,
        title: 'اشتراک‌گذاری با اشخاص ثالث',
        color: 'from-teal-500 to-teal-600',
        content: [
            { subtitle: 'عدم فروش اطلاعات', text: 'ما هرگز اطلاعات شخصی شما را به شخص یا سازمان ثالث نمی‌فروشیم.' },
            { subtitle: 'شرکت‌های حمل‌ونقل', text: 'برای ارسال کالا، نام، آدرس و شماره تماس شما در اختیار شرکت حمل‌ونقل قرار می‌گیرد.' },
            { subtitle: 'الزامات قانونی', text: 'در صورت درخواست مراجع قضایی ذی‌صلاح، اطلاعات مطابق قانون ارائه خواهد شد.' },
        ],
    },
    {
        id: 6,
        icon: Bell,
        title: 'حقوق کاربر',
        color: 'from-rose-500 to-rose-600',
        content: [
            { subtitle: 'حق دسترسی', text: 'می‌توانید درخواست کنید چه اطلاعاتی از شما داریم.' },
            { subtitle: 'حق اصلاح', text: 'اطلاعات نادرست خود را از طریق پنل کاربری یا پشتیبانی اصلاح کنید.' },
            { subtitle: 'حق فراموشی', text: 'درخواست حذف تمام اطلاعات خود را ثبت کنید.' },
            { subtitle: 'حق اعتراض', text: 'می‌توانید به نحوه پردازش اطلاعات خود اعتراض کنید.' },
        ],
    },
];

const SectionCard = ({ section }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${section.color} text-white`}>
                        <section.icon size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            {section.id}. {section.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {section.content.length} بند
                        </p>
                    </div>
                </div>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="space-y-4 pt-5">
                        {section.content.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-[#002874] dark:bg-[#4C6FB6] rounded-full"></span>
                                    {item.subtitle}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrivacyContent = () => (
    <div className="space-y-4 mb-8">
        {/* Introduction */}
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20">
                    <AlertCircle size={24} className="text-[#002874] dark:text-[#4C6FB6]" />
                </div>
                <div>
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">آخرین به‌روزرسانی</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">۱۵ فروردین ۱۴۰۴</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                این سیاست حریم خصوصی توضیح می‌دهد که فروشگاه اینترنتی کیان شاپ چگونه اطلاعات شخصی شما را جمع‌آوری، استفاده، ذخیره و محافظت می‌کند.
                با استفاده از خدمات ما، شما با شرایط این سیاست موافقت می‌کنید. لطفاً آن را با دقت مطالعه فرمایید.
            </p>
        </div>

        {/* Sections */}
        {sections.map(section => (
            <SectionCard key={section.id} section={section} />
        ))}

        {/* Contact */}
        <div className="bg-gradient-to-r from-[#002874] to-[#4C6FB6] rounded-2xl p-6 sm:p-8 text-center text-white">
            <Shield size={32} className="mx-auto mb-3" />
            <h3 className="text-xl font-extrabold mb-2">سوالی درباره حریم خصوصی دارید؟</h3>
            <p className="text-sm text-white/70 mb-4 max-w-md mx-auto">
                اگر سوال یا نگرانی درباره نحوه استفاده از اطلاعات خود دارید، با ما تماس بگیرید.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="mailto:privacy@kianshop.ir" className="px-6 py-3 bg-white text-[#002874] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                    privacy@kianshop.ir
                </a>
                <a href="tel:02112345678" className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-medium text-sm hover:bg-white/30 transition-colors">
                    ۰۲۱-۱۲۳۴۵۶۷۸
                </a>
            </div>
        </div>
    </div>
);

export default PrivacyContent;