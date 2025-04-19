import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { format } from 'date-fns';
import SaveNotification from '../admin/components/SaveNotification';

const schema = z.object({
    title: z.string().min(1, 'Meeting title is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    duration: z.string().min(1, 'Duration is required'),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddMeetingDetails({
    onClose,
    selectedDate,
    selectedTime
}: {
    onClose: () => void;
    selectedDate?: Date;
    selectedTime?: { hour: number; minute: number } | null;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
            time: selectedTime
                ? `${String(selectedTime.hour).padStart(2, '0')}:${String(selectedTime.minute).padStart(2, '0')}`
                : '',
        },
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const onSubmit = (data: FormValues) => {
        console.log('Meeting Data:', data);
        setToastMessage("Meeting added successfully!");
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            onClose();
        }, 2000);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-[20px] font-[700] text-black">Add Meeting Details</h2>
                        <p className="text-[#A5A8B5] text-[14px] font-[400]">Fill in the details below to schedule a meeting</p>
                    </div>

                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                    </button>
                </div>

                {/* Meeting Title */}
                <div>
                    <label className="block text-[14px] font-[400]">Meeting Title <span className="text-red-500">*</span></label>
                    <input
                        {...register('title')}
                        placeholder="Team Sync-up"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Select Date */}
                <div>
                    <label className="block text-[14px] font-[400]">Select Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        {...register('date')}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>

                {/* Select Time */}
                <div>
                    <label className="block text-[14px] font-[400]">Time <span className="text-red-500">*</span></label>
                    <input
                        type="time"
                        {...register('time')}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-[14px] font-[400]">Duration (minutes) <span className="text-red-500">*</span></label>
                    <select
                        {...register('duration')}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                        defaultValue=""
                    >
                        <option value="" disabled>Select duration</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1 hour 30 minutes</option>
                        <option value="120">2 hours</option>
                    </select>
                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
                </div>

                {/* Optional Description */}
                <div>
                    <label className="block text-[14px] font-[400]">Meeting Description</label>
                    <textarea
                        {...register('description')}
                        placeholder="Enter meeting description"
                        className="mt-1 w-full px-4 py-2 border resize-none border-gray-300 rounded-md text-sm"
                        rows={3}
                    />
                </div>

                {/* Submit */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#134562] text-white rounded-md text-sm hover:bg-[#0f3a4c]"
                    >
                        Continue
                    </button>
                </div>
            </form>

            {showToast && <SaveNotification showToast={showToast} message={toastMessage} />}
        </>
    );
}
