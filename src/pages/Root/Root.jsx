import React from "react";
import Stories from "../../components/index/stories";
import HeroSlider from "../../components/index/sliders";
import AmazingProducts from "../../components/index/amazingProducts";
import CategoriesSlider from "../../components/index/categoriesSlider";
import NewestProducts from "../../components/index/newestProducts";
import MiddleBanners from "../../components/index/middleBanners";
import SomeProducts from "../../components/index/someProducts";
import NewProductCardGrid from "../../components/index/newProductsGrid";
import MostViewedProducts from "../../components/index/mostViewedProducts";
import BrandsSlider from "../../components/index/brandsSlider";
import LatestBlogPosts from "../../components/index/latestBlogPosts";

const Root = () => {
    return (
        <div className="container mx-auto px-6">
            <Stories/>
            <HeroSlider/>
            <AmazingProducts/>
            <CategoriesSlider />
            <NewestProducts/>
            <MiddleBanners />
            <SomeProducts />
            <NewProductCardGrid/>
            <MostViewedProducts/>
            <BrandsSlider/>
            <LatestBlogPosts/>
        </div>
    )
};

export default Root;