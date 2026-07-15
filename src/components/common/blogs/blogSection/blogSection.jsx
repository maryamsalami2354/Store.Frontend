import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import Skeleton from 'react-loading-skeleton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    Search,
    Eye,
    ChevronLeft,
    TrendingUp,
    Cpu,
    BookOpen,
    Film,
    Sun,
    Calendar,
    User,
    Box
} from 'react-feather';

// ایمپورت مستقیم JSON
import blogDataJson from '../../../../../public/jsons/blogPosts.json';

// آیکون‌های منوی جانبی
const menuIconMap = {
    'جدیدترین مطالب': TrendingUp,
    'علم و تکنولوژی': Cpu,
    'بازی ویدویی': Box,
    'کتاب و رمان': BookOpen,
    'هنر و سینما': Film,
    'سبک زندگی': Sun
};

// فرمت‌کننده تاریخ شمسی - خلاصه
const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fa-IR', {
        month: 'long',
        day: 'numeric'
    });
};

const BlogSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading] = useState(false);
    const [bannerImage] = useState('/images/sliders/slider-2.jpg');

    const { posts } = blogDataJson;

    // پیکربندی Fuse
    const fuse = new Fuse(posts, {
        keys: ['title', 'excerpt', 'tags', 'category'],
        threshold: 0.3,
        minMatchCharLength: 2
    });

    // فیلتر و جستجو
    let filteredPosts = posts;
    if (activeCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.categorySlug === activeCategory);
    }
    if (searchQuery.trim().length > 0) {
        const results = fuse.search(searchQuery);
        filteredPosts = results.map(r => r.item);
    }

    // پست‌های ویژه - فقط ۳ عدد
    const featuredPosts = posts.filter(post => post.isFeatured).slice(0, 3);
    const displayPosts = searchQuery || activeCategory !== 'all' ? filteredPosts.slice(0, 3) : featuredPosts;

    // دسته‌بندی‌های منوی کناری
    const sidebarCategories = [
        { id: 1, name: 'جدیدترین مطالب', slug: 'latest' },
        { id: 2, name: 'علم و تکنولوژی', slug: 'technology' },
        { id: 3, name: 'بازی ویدویی', slug: 'gaming' },
        { id: 4, name: 'کتاب و رمان', slug: 'books' },
        { id: 5, name: 'هنر و سینما', slug: 'art' },
        { id: 6, name: 'سبک زندگی', slug: 'lifestyle' }
    ];

    return (
        <div className="grid grid-cols-12 gap-5 lg:gap-6 mt-6">
            {/* Sidebar - جستجو و دسته‌بندی */}
            <div className="lg:col-span-3 col-span-12">
                <div className="bg-white dark:bg-[#0a0a0a] space-y-5 shadow-sm border border-gray-200 dark:border-gray-800 p-5 rounded-2xl flex flex-col sticky top-[150px] transition-all duration-300">
                    {/* فرم جستجو */}
                    <div className="relative flex items-center w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 appearance-none rounded-xl border border-gray-200 dark:border-gray-700 py-3 ps-4 pe-12 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002874] focus:border-transparent text-gray-900 dark:text-gray-100 transition-all duration-300"
                            placeholder="جستجوی مطالب ...."
                        />
                        <button className="p-2.5 bg-[#002874] hover:opacity-90 rounded-xl absolute end-1.5 transition-all duration-300 hover:scale-105">
                            <Search className="size-4 text-white" />
                        </button>
                    </div>

                    {/* منوی دسته‌بندی */}
                    <nav>
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
                            دسته‌بندی مطالب
                        </h3>
                        <ul className="space-y-1.5">
                            {sidebarCategories.map((cat) => {
                                const Icon = menuIconMap[cat.name] || Cpu;
                                const isActive = (cat.slug === 'latest' && activeCategory === 'all') || activeCategory === cat.slug;

                                return (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => setActiveCategory(cat.slug === 'latest' ? 'all' : cat.slug)}
                                            className={`w-full group px-3 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                                                isActive
                                                    ? 'bg-[#002874] text-white shadow-lg shadow-[#002874]/20 dark:shadow-[#4C6FB6]/20'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={`size-5 transition-transform duration-300 group-hover:scale-110 ${
                                                    isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                                                }`} />
                                                <span className="text-sm font-medium">{cat.name}</span>
                                            </div>
                                            {isActive && (
                                                <ChevronLeft className="size-4 text-white/80" />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* محتوای اصلی */}
            <div className="lg:col-span-9 col-span-12">
                {loading ? (
                    // Skeleton Loading
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <div className="md:col-span-4">
                            <Skeleton height={280} borderRadius={16} className="dark:!bg-gray-800" />
                        </div>
                        <div className="md:col-span-1">
                            <Skeleton height={320} borderRadius={16} className="dark:!bg-gray-800" />
                        </div>
                        <div className="md:col-span-2">
                            <Skeleton height={320} borderRadius={16} className="dark:!bg-gray-800" />
                        </div>
                        <div className="md:col-span-1">
                            <Skeleton height={320} borderRadius={16} className="dark:!bg-gray-800" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* بنر اصلی */}
                        <Link to="/blog" className="block group">
                            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-500">
                                <LazyLoadImage
                                    src={bannerImage}
                                    alt="بنر وبلاگ"
                                    effect="blur"
                                    wrapperClassName="w-full h-full !block bg-gray-50 dark:bg-gray-900"
                                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </Link>

                        {/* گرید پست‌ها - چیدمان ۱-۲-۱ */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            {displayPosts.map((post, index) => {
                                let colSpan;
                                if (index === 0) colSpan = 'md:col-span-1';
                                else if (index === 1) colSpan = 'md:col-span-2';
                                else colSpan = 'md:col-span-1';

                                return (
                                    <div
                                        key={post.id}
                                        className={`group ${colSpan}`}
                                    >
                                        <Link to={`/blog/${post.id}`} className="block h-full">
                                            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                                                {/* تصویر */}
                                                <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 p-4">
                                                    <LazyLoadImage
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        effect="blur"
                                                        wrapperClassName="w-full"
                                                        className={`w-full ${index === 1 ? 'h-48 md:h-56' : 'h-40 md:h-48'} object-contain group-hover:scale-110 transition-transform duration-700`}
                                                    />
                                                    {post.isFeatured && (
                                                        <span className="absolute top-3 start-3 px-2.5 py-1 text-[10px] font-bold bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-lg">
                                                            ویژه
                                                        </span>
                                                    )}
                                                </div>

                                                {/* محتوا */}
                                                <div className="p-4 flex-1 flex flex-col">
                                                    {/* دسته‌بندی */}
                                                    <span className="text-[11px] font-medium text-[#002874]  dark:text-[#4C6FB6] mb-2">
                                                        {post.category}
                                                    </span>

                                                    {/* عنوان */}
                                                    <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#002874]  dark:group-hover:text-[#4C6FB6] transition-colors duration-300">
                                                        {post.title}
                                                    </h3>

                                                    {/* خلاصه - فقط در کارت بزرگ */}
                                                    {index === 1 && (
                                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                            {post.excerpt}
                                                        </p>
                                                    )}

                                                    {/* متادیتا - طراحی جدید و جمع‌وجور */}
                                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                            <User className="size-3" />
                                                            <span className="text-[11px] truncate max-w-[70px] md:max-w-none">
                                                                {post.author.name.split(' ')[0]}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                                <Calendar className="size-3" />
                                                                <span className="text-[11px]">
                                                                    {formatDate(post.publishedAt)}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                                <Eye className="size-3" />
                                                                <span className="text-[11px]">
                                                                    {post.views > 1000 ? `${(post.views/1000).toFixed(1)}k` : post.views}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}

                            {displayPosts.length === 0 && (
                                <div className="md:col-span-4">
                                    <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                                        <Search className="size-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            مطلبی یافت نشد
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setActiveCategory('all');
                                            }}
                                            className="mt-4 px-6 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all duration-300"
                                        >
                                            مشاهده همه مطالب
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogSection;