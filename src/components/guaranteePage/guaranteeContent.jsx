// =============================================================================
// FILE: guaranteeContent.jsx
// =============================================================================
import React, { useState } from 'react';
import { ChevronDown, Award, Clock, FileText, RotateCcw, Phone, CheckCircle, Shield, AlertCircle } from 'react-feather';

const sections = [
    {
        id: 1,
        icon: Award,
        title: 'انواع گارانتی',
        color: 'from-amber-500 to-orange-600',
        content: [
            { subtitle: 'گارانتی طلایی (۱۸ ماه)', text: 'شامل تمام محصولات الکترونیکی و دیجیتال. پوشش کامل قطعات و خدمات پس از فروش.' },
            { subtitle: 'گارانتی نقره‌ای (۱۲ ماه)', text: 'شامل لوازم خانگی و محصولات با کارکرد متوسط. تعمیر یا تعویض رایگان.' },
            { subtitle: 'گارانتی استاندارد (۶ ماه)', text: 'شامل محصولات جانبی و لوازم مصرفی. پوشش ایرادات فنی و تولید.' },
        ],
    },
    {
        id: 2,
        icon: Shield,
        title: 'خدمات تحت پوشش',
        color: 'from-green-500 to-green-600',
        content: [
            { subtitle: 'تعمیر رایگان', text: 'در صورت بروز ایراد فنی، محصول به‌صورت رایگان تعمیر می‌شود.' },
            { subtitle: 'تعویض کالا', text: 'اگر کالا قابل تعمیر نباشد، با نمونه سالم و مشابه تعویض می‌شود.' },
            { subtitle: 'بازگشت وجه', text: 'در صورت عدم امکان تعمیر یا تعویض، وجه پرداختی به شما بازگردانده می‌شود.' },
            { subtitle: 'پشتیبانی ۲۴/۷', text: 'تیم پشتیبانی ما در هر ساعت از شبانه‌روز آماده پاسخگویی است.' },
        ],
    },
    {
        id: 3,
        icon: FileText,
        title: 'شرایط استفاده از گارانتی',
        color: 'from-blue-500 to-blue-600',
        content: [
            { subtitle: 'ارائه فاکتور', text: 'برای استفاده از گارانتی، ارائه فاکتور خرید یا شماره سفارش الزامی است.' },
            { subtitle: 'عدم آسیب فیزیکی', text: 'گارانتی شامل آسیب‌های فیزیکی، ضربه، نفوذ مایعات و سوختگی نمی‌شود.' },
            { subtitle: 'پلمپ سالم', text: 'برچسب‌ها و پلمپ‌های گارانتی باید سالم و دست‌نخورده باشند.' },
            { subtitle: 'استفاده صحیح', text: 'گارانتی فقط ایرادات ناشی از تولید و عملکرد عادی را پوشش می‌دهد.' },
        ],
    },
    {
        id: 4,
        icon: RotateCcw,
        title: 'فرآیند ثبت گارانتی',
        color: 'from-purple-500 to-purple-600',
        content: [
            { subtitle: 'گام اول: ثبت درخواست', text: 'از طریق پنل کاربری یا تماس با پشتیبانی، درخواست گارانتی ثبت کنید.' },
            { subtitle: 'گام دوم: ارسال کالا', text: 'کالا را با بسته‌بندی مناسب به آدرس اعلام‌شده ارسال کنید (هزینه ارسال با ماست).' },
            { subtitle: 'گام سوم: بررسی', text: 'کارشناسان ما ظرف ۴۸ ساعت کالا را بررسی و نتیجه را اعلام می‌کنند.' },
            { subtitle: 'گام چهارم: نتیجه', text: 'تعمیر، تعویض یا بازگشت وجه مطابق با شرایط گارانتی انجام می‌شود.' },
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
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{section.id}. {section.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{section.content.length} بند</p>
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

const GuaranteeContent = () => (
    <div className="space-y-4 mb-8">
        {/* Introduction */}
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20">
                    <Shield size={24} className="text-[#002874] dark:text-[#4C6FB6]" />
                </div>
                <div>
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">گارانتی کیان شاپ</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">تضمین کیفیت و اصالت کالا</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                کیان شاپ متعهد به ارائه محصولات با ضمانت اصالت و گارانتی معتبر است. تمامی محصولات دارای گارانتی طلایی ۱۸ ماهه،
                نقره‌ای ۱۲ ماهه یا استاندارد ۶ ماهه می‌باشند. در صورت بروز هرگونه مشکل، کافیست از طریق پنل کاربری یا
                پشتیبانی اقدام کنید تا در سریع‌ترین زمان ممکن مشکل شما حل شود.
            </p>
        </div>

        {/* Sections */}
        {sections.map(section => (
            <SectionCard key={section.id} section={section} />
        ))}

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#002874] to-[#4C6FB6] rounded-2xl p-6 sm:p-8 text-center text-white">
            <Phone size={32} className="mx-auto mb-3" />
            <h3 className="text-xl font-extrabold mb-2">نیاز به خدمات گارانتی دارید؟</h3>
            <p className="text-sm text-white/70 mb-4 max-w-md mx-auto">
                همین حالا با ما تماس بگیرید یا از طریق پنل کاربری درخواست خود را ثبت کنید.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="tel:02112345678" className="px-6 py-3 bg-white text-[#002874] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                    ۰۲۱-۱۲۳۴۵۶۷۸
                </a>
                <button className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-medium text-sm hover:bg-white/30 transition-colors">
                    ثبت درخواست گارانتی
                </button>
            </div>
        </div>
    </div>
);

export default GuaranteeContent;