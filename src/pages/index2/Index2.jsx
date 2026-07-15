// src/pages/index2/Index2.jsx
import React from 'react';
import HeroSection from '../../components/index2/HeroSection';
import FeatureBoxes from '../../components/index2/FeatureBoxes';
import FlashDeals from '../../components/index2/FlashDeals';
import CategoryShowcase from '../../components/index2/CategoryShowcase';
import DualBanner from '../../components/index2/DualBanner';
import BestSellerProducts from '../../components/index2/BestSellerProducts';
import VerticalSlider from '../../components/index2/VerticalSlider';
import DiscountZone from '../../components/index2/DiscountZone';
import TopRatedProducts from '../../components/index2/TopRatedProducts';
import InstagramSection from '../../components/index2/InstagramSection';
import Newsletter from '../../components/index2/Newsletter';

const Index2 = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <FeatureBoxes />
                <FlashDeals />
                <CategoryShowcase />
                <DualBanner />
                <BestSellerProducts />
                <VerticalSlider />
                <DiscountZone />
                <TopRatedProducts />
                <InstagramSection />
                <Newsletter />
            </div>
        </div>
    );
};

export default Index2;