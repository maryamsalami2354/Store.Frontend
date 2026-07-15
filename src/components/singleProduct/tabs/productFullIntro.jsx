// src/components/singleProduct/tabs/productFullIntro.jsx
import React, { useState } from 'react';

const ProductFullIntro = ({ product }) => {
    const [expanded, setExpanded] = useState(false);

    const loremParagraphs = [
        'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد.',
        'تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. طراحان گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و ارائه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نمایند. از آنجایی که طراحان عموما نویسنده متن نیستند و وظیفه رعایت حق تکثیر متون را ندارند.',
        'همه روزه با انبوهی از متون و مقالات روبرو هستند که باید در طراحی گرافیکی آن ها را بکار گیرند. به همین دلیل است که طراحان از متن های ساختگی و بی معنی استفاده می کنند تا صفحه آرایی طرح خود را به کارفرما نشان دهند.',
        'امروزه طراحی وبسایت و اپلیکیشن های موبایل به یکی از مهمترین نیازهای هر کسب و کاری تبدیل شده است. تیم ما با سالها تجربه در زمینه طراحی و توسعه نرم افزار، آماده ارائه بهترین خدمات به شما عزیزان می باشد. ما با استفاده از جدیدترین تکنولوژی ها و متدهای روز دنیا، محصولاتی با کیفیت و کارآمد را به شما ارائه می دهیم.',
        'کیفیت ساخت این محصول فوق‌العاده است و از بهترین متریال موجود در بازار ساخته شده است. تیم مهندسی ما با دقت بسیار بالایی این محصول را طراحی کرده تا بتواند نیازهای شما را به بهترین شکل ممکن برطرف کند. استفاده از تکنولوژی روز دنیا در ساخت این محصول، آن را به یکی از بهترین‌های بازار تبدیل کرده است.',
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white relative pb-3 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-24 before:bg-[#002874] dark:before:bg-[#4C6FB6] before:rounded">
                طراحی و کیفیت ساخت {product?.name}
            </h2>

            {/* تصویر محصول - اندازه مناسب */}
            {product?.image && (
                <div className="flex justify-center my-6">
                    <img
                        src={product.image}
                        alt={product?.name}
                        className="max-w-full sm:max-w-md lg:max-w-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 object-contain max-h-80"
                    />
                </div>
            )}

            <div className={`text-gray-700 dark:text-gray-300 leading-8 text-justify space-y-4 ${expanded ? '' : 'max-h-[500px] overflow-hidden relative'}`}>
                {/* توضیحات اصلی محصول */}
                <p>{product?.description || 'توضیحاتی برای این محصول ثبت نشده است.'}</p>

                {/* لورم ایپسوم اضافی */}
                {loremParagraphs.map((text, idx) => (
                    <p key={idx}>{text}</p>
                ))}

                {/* گرادیانت محو کننده */}
                {!expanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#111] to-transparent"></div>
                )}
            </div>

            {/* دکمه ادامه/بستن */}
            <div className="text-center">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-[#002874] hover:text-white dark:hover:bg-[#4C6FB6] transition-all duration-200"
                >
                    {expanded ? 'بستن متن' : 'ادامه مطلب'}
                </button>
            </div>
        </div>
    );
};

export default ProductFullIntro;