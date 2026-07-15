// src/components/index2/FeatureBoxes.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Headphones, RefreshCw } from 'lucide-react';

const features = [
    {
        icon: Truck,
        title: 'ارسال سریع',
        desc: 'تحویل ۲۴ ساعته در تهران',
        color: 'from-blue-500 to-blue-600'
    },
    {
        icon: Shield,
        title: 'ضمانت اصالت',
        desc: 'ضمانت بازگشت وجه',
        color: 'from-emerald-500 to-emerald-600'
    },
    {
        icon: Headphones,
        title: 'پشتیبانی ۲۴/۷',
        desc: '۷ روز هفته، ۲۴ ساعت',
        color: 'from-purple-500 to-purple-600'
    },
    {
        icon: RefreshCw,
        title: 'گارانتی تعویض',
        desc: '۳۰ روز گارانتی بی‌قید و شرط',
        color: 'from-orange-500 to-orange-600'
    }
];

const FeatureBoxes = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group relative bg-white dark:bg-[#111111] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                            <div className="relative z-10 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                                    <Icon size={22} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default FeatureBoxes;