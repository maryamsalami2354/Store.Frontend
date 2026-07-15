import React from "react";
import useCartActions from "../../hooks/useCartActions.js";

const Products = ({ product }) => {
  const { addProductToCart } = useCartActions();

  return (
    <button onClick={() => addProductToCart(product)}>
      افزودن به سبد خرید
    </button>
  );
};

export default Products;
