// src/components/user/userWishlist/wishlistCard.jsx
import React from 'react';
import { Heart, ShoppingBag } from 'react-feather';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';
import { getProductAvailability } from '../../../utils/helpers/productAvailability.js';
import 'react-lazy-load-image-component/src/effects/blur.css';

const WishlistCard = ({ product, onRemove, onAddToCart }) => {
    const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);
    const handleAddToCart = () => {
        if (isOutOfStock) {
            toast.info('این محصول فعلا ناموجود است');
            return;
        }
        onAddToCart?.();
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden group hover:shadow-md transition-all flex flex-col">
            {/* تصویر */}
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                <LazyLoadImage
                    src={product.image}
                    effect="blur"
                    wrapperClassName="w-full h-40 lg:h-48 block bg-gray-50 dark:bg-gray-900"
                    className="w-full h-40 lg:h-48 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
            ٪{product.discount}
          </span>
                )}
                <button
                    onClick={(e) => { e.preventDefault(); onRemove(); }}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                    <Heart size={16} className="fill-red-500" />
                </button>
            </Link>

            {/* اطلاعات */}
            <div className="p-4 flex flex-col flex-1">
                <Link to={`/product/${product.id}`} className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-2 hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition leading-6 min-h-[3rem]">
                        {product.name}
                    </h3>
                    <span className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${availabilityBadgeClass}`}>
                        {availabilityLabel}
                    </span>
                </Link>

                <div className="mt-auto">
                    {/* قیمت - با ارتفاع ثابت */}
                    <div className="flex items-end justify-between mb-3 min-h-[3rem]">
                        <div>
                            {product.oldPrice && (
                                <span className="text-xs text-gray-400 line-through block leading-5">
                  {product.oldPrice} تومان
                </span>
                            )}
                            <span className="text-sm font-bold text-gray-900 dark:text-white leading-6">
                {product.price} تومان
              </span>
                        </div>
                    </div>

                    <button
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                        className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition ${isOutOfStock ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' : 'bg-[#002874] text-white hover:bg-[#001d5a]'}`}
                    >
                        <ShoppingBag size={14} /> افزودن به سبد خرید
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistCard;
