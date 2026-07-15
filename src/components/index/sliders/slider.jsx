import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'react-feather';
import Skeleton from 'react-loading-skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import SliderData from '../../../../public/jsons/sliderData.json';
import ErrorOnFetchApi from "../../common/ErrorOnFetchApi/ErrorOnFetchApi";

import 'swiper/css';
import 'swiper/css/pagination';

const HeroSlider = () => {
    const [sliderData, setSliderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setSliderData(SliderData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <section className="hero-slider-v2 mt-4 md:mt-5 lg:mt-6">
                <div className="container px-4 sm:px-6">
                    <Skeleton height={180} className="w-full rounded-xl md:rounded-2xl sm:h-[200px] md:h-[220px]" />
                </div>
            </section>
        );
    }

    if (error) {
        return <ErrorOnFetchApi message={error} />;
    }

    if (sliderData.length === 0) {
        return null;
    }

    return (
        <section className="hero-slider-v2 mt-4 md:mt-5 lg:mt-6">
            <div className="">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{
                        clickable: true,
                        bulletClass: `swiper-pagination-bullet !w-1.5 !h-1.5 !rounded-full !bg-white/40 !opacity-100 transition-all duration-300`,
                        bulletActiveClass: `!w-6 !bg-white !opacity-100`
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    speed={500}
                    loop={sliderData.length > 1}
                    grabCursor={true}
                    className="!overflow-hidden rounded-xl md:!rounded-2xl
                        !h-[160px] sm:!h-[180px] md:!h-[200px] lg:!h-[220px]
                        shadow-md shadow-black/5
                        [&_.swiper-pagination]:!bottom-2 md:[&_.swiper-pagination]:!bottom-3
                        [&_.swiper-pagination-bullets]:!flex [&_.swiper-pagination-bullets]:!gap-1"
                >
                    {sliderData.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-full group">
                                {/* تصویر پس‌زمینه */}
                                <img
                                    src={slide.image}
                                    alt={slide.alt}
                                    className="w-full h-full object-cover object-center"
                                    loading="lazy"
                                />

                                {/* گرادینت ملایم برای خوانایی */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                                {/* محتوای متنی - چپ چین برای راستچین نشدن متن انگلیسی */}
                                <div className="absolute inset-0 flex items-center">
                                    <div className="px-4 sm:px-6 md:px-8">
                                        <div className="max-w-xs sm:max-w-sm md:max-w-md">
                                            {/* عنوان */}
                                            <h2 className="text-white font-bold
                                                text-base sm:text-lg md:text-xl lg:text-2xl
                                                leading-tight
                                                drop-shadow-md
                                                line-clamp-2">
                                                {slide.title}
                                            </h2>

                                            {/* زیرعنوان - فقط تو دسکتاپ نشون بده */}
                                            {slide.subtitle && (
                                                <p className="hidden md:block text-white/80 text-sm mt-1 line-clamp-1">
                                                    {slide.subtitle}
                                                </p>
                                            )}

                                            {/* لینک - آیکون فقط */}
                                            {slide.buttonLink && (
                                                <Link
                                                    to={slide.buttonLink}
                                                    className="inline-flex items-center justify-center
                                                        w-8 h-8 sm:w-9 sm:h-9
                                                        mt-2 sm:mt-3
                                                        bg-white/15 backdrop-blur-sm
                                                        border border-white/20
                                                        rounded-full
                                                        transition-all duration-300
                                                        hover:bg-[#002874] dark:hover:bg-[#4C6FB6]
                                                        hover:border-[#002874] dark:hover:border-[#4C6FB6]
                                                        hover:scale-110 active:scale-95
                                                        group/link"
                                                >
                                                    <ArrowRight className="size-3.5 sm:size-4 text-white transition-transform duration-300 group-hover/link:-translate-x-0.5" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* نشانگر اسلاید - خط نازک بالا */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
                                    <div className="h-full w-0 bg-[#002874] dark:bg-[#4C6FB6] animate-[progress_4s_linear_infinite]" />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* استایل انیمیشن progress bar */}
            <style jsx>{`
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
            `}</style>
        </section>
    );
};

export default HeroSlider;