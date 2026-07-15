// src/pages/Products/Products.jsx
import React, { useState, useCallback, useLayoutEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import SkeletonProduct from "../skeleton/ProductsCartSkeleton/";
import { GetProductsByPage } from "../../utils/api/products/GetProduct.js";
import ErrorOnFetchApi from "../common/ErrorOnFetchApi/ErrorOnFetchApi.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(true);

  const fetchProducts = useCallback(async (pageNum) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await GetProductsByPage(pageNum);
      
      if (pageNum === 1) {
        setProducts(data.products || []);
      } else {
        setProducts(prev => [...prev, ...(data.products || [])]);
      }
      
      setHasMore(pageNum < (data.totalPages || 1));
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchProducts(page + 1);
    }
  };

  if (initialLoading) {
    return <SkeletonProduct count={8} />;
  }

  if (error && products.length === 0) {
    return (
      <ErrorOnFetchApi 
        message="خطا در اتصال به سرور" 
        isVisible={showError}
        onClose={() => setShowError(false)}
      />
    );
  }

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={loadMore}
      hasMore={hasMore}
      loader={null}
      endMessage={<p style={{ textAlign: "center", padding: "20px" }}>پایان ✓</p>}
      style={{ overflow: "hidden" }}
    >
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
        gap: "20px", 
        padding: "20px" 
      }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
            <LazyLoadImage
              src={product.image}
              alt={product.name}
              width="100%"
              height="200"
              effect="blur"
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
            <h3>{product.name}</h3>
            <p style={{ color: "#2ecc71", fontWeight: "bold" }}>
              {product.price?.toLocaleString()} تومان
            </p>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default Products;