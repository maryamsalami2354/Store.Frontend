// =============================================================================
// FILE: returnPolicyPage.jsx
// =============================================================================
import React, { useState, useEffect } from 'react';
import { FileText } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import ReturnPolicyPageSkeleton from '../skeleton/ReturnPolicyPageSkeleton/ReturnPolicyPageSkeleton';
import ReturnPolicyHero from './returnPolicyHero';
import ReturnPolicyContent from './returnPolicyContent';
import ReturnPolicyFaq from './returnPolicyFaq';
import ReturnPolicySidebar from './returnPolicySidebar';
import ReturnPolicyContact from './returnPolicyContact';

const ReturnPolicyPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <ReturnPolicyPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                <Breadcrumb items={[{ title: 'شرایط بازگشت کالا', link: '/return-policy', icon: FileText }]} />

                <ReturnPolicyHero />

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-4">
                        <ReturnPolicyContent />
                        <ReturnPolicyFaq />
                        <ReturnPolicyContact />
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <ReturnPolicySidebar />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReturnPolicyPage;