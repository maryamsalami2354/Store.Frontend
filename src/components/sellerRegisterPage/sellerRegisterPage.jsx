// =============================================================================
// FILE: sellerRegisterPage.jsx (اصلاح‌شده)
// =============================================================================
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Award } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import SellerRegisterPageSkeleton from '../skeleton/SellerRegisterPageSkeleton/SellerRegisterPageSkeleton';

// Landing
import SellerLandingHero from './landing/sellerLandingHero';
import SellerLandingBenefits from './landing/sellerLandingBenefits';
import SellerLandingPlans from './landing/sellerLandingPlans';
import SellerLandingCompare from './landing/sellerLandingCompare';
import SellerLandingStats from './landing/sellerLandingStats';
import SellerLandingTestimonials from './landing/sellerLandingTestimonials';
import SellerLandingFaq from './landing/sellerLandingFaq';

// Form
import SellerFormStep from './form/sellerFormStep';
import SellerFormPersonal from './form/sellerFormPersonal';
import SellerFormOtp from './form/sellerFormOtp';
import SellerFormShop from './form/sellerFormShop';

// Approval
import SellerWaitingApproval from './approval/sellerWaitingApproval';

// Welcome
import SellerWelcome from './welcome/sellerWelcome';

// =============================================================================
// STEPS
// =============================================================================
const STEPS = {
    LANDING: 'landing',
    FORM_PERSONAL: 'form_personal',
    FORM_OTP: 'form_otp',
    FORM_SHOP: 'form_shop',
    WAITING: 'waiting',
    WELCOME: 'welcome',
};

// =============================================================================
// SELLER PLANS DATA
// =============================================================================
const plansData = [
    {
        id: 'basic',
        name: 'پایه',
        price: 'رایگان',
        period: 'ماهانه',
        commission: '۱۵٪',
        products: 30,
        features: ['پنل فروشنده', '۳۰ محصول', 'پشتیبانی تیکت', 'گزارشات پایه'],
        color: 'from-gray-500 to-gray-600',
        popular: false,
    },
    {
        id: 'pro',
        name: 'حرفه‌ای',
        price: '۲۹۹,۰۰۰',
        period: 'ماهانه',
        commission: '۸٪',
        products: 200,
        features: ['پنل پیشرفته', '۲۰۰ محصول', 'پشتیبانی چت زنده', 'گزارشات تحلیلی', 'تخفیف‌های ویژه', 'الویت در جستجو'],
        color: 'from-[#002874] to-[#4C6FB6]',
        popular: true,
    },
    {
        id: 'enterprise',
        name: 'سازمانی',
        price: '۷۹۹,۰۰۰',
        period: 'ماهانه',
        commission: '۴٪',
        products: 'نامحدود',
        features: ['پنل اختصاصی', 'محصولات نامحدود', 'پشتیبانی اختصاصی ۲۴/۷', 'گزارشات هوش تجاری', 'API اختصاصی', 'مدیر حساب', 'تخفیف‌های VIP', 'بنر تبلیغاتی'],
        color: 'from-purple-500 to-indigo-600',
        popular: false,
    },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const SellerRegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(STEPS.LANDING);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isSubStepLoading, setIsSubStepLoading] = useState(false);
    const [personalData, setPersonalData] = useState(null);
    const [shopData, setShopData] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleSelectPlan = useCallback((plan) => {
        setSelectedPlan(plan);
        setIsSubStepLoading(true);
        setTimeout(() => {
            setStep(STEPS.FORM_PERSONAL);
            setIsSubStepLoading(false);
        }, 500);
    }, []);

    const handlePersonalSubmit = useCallback((data) => {
        setPersonalData(data);
        setIsSubStepLoading(true);
        setTimeout(() => {
            setStep(STEPS.FORM_OTP);
            setIsSubStepLoading(false);
        }, 500);
        toast.success('کد تأیید به شماره شما ارسال شد');
    }, []);

    const handleOtpSuccess = useCallback(() => {
        setIsSubStepLoading(true);
        setTimeout(() => {
            setStep(STEPS.FORM_SHOP);
            setIsSubStepLoading(false);
        }, 500);
        toast.success('شماره موبایل تأیید شد');
    }, []);

    const handleShopSubmit = useCallback((data) => {
        setShopData(data);
        setIsSubStepLoading(true);
        setTimeout(() => {
            setStep(STEPS.WAITING);
            setIsSubStepLoading(false);
        }, 500);
        toast.success('اطلاعات فروشگاه ثبت شد');
    }, []);

    const handleApprovalDone = useCallback(() => {
        setIsSubStepLoading(true);
        setTimeout(() => {
            setStep(STEPS.WELCOME);
            setIsSubStepLoading(false);
        }, 1000);
    }, []);

    const handleBackToLanding = useCallback(() => {
        setStep(STEPS.LANDING);
        setSelectedPlan(null);
    }, []);

    const renderStepContent = () => {
        if (isSubStepLoading) {
            return <SellerRegisterPageSkeleton />;
        }

        switch (step) {
            case STEPS.LANDING:
                return (
                    <>
                        <SellerLandingHero onStart={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} />
                        <SellerLandingBenefits />
                        <div id="plans">
                            <SellerLandingPlans plans={plansData} selectedPlan={selectedPlan} onSelect={handleSelectPlan} />
                        </div>
                        <SellerLandingCompare plans={plansData} />
                        <SellerLandingStats />
                        <SellerLandingTestimonials />
                        <SellerLandingFaq />
                    </>
                );

            case STEPS.FORM_PERSONAL:
                return (
                    <div className="max-w-xl mx-auto">
                        <SellerFormStep current={1} total={3} titles={['اطلاعات شخصی', 'تأیید موبایل', 'اطلاعات فروشگاه']} />
                        <SellerFormPersonal selectedPlan={selectedPlan} onSubmit={handlePersonalSubmit} onBack={handleBackToLanding} />
                    </div>
                );

            case STEPS.FORM_OTP:
                return (
                    <div className="max-w-md mx-auto">
                        <SellerFormStep current={2} total={3} titles={['اطلاعات شخصی', 'تأیید موبایل', 'اطلاعات فروشگاه']} />
                        <SellerFormOtp phone={personalData?.phone} onSuccess={handleOtpSuccess} onBack={() => setStep(STEPS.FORM_PERSONAL)} />
                    </div>
                );

            case STEPS.FORM_SHOP:
                return (
                    <div className="max-w-xl mx-auto">
                        <SellerFormStep current={3} total={3} titles={['اطلاعات شخصی', 'تأیید موبایل', 'اطلاعات فروشگاه']} />
                        <SellerFormShop selectedPlan={selectedPlan} onSubmit={handleShopSubmit} onBack={() => setStep(STEPS.FORM_OTP)} />
                    </div>
                );

            case STEPS.WAITING:
                return <SellerWaitingApproval onApprovalDone={handleApprovalDone} />;

            case STEPS.WELCOME:
                return <SellerWelcome shopName={shopData?.shopName} onGoToDashboard={() => navigate('/seller')} />;

            default:
                return null;
        }
    };

    if (isLoading) return <SellerRegisterPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                {step === STEPS.LANDING && (
                    <div className="mb-3">
                        <Breadcrumb items={[{ title: 'فروشنده شوید', link: '/seller/register', icon: Award }]} />
                    </div>                )}
                {renderStepContent()}
            </div>
        </div>
    );
};

export default SellerRegisterPage;