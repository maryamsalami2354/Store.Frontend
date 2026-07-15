import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    ChevronLeft, ChevronRight, Calendar, Clock, Eye,
    Heart, MessageCircle, BookOpen, ArrowLeft, User
} from 'lucide-react';
import blogData from '../../../../public/jsons/blogPosts.json';
import Skeleton from 'react-loading-skeleton';
import {toast} from "react-toastify";
import 'react-loading-skeleton/dist/skeleton.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ErrorOnFetchApi from "../../common/ErrorOnFetchApi/index.js";

// =============================================================================
// CONSTANTS
// =============================================================================
const BREAKPOINTS = {
    320: { slidesPerView: 1.1, spaceBetween: 12 },
    480: { slidesPerView: 1.2, spaceBetween: 14 },
    640: { slidesPerView: 1.5, spaceBetween: 16 },
    768: { slidesPerView: 2, spaceBetween: 16 },
    900: { slidesPerView: 2.2, spaceBetween: 18 },
    1024: { slidesPerView: 2.5, spaceBetween: 18 },
    1200: { slidesPerView: 3, spaceBetween: 20 },
    1400: { slidesPerView: 3.5, spaceBetween: 20 },
    1600: { slidesPerView: 4, spaceBetween: 22 }
};

const SKELETON_COUNT = 4;

// =============================================================================
// UTILS
// =============================================================================
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

const formatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

// =============================================================================
// SKELETON CARD
// =============================================================================
const BlogCardSkeleton = () => (
    <div className="bg-white dark:bg-[#111111] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm h-full">
        {/* Cover Image */}
        <Skeleton
            height={160}
            containerClassName="block sm:hidden"
        />
        <Skeleton
            height={176}
            containerClassName="hidden sm:block md:hidden"
        />
        <Skeleton
            height={192}
            containerClassName="hidden md:block"
        />

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-3">
            {/* Author Row */}
            <div className="flex items-center gap-2">
                <Skeleton circle width={24} height={24} />
                <Skeleton width={80} height={16} />
            </div>

            {/* Title - Two Lines */}
            <div className="space-y-2">
                <Skeleton width="90%" height={20} />
                <Skeleton width="75%" height={20} />
            </div>

            {/* Excerpt */}
            <Skeleton count={2} height={12} />

            {/* Stats Footer */}
            <div className="flex items-center justify-between pt-2">
                <Skeleton width={64} height={16} />
                <div className="flex gap-3">
                    <Skeleton width={48} height={16} />
                    <Skeleton width={48} height={16} />
                </div>
            </div>
        </div>
    </div>
);

