// src/components/user/userProfile/profilePasswordChange.jsx
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'react-feather';
import { toast } from 'react-toastify';

const initialForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

const ProfilePasswordChange = ({ hasPassword, onSave }) => {
    const [formData, setFormData] = useState(initialForm);
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};

        if (hasPassword && !formData.currentPassword) {
            newErrors.currentPassword = 'رمز فعلی را وارد کنید';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'رمز عبور جدید اجباری است';
        } else {
            if (formData.newPassword.length < 4) newErrors.newPassword = 'حداقل ۴ کاراکتر';
            else if (!/[a-z]/.test(formData.newPassword)) newErrors.newPassword = 'حداقل یک حرف کوچک انگلیسی لازم است';
            else if (!/[A-Z]/.test(formData.newPassword)) newErrors.newPassword = 'حداقل یک حرف بزرگ انگلیسی لازم است';
            else if (!/\d/.test(formData.newPassword)) newErrors.newPassword = 'حداقل یک عدد لازم است';
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'رمز جدید مطابقت ندارد';
        }

        if (hasPassword && formData.currentPassword && formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'رمز جدید باید با رمز فعلی متفاوت باشد';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            toast.error('لطفا خطاها را بررسی کنید');
            return;
        }

        setIsSubmitting(true);

        try {
            await onSave({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });
            setFormData(initialForm);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleShow = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const fields = [
        ...(hasPassword
            ? [{ name: 'currentPassword', label: 'رمز عبور فعلی', show: showPasswords.current, toggle: () => toggleShow('current') }]
            : []),
        { name: 'newPassword', label: hasPassword ? 'رمز عبور جدید' : 'رمز عبور', show: showPasswords.new, toggle: () => toggleShow('new') },
        { name: 'confirmPassword', label: 'تکرار رمز جدید', show: showPasswords.confirm, toggle: () => toggleShow('confirm') },
    ];

    return (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            {!hasPassword && (
                <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        برای حساب شما هنوز رمز عبور ثبت نشده است. اینجا می‌توانید اولین رمز عبور را تنظیم کنید.
                    </p>
                </div>
            )}

            {fields.map((field) => (
                <div key={field.name}>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{field.label}</label>
                    <div className="relative">
                        <input
                            name={field.name}
                            type={field.show ? 'text' : 'password'}
                            value={formData[field.name]}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            autoComplete="new-password"
                            className={`w-full p-2.5 pl-7 rounded-xl border bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] transition dir-ltr text-left disabled:opacity-60 ${
                                errors[field.name] ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                            }`}
                        />
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <button
                            type="button"
                            onClick={field.toggle}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors[field.name] && <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>}
                </div>
            ))}

            <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <Save size={16} /> {isSubmitting ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </button>
        </form>
    );
};

export default ProfilePasswordChange;
