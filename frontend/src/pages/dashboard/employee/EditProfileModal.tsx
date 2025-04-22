import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type EditProfileModalProps = {
    onClose: () => void;
    image: string;
    fullName: string;
    email: string;
};

type FormData = {
    fullName: string;
    email: string;
    phone: string;
};

export default function EditProfileModal({
    onClose,
    image,
    fullName,
    email,
}: EditProfileModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            fullName,
            email,
            phone: '',
        },
    });

    const [profileImage, setProfileImage] = useState<string>(image);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data: FormData) => {
        console.log('Updated profile data:', data);
        onClose();
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-bold text-black">Edit profile details</h2>
                    <p className="text-sm text-[#A5A8B5]">Click to edit your profile details below</p>
                </div>
                <button onClick={onClose}>
                    <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-center mb-6 relative">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 "
                />
                <button
                    type="button"
                    onClick={handleImageClick}
                    className="absolute bottom-2 right-[calc(50%-48px)]"
                >
                    <img src="/images/camera-icon.png" alt="Edit" className="w" />
                </button>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-[8px]">Full name  <span className='text-[#EF4444]'>*</span></label>

                    <input
                        type="text"
                        {...register('fullName', { required: true })}
                        className="w-full px-2 py-2 border border-[#DCDFE3] placeholder:text-[#A5A8B5] rounded-md text-sm"
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">Full name is required</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-[8px]">Work Email  <span className='text-[#EF4444]'>*</span></label>

                    <input
                        type="email"
                        {...register('email')}
                        className="w-full px-2 py-2 border border-[#DCDFE3] placeholder:text-[#A5A8B5] rounded-md text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-[8px]">Phone Number </label>
                    <div className="flex gap-2">

                        <input
                            type="tel"
                            {...register('phone')}
                            placeholder="+234"
                            className="w-full px-2 py-2 border border-[#DCDFE3] placeholder:text-[#A5A8B5] rounded-md text-sm"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="w-[140px] bg-[#134562] text-white py-2 rounded  font-[500] text-[14px] hover:bg-[#7b95a9] transition"
                    >
                        Save changes
                    </button>
                </div>
            </form>
        </div>
    );
}
