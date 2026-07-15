// =============================================================================
// FILE: clubPage.jsx
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Award } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import ClubPageSkeleton from '../skeleton/ClubPageSkeleton/ClubPageSkeleton';
import ClubHero from './clubHero';
import ClubTiers from './clubTiers';
import ClubBenefits from './clubBenefits';
import ClubHowToEarn from './clubHowToEarn';
import ClubRewards from './clubRewards';
import ClubFaq from './clubFaq';
import ClubJoinCard from './clubJoinCard';

const ClubPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn] = useState(() => !!localStorage.getItem('token'));

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <ClubPageSkeleton />;

    if (!isLoggedIn) {
        return (
            <div className="bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                    <Breadcrumb items={[{ title: 'باشگاه مشتریان', link: '/club', icon: Award }]} />
                    <ClubHero isLoggedIn={false} />
                    <div className="max-w-4xl mx-auto space-y-4 pb-8">
                        <ClubTiers currentTier={null} />
                        <ClubBenefits />
                        <ClubHowToEarn />
                        <ClubRewards />
                        <ClubFaq />
                        <ClubJoinCard />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'باشگاه مشتریان', link: '/club', icon: Award }]} />
                <ClubHero isLoggedIn={true} />
                <div className="max-w-4xl mx-auto space-y-4 pb-8">
                    <ClubTiers currentTier="gold" />
                    <ClubBenefits />
                    <ClubHowToEarn />
                    <ClubRewards />
                    <ClubFaq />
                </div>
            </div>
        </div>
    );
};

export default ClubPage;