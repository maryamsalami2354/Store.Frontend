// src/components/skeleton/MainSkeleton.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonContext = createContext();

export const useSkeleton = () => useContext(SkeletonContext);

export const SkeletonProvider = ({ children }) => {
  const [readyPages, setReadyPages] = useState({});

  const markReady = useCallback((pageKey) => {
    setReadyPages(prev => ({ ...prev, [pageKey]: true }));
  }, []);

  const isReady = useCallback((pageKey) => {
    return readyPages[pageKey] === true;
  }, [readyPages]);

  return (
    <SkeletonContext.Provider value={{ markReady, isReady }}>
      {children}
    </SkeletonContext.Provider>
  );
};

const PageSkeleton = ({ children, customSkeleton }) => {
  const { isReady, markReady } = useSkeleton();

  const path = window.location.pathname.replace("/", "") || "root";

  useEffect(() => {
    const timer = setTimeout(() => {
      markReady(path);
    }, 1);

    return () => clearTimeout(timer);
  }, [path, markReady]);

  if (isReady(path)) {
    return <>{children}</>;
  }

  const defaultSkeleton = (
    <div className="w-full p-4 md:p-6">
      <Skeleton height={300} className="w-full !rounded-[10px]" />
      <div className="grid mt-3 grid-cols-2 gap-4">
        <div className="relative">
          <Skeleton height={200} className="w-full !rounded-[10px]" />
          <div className="absolute top-4 right-4 left-4">
          <Skeleton
              height={30}
              width="40%"
              className="!rounded-[3px]"
              baseColor="#c9c9c9"
              highlightColor="#f1f1f1"
            />
            <Skeleton
              height={30}
              width="60%"
              className="!rounded-[3px] mt-3"
              baseColor="#c9c9c9"
              highlightColor="#f1f1f1"
            />
            <Skeleton
              height={30}
              width="20%"
              className="!rounded-[3px] mt-3"
              baseColor="#c9c9c9"
              highlightColor="#f1f1f1"
            />
          </div>
        </div>
        <div className="relative">
          <Skeleton height={200} className="w-full !rounded-[10px]" />
          <div className="absolute top-4 right-4 left-4">
            <Skeleton
              height={30}
              width="40%"
              className="!rounded-[3px]"
              baseColor="#c9c9c9"
              highlightColor="#f1f1f1"
            />
            <Skeleton
              height={30}
              width="60%"
              className="!rounded-[3px] mt-3"
              baseColor="#c9c9c9"
              highlightColor="#f1f1f1"
            />
            <Skeleton
              height={30}
              width="20%"
              className="!rounded-[3px] mt-3"
              baseColor="#c9c9c9"
              highlightColor="#f1f1f1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return customSkeleton || defaultSkeleton;
};

export default PageSkeleton;