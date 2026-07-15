// =============================================================================
// FILE: returnPolicyHero.jsx
// =============================================================================
import React from 'react';
import { RotateCcw, Shield, Clock } from 'react-feather';

const ReturnPolicyHero = () => (
    <div className="relative overflow-hidden mt-3 rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-6 sm:p-8 lg:p-10 mb-6">
        <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-[12px] border-white" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full border-[12px] border-white" />
        </div>

        <div className="relative z-10 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur mb-4">
                <RotateCcw size={36} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                شرایط <span className="text-amber-400">بازگشت کالا</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
                ما در شاپ مارکت به رضایت شما اهمیت می‌دهیم. اگر از خرید خود راضی نیستید، می‌توانید طبق شرایط زیر کالا را بازگردانید.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-2xl mx-auto">
                {[
                    { icon: Clock, label: '۷ روز', text: 'فرصت بازگشت' },
                    { icon: Shield, label: 'تضمینی', text: 'بازگشت وجه' },
                    { icon: RotateCcw, label: 'سریع', text: 'فرآیند مرجوعی' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                        <item.icon size={24} className="text-amber-400 mx-auto mb-2" />
                        <div className="text-xl font-extrabold text-white">{item.label}</div>
                        <div className="text-xs text-white/60 mt-0.5">{item.text}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ReturnPolicyHero;