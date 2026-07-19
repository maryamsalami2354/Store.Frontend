import React from "react";
import { toast } from "react-toastify";
import useCartActions from "../../hooks/useCartActions.js";
import { getProductAvailability } from "../../utils/helpers/productAvailability.js";

const Products = ({ product }) => {
  const { addProductToCart } = useCartActions();
  const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.info('این محصول فعلا ناموجود است');
      return;
    }

    addProductToCart(product);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${availabilityBadgeClass}`}>
        {availabilityLabel}
      </span>
      <button disabled={isOutOfStock} onClick={handleAddToCart} className={isOutOfStock ? 'cursor-not-allowed opacity-60' : ''}>
        افزودن به سبد خرید
      </button>
    </div>
  );
};

export default Products;
