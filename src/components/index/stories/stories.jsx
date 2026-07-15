// src/components/Stories/index.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    X, ChevronRight, ChevronLeft, Play, Eye, ExternalLink,
    Volume2, VolumeX
} from 'react-feather';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import StoriesData from '../../../../public/jsons/stories.json';
import ErrorOnFetchApi from "../../common/ErrorOnFetchApi/index.js";

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const timerRef = useRef(null);
    const videoRef = useRef(null);

    // --- واکشی داده ---
    useEffect(() => {
        const loadStories = async () => {
            try {
                const data = StoriesData ;
                const storiesArray = Array.isArray(data) ? data : Object.values(data || {});
                setStories(storiesArray);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadStories();
    }, []);

    // --- کیبورد ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') closeStory();
            if (e.key === 'ArrowRight') goPrev();
            if (e.key === 'ArrowLeft') goNext();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]);

    // --- تایمر ---
    const startTimer = useCallback((duration = 5000) => {
        clearInterval(timerRef.current);
        setProgress(0);
        const startTime = Date.now();
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);
            if (newProgress >= 100) handleNext();
        }, 50);
    }, []);

    // --- باز/بسته ---
    const openStory = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
        setProgress(0);
        clearInterval(timerRef.current);
        document.body.style.overflow = 'hidden';
    };

    const closeStory = () => {
        setIsOpen(false);
        clearInterval(timerRef.current);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        document.body.style.overflow = '';
    };

    // --- ناوبری ---
    const goNext = useCallback(() => {
        if (currentIndex < stories.length - 1) {
            markAsViewed(currentIndex);
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            closeStory();
        }
    }, [currentIndex, stories.length]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        }
    }, [currentIndex]);

    const handleNext = goPrev;
    const handlePrev = goNext;

    const markAsViewed = (index) => {
        setStories(prev =>
            prev.map((story, i) =>
                i === index ? { ...story, viewed: true } : story
            )
        );
    };

    // --- تغییر استوری ---
    useEffect(() => {
        if (!isOpen || !stories.length) return;
        const currentStory = stories[currentIndex];
        if (!currentStory) return;
        if (currentStory.type === 'video' && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = isMuted;
            videoRef.current.play().catch(() => {});
        } else {
            startTimer(currentStory.duration || 5000);
        }
        return () => clearInterval(timerRef.current);
    }, [currentIndex, isOpen, stories]);

    // --- لمس صفحه ---
    const handleOverlayClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (clickX < width * 0.3) handlePrev();
        else if (clickX > width * 0.7) handleNext();
    };

    // --- رندر ---
    const currentStory = stories[currentIndex];

    if (loading) {
        return (
            <section className="py-4 md:py-5">
                <div className="container mx-auto px-3 md:px-4">
                    <div className="flex items-center gap-2 sm:gap-3 overflow-hidden py-2">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className="bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-full animate-pulse">
                                <div className="p-0.5 bg-white dark:bg-[#0a0a0a] rounded-full">
                                    <Skeleton width={64} height={64} circle={true} className="!rounded-full md:!w-[76px] md:!h-[76px]" />
                                </div>
                            </div>
                            <Skeleton width={40} height={10} className="md:!w-[50px] md:!h-[12]" />
                        </div>
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className="bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-full animate-pulse">
                                    <div className="bg-white dark:bg-[#0a0a0a] rounded-full">
                                        <Skeleton width={64} height={64} circle={true} className="!rounded-full md:!w-[76px] md:!h-[76px]" />
                                    </div>
                                </div>
                                <Skeleton width={40} height={10} className="md:!w-[50px] md:!h-[12]" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return <ErrorOnFetchApi message={error} />;
    }

    if (!stories.length) return null;

    return (
        <>
            {/* STORIES LIST */}
            <section className="py-3 sm:py-4 md:py-5">
                <div className="container mx-auto px-3 md:px-4">
                    <div role="region" aria-labelledby="stories-title" className="relative">
                        <h2 id="stories-title" className="sr-only">استوری‌های فروشگاه</h2>
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={8}
                            slidesPerView="auto"
                            slidesPerGroup={1}
                            watchSlidesProgress={false}
                            navigation={{
                                prevEl: '.stories-swiper-button-prev',
                                nextEl: '.stories-swiper-button-next',
                            }}
                            breakpoints={{
                                320: { spaceBetween: 6 },
                                480: { spaceBetween: 8 },
                                640: { spaceBetween: 12 },
                                768: { spaceBetween: 14 },
                                1024: { spaceBetween: 16 },
                            }}
                            dir="rtl"
                            className="!overflow-hidden stories-swiper"
                            wrapperClass="!py-2"
                        >
                            {stories.map((story, index) => (
                                <SwiperSlide key={story.id || index} className="!w-auto">
                                    <button
                                        onClick={() => openStory(index)}
                                        className="flex flex-col items-center gap-1 sm:gap-1.5 group/story transition-transform duration-300 hover:scale-105 active:scale-95"
                                        aria-label={`باز کردن استوری ${story.user}`}
                                    >
                                        <div
                                            className={`relative p-0.5 rounded-full transition-all duration-300 ${
                                                story.viewed
                                                    ? 'bg-gray-300 dark:bg-gray-600'
                                                    : 'bg-gradient-to-tr from-[#002874] via-[#4C6FB6] to-[#002874]'
                                            }`}
                                        >
                                            <div className="p-0.5 bg-white dark:bg-[#0a0a0a] rounded-full">
                                                <div className="relative size-12 sm:size-14 md:size-16 lg:size-[72px] rounded-full overflow-hidden">
                                                    <LazyLoadImage
                                                        src={story.avatar}
                                                        alt={story.user}
                                                        effect="blur"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {story.type === 'video' && (
                                                        <div className="absolute bottom-0.5 sm:bottom-1 end-0.5 sm:end-1 size-4 sm:size-5 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full">
                                                            <Play className="size-2 sm:size-2.5 text-white fill-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 group-hover/story:text-[#002874]  dark:group-hover/story:text-[#4C6FB6] transition-colors max-w-[60px] sm:max-w-[70px] truncate">
                                            {story.user}
                                        </span>
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation Buttons - Hidden on mobile, shown on tablet+ */}
                        <button
                            className="stories-swiper-button-prev absolute start-0 top-1/2 -translate-y-1/2 z-10 size-8 sm:size-9 md:size-10
                                hidden lg:flex items-center justify-center
                                bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm rounded-full shadow-lg
                                hover:bg-white dark:hover:bg-[#111111] transition-all duration-300
                                opacity-0 group-hover:opacity-100 -ms-2 md:-ms-3
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="اسکرول به چپ"
                        >
                            <ChevronRight className="size-4 sm:size-5 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                            className="stories-swiper-button-next absolute end-0 top-1/2 -translate-y-1/2 z-10 size-8 sm:size-9 md:size-10
                                hidden lg:flex items-center justify-center
                                bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm rounded-full shadow-lg
                                hover:bg-white dark:hover:bg-[#111111] transition-all duration-300
                                opacity-0 group-hover:opacity-100 -me-2 md:-me-3
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="اسکرول به راست"
                        >
                            <ChevronLeft className="size-4 sm:size-5 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </section>

            {/* STORY PLAYER - RESPONSIVE MODAL */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`استوری ${currentStory?.user || ''}`}
                className={`fixed inset-0 z-[70] transition-all duration-300 ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
            >
                <div
                    className="absolute inset-0 bg-black/95 backdrop-blur-sm transition-opacity"
                    onClick={closeStory}
                />

                <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
                    {/* Close Button */}
                    <button
                        onClick={closeStory}
                        className="absolute top-2 right-2 sm:top-4 sm:end-4 z-30
                            size-8 sm:size-10 flex items-center justify-center
                            bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full
                            transition-all duration-300 hover:scale-110 active:scale-95"
                        aria-label="بستن"
                    >
                        <X className="size-4 sm:size-5 text-white" />
                    </button>

                    {/* Progress Bar */}
                    <div className="absolute top-3 right-3 left-3 sm:top-4 sm:start-4 sm:end-4 z-30
                        flex items-center gap-1">
                        {stories.map((_, index) => (
                            <div
                                key={index}
                                className="flex-1 h-0.5 sm:h-1 bg-white/30 rounded-full overflow-hidden"
                            >
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-75"
                                    style={{
                                        width: index === currentIndex
                                            ? `${progress}%`
                                            : index < currentIndex
                                                ? '100%'
                                                : '0%'
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="absolute top-8 sm:top-12 start-3 end-3 sm:start-4 sm:end-4 z-30
                        flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <img
                                src={currentStory?.avatar}
                                alt={currentStory?.user}
                                className="size-8 sm:size-10 rounded-full border-2 border-white/50 object-cover"
                            />
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-white">{currentStory?.user}</p>
                                <p className="text-[10px] sm:text-xs text-white/60">
                                    {currentStory?.type === 'video' ? 'ویدیو' : 'تصویر'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {currentStory?.type === 'video' && (
                                <button
                                    onClick={() => setIsMuted(prev => {
                                        const next = !prev;
                                        if (videoRef.current) videoRef.current.muted = next;
                                        return next;
                                    })}
                                    className="size-7 sm:size-9 flex items-center justify-center
                                        bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full
                                        transition-all duration-300"
                                    aria-label={isMuted ? 'صدا فعال' : 'صدا غیرفعال'}
                                >
                                    {isMuted
                                        ? <VolumeX className="size-3.5 sm:size-4 text-white" />
                                        : <Volume2 className="size-3.5 sm:size-4 text-white" />
                                    }
                                </button>
                            )}
                            <Link
                                to={currentStory?.link || '/'}
                                onClick={closeStory}
                                className="size-7 sm:size-9 flex items-center justify-center
                                    bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full
                                    transition-all duration-300"
                                aria-label="مشاهده"
                            >
                                <ExternalLink className="size-3.5 sm:size-4 text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div
                        className="absolute inset-0 sm:inset-4 md:inset-6 lg:inset-8
                            flex items-center justify-center cursor-pointer"
                        onClick={handleOverlayClick}
                    >
                        {/* Nav Arrows - Desktop only */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute start-2 sm:start-4 top-1/2 -translate-y-1/2 z-20
                                hidden md:flex items-center justify-center
                                size-10 lg:size-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full
                                transition-all duration-300 opacity-0 hover:opacity-100"
                            aria-label="قبلی"
                        >
                            <ChevronRight className="size-5 lg:size-6 text-white" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute end-2 sm:end-4 top-1/2 -translate-y-1/2 z-20
                                hidden md:flex items-center justify-center
                                size-10 lg:size-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full
                                transition-all duration-300 opacity-0 hover:opacity-100"
                            aria-label="بعدی"
                        >
                            <ChevronLeft className="size-5 lg:size-6 text-white" />
                        </button>

                        {/* Media Container - Responsive aspect ratio */}
                        <div className="relative w-full h-full max-w-full max-h-full
                            flex items-center justify-center
                            aspect-[9/16] max-aspect-[9/16] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]">
                            {currentStory?.type === 'video' ? (
                                <video
                                    ref={videoRef}
                                    src={currentStory.url}
                                    className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                                    autoPlay
                                    muted={isMuted}
                                    playsInline
                                    onLoadedData={() => {
                                        if (videoRef.current) {
                                            const dur = videoRef.current.duration * 1000;
                                            if (dur && isFinite(dur)) startTimer(dur);
                                        }
                                    }}
                                    onEnded={handleNext}
                                />
                            ) : (
                                <img
                                    src={currentStory?.url}
                                    alt={currentStory?.user}
                                    className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                                />
                            )}
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="absolute bottom-3 start-3 right-3 sm:bottom-4 sm:start-4 sm:end-4 z-30">
                        <Link
                            to={currentStory?.link || '/'}
                            onClick={closeStory}
                            className="flex items-center justify-center gap-1.5 sm:gap-2
                                w-full py-2.5 sm:py-3 px-3 sm:px-4
                                bg-[#002874] hover:bg-[#001d5a]
                                dark:bg-[#4C6FB6] dark:hover:bg-[#3d5a94]
                                text-white rounded-xl sm:rounded-2xl
                                transition-all duration-300 font-medium text-xs sm:text-sm"
                        >
                            <Eye className="size-3.5 sm:size-4" />
                            مشاهده محصولات
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Stories;