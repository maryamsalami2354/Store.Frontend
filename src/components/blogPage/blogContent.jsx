// =============================================================================
// FILE: blogContent.jsx
// =============================================================================
import React from 'react';

const BlogContent = ({ post }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
        </h1>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            {post.excerpt}
        </p>

        {/* محتوای مقاله - اینجا می‌تونه HTML باشه */}
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-loose">
            <p>
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
                چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی
                مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد.
            </p>
            <p>
                کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد
                تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه‌ای علی‌الخصوص طراحان خلاقی و فرهنگ
                پیشرو در زبان فارسی ایجاد کرد.
            </p>
        </div>
    </div>
);

export default BlogContent;