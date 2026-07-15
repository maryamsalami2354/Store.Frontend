const MiddleBanners = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full">
            <img
                src="/images/middleBanner/bnr1.png"
                className="w-full h-auto rounded-xl object-contain hover:scale-105 transition-transform duration-300"
                alt=""
            />
            <img
                src="/images/middleBanner/bnr2.png"
                className="w-full h-auto rounded-xl object-contain hover:scale-105 transition-transform duration-300"
                alt=""
            />
            <img
                src="/images/middleBanner/bnr3.png"
                className="w-full h-auto rounded-xl object-contain hover:scale-105 transition-transform duration-300"
                alt=""
            />
            <img
                src="/images/middleBanner/bnr4.png"
                className="w-full h-auto rounded-xl object-contain hover:scale-105 transition-transform duration-300"
                alt=""
            />
        </div>
    );
};

export default MiddleBanners;