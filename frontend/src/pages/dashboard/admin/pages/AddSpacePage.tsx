import CustomDropdown from "../components/CustomDropdown";
import { useNavigate } from "react-router-dom";
import { SpaceFormData, spaceSchema } from "../../../../schemas/spaceSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WeeklySchedule from "../components/WeeklySchedule";
import ImageUploader from "../components/ImageUploader";
import { useState } from "react";
import SpacePreviewContent from "../components/SpacePreviewContent";
import AdminModal from "../components/AdminModal";
import SaveNotification from "../components/SaveNotification";


const spaceTypeOptions = [
    { label: "Hot Desk", value: "hot-desk" },
    { label: "Private Office", value: "private-office" },
    { label: "Meeting Room", value: "meeting-room" },
];

const locationOptions = [
    { label: "Berger Office", value: "berger" },
    { label: "Lekki Office", value: "lekki" },
    { label: "Mainland Office", value: "mainland" },
];

const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];


const AddSpacePage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
        clearErrors,
        trigger,
    } = useForm({
        resolver: zodResolver(spaceSchema),
        defaultValues: {
            name: "",
            location: "",
            spaceType: "",
            capacity: "",
            floor: "",
            file: undefined,
        }
    });


    const nameValue = watch("name");
    const capacityValue = watch("capacity");
    const floorValue = watch("floor");

    const file = watch("file");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setValue("file", selectedFile, { shouldValidate: true });
            clearErrors("file");
        }
    };

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");


    const onSubmit = (data: SpaceFormData) => {
        console.log("Data", data);
        setToastMessage("New space added successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

    };

    const [showModal, setShowModal] = useState(false);
    const [previewData, setPreviewData] = useState<SpaceFormData | null>(null);

    const [schedule, setSchedule] = useState(
        daysOfWeek.map(day => ({
            day,
            enabled: !["Saturday", "Sunday"].includes(day), // Sat & Sun OFF by default
            from: "08:00",
            to: "18:00"
        }))
    );

    const toggleDay = (index: number) => {
        setSchedule(prev => {
            const newSchedule = [...prev];
            newSchedule[index] = {
                ...newSchedule[index],
                enabled: !newSchedule[index].enabled
            };
            return newSchedule;
        });
    };

    const updateTime = (index: number, field: "from" | "to", value: string) => {
        setSchedule(prev => {
            const newSchedule = [...prev];
            newSchedule[index][field] = value;
            return newSchedule;
        });
    };


    return (
        <div className="max-940:px-[15px] px-[50px] max-860:px-[10px] font-manrope">
            <div className="flex items-center gap-[5px]  mb-6 cursor-pointer" onClick={() => navigate(-1)}>
                <img src="/images/arl.png" alt="Back" className="w-4 h-4 cursor-pointer" />
                <span className="text-[#134562] font-[500] text-[14px]">Back</span>
            </div>
            <div className="block md:flex items-center justify-between mb-6 ">
                <div>
                    <h2 className="text-xl font-bold text-black mb-[4px]">Add New Space</h2>
                    <p className="text-[#A5A8B5] text-sm">Fill the details below to add a new space</p>
                </div>

            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="relative flex border-b border-gray-200 mb-[18px] mt-[19px]">
                    {["Basic Information"].map((tab) => {
                        return (
                            <button
                                key={tab}

                                className="relative pb-2 pl-[5px] pr-[20px]  transition-colors duration-200 
                                         text-[#000000] font-[700] text-[16px]"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}


                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Space Name */}
                    <div>
                        <label className="block text-sm text-black">Space Name <span className="text-[#EF4444]">*</span></label>
                        <input
                            type="text"
                            {...register("name")}
                            className={`mt-[8px] w-full px-4 py-2 border rounded-md bg-transparent outline-none transition-all
            ${errors.name
                                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                                    : nameValue
                                        ? "border-2 border-[#292524]"
                                        : "border-[#D7D3D0] focus:border-[#292524]"
                                }`}
                            placeholder="Enter space name"
                        />
                        {errors.name && <p className="text-[#EF4444] text-xs mt-[8px]">{errors.name.message}</p>}
                    </div>

                    {/* Location Dropdown */}
                    <div>
                        <label className="block text-sm text-black mb-[8px]">Location <span className="text-[#EF4444]">*</span></label>
                        <Controller
                            control={control}
                            name="location"
                            render={({ field }) => (
                                <CustomDropdown {...field} options={locationOptions} placeholder="Choose space location" />
                            )}
                        />
                        {errors.location && <p className="text-xs text-[#EF4444] mt-[8px]">{errors.location.message}</p>}
                    </div>

                    {/* Space Type Dropdown */}
                    <div>
                        <label className="block text-sm text-black  mb-[8px]">Space Type <span className="text-[#EF4444]">*</span></label>
                        <Controller
                            control={control}
                            name="spaceType"
                            render={({ field }) => (
                                <CustomDropdown {...field} options={spaceTypeOptions} placeholder="Choose space type" />
                            )}
                        />
                        {errors.spaceType && <p className="text-xs text-[#EF4444] mt-[8px]">{errors.spaceType.message}</p>}
                    </div>

                    {/* Capacity */}
                    <div>
                        <label className="block text-sm text-black">Capacity <span className="text-[#EF4444]">*</span></label>
                        <input
                            type="text"
                            {...register("capacity")}
                            className={`mt-[8px] w-full px-4 py-2 border rounded-md bg-transparent outline-none transition-all
            ${errors.capacity
                                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                                    : capacityValue
                                        ? "border-2 border-[#292524]"
                                        : "border-[#D7D3D0] focus:border-[#292524]"
                                }`}
                            placeholder='e.g. "5 seats"'
                        />
                        {errors.capacity && <p className="text-[#EF4444] text-xs mt-[8px]">{errors.capacity.message}</p>}
                    </div>

                    {/* Floor */}
                    <div className="mb-[32px]">
                        <label className="block text-sm text-black">Floor <span className="text-[#EF4444]">*</span></label>
                        <input
                            type="text"
                            {...register("floor")}
                            className={`mt-[8px] w-full px-4 py-2 border rounded-md bg-transparent outline-none transition-all
            ${errors.floor
                                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                                    : floorValue
                                        ? "border-2 border-[#292524]"
                                        : "border-[#D7D3D0] focus:border-[#292524]"
                                }`}
                            placeholder='e.g. "Floor 1"'
                        />
                        {errors.floor && <p className="text-[#EF4444] text-xs mt-[8px]">{errors.floor.message}</p>}
                    </div>
                </div>

                <div className="relative flex border-b border-gray-200 mb-[18px] mt-[19px]">
                    {["Availability Preference"].map((tab) => {
                        return (
                            <button
                                key={tab}

                                className="relative pb-2 pl-[5px] pr-[20px]  transition-colors duration-200 
                                         text-[#000000] font-[700] text-[16px]"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}


                            </button>
                        );
                    })}
                </div>

                <WeeklySchedule schedule={schedule}
                    toggleDay={toggleDay}
                    updateTime={updateTime}
                />
                <ImageUploader
                    file={file}
                    handleFileChange={handleFileChange}
                    setFile={(file) => {
                        setValue("file", file, { shouldValidate: true });
                        if (!file) clearErrors("file");
                    }}
                    error={errors.file?.message as string | undefined}
                />
                <div className=" md:flex-row flex flex-col  gap-[16px] md:justify-end mt-[40px]">

                    <button onClick={async () => {
                        const isValid = await trigger(); // Validate the form
                        if (!isValid) return; // Stop if there are errors

                        const formValues = watch();
                        setPreviewData({
                            ...formValues,
                            file: formValues.file || null,
                        });
                        setShowModal(true);
                    }} className="border w-full md:w-[250px] p-2 justify-center border-[#134562] hover:bg-[#103a4c] text-[#134562] rounded flex items-center gap-2 text-sm">
                        Preview
                    </button>
                    <button type="submit" className="bg-[#134562] w-full  md:w-[250px] p-2 justify-center  hover:bg-[#103a4c] text-white rounded flex items-center gap-2 text-sm">

                        Save
                    </button>
                </div>

            </form>





            {previewData && (
                <AdminModal show={showModal} onClose={() => setShowModal(false)} maxWidth="max-w-[583px]">
                    <SpacePreviewContent
                        data={previewData}
                        imageFile={file}
                        schedule={schedule}
                        onClose={() => setShowModal(false)}
                    />
                </AdminModal>
            )}

            {showToast && <SaveNotification showToast={showToast} message={toastMessage}/>}
        </div>
    );
};

export default AddSpacePage;