// =============================================================================
// BLOG CARD COMPONENT
// =============================================================================
const BlogCard = ({ post ,navigate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes || 0);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    const handleLike = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(prev => !prev);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    }, [isLiked]);
    const handleClick = useCallback(() => {
        navigate(`/blog/${post.id}`);  // post استفاده کن
    }, [navigate, post.id]);

    return (
        <article
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group bg-white dark:bg-[#111111] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col"
        >
            {/* Cover Image */}
            <div className="relative overflow-hidden h-40 sm:h-44 md:h-48 lg:h-52">
                <LazyLoadImage
                    src={post.coverImage}
                    alt={post.title}
                    effect="blur"
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    placeholder={
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    }
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] sm:text-xs font-medium bg-white/95 dark:bg-[#111]/95 backdrop-blur-sm text-[#002874]  dark:text-[#4C6FB6] rounded-lg shadow-sm">
                        {post.category}
                    </span>
                </div>

                {/* Featured Badge */}
                {post.isFeatured && (
                    <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-md">
                            ویژه
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    <div className="absolute bottom-3 left-3 right-3">
                        <button className="w-full py-2 bg-white dark:bg-[#111] text-gray-900 dark:text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#002874] hover:text-white dark:hover:bg-[#4C6FB6] transition-colors duration-200">
                            مطالعه مقاله
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col">
                {/* Author & Date */}
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5">
                        <div className="size-5 sm:size-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <LazyLoadImage
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-full h-full object-cover"
                                placeholder={
                                    <div className="w-full h-full bg-gray-300 dark:bg-gray-600" />
                                }
                            />
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium line-clamp-1">
                            {post.author.name}
                        </span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-500">
                        <Calendar size={10} className="sm:size-3" />
                        <span>{formatDate(post.publishedAt)}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#002874]  dark:group-hover:text-[#4C6FB6] transition-colors duration-200">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
                    {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-1.5 py-0.5 text-[9px] sm:text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={10} className="sm:size-3" />
                        <span>{post.readTime} دقیقه مطالعه</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            <Eye size={10} className="sm:size-3" />
                            <span>{formatNumber(post.views)}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            <MessageCircle size={10} className="sm:size-3" />
                            <span>{formatNumber(post.comments)}</span>
                        </div>

                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 text-[10px] sm:text-xs transition-colors duration-200 ${
                                isLiked
                                    ? 'text-red-500'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                            }`}
                        >
                            <Heart size={10} className={`sm:size-3 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{formatNumber(likesCount)}</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const LatestBlogPosts = ({
                             title = "آخرین مقالات وبلاگ",
                             subtitle = "جدیدترین مطالب آموزشی و خبری",
                             linkText = "مشاهده همه مقالات",
                             linkHref = "/blogs",
                             posts: propPosts,
                             isLoading: propLoading = false,
                             limit = 8
                         }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(propLoading);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        if (propPosts !== undefined) {
            setPosts(propPosts.slice(0, limit));
            setIsLoading(false);
            return;
        }

        const loadPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const allPosts = blogData.posts || [];
                // Sort by published date (newest first)
                const sortedPosts = [...allPosts].sort((a, b) =>
                    new Date(b.publishedAt) - new Date(a.publishedAt)
                );
                setPosts(sortedPosts.slice(0, limit));
            } catch (err) {
                console.error('Error fetching blog posts:', err);
                setError('خطا در بارگذاری مقالات');
            } finally {
                setIsLoading(false);
            }
        };

        loadPosts();
    }, [propPosts, limit]);

    const handleSwiper = useCallback((swiper) => {
        setSwiperInstance(swiper);
    }, []);

    useEffect(() => {
        if (swiperInstance && navigationPrevRef.current && navigationNextRef.current) {
            if (swiperInstance.navigation) {
                swiperInstance.navigation.destroy();
            }
            swiperInstance.params.navigation = {
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
                disabledClass: 'swiper-button-disabled'
            };
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    if (error) {
        return (
           <ErrorOnFetchApi message={error.message} />
        );
    }

    if (!posts.length && !isLoading) return null;

    return (
        <section className="py-4 sm:py-6" aria-labelledby="blog-posts-title">
            <h2 id="blog-posts-title" className="sr-only">{title}</h2>

            <div className="">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    {/* Background Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                    
                    />

                    {/* Header */}
                    <div className="relative flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 xl:p-5">
                        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                            <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-lg sm:rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 dark:shadow-blue-700/30">
                                <BookOpen size={16} className="sm:size-5 xl:size-6 text-white" />
                                <div className="absolute inset-0 rounded-lg sm:rounded-xl xl:rounded-2xl bg-gradient-to-br from-blue-600/50 to-indigo-600/50 blur-lg -z-10 animate-pulse opacity-50" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base xl:text-xl font-bold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                                <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500 dark:text-gray-400">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 xl:gap-3">
                            <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100/80 dark:bg-[#111] p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
                                <button
                                    ref={navigationPrevRef}
                                    className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1c20] hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition-all duration-200 disabled:opacity-40"
                                    aria-label="قبلی"
                                >
                                    <ChevronRight size={16} className="sm:size-5" />
                                </button>
                                <div className="hidden sm:block w-px h-4 sm:h-5 bg-gray-300 dark:bg-gray-700 mx-0.5" />
                                <button
                                    ref={navigationNextRef}
                                    className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1c20] hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition-all duration-200 disabled:opacity-40"
                                    aria-label="بعدی"
                                >
                                    <ChevronLeft size={16} className="sm:size-5" />
                                </button>
                            </div>
                            <Link
                                to={linkHref}
                                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 xl:px-4 py-1.5 sm:py-2 xl:py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs xl:text-sm font-medium rounded-lg sm:rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 hover:shadow-sm transition-all duration-200 group"
                            >
                                <span className="hidden xs:inline">{linkText}</span>
                                <ArrowLeft size={14} className="sm:size-4 transition-transform group-hover:-translate-x-0.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Swiper Slider */}
                    <div className="relative px-3 sm:px-4 xl:px-5 pb-3 sm:pb-4 xl:pb-5">
                        {isLoading ? (
                            <Swiper
                                modules={[Navigation, FreeMode]}
                                onSwiper={handleSwiper}
                                spaceBetween={16}
                                slidesPerView={1.1}
                                freeMode={{ enabled: true, sticky: true }}
                                navigation={{
                                    prevEl: navigationPrevRef.current,
                                    nextEl: navigationNextRef.current
                                }}
                                breakpoints={BREAKPOINTS}
                                dir="rtl"
                                className="!overflow-visible"
                            >
                                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                    <SwiperSlide key={i} className="!h-auto">
                                        <BlogCardSkeleton />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <Swiper
                                modules={[Navigation, FreeMode]}
                                onSwiper={handleSwiper}
                                spaceBetween={16}
                                slidesPerView={1.1}
                                freeMode={{ enabled: true, sticky: true }}
                                breakpoints={BREAKPOINTS}
                                dir="rtl"
                                className="!overflow-visible"
                            >
                                {posts.map((post) => (
                                    <SwiperSlide key={post.id} className="!h-auto">
                                        <BlogCard post={post} navigate={navigate} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LatestBlogPosts;