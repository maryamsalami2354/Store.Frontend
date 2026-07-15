import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { GetProductsByPage } from "../../utils/api/products/GetProduct.js";

// کامپوننت Modal با زوم و اسلایدر
const ImageModal = ({ image, name, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(1.5);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  if (!isOpen) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        flexDirection: "column"
      }}
      onClick={onClose}
    >
      {/* دکمه بستن */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer",
          zIndex: 10000
        }}
      >
        ✕
      </button>

      {/* تصویر بزرگ */}
      <div 
        style={{
          position: "relative",
          maxWidth: "80vw",
          maxHeight: "70vh",
          overflow: "hidden",
          cursor: "move"
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
      >
        <img
          src={image}
          alt={name}
          style={{
            maxWidth: "80vw",
            maxHeight: "70vh",
            objectFit: "contain",
            transform: `scale(${zoom})`,
            transformOrigin: `${position.x}% ${position.y}%`,
            transition: "transform 0.1s ease"
          }}
        />
      </div>

      {/* نام محصول */}
      <h2 style={{ color: "#fff", margin: "20px 0" }}>{name}</h2>

      {/* اسلایدر زوم */}
      <div 
        style={{
          backgroundColor: "#fff",
          padding: "15px 30px",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          cursor: "pointer"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ fontSize: "18px" }}>🔍</span>
        <input 
          type="range" 
          min="1" 
          max="4" 
          step="0.1" 
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          style={{
            width: "200px",
            accentColor: "#2ecc71"
          }}
        />
        <span style={{ minWidth: "40px", fontWeight: "bold" }}>
          {zoom.toFixed(1)}x
        </span>
      </div>
    </div>
  );
};

export const Products = () => {
  const MAX_PAGES = 15;
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState(null);

  const {
    isPending,
    error,
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam = 1 }) => GetProductsByPage(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length >= MAX_PAGES || allPages.length >= lastPage.totalPages) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1
  });

  const allProducts = data?.pages?.flatMap((page) => page.products || []) || [];

  const openModal = (image, name) => {
    setSelectedImage(image);
    setSelectedName(name);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedName(null);
  };

  if (isPending) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در دریافت محصولات: {error.message}</div>;
  }

  return (
    <>
      <InfiniteScroll
        dataLength={allProducts.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<div style={{ textAlign: "center", padding: "20px" }}>در حال بارگذاری بیشتر...</div>}
        endMessage={<div style={{ textAlign: "center", padding: "20px" }}>تمام محصولات نمایش داده شد</div>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
          {allProducts.map((product) => (
            <div 
              key={product.id} 
              style={{ 
                border: "1px solid #ddd", 
                padding: "10px", 
                borderRadius: "8px",
                backgroundColor: "#fff"
              }}
            >
              <div 
                style={{ cursor: "zoom-in", borderRadius: "8px", overflow: "hidden" }}
                onClick={() => openModal(product.image, product.name)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  width="250"
                  height="200"
                  style={{ 
                    objectFit: "cover",
                    borderRadius: "8px",
                    width: "100%"
                  }}
                />
              </div>
              <h3 style={{ margin: "10px 0 5px", fontSize: "16px" }}>{product.name}</h3>
              <p style={{ color: "#2ecc71", fontWeight: "bold", margin: 0 }}>
                {product.price.toLocaleString()} تومان
              </p>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {/* Modal */}
      <ImageModal 
        image={selectedImage} 
        name={selectedName} 
        isOpen={!!selectedImage} 
        onClose={closeModal} 
      />
    </>
  );
};