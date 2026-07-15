// src/components/singleProduct/productGallery.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Heart, Share2, BarChart2, RefreshCw, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProductGallery = ({ product, onShare, onCompare, onChart }) => {
    const images = product?.gallery?.length ? product.gallery : [product?.image];
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    const handlePrev = () => {
        setActiveIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
        resetZoom();
    };

    const handleNext = () => {
        setActiveIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
        resetZoom();
    };

    const resetZoom = () => {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.5, 5));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.5, 1));
        if (zoomLevel <= 1.5) {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setZoomLevel(prev => Math.min(prev + 0.3, 5));
        } else {
            setZoomLevel(prev => {
                const newZoom = Math.max(prev - 0.3, 1);
                if (newZoom === 1) setPosition({ x: 0, y: 0 });
                return newZoom;
            });
        }
    };

    const handleMouseDown = (e) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoomLevel > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleDoubleClick = (e) => {
        e.preventDefault();
        if (zoomLevel > 1) {
            resetZoom();
        } else {
            setZoomLevel(2);
        }
    };

    // کیبورد
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!zoomed) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') { setZoomed(false); resetZoom(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [zoomed, activeIndex]);

    return (
        <>
            <div className="relative p-4 lg:p-5">
                {/* دکمه‌های عملیات - روی تصویر */}
                <div className="absolute top-6 right-6 z-10 flex flex-col gap-1">
                    <button onClick={() => setIsFavorite(!isFavorite)} className={`p-2 rounded-xl backdrop-blur-sm transition ${isFavorite ? 'text-red-500 bg-white/90' : 'text-gray-600 bg-white/80 hover:bg-white'}`}>
                        <Heart size={18} className={isFavorite ? 'fill-red-500' : ''} />
                    </button>
                    <button onClick={onShare} className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition">
                        <Share2 size={18} />
                    </button>
                    <button onClick={onCompare} className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition">
                        <RefreshCw size={18} />
                    </button>
                    <button onClick={onChart} className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition">
                        <BarChart2 size={18} />
                    </button>
                </div>

                {/* تصویر اصلی */}
                <div
                    className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-4 flex items-center justify-center h-64 lg:h-80 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-zoom-in"
                    onClick={() => setZoomed(true)}
                >
                    <LazyLoadImage
                        src={images[activeIndex] || '/images/products/placeholder.jpg'}
                        alt={product?.name}
                        effect="blur"
                        wrapperClassName="w-full h-full block"
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                    {product?.discount > 0 && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-xl">٪{product.discount}</span>
                    )}
                </div>

                {/* ریزعکس‌ها */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                                    idx === activeIndex ? 'border-[#002874] dark:border-[#4C6FB6]' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <LazyLoadImage src={img} effect="blur" wrapperClassName="w-full h-full block" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* مودال زوم */}
            {zoomed && (
                <div
                    className="fixed inset-0 z-[200] bg-black/98 flex flex-col"
                    onWheel={handleWheel}
                >
                    {/* هدر */}
                    <div className="flex items-center justify-between p-4 bg-black/50">
                        <span className="text-white/70 text-sm">{activeIndex + 1} / {images.length}</span>
                        <div className="flex items-center gap-3">
                            <button onClick={handleZoomOut} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition" title="کاهش زوم">
                                <ZoomOut size={18} />
                            </button>
                            <span className="text-white/50 text-xs">{Math.round(zoomLevel * 100)}%</span>
                            <button onClick={handleZoomIn} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition" title="افزایش زوم">
                                <ZoomIn size={18} />
                            </button>
                            <button onClick={() => { setZoomed(false); resetZoom(); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* تصویر با زوم */}
                    <div
                        ref={containerRef}
                        className="flex-1 overflow-hidden flex items-center justify-center"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onDoubleClick={handleDoubleClick}
                        style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                    >
                        <img
                            ref={imageRef}
                            src={images[activeIndex]}
                            alt={product?.name}
                            className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
                            style={{
                                transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* دکمه‌های ناوبری */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-10"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-10"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}

                    {/* ریزعکس‌ها در پایین */}
                    {images.length > 1 && (
                        <div className="flex justify-center gap-2 p-4 bg-black/50 overflow-x-auto">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setActiveIndex(idx); resetZoom(); }}
                                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                                        idx === activeIndex ? 'border-[#4C6FB6]' : 'border-white/20 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ProductGallery;