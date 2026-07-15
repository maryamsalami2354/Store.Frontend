// =============================================================================
// FILE: blogPage.jsx
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Home, Clock, Eye, Heart, MessageCircle, Calendar, User } from 'react-feather';
import blogsData from '../../../public/jsons/blogPosts.json';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import BlogPageSkeleton from '../skeleton/BlogPageSkeleton/BlogPageSkeleton.jsx';
import BlogNotFound from './blogNotFound';
import BlogHero from './blogHero';
import BlogContent from './blogContent';
import BlogSidebar from './blogSidebar';
import BlogTags from './blogTags';
import BlogShare from './blogShare';
import BlogComments from './blogComments';
import BlogRelatedPosts from './blogRelatedPosts';

const BlogPage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const allPosts = useMemo(() => blogsData.posts || [], []);

    const post = useMemo(() => allPosts.find(p => p.id === parseInt(id)), [allPosts, id]);

    const relatedPosts = useMemo(() => {
        if (!post) return [];
        return allPosts
            .filter(p => p.id !== post.id && p.category === post.category)
            .slice(0, 4);
    }, [post, allPosts]);

    const categories = useMemo(() => blogsData.categories || [], []);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, [id]);

    const handleLike = () => toast.success('لایک شما ثبت شد');
    const handleShare = () => toast.success('لینک کپی شد');
    const handleComment = () => toast.success('نظر شما ثبت شد');

    if (isLoading) return <BlogPageSkeleton />;
    if (!post) return <BlogNotFound />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                <Breadcrumb items={[
                    { title: 'بلاگ', link: '/blog', icon: Heart },
                    { title: post.category, link: `/blog?category=${post.categorySlug}` },
                    { title: post.title }
                ]} />

                <div className="flex mt-3 flex-col lg:flex-row gap-4 lg:gap-6">

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">

                        <BlogHero post={post} />

                        {/* Meta Mobile */}
                        <div className="lg:hidden bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1.5"><User size={14} className="text-[#002874] dark:text-[#4C6FB6]" />{post.author.name}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#002874] dark:text-[#4C6FB6]" />{new Date(post.publishedAt).toLocaleDateString('fa-IR')}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#002874] dark:text-[#4C6FB6]" />{post.readTime} دقیقه</span>
                                <span className="flex items-center gap-1.5"><Eye size={14} className="text-[#002874] dark:text-[#4C6FB6]" />{post.views.toLocaleString('fa-IR')}</span>
                            </div>
                        </div>

                        <BlogTags tags={post.tags} />
                        <BlogContent post={post} />
                        <BlogShare post={post} onShare={handleShare} />
                        <BlogComments post={post} onSubmit={handleComment} />
                        <BlogRelatedPosts posts={relatedPosts} />

                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <BlogSidebar post={post} categories={categories} allPosts={allPosts} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BlogPage;