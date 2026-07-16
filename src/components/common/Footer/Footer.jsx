import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Headphones, RefreshCw, Award, Shield, Phone, Video, Instagram,
    Send, Youtube, ChevronDown, ExternalLink, MapPin, ChevronRight
} from 'react-feather';
import FooterMenus from '../../../../public/jsons/footerData.json';

// Services Data (Hardcoded)
const servicesData = [
    {
        id: 1,
        title: 'پشتیبانی 24 ساعته',
        subtitle: 'تماس با 021123456',
        icon: 'Headphones',
        highlight: '24 ساعته'
    },
    {
        id: 2,
        title: 'فرصت 7 روزه بازگشت کالا',
        subtitle: 'ضمانت بازگشت کالا تا 7 روز',
        icon: 'RefreshCw',
        highlight: '7 روزه'
    },
    {
        id: 3,
        title: 'تضمین کیفیت کالا',
        subtitle: 'خرید بهترین کالای موجود',
        icon: 'Award',
        highlight: 'کیفیت'
    },
    {
        id: 4,
        title: 'پرداخت امن از درگاه بانکی',
        subtitle: 'امنیت در خریدهای آنلاین',
        icon: 'Shield',
        highlight: 'درگاه بانکی'
    }
];

// Contact Data (Hardcoded)
const contactData = {
    title: 'کارشناسان ما میزبان صدایتان هستند',
    phone: '021123456',
    phoneDisplay: '021-123456'
};

// Symbols Data (Hardcoded)
const symbolsData = [
    { id: 1, name: 'نماد اعتماد الکترونیکی', image: '/images/namad/enamad.png' },
    { id: 2, name: 'نماد ساماندهی', image: '/images/namad/namad-01.png' },
    { id: 3, name: 'نماد رسانه', image: '/images/namad/rezi.png' }
];

// Social Data (Hardcoded)
const socialData = [
    { id: 1, name: 'آپارات', icon: 'Video', link: '#' },
    { id: 2, name: 'اینستاگرام', icon: 'Instagram', link: '#' },
    { id: 3, name: 'تلگرام', icon: 'Send', link: '#' },
    { id: 4, name: 'یوتیوب', icon: 'Youtube', link: '#' }
];

// Footer Info (Hardcoded)
const footerInfo = {
    description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد',
    copyright: 'تمامی حقوق مادی و معنوی برای فروشگاه اینترنتی کیان شاپ محفوظ می‌باشد.',
    designer: 'مهرداد وفایی منش',
    designerLink: '#'
};

