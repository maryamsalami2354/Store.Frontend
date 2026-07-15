import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { X, Play, ChevronLeft, Video } from 'react-feather'; // اضافه شدن Video

// ایمپورت مستقیم JSON
import blogDataJson from '../../../../../public/jsons/blogPosts.json';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fa-IR', {
        month: 'long',
        day: 'numeric',
    });
};

const VideoBlogSection = () => {
    const [loading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const { posts } = blogDataJson;

    const videoPosts = useMemo(() => {
        return posts.filter((post) => post.videoUrl);
    }, [posts]);

    const sidebarVideos = videoPosts.slice(0, 7);
    const mainVideos = videoPosts.slice(0, 4);

    const openModal = (videoUrl) => setSelectedVideo(videoUrl);
    const closeModal = () => setSelectedVideo(null);

    return (
        <>
            <section className="py-5">
                <h2 className="sr-only">آخرین ویدیو وبلاگ</h2>
                <div className="">
                    {/* Header مشابه AmazingProducts */}
                    <header className="flex flex-wrap items-center justify-between gap-2 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#002874] to-[#4C6FB6] dark:from-[#4C6FB6] dark:to-[#002874] rounded-xl flex items-center justify-center shadow-lg shadow-[#002874]/30 dark:shadow-[#4C6FB6]/30">
                                <Video size={20} className="text-white" />
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                                آخرین ویدیو های وبلاگ
                            </h2>
                        </div>

                        <Link
                            to="/videos"
                            className="group flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium rounded-xl hover:border-[#002874] dark:hover:border-[#4C6FB6] hover:text-[#002874]  dark:hover:text-[#4C6FB6] hover:shadow-sm transition-all duration-200"
                        >
                            <span>مشاهده همه</span>
                            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                    </header>

                    {/* بقیه محتوا بدون تغییر */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Video sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-[#0a0a0a] space-y-3 shadow-sm border border-gray-200 dark:border-gray-800 p-4 rounded-2xl flex flex-col">
                                <nav className="space-y-4">
                                    {loading
                                        ? Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <Skeleton width={96} height={80} borderRadius={8} className="dark:!bg-gray-800" />
                                                <div className="flex-1">
                                                    <Skeleton count={2} className="dark:!bg-gray-800" />
                                                    <Skeleton width={80} className="dark:!bg-gray-800" />
                                                </div>
                                            </div>
                                        ))
                                        : sidebarVideos.map((video) => (
                                            <button
                                                key={video.id}
                                                onClick={() => openModal(video.videoUrl)}
                                                className="block w-full text-start group/sidebar"
                                            >
                                                <div className="flex items-start">
                                                    <div className="relative me-3 flex-shrink-0">
                                                        <LazyLoadImage
                                                            src={video.coverImage}
                                                            alt={video.title}
                                                            effect="blur"
                                                            wrapperClassName="w-24 h-20 block"
                                                            className="w-24 h-20 object-cover rounded brightness-50 group-hover/sidebar:brightness-75 transition"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Play className="size-10 text-white fill-white opacity-80 group-hover/sidebar:opacity-100 transition" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-between h-20">
                                                        <h5 className="text-sm font-medium line-clamp-2 group-hover/sidebar:text-[#002874]  dark:group-hover/sidebar:text-[#4C6FB6] transition-colors">
                                                            {video.title}
                                                        </h5>
                                                        <div className="flex items-center">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
                                                                {formatDate(video.publishedAt)}
                                                            </p>
                                                            <div className="text-right ms-2">
                                                                <Play className="size-6 text-[#002874]  dark:text-[#4C6FB6]" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                </nav>
                            </div>
                        </div>

                        {/* Main video grid */}
                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={i === 0 ? 'md:col-span-1' : i === 1 ? 'md:col-span-2' : 'md:col-span-1'}
                                        >
                                            <Skeleton height={320} borderRadius={12} className="dark:!bg-gray-800" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {mainVideos.map((video, index) => {
                                        let colSpan = '';
                                        if (index === 0) colSpan = 'md:col-span-1';
                                        else if (index === 1) colSpan = 'md:col-span-2';
                                        else if (index === 2) colSpan = 'md:col-span-1';
                                        else if (index === 3) colSpan = 'md:col-span-1';

                                        return (
                                            <div key={video.id} className={`group relative rounded-xl overflow-hidden ${colSpan}`}>
                                                <button onClick={() => openModal(video.videoUrl)} className="block w-full h-full">
                                                    <LazyLoadImage
                                                        src={video.coverImage}
                                                        alt={video.title}
                                                        effect="blur"
                                                        wrapperClassName="w-full h-80 block"
                                                        className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Play className="size-20 text-[#002874]  dark:text-[#4C6FB6] fill-current opacity-80 group-hover:opacity-100 transition" />
                                                    </div>
                                                    <div className="absolute bottom-0 start-0 end-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                                                        <h3 className="text-sm font-medium text-white truncate mb-2">{video.title}</h3>
                                                        <div className="flex items-center text-white/80">
                                                            <span className="text-xs">{formatDate(video.publishedAt)}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
                        >
                            <X className="size-6" />
                        </button>
                        <video
                            src={selectedVideo}
                            controls
                            autoPlay
                            className="w-full h-auto max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoBlogSection;