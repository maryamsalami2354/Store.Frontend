import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import { z } from "zod";
import {
    ArrowLeft,
    CheckCircle,
    Home,
    Mail,
    MapPin,
    Moon,
    Phone,
    Sun,
    User,
    X,
    XCircle,
} from "react-feather";
import { login, register, requestOtp } from "../../../services/authApi.js";
import { setCookie } from "../../../utils/helpers/cookie.js";
import useStore from "../../../store/index.js";
import { normalizeAuthUser } from "../../../utils/helpers/authUser.js";

const phoneSchema = z.object({
    phone: z.string().regex(/^09\d{9}$/, "شماره موبایل باید 11 رقم و با 09 شروع شود"),
});

const otpSchema = z.object({
    otpCode: z.string().regex(/^\d{5}$/, "کد تایید باید 5 رقم باشد"),
});

const optionalEmail = z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().email("ایمیل معتبر نیست").optional()
);

const registerSchema = z.object({
    name: z.string().trim().min(2, "نام حداقل 2 حرف باشد"),
    lastName: z.string().trim().min(2, "نام خانوادگی حداقل 2 حرف باشد"),
    nationalCode: z.string().regex(/^\d{10}$/, "کد ملی باید 10 رقم باشد"),
    email: optionalEmail,
    provinceName: z.string().trim().min(2, "نام استان را وارد کنید"),
    cityName: z.string().trim().min(2, "نام شهر را وارد کنید"),
    neighborhood: z.string().trim().min(2, "محله را وارد کنید"),
    plateNumber: z.string().regex(/^\d{1,10}$/, "شماره پلاک معتبر نیست"),
    unitNumber: z.string().regex(/^\d{1,10}$/, "شماره واحد معتبر نیست"),
    postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید 10 رقم باشد"),
    description: z.string().optional(),
});

const onlyDigits = (value, maxLength) => value.replace(/\D/g, "").slice(0, maxLength);

const allowOnlyDigits = (event) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];

    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
    }
};

const InputShell = ({ children, error, valid }) => (
    <div
        className={`flex items-center rounded-xl border bg-gray-50 dark:bg-gray-900 transition-all ${
            error ? "border-red-500" : valid ? "border-green-500" : "border-gray-300 dark:border-gray-700"
        } focus-within:ring-2 focus-within:ring-[#002874] dark:focus-within:ring-[#4C6FB6] focus-within:border-transparent`}
    >
        {children}
    </div>
);

const FieldError = ({ message }) => {
    if (!message) return null;

    return (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <X size={12} /> {message}
        </p>
    );
};

