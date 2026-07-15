// src/components/user/userProfile/userProfile.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ProfileInfoForm from './profileInfoForm';
import ProfileAvatarUpload from './profileAvatarUpload';
import ProfilePasswordChange from './profilePasswordChange';
import ProfileNotificationsSettings from './profileNotificationsSettings';
import useStore from '../../../store/index.js';
import { changePassword, deleteAvatar, getMe, updateMe, uploadAvatar } from '../../../services/authApi.js';
import { setCookie } from '../../../utils/helpers/cookie.js';
import { getUserFullName, normalizeAuthUser } from '../../../utils/helpers/authUser.js';
import { toEnglishDigits } from '../../../utils/helpers/persianDigits.js';

const TABS = [
    { id: 'info', label: 'اطلاعات شخصی' },
    { id: 'password', label: 'تغییر رمز عبور' },
    { id: 'notifications', label: 'تنظیمات اعلان‌ها' },
];

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const accessToken = useStore((state) => state.accessToken);
    const setAuthState = useStore((state) => state.setState);

    useEffect(() => {
        let ignore = false;

        const loadUser = async () => {
            if (!accessToken) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            try {
                const profile = normalizeAuthUser(await getMe());

                if (ignore) return;

                setUser(profile);
                setAuthState({ accessToken, user: profile });
            } catch (error) {
                if (!ignore) {
                    setUser(normalizeAuthUser(useStore.getState().user));
                    toast.error(error.message);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadUser();

        return () => {
            ignore = true;
        };
    }, [accessToken, setAuthState]);

    const syncCurrentUser = async (updatedUser) => {
        setUser(updatedUser);
        setAuthState({ accessToken, user: updatedUser });
        await setCookie('origins', {
            accessToken,
            token: accessToken,
            user: updatedUser,
        });
    };

    const handleUpdateInfo = async (formData) => {
        const updatedUser = normalizeAuthUser(await updateMe({
            name: formData.firstName,
            lastName: formData.lastName,
            nationalCode: toEnglishDigits(formData.nationalCode),
            phoneNumber: toEnglishDigits(formData.phone),
            email: formData.email || null,
        }));

        await syncCurrentUser(updatedUser);
        toast.success('اطلاعات با موفقیت به‌روزرسانی شد');
    };

    const handleAvatarChange = async (file) => {
        const updatedUser = normalizeAuthUser(await uploadAvatar(file));

        await syncCurrentUser(updatedUser);
        toast.success('تصویر پروفایل با موفقیت تغییر کرد');
    };

    const handleAvatarRemove = async () => {
        const updatedUser = normalizeAuthUser(await deleteAvatar());

        await syncCurrentUser(updatedUser);
        toast.success('تصویر پروفایل حذف شد');
    };

    const handlePasswordChange = async (data) => {
        const result = await changePassword(data);
        const updatedUser = normalizeAuthUser(result.user);

        await syncCurrentUser(updatedUser);
        toast.success('رمز عبور با موفقیت تغییر کرد');
    };

    const handleNotificationsChange = (settings) => {
        console.log('Notifications updated:', settings);
        toast.success('تنظیمات اعلان‌ها ذخیره شد');
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">پروفایل کاربری</h1>
            </div>

            <ProfileAvatarUpload
                avatar={user?.avatar}
                userName={getUserFullName(user)}
                isLoading={isLoading}
                onAvatarChange={handleAvatarChange}
                onAvatarRemove={handleAvatarRemove}
            />

            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 lg:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-[#002874] text-[#002874]  dark:border-[#4C6FB6] dark:text-[#4C6FB6]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-5 lg:p-6">
                    {activeTab === 'info' && (
                        <ProfileInfoForm user={user} isLoading={isLoading} onSave={handleUpdateInfo} />
                    )}
                    {activeTab === 'password' && (
                        <ProfilePasswordChange hasPassword={Boolean(user?.hasPassword)} onSave={handlePasswordChange} />
                    )}
                    {activeTab === 'notifications' && (
                        <ProfileNotificationsSettings user={user} isLoading={isLoading} onSave={handleNotificationsChange} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
