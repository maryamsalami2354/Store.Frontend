import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { GetProductsByPage } from "../../utils/api/products/GetProduct.js";

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const { isPending, error, data } = useQuery({
    queryKey: ["products", currentPage],
    queryFn: () => GetProductsByPage(currentPage)
  });

  const goToPage = (page) => {
    setSearchParams({ page: page.toString() });
  };

  if (isPending) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در دریافت محصولات: {error.message}</div>;
  }

  const totalPages = data?.totalPages || 1;
  const products = data?.products || [];

  return (
    <>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
        gap: "20px", 
        padding: "20px" 
      }}>
        {products.map((product) => (
          <div 
            key={product.id} 
            style={{ 
              border: "1px solid #ddd", 
              padding: "10px", 
              borderRadius: "8px",
              backgroundColor: "#fff"
            }}
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
            <h3 style={{ margin: "10px 0 5px", fontSize: "16px" }}>{product.name}</h3>
            <p style={{ color: "#2ecc71", fontWeight: "bold", margin: 0 }}>
              {product.price.toLocaleString()} تومان
            </p>
          </div>
        ))}
      </div>

      <ul style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "20px", listStyle: "none" }}>
        <li>
          <button 
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{ 
              padding: "8px 12px", 
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            ← قبلی
          </button>
        </li>
        
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i}>
            <button
              onClick={() => goToPage(i + 1)}
              style={{ 
                padding: "8px 12px", 
                cursor: "pointer",
                backgroundColor: currentPage === i + 1 ? "#2ecc71" : "transparent",
                color: currentPage === i + 1 ? "#fff" : "#333",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            >
              {i + 1}
            </button>
          </li>
        ))}
        
        <li>
          <button 
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{ 
              padding: "8px 12px", 
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            بعدی →
          </button>
        </li>
      </ul>
    </>
  );
};