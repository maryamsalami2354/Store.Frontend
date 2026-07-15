// =============================================================================
// FILE: privacyPage.jsx
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Shield } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import PrivacyPageSkeleton from '../skeleton/PrivacyPageSkeleton/PrivacyPageSkeleton';
import PrivacyHero from './privacyHero';
import PrivacyContent from './privacyContent';

const PrivacyPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { const t = setTimeout(() => setIsLoading(false), 600); window.scrollTo(0, 0); return () => clearTimeout(t); }, []);
    if (isLoading) return <PrivacyPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'حریم خصوصی', link: '/privacy', icon: Shield }]} />
                <PrivacyHero />
                <div className="max-w-4xl mx-auto">
                    <PrivacyContent />
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;