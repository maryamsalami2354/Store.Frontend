// src/components/user/userProfile/profileAvatarUpload.jsx
import React, { useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Camera, Trash2 } from 'react-feather';
import { toast } from 'react-toastify';
import { DEFAULT_AVATAR } from '../../../utils/helpers/authUser.js';

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const maxSize = 2 * 1024 * 1024;

const ProfileAvatarUpload = ({ avatar, userName, isLoading, onAvatarChange, onAvatarRemove }) => {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const resetInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            toast.error('فرمت فایل مجاز نیست. لطفا از JPG، PNG یا WebP استفاده کنید.');
            resetInput();
            return;
        }

        if (file.size > maxSize) {
            toast.error('حجم فایل نباید بیشتر از ۲ مگابایت باشد.');
            resetInput();
            return;
        }

        setIsUploading(true);

        try {
            await onAvatarChange(file);
        } finally {
            setIsUploading(false);
            resetInput();
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);

        try {
            await onAvatarRemove();
        } finally {
            setIsRemoving(false);
            resetInput();
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-4">
                    <Skeleton width={80} height={80} borderRadius={20} className="dark:!bg-gray-800" />
                    <div>
                        <Skeleton width={120} height={20} className="dark:!bg-gray-800 mb-2" />
                        <Skeleton width={80} height={14} className="dark:!bg-gray-800" />
                    </div>
                </div>
            </div>
        );
    }

    const currentAvatar = avatar || DEFAULT_AVATAR;
    const hasCustomAvatar = currentAvatar !== DEFAULT_AVATAR;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-5">
                <div className="relative group">
                    <img
                        src={currentAvatar}
                        alt={userName}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200 dark:border-gray-700 shadow-md"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isRemoving}
                        className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                    >
                        <Camera size={20} className="text-white" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{userName}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || isRemoving}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002874] text-white rounded-lg text-xs font-medium hover:bg-[#001d5a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Camera size={14} /> {isUploading ? 'در حال آپلود...' : 'تغییر تصویر'}
                        </button>
                        {hasCustomAvatar && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={isUploading || isRemoving}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-800 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={14} /> {isRemoving ? 'در حال حذف...' : 'حذف'}
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">فرمت‌های مجاز: JPG، PNG، WebP. حداکثر ۲ مگابایت</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileAvatarUpload;
