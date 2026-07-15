// =============================================================================
// FILE: blogHero.jsx (اصلاح کامل)
// =============================================================================
import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Clock, Eye, Heart, MessageCircle, Calendar, User, Play, Pause, Volume2, VolumeX, Maximize2 } from 'react-feather';

const BlogHero = ({ post }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = React.useRef(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            videoRef.current.requestFullscreen();
        }
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-4">

            {/* Cover Image or Video */}
            <div className="relative aspect-video bg-gray-900 overflow-hidden group">
                {post.videoUrl ? (
                    <>
                        <video
                            ref={videoRef}
                            src={post.videoUrl}
                            className="w-full h-full object-contain bg-black"
                            muted={isMuted}
                            loop
                            playsInline
                            onClick={togglePlay}
                        />

                        {/* Center Play Button - visible on mobile, hover on desktop */}
                        {!isPlaying && (
                            <button
                                onClick={togglePlay}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                                <Play size={28} className="text-white ml-1" />
                            </button>
                        )}

                        {/* Bottom Controls - visible on mobile, hover on desktop */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={togglePlay}
                                className="p-2 rounded-lg bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors"
                            >
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={toggleMute}
                                    className="p-2 rounded-lg bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors"
                                >
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <button
                                    onClick={handleFullscreen}
                                    className="p-2 rounded-lg bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors"
                                >
                                    <Maximize2 size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <LazyLoadImage
                        src={post.coverImage}
                        alt={post.title}
                        effect="blur"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Meta Info */}
            <div className="p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover border-2 border-[#002874] dark:border-[#4C6FB6]"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div class="w-8 h-8 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 flex items-center justify-center text-[#002874] dark:text-[#4C6FB6] font-bold text-xs">${post.author.name[0]}</div>`;
                            }}
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{post.author.name}</span>
                    </div>
                    <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(post.publishedAt).toLocaleDateString('fa-IR')}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} />{post.readTime} دقیقه</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Eye size={14} className="text-[#002874] dark:text-[#4C6FB6]" />{post.views.toLocaleString('fa-IR')} بازدید</span>
                    <span className="flex items-center gap-1.5"><Heart size={14} className="text-red-500" />{post.likes.toLocaleString('fa-IR')} لایک</span>
                    <span className="flex items-center gap-1.5"><MessageCircle size={14} className="text-[#002874] dark:text-[#4C6FB6]" />{post.comments} نظر</span>
                </div>
            </div>
        </div>
    );
};

export default BlogHero;