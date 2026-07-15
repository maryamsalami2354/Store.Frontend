// src/components/index2/DiscountZone.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Copy, Gift, ArrowLeft, Percent } from 'lucide-react';

const discountCode = "WELCOME1404";
const discountPercent = 15;

const DiscountZone = () => {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(discountCode);
        setCopied(true);
        toast.success(`کد ${discountCode} کپی شد!`, { position: "top-center", autoClose: 2000 });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-3 sm:py-5">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002874] to-[#4C6FB6] dark:from-[#1a1c20] dark:to-[#20242b] p-6 sm:p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Gift size={32} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">تخفیف ویژه {discountPercent} درصدی</h3>
                            <p className="text-white/80 text-sm">با کد تخفیف زیر، از خرید خود لذت ببرید</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                            <Percent size={16} className="text-white/70" />
                            <span className="text-white font-mono text-lg tracking-wider">{discountCode}</span>
                            <button onClick={handleCopyCode} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"><Copy size={14} className="text-white" /></button>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2 bg-white text-[#002874] rounded-lg font-medium hover:gap-3 transition-all">
                            <span>خرید با تخفیف</span>
                            <ArrowLeft size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default DiscountZone;