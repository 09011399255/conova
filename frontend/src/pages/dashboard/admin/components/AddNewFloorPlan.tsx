import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import SaveNotification from './SaveNotification';
import { FloorPlanFormData, floorPlanSchema } from '../../../../schemas/floorPlanSchema';
import CustomDropdown from './CustomDropdown';

const locationOptions = [
    { label: "Berger Office", value: "berger" },
    { label: "Lekki Office", value: "lekki" },
    { label: "Mainland Office", value: "mainland" },
];


export default function AddNewFloorPlan({ onClose }: { onClose: () => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        control,
        clearErrors,
    } = useForm<FloorPlanFormData>({
        resolver: zodResolver(floorPlanSchema),
        defaultValues: {
            location: '',
            floor: '',
        },

    });

    const file = watch('file');
    const floorValue = watch('floor');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const onSubmit = (data: FloorPlanFormData) => {
        console.log('Form data:', data);
        setToastMessage('New floor plan added successfully!');
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            onClose();
        }, 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setValue("file", selectedFile, { shouldValidate: true });
            clearErrors("file");
        }
    };

    const handleRemove = () => {
        setValue("file", undefined as unknown as File, { shouldValidate: true });
        const input = document.getElementById("file-upload") as HTMLInputElement;
        if (input) input.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile?.type.startsWith("image/")) {
            setValue("file", droppedFile, { shouldValidate: true });
            clearErrors("file");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-[20px] font-[700] text-black">Add Floor Plan</h2>
                        <p className="text-[#A5A8B5] text-[14px] font-[400]">
                            Fill the details below to add a new floor plan
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                    </button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {/* Location Dropdown */}
                    <div>
                        <label className="block text-sm text-black mb-[8px]">Location <span className="text-[#EF4444]">*</span></label>
                        <Controller
                            control={control}
                            name="location"
                            render={({ field }) => (
                                <CustomDropdown {...field} options={locationOptions} placeholder="Choose Location" />
                            )}
                        />
                        {errors.location && <p className="text-xs text-[#EF4444] mt-[8px]">{errors.location.message}</p>}
                    </div>

                    {/* Floor */}
                    <div className="mb-[16px]">
                        <label className="block text-sm text-black">Floor <span className="text-[#EF4444]">*</span></label>
                        <input
                            type="text"
                            {...register("floor")}
                            className={`mt-[8px] w-full px-4 py-2 border rounded-md bg-transparent outline-none transition-all ${errors.floor
                                ? "border-[#EF4444] focus:ring-[#EF4444]"
                                : floorValue
                                    ? "border-2 border-[#292524]"
                                    : "border-[#D7D3D0] focus:border-[#292524]"
                                }`}
                            placeholder='e.g. "Floor 3"'
                        />
                        {errors.floor && <p className="text-[#EF4444] text-xs mt-[8px]">{errors.floor.message}</p>}
                    </div>
                </div>



                {/* File Upload */}
                <div className="border border-[#DCDFE3] rounded-md">
                    <div className="bg-[#FAFAFA] px-4 py-3">
                        <p className="text-sm text-gray-400">
                            <span className="font-[500] mr-[2px] text-[16px] text-[#000000]">
                                Upload Space Image
                            </span>{" "}
                            <span className="text-[13px] font-[400] text-[#A5A8B5]">
                                (Only .jpg, and .png of 15mb are allowed)
                            </span>
                        </p>
                    </div>
                    <div className="p-4">
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`flex flex-col items-center justify-center border-2 border-dashed h-[200px] rounded-md p-6 transition text-center bg-[#FAFAFA] ${isDragging ? "border-[#134562]" : "border-[#DCDFE3]"
                                }`}
                        >
                            {file ? (
                                <div className="flex flex-col items-center gap-2 w-[250px]">
                                    <div className="flex items-center justify-between w-[85%] gap-3 px-4 py-2 rounded bg-white border border-[#DCDFE3] ">
                                        <div className="flex items-center gap-3">
                                            <img src="/images/file-icon.png" className="w-4 h-4" alt="File icon" />

                                            <div className="flex-1 overflow-hidden">
                                                <span className="text-[12px] font-[500] text-black truncate block">{file.name}</span>
                                            </div>
                                        </div>


                                        <button
                                            type="button"
                                            onClick={handleRemove}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <img src="/images/delete-icon.png" className="w-4 h-4" alt="Delete" />
                                        </button>
                                    </div>

                                    <label htmlFor="file-upload" className="text-[14px] text-[#0F27BD] ">
                                        <span className='underline cursor-pointer'>    Click to upload </span>
                                        <span className="text-[14px] font-[500] text-[#A5A8B5]">
                                             or drag and drop
                                        </span>
                                    </label>


                                </div>

                            ) : (
                                <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                                    <img src="/images/upload.png" className="w-6 h-6 mb-2" />
                                    <span className="text-[14px] font-[500] text-[#0E6BA8] underline">
                                        Click to upload
                                    </span>
                                    <span className="text-[14px] font-[500] text-[#A5A8B5]">
                                        or drag and drop
                                    </span>
                                </label>
                            )}
                            <input
                                id="file-upload"
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        {errors.file && (
                            <p className="text-[#EF4444] text-xs mt-2">{errors.file.message}</p>
                        )}
                    </div>
                </div>


                {/* Submit Button */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#134562] text-white rounded-md text-sm hover:bg-[#0f3a4c]"
                    >
                        Save
                    </button>
                </div>
            </form >

            {showToast && <SaveNotification showToast={showToast} message={toastMessage} />
            }
        </>
    );
}