const LoginPage = () => {
    const [step, setStep] = useState("phone");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [serverHint, setServerHint] = useState("");
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved === "true" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    });
    const navigate = useNavigate();
    const setAuthState = useStore((state) => state.setState);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const goToOtp = (phone, hint = "") => {
        setPhoneNumber(phone);
        setServerHint(hint);
        setStep("otp");
    };

    const handlePhoneSubmit = async (phone) => {
        const result = await requestOtp(phone);

        if (result.userExists) {
            goToOtp(phone, result.developmentOtp ? `کد تست: ${result.developmentOtp}` : "");
            toast.success(result.message || "کد تایید ارسال شد");
            return;
        }

        setPhoneNumber(phone);
        setServerHint("");
        setStep("register");
        toast.info(result.message || "برای ادامه، ثبت نام را تکمیل کنید");
    };

    const handleRegisterSubmit = async (payload) => {
        await register({
            name: payload.name.trim(),
            lastName: payload.lastName.trim(),
            nationalCode: payload.nationalCode,
            phoneNumber,
            email: payload.email?.trim() || null,
            address: {
                provinceName: payload.provinceName.trim(),
                cityName: payload.cityName.trim(),
                neighborhood: payload.neighborhood.trim(),
                plateNumber: payload.plateNumber,
                unitNumber: payload.unitNumber,
                postalCode: payload.postalCode,
                description: payload.description?.trim() || "",
            },
        });

        const otpResult = await requestOtp(phoneNumber);
        goToOtp(phoneNumber, otpResult.developmentOtp ? `کد تست: ${otpResult.developmentOtp}` : "");
        toast.success("ثبت نام انجام شد. کد تایید را وارد کنید");
    };

    const handleOtpSubmit = async (otpCode) => {
        const result = await login({ phoneNumber, otpCode });
        const authUser = normalizeAuthUser(result.user);

        localStorage.setItem("authToken", result.token);
        await setCookie("origins", {
            accessToken: result.token,
            token: result.token,
            user: authUser,
        });
        setAuthState({ accessToken: result.token, user: authUser });

        toast.success("ورود با موفقیت انجام شد");
        navigate("/user");
    };

    const handleBack = () => {
        if (step === "otp" || step === "register") {
            setStep("phone");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-6 transition-colors duration-300">
            <button
                type="button"
                onClick={() => setDarkMode((value) => !value)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#002874] dark:hover:border-[#4C6FB6] transition-all"
                aria-label="تغییر تم"
            >
                {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link to="/">
                        <img src="/images/logos/with-border.svg" alt="Shop Market" className="h-16 w-auto dark:brightness-90" />
                    </Link>
                </div>

                <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                    <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800 relative">
                        {step !== "phone" && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="absolute left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                                aria-label="بازگشت"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2 className="w-full text-center font-bold text-gray-900 dark:text-white text-lg">
                            {step === "phone" && "ورود / ثبت نام"}
                            {step === "otp" && "تایید کد"}
                            {step === "register" && "تکمیل ثبت نام"}
                        </h2>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait" initial={false}>
                            {step === "phone" && <PhoneStep key="phone" onSubmit={handlePhoneSubmit} />}
                            {step === "otp" && (
                                <OtpStep
                                    key="otp"
                                    phone={phoneNumber}
                                    serverHint={serverHint}
                                    onSubmit={handleOtpSubmit}
                                    onResend={handlePhoneSubmit}
                                />
                            )}
                            {step === "register" && (
                                <RegisterStep key="register" phone={phoneNumber} onSubmit={handleRegisterSubmit} />
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="text-center p-3 text-xs text-gray-500 dark:text-gray-400 mt-4 leading-6">
                        با ورود و ثبت نام،
                        <Link to="/terms" className="text-[#002874] dark:text-[#4C6FB6] hover:underline">
                            &nbsp; قوانین و مقررات&nbsp;
                        </Link>
                        و
                        <Link to="/privacy" className="text-[#002874] dark:text-[#4C6FB6] hover:underline">
                            &nbsp; حریم خصوصی&nbsp;
                        </Link>
                        را می‌پذیرید
                    </p>
                </div>
            </div>
        </div>
    );
};

const PhoneStep = ({ onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        trigger,
        watch,
    } = useForm({
        resolver: zodResolver(phoneSchema),
        mode: "onChange",
        defaultValues: { phone: "" },
    });
    const phoneValue = watch("phone");

    const submit = async ({ phone }) => {
        setIsSubmitting(true);
        try {
            await onSubmit(phone);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="space-y-6"
        >
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                شماره موبایل خود را وارد کنید تا وضعیت حساب بررسی شود.
            </div>

            <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                    <div>
                        <InputShell error={errors.phone} valid={/^09\d{9}$/.test(phoneValue || "")}>
                            <span className="ps-3 text-gray-400">
                                <Phone size={18} />
                            </span>
                            <input
                                {...field}
                                type="tel"
                                inputMode="numeric"
                                placeholder="09xxxxxxxxx"
                                className="w-full py-3 px-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 text-left dir-ltr"
                                onChange={(event) => {
                                    field.onChange(onlyDigits(event.target.value, 11));
                                    trigger("phone");
                                }}
                                onKeyDown={allowOnlyDigits}
                            />
                            <div className="pe-3">
                                {errors.phone && <XCircle size={18} className="text-red-500" />}
                                {!errors.phone && /^09\d{9}$/.test(phoneValue || "") && (
                                    <CheckCircle size={18} className="text-green-500" />
                                )}
                            </div>
                        </InputShell>
                        <FieldError message={errors.phone?.message} />
                    </div>
                )}
            />

            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full py-3 rounded-xl bg-[#002874] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#001d5a] transition-all duration-200 shadow-sm hover:shadow-md"
            >
                {isSubmitting ? "در حال بررسی..." : "دریافت کد تایید"}
            </button>
        </form>
    );
};

const OtpStep = ({ phone, serverHint, onSubmit, onResend }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(otpSchema),
        mode: "onChange",
        defaultValues: { otpCode: "" },
    });

    const submit = async ({ otpCode }) => {
        setIsSubmitting(true);
        try {
            await onSubmit(otpCode);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resend = async () => {
        setIsResending(true);
        try {
            await onResend(phone);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <p className="text-gray-600 dark:text-gray-300 text-sm">کد 5 رقمی ارسال شده به شماره زیر را وارد کنید.</p>
                <p className="font-mono text-gray-900 dark:text-white text-lg dir-ltr">{phone}</p>
                {serverHint && <p className="text-gray-500 dark:text-gray-400 text-xs">{serverHint}</p>}
                <button
                    type="button"
                    disabled={isResending}
                    className="text-sm text-[#002874] dark:text-[#4C6FB6] hover:underline disabled:opacity-50"
                    onClick={resend}
                >
                    {isResending ? "در حال ارسال..." : "ارسال مجدد کد"}
                </button>
            </div>

            <Controller
                name="otpCode"
                control={control}
                render={({ field }) => (
                    <div className="space-y-2">
                        <div className="flex justify-center" dir="ltr">
                            <OtpInput
                                value={field.value}
                                onChange={field.onChange}
                                numInputs={5}
                                renderSeparator={<span className="w-2" />}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        inputMode="numeric"
                                        className="!w-12 h-14 text-center text-xl font-bold rounded-xl border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition-all outline-none"
                                        style={{ borderColor: errors.otpCode ? "#ef4444" : isValid ? "#22c55e" : "#d1d5db" }}
                                        onKeyDown={allowOnlyDigits}
                                    />
                                )}
                                shouldAutoFocus
                            />
                        </div>
                        <FieldError message={errors.otpCode?.message} />
                    </div>
                )}
            />

            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full py-3 rounded-xl bg-[#002874] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#001d5a] transition-all duration-200 shadow-sm hover:shadow-md"
            >
                {isSubmitting ? "در حال ورود..." : "تایید و ورود"}
            </button>
        </form>
    );
};

const RegisterStep = ({ phone, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register: registerField,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            lastName: "",
            nationalCode: "",
            email: "",
            provinceName: "",
            cityName: "",
            neighborhood: "",
            plateNumber: "",
            unitNumber: "",
            postalCode: "",
            description: "",
        },
    });

    const submit = async (data) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const setDigits = (name, maxLength) => (event) => {
        setValue(name, onlyDigits(event.target.value, maxLength), { shouldValidate: true, shouldDirty: true });
    };

    const fieldClass = "w-full py-3 px-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white";

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="space-y-5"
        >
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 px-4 py-3">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                    شماره {phone} هنوز ثبت نشده است. اطلاعات زیر را تکمیل کنید.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                    label="نام"
                    icon={<User size={18} />}
                    error={errors.name?.message}
                    valid={watch("name")?.length >= 2}
                    input={<input {...registerField("name")} className={fieldClass} />}
                />
                <TextField
                    label="نام خانوادگی"
                    icon={<User size={18} />}
                    error={errors.lastName?.message}
                    valid={watch("lastName")?.length >= 2}
                    input={<input {...registerField("lastName")} className={fieldClass} />}
                />
            </div>

            <TextField
                label="کد ملی"
                icon={<User size={18} />}
                error={errors.nationalCode?.message}
                valid={/^\d{10}$/.test(watch("nationalCode") || "")}
                input={
                    <input
                        {...registerField("nationalCode")}
                        type="tel"
                        inputMode="numeric"
                        className={`${fieldClass} dir-ltr text-left`}
                        onChange={setDigits("nationalCode", 10)}
                        onKeyDown={allowOnlyDigits}
                    />
                }
            />

            <TextField
                label="ایمیل اختیاری"
                icon={<Mail size={18} />}
                error={errors.email?.message}
                valid={!!watch("email") && !errors.email}
                input={<input {...registerField("email")} type="email" className={`${fieldClass} dir-ltr text-left`} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                    label="استان"
                    icon={<MapPin size={18} />}
                    error={errors.provinceName?.message}
                    valid={watch("provinceName")?.length >= 2}
                    input={<input {...registerField("provinceName")} className={fieldClass} />}
                />
                <TextField
                    label="شهر"
                    icon={<MapPin size={18} />}
                    error={errors.cityName?.message}
                    valid={watch("cityName")?.length >= 2}
                    input={<input {...registerField("cityName")} className={fieldClass} />}
                />
            </div>

            <TextField
                label="محله"
                icon={<Home size={18} />}
                error={errors.neighborhood?.message}
                valid={watch("neighborhood")?.length >= 2}
                input={<input {...registerField("neighborhood")} className={fieldClass} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                    label="پلاک"
                    icon={<Home size={18} />}
                    error={errors.plateNumber?.message}
                    valid={/^\d{1,10}$/.test(watch("plateNumber") || "")}
                    input={
                        <input
                            {...registerField("plateNumber")}
                            type="tel"
                            inputMode="numeric"
                            className={`${fieldClass} dir-ltr text-left`}
                            onChange={setDigits("plateNumber", 10)}
                            onKeyDown={allowOnlyDigits}
                        />
                    }
                />
                <TextField
                    label="واحد"
                    icon={<Home size={18} />}
                    error={errors.unitNumber?.message}
                    valid={/^\d{1,10}$/.test(watch("unitNumber") || "")}
                    input={
                        <input
                            {...registerField("unitNumber")}
                            type="tel"
                            inputMode="numeric"
                            className={`${fieldClass} dir-ltr text-left`}
                            onChange={setDigits("unitNumber", 10)}
                            onKeyDown={allowOnlyDigits}
                        />
                    }
                />
            </div>

            <TextField
                label="کد پستی"
                icon={<Home size={18} />}
                error={errors.postalCode?.message}
                valid={/^\d{10}$/.test(watch("postalCode") || "")}
                input={
                    <input
                        {...registerField("postalCode")}
                        type="tel"
                        inputMode="numeric"
                        className={`${fieldClass} dir-ltr text-left`}
                        onChange={setDigits("postalCode", 10)}
                        onKeyDown={allowOnlyDigits}
                    />
                }
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">توضیحات آدرس اختیاری</label>
                <textarea
                    {...registerField("description")}
                    rows={3}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-3 px-3 focus:outline-none focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] text-gray-900 dark:text-white resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full py-3 rounded-xl bg-[#002874] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#001d5a] transition-all duration-200 shadow-sm hover:shadow-md"
            >
                {isSubmitting ? "در حال ثبت نام..." : "ثبت نام و دریافت کد"}
            </button>
        </form>
    );
};

const TextField = ({ label, icon, input, error, valid }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
        <InputShell error={error} valid={valid}>
            <span className="ps-3 text-gray-400">{icon}</span>
            {input}
            <div className="pe-3">
                {error && <XCircle size={18} className="text-red-500" />}
                {!error && valid && <CheckCircle size={18} className="text-green-500" />}
            </div>
        </InputShell>
        <FieldError message={error} />
    </div>
);

export default LoginPage;
