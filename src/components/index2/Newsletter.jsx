// src/components/index2/Newsletter.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Mail, Send, CheckCircle } from 'lucide-react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateEmail = (email) => /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { toast.error('لطفا ایمیل خود را وارد کنید'); return; }
        if (!validateEmail(email)) { toast.error('فرمت ایمیل وارد شده صحیح نیست'); return; }
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSuccess(true);
        toast.success('با موفقیت در خبرنامه عضو شدید!');
        setEmail('');
        setTimeout(() => setIsSuccess(false), 3000);
        setIsSubmitting(false);
    };

    return (
        <section className="py-3 sm:py-5">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-l from-[#002874] to-[#4C6FB6] dark:from-[#1a1c20] dark:to-[#20242b] p-6 sm:p-8 text-center">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" /><div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    {isSuccess ? (<div className="flex flex-col items-center gap-3"><CheckCircle size={48} className="text-green-400" /><h3 className="text-white text-xl font-bold">عضویت شما با موفقیت ثبت شد!</h3><p className="text-white/70">به زودی بهترین تخفیف‌ها را برای شما می‌فرستیم</p></div>) : (<><div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"><Mail size={28} className="text-white" /></div><h3 className="text-white text-xl sm:text-2xl font-bold mb-2">عضویت در خبرنامه</h3><p className="text-white/70 text-sm mb-5">برای اطلاع از جدیدترین تخفیف‌ها و محصولات، ایمیل خود را وارد کنید</p><form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل خود را وارد کنید..." className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" disabled={isSubmitting} /><button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-white text-[#002874] rounded-lg font-medium flex items-center justify-center gap-2 hover:gap-3 transition-all disabled:opacity-50">{isSubmitting ? 'در حال ثبت...' : <>عضویت <Send size={14} /></>}</button></form><p className="text-white/50 text-[10px] mt-3">با عضویت، قوانین و شرایط را پذیرفته‌اید</p></>)}
                </div>
            </motion.div>
        </section>
    );
};

export default Newsletter;