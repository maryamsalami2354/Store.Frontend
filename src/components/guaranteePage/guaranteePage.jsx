// =============================================================================
// FILE: guaranteePage.jsx
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Shield } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import GuaranteePageSkeleton from '../skeleton/GuaranteePageSkeleton/GuaranteePageSkeleton';
import GuaranteeHero from './guaranteeHero';
import GuaranteeContent from './guaranteeContent';

const GuaranteePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { const t = setTimeout(() => setIsLoading(false), 600); window.scrollTo(0, 0); return () => clearTimeout(t); }, []);
    if (isLoading) return <GuaranteePageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'گارانتی محصولات', link: '/guarantee', icon: Shield }]} />
                <GuaranteeHero />
                <div className="max-w-4xl mx-auto">
                    <GuaranteeContent />
                </div>
            </div>
        </div>
    );
};

export default GuaranteePage;