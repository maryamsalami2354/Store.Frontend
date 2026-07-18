import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Lock, Phone, Shield, Sun, Moon } from "react-feather";
import { adminLogin, requestAdminOtp } from "../../services/authApi.js";
import { setCookie } from "../../utils/helpers/cookie.js";
import { isAdminUser, normalizeAuthUser } from "../../utils/helpers/authUser.js";
import useStore from "../../store/index.js";

const onlyDigits = (value, maxLength) => value.replace(/\D/g, "").slice(0, maxLength);

const AdminLogin = () => {
    const navigate = useNavigate();
    const setAuthState = useStore((state) => state.setState);
    const [step, setStep] = useState("phone");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [serverHint, setServerHint] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved === "true" || saved === null;
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const handlePhoneSubmit = async (event) => {
        event.preventDefault();

        if (!/^09\d{9}$/.test(phoneNumber)) {
            toast.error("شماره موبایل ادمین معتبر نیست");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await requestAdminOtp(phoneNumber);
            setServerHint(result.developmentOtp ? `کد تست: ${result.developmentOtp}` : "");
            setStep("otp");
            toast.success(result.message || "کد ورود ادمین ارسال شد");
        } catch (error) {
            toast.error(error.message || "دسترسی ادمین برای این شماره مجاز نیست");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpSubmit = async (event) => {
        event.preventDefault();

        if (!/^\d{5}$/.test(otpCode)) {
            toast.error("کد تایید باید ۵ رقم باشد");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await adminLogin({ phoneNumber, otpCode });
            const authUser = normalizeAuthUser(result.user);

            if (!isAdminUser(authUser)) {
                toast.error("این حساب نقش ادمین ندارد");
                return;
            }

            localStorage.setItem("authToken", result.token);
            localStorage.setItem("token", result.token);
            await setCookie("origins", {
                accessToken: result.token,
                token: result.token,
                user: authUser,
            });
            setAuthState({ accessToken: result.token, user: authUser });

            toast.success("ورود به پنل ادمین انجام شد");
            navigate("/admin", { replace: true });
        } catch (error) {
            toast.error(error.message || "ورود ادمین ناموفق بود");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0b1020] text-white" dir="rtl">
            <div className="flex min-h-screen">
                <section className="hidden min-h-screen flex-1 bg-[#10182f] px-12 py-10 lg:flex lg:flex-col lg:justify-between">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                            <ArrowLeft size={17} />
                            بازگشت به فروشگاه
                        </Link>
                    </div>

                    <div className="max-w-lg">
                        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
                            <Shield size={28} />
                        </div>
                        <h1 className="text-3xl font-bold leading-10">ورود مدیران کیان شاپ</h1>
                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            این بخش مخصوص مدیریت کاربران، سفارش‌ها و عملیات فروشگاه است.
                        </p>
                    </div>

                    <p className="text-xs text-slate-500">Kian Shop Admin Console</p>
                </section>

                <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-8">
                    <button
                        type="button"
                        onClick={() => setDarkMode((value) => !value)}
                        className="absolute left-4 top-4 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10"
                        aria-label="تغییر تم"
                    >
                        {darkMode ? <Sun size={19} /> : <Moon size={19} />}
                    </button>

                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center lg:hidden">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
                                <Shield size={28} />
                            </div>
                            <h1 className="text-2xl font-bold">ورود مدیران کیان شاپ</h1>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
                            <div className="mb-6">
                                <p className="text-xs text-cyan-300">Admin Login</p>
                                <h2 className="mt-1 text-xl font-bold">
                                    {step === "phone" ? "شماره ادمین را وارد کنید" : "کد تایید را وارد کنید"}
                                </h2>
                            </div>

                            {step === "phone" ? (
                                <form onSubmit={handlePhoneSubmit} className="space-y-5">
                                    <label className="block space-y-2">
                                        <span className="text-xs text-slate-300">شماره موبایل ادمین</span>
                                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-3 focus-within:border-cyan-300">
                                            <Phone size={18} className="text-slate-400" />
                                            <input
                                                value={phoneNumber}
                                                onChange={(event) => setPhoneNumber(onlyDigits(event.target.value, 11))}
                                                placeholder="09123456789"
                                                inputMode="numeric"
                                                dir="ltr"
                                                className="w-full bg-transparent text-left text-sm text-white outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-lg bg-cyan-400 px-4 py-3 text-sm font-bold text-[#07111f] hover:bg-cyan-300 disabled:opacity-60"
                                    >
                                        {isSubmitting ? "در حال بررسی..." : "دریافت کد ورود ادمین"}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleOtpSubmit} className="space-y-5">
                                    <label className="block space-y-2">
                                        <span className="text-xs text-slate-300">کد تایید</span>
                                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-3 focus-within:border-cyan-300">
                                            <Lock size={18} className="text-slate-400" />
                                            <input
                                                value={otpCode}
                                                onChange={(event) => setOtpCode(onlyDigits(event.target.value, 5))}
                                                placeholder="55555"
                                                inputMode="numeric"
                                                dir="ltr"
                                                className="w-full bg-transparent text-center text-lg tracking-widest text-white outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                    </label>

                                    {serverHint && <p className="rounded-lg bg-cyan-400/10 px-3 py-2 text-center text-xs text-cyan-200">{serverHint}</p>}

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep("phone");
                                                setOtpCode("");
                                            }}
                                            className="rounded-lg border border-white/10 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
                                        >
                                            تغییر شماره
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 rounded-lg bg-cyan-400 px-4 py-3 text-sm font-bold text-[#07111f] hover:bg-cyan-300 disabled:opacity-60"
                                        >
                                            {isSubmitting ? "در حال ورود..." : "ورود به پنل"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AdminLogin;
