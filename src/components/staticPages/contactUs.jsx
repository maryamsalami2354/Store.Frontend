// =============================================================================
// FILE: ContactUsComponents.jsx (اصلاح‌شده - CustomSelect + toast ساده)
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, MapPin, Clock, Send, MessageSquare,
    Instagram, Send as Telegram, Youtube, ChevronLeft, Home,
    Headphones, HelpCircle, FileText, Users
} from 'react-feather';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import CustomSelect from '../common/customSelect/customSelect';
import 'react-loading-skeleton/dist/skeleton.css';

const contactInfoData = [
    { id: 1, icon: Phone, title: 'تلفن تماس', value: '۰۲۱-۱۲۳۴۵۶۷۸', subValue: '۰۲۱-۸۷۶۵۴۳۲۱', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: 2, icon: Mail, title: 'ایمیل', value: 'info@shopmarket.ir', subValue: 'support@shopmarket.ir', color: 'from-green-500 to-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
    { id: 3, icon: MapPin, title: 'آدرس', value: 'تهران، خیابان ولیعصر، کوچه باغ', subValue: 'پلاک ۱۲۳، طبقه ۴', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
    { id: 4, icon: Clock, title: 'ساعات کاری', value: 'شنبه تا پنجشنبه', subValue: '۹ صبح تا ۹ شب', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
];

const quickLinksData = [
    { id: 1, icon: Headphones, title: 'پشتیبانی', link: '/support', description: 'سوالات متداول و راهنمایی' },
    { id: 2, icon: FileText, title: 'قوانین و مقررات', link: '/terms', description: 'شرایط استفاده از خدمات' },
    { id: 3, icon: Users, title: 'همکاری با ما', link: '/careers', description: 'فرصت‌های شغلی' },
];

const socialData = [
    { id: 1, icon: Instagram, name: 'اینستاگرام', link: '#', color: 'hover:bg-pink-500' },
    { id: 2, icon: Telegram, name: 'تلگرام', link: '#', color: 'hover:bg-blue-500' },
    { id: 3, icon: Youtube, name: 'یوتیوب', link: '#', color: 'hover:bg-red-500' },
];

const subjectOptions = [
    { value: 'support', label: 'پشتیبانی فنی' },
    { value: 'order', label: 'پیگیری سفارش' },
    { value: 'complaint', label: 'انتقادات و شکایات' },
    { value: 'suggestion', label: 'پیشنهادات' },
    { value: 'other', label: 'سایر موارد' },
];

const ContactUsComponents = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    useEffect(() => { const t = setTimeout(() => setIsLoading(false), 800); window.scrollTo(0, 0); return () => clearTimeout(t); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('لطفاً فیلدهای ضروری را تکمیل کنید');
            return;
        }
        toast.success('پیام شما با موفقیت ارسال شد');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2 mb-6"><Skeleton width={50} height={16} borderRadius={8} /><Skeleton width={12} height={12} borderRadius="50%" /><Skeleton width={80} height={16} borderRadius={8} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{[...Array(4)].map((_, i) => (<div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-4"><Skeleton circle width={40} height={40} className="mb-3" /><Skeleton width={60} height={14} borderRadius={4} className="mb-2" /><Skeleton width={120} height={18} borderRadius={8} /></div>))}</div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-2xl border p-6"><Skeleton width={150} height={24} borderRadius={8} className="mb-4" /><Skeleton height={40} borderRadius={8} className="mb-3" /><Skeleton height={40} borderRadius={8} className="mb-3" /><Skeleton height={120} borderRadius={8} className="mb-4" /><Skeleton height={44} borderRadius={12} /></div>
                        <div className="bg-white dark:bg-[#111] rounded-2xl border p-6"><Skeleton width={120} height={24} borderRadius={8} className="mb-4" />{[...Array(3)].map((_, i) => (<div key={i} className="mb-3"><Skeleton circle width={36} height={36} className="mb-2" /><Skeleton width={100} height={16} borderRadius={8} className="mb-1" /><Skeleton width={80} height={12} borderRadius={4} /></div>))}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                <nav className="py-2 sm:py-3">
                    <ol className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <li><Link to="/" className="flex items-center hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors"><Home size={14} className="ml-1" />خانه</Link></li>
                        <li className="mx-1.5 sm:mx-2"><ChevronLeft size={12} /></li>
                        <li><span className="text-gray-900 dark:text-white font-medium">تماس با ما</span></li>
                    </ol>
                </nav>

                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">تماس با ما</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">ما همیشه آماده شنیدن نظرات، پیشنهادات و انتقادات شما هستیم</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6">
                    {contactInfoData.map(info => (
                        <div key={info.id} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 group hover:shadow-lg transition-all duration-300">
                            <div className={`inline-flex p-2.5 rounded-xl ${info.bgColor} mb-3 group-hover:scale-110 transition-transform`}><info.icon size={20} className={info.iconColor} /></div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{info.title}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 dir-ltr text-right">{info.value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{info.subValue}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20"><MessageSquare size={22} className="text-[#002874] dark:text-[#4C6FB6]" /></div>
                            <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">ارسال پیام</h2><p className="text-xs text-gray-500 dark:text-gray-400">در اسرع وقت پاسخگو خواهیم بود</p></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">نام و نام خانوادگی <span className="text-red-500">*</span></label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="نام خود را وارد کنید" className="w-full p-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">ایمیل <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" className="w-full p-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">شماره تماس</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="۰۹۱۲۳۴۵۶۷۸۹" className="w-full p-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">موضوع</label>
                                    <CustomSelect options={subjectOptions} value={formData.subject} onChange={(val) => setFormData(prev => ({ ...prev, subject: val }))} placeholder="انتخاب موضوع" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">پیام شما <span className="text-red-500">*</span></label>
                                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={6} placeholder="پیام خود را بنویسید..." className="w-full p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent resize-none" />
                            </div>

                            <button type="submit" className="w-full py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors flex items-center justify-center gap-2">
                                <Send size={18} />ارسال پیام
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><HelpCircle size={18} className="text-[#002874] dark:text-[#4C6FB6]" />دسترسی سریع</h3>
                            <div className="space-y-3">
                                {quickLinksData.map(link => (
                                    <Link key={link.id} to={link.link} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-[#002874]/10 dark:group-hover:bg-[#4C6FB6]/20 transition-colors"><link.icon size={16} className="text-gray-600 dark:text-gray-400 group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6]" /></div>
                                        <div><p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors">{link.title}</p><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{link.description}</p></div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">شبکه‌های اجتماعی</h3>
                            <div className="flex items-center gap-2">
                                {socialData.map(social => (
                                    <a key={social.id} href={social.link} className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white transition-all duration-300 ${social.color}`} title={social.name}><social.icon size={18} /></a>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <div className="text-center"><MapPin size={32} className="text-gray-400 mx-auto mb-2" /><p className="text-xs text-gray-500">نقشه گوگل</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsComponents;