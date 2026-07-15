// src/components/index2/InstagramSection.jsx
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Heart, MessageCircle, Camera } from 'lucide-react';

const instagramPosts = [
    { id: 1, image: "/images/instagram/1.jpg", likes: 1240, comments: 45, link: "https://instagram.com/p/1" },
    { id: 2, image: "/images/instagram/2.jpg", likes: 890, comments: 32, link: "https://instagram.com/p/2" },
    { id: 3, image: "/images/instagram/3.jpg", likes: 2100, comments: 78, link: "https://instagram.com/p/3" },
    { id: 4, image: "/images/instagram/7.jpg", likes: 560, comments: 23, link: "https://instagram.com/p/4" },
    { id: 5, image: "/images/instagram/5.jpg", likes: 3200, comments: 156, link: "https://instagram.com/p/5" },
    { id: 6, image: "/images/instagram/6.jpg", likes: 980, comments: 42, link: "https://instagram.com/p/6" }
];

const InstagramSection = () => {
    return (
        <section className="py-3 sm:py-5 w-full">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-pink-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800 p-5 w-full">
                {/* هدر بخش */}
                <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-3 shadow-lg">
                        <Camera size={28} className="text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        ما را در اینستاگرام دنبال کنید
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        جدیدترین محصولات و تخفیف‌های ویژه
                    </p>
                </div>

                {/* گرید تصاویر - عکس‌ها کامل پوشانده می‌شوند */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {instagramPosts.map((post, idx) => (
                        <a
                            key={post.id}
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block overflow-hidden rounded-xl aspect-square"
                        >
                            <LazyLoadImage
                                src={post.image}
                                alt="Instagram post"
                                effect="blur"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                placeholder={<div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-white">
                                        <Heart size={14} fill="white" />
                                        <span className="text-xs font-medium">{Math.floor(post.likes / 1000)}.{Math.floor((post.likes % 1000) / 100)}k</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white">
                                        <MessageCircle size={14} />
                                        <span className="text-xs font-medium">{post.comments}</span>
                                    </div>
                                </div>
                                <span className="text-white text-[10px] bg-white/20 px-2 py-0.5 rounded-full">مشاهده پست</span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* دکمه دنبال کردن */}
                <div className="text-center mt-6">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:gap-3 transition-all duration-300"
                    >
                        <Camera size={16} />
                        دنبال کردن در اینستاگرام
                    </a>
                </div>
            </div>
        </section>
    );
};

export default InstagramSection;