const Footer = () => {
    const [menusData, setMenusData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileExpandedSection, setMobileExpandedSection] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = FooterMenus;
                setMenusData(data);
            } catch (error) {
                console.error('Error loading footer data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Service icon component with gradient background
    const ServiceIcon = ({ icon, serviceId }) => {
        const iconComponents = { Headphones, RefreshCw, Award, Shield };
        const Icon = iconComponents[icon] || Headphones;

        const gradients = [
            'from-[#43386B] to-[#7662BD]',
            'from-[#236568] to-[#2F878A]',
            'from-[#CC8241] to-[#DEA861]',
            'from-[#27DEB2] to-[#06DAAE]'
        ];

        return (
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[serviceId - 1]} flex items-center justify-center shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
        );
    };

    // Social icon component
    const SocialIcon = ({ icon }) => {
        const iconComponents = { Video, Instagram, Send, Youtube };
        const Icon = iconComponents[icon] || Send;
        return <Icon className="w-5 h-5" />;
    };

    const toggleMobileSection = (id) => {
        setMobileExpandedSection(mobileExpandedSection === id ? null : id);
    };

    if (loading) {
        return (
            <footer className="bg-gray-100 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#002874] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            {/* Services Section */}
            <div className="bg-gray-100 dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {servicesData.map((service) => (
                            <div
                                key={service.id}
                                className="group flex items-center p-3 rounded-2xl hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
                            >
                                <ServiceIcon icon={service.icon} serviceId={service.id} />
                                <div className="ms-4">
                                    <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                                        {service.title.replace(service.highlight, '')}
                                        <strong className="text-[#002874]  dark:text-[#4C6FB6]">
                                            {service.highlight}
                                        </strong>
                                    </p>
                                    <small className="text-xs text-gray-500 dark:text-gray-400">
                                        {service.subtitle}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-10 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Menus Section - Desktop */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {menusData?.menus?.map((menu) => (
                                <div key={menu.id} className="hidden md:block">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
                                        <strong className="text-[#002874]  dark:text-[#4C6FB6]">
                                            {menu.titleBold}&nbsp;
                                        </strong>
                                        {menu.titleRest}
                                    </h3>
                                    <nav className="flex flex-col space-y-3">
                                        {menu.items.map((item, idx) => (
                                            <Link
                                                key={idx}
                                                to={item.link}
                                                className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition-colors duration-200"
                                            >
                                                <ChevronRight className="w-3 h-3 me-1 rotate-[-180deg] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <span>{item.name}</span>
                                                {item.badge && (
                                                    <span className="ms-2 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-[#43386B] to-[#7662BD] text-white rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Accordion Menus */}
                        <div className="md:hidden">
                            {menusData?.menus?.map((menu) => (
                                <div key={menu.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                    <button
                                        onClick={() => toggleMobileSection(menu.id)}
                                        className="flex items-center justify-between w-full py-4 text-right"
                                    >
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            <strong className="text-[#002874]  dark:text-[#4C6FB6]">
                                                {menu.titleBold}
                                            </strong>
                                            {menu.titleRest}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
                                                mobileExpandedSection === menu.id ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${
                                            mobileExpandedSection === menu.id ? 'max-h-48 pb-4' : 'max-h-0'
                                        }`}
                                    >
                                        <nav className="flex flex-col space-y-2 ps-4">
                                            {menu.items.map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={item.link}
                                                    className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition-colors py-1"
                                                >
                                                    {item.name}
                                                    {item.badge && (
                                                        <span className="ms-2 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-[#43386B] to-[#7662BD] text-white rounded-full">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact & Social Section */}
                    <div className="lg:col-span-5">
                        <div className="space-y-6">
                            {/* Contact Banner */}
                            <div className="bg-gradient-to-r from-[#002874] to-[#003399] dark:from-[#002874] dark:to-[#003399] rounded-2xl p-5 text-white shadow-xl">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium mb-2 opacity-90">
                                            {contactData.title}
                                        </p>
                                        <a
                                            href={`tel:${contactData.phone}`}
                                            className="flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition-opacity"
                                        >
                                            <Phone className="w-6 h-6" />
                                            {contactData.phoneDisplay}
                                        </a>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                </div>
                            </div>

                            {/* Symbols */}
                            <div className="flex flex-wrap items-center gap-3">
                                {symbolsData.map((symbol) => (
                                    <a
                                        key={symbol.id}
                                        href="#"
                                        className="group block"
                                        title={symbol.name}
                                    >
                                        <div className="w-20 h-20 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#002874] dark:group-hover:border-[#4C6FB6] group-hover:shadow-lg group-hover:shadow-[#002874]/20 dark:group-hover:shadow-[#4C6FB6]/20">
                                            <img
                                                src={symbol.image}
                                                alt={symbol.name}
                                                loading="lazy"
                                                className="w-full h-full object-contain dark:brightness-90"
                                            />
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Social Networks */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                                    ما را دنبال کنید
                                </p>
                                <div className="flex items-center gap-3">
                                    {socialData.map((social) => (
                                        <a
                                            key={social.id}
                                            href={social.link}
                                            className="group relative w-12 h-12 rounded-xl bg-[#002874] dark:bg-[#002874] hover:bg-[#003399] dark:hover:bg-[#003399] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg shadow-[#002874]/30"
                                            title={social.name}
                                        >
                                            <SocialIcon icon={social.icon} />
                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
                                                {social.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logo & Description Section */}
                <div className="mt-10 lg:mt-14 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        {/* Logo */}
                        <div className="hidden lg:block flex-shrink-0">
                            <Link to="/" className="block">
                                <img
                                    src="/images/logos/border-details.svg"
                                    alt="لوگو"
                                    className="h-16 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Description */}
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                {footerInfo.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-gray-100 dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="container mx-auto px-4 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center sm:text-right order-2 sm:order-1">
                            © {new Date().getFullYear()} - {footerInfo.copyright}
                        </p>
                        <a
                            href={footerInfo.designerLink}
                            className="text-xs text-[#002874]  dark:text-[#4C6FB6] hover:underline order-1 sm:order-2"
                        >
                            طراحی و توسعه : {footerInfo.designer}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;