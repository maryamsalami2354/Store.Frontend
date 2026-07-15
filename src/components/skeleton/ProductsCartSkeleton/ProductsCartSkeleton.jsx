import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonProduct = ({ count = 8 }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <Skeleton
            baseColor="#e0e0e0"
            highlightColor="#f5f5f5"
            height="200px"
            borderRadius="8px"
          />
          <div style={{ marginTop: "10px" }}>
            <Skeleton
              baseColor="#e0e0e0"
              highlightColor="#f5f5f5"
              width="80%"
              height="20px"
              style={{ marginBottom: "8px" }}
            />
            <Skeleton
              baseColor="#e0e0e0"
              highlightColor="#f5f5f5"
              width="60%"
              height="16px"
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <Skeleton
              baseColor="#e0e0e0"
              highlightColor="#f5f5f5"
              width="40%"
              height="24px"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonProduct;