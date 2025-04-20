import { useState } from "react";
import { motion } from "framer-motion";
import CustomDropdown from "../admin/components/CustomDropdown";
import { hubbleSpaces } from "../../../data/huddleSpaces";
import { Users } from "lucide-react";
import 'react-calendar/dist/Calendar.css';
import DayViewCalendar from "./DaySchedule";
import AddTeamMembers from "./AddTeamMembers";



const locationOptions = [
    { label: 'Constain Office', value: 'constain' },
    { label: 'Berger Office', value: 'berger' },
    { label: 'Festac Office', value: 'festac' },
    { label: 'Lekki Office', value: 'lekki' },
];

const workspaceAreaOptions = [
    { label: 'Meeting Room', value: 'meeting' },
    { label: 'Open Desks', value: 'desks' },
    { label: 'Private Office', value: 'private' },
];

const floorOptions = [
    { label: 'Ground Floor', value: '0' },
    { label: '1st Floor', value: '1' },
    { label: '2nd Floor', value: '2' },
    { label: '3rd Floor', value: '3' },
];

const roomCapacityOptions = [
    { label: '1-4 People', value: '1-4' },
    { label: '5-10 People', value: '5-10' },
    { label: '11-20 People', value: '11-20' },
    { label: '20+ People', value: '20+' },
];

const steps = [
    { label: "Choose room" },
    { label: "Select time" },
    { label: "Add team members" },
    { label: "Confirm booking" },
];



const BookRoom = () => {
    // const { isAdmin } = useAdmin()

    const [activeTab, setActiveTab] = useState<"image View" | "floor Plan" | "list View">(() => {
        return (localStorage.getItem("spacesActiveTab") as "image View" | "floor Plan" | "list View") || "image View";
    });
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCapacity, setSelectedCapacity] = useState("");
    const [step, setStep] = useState(1);
    const [showModalContinue, setShowModalContinue] = useState(true);


    return (
        <div className="max-940:px-[15px] px-[50px] max-860:px-[10px] font-manrope">
            <div className="block md:flex items-center justify-between mb-6 ">
                <div>
                    <h2 className="text-xl font-bold text-black mb-[4px]">
                        Book a room

                    </h2>
                    <p className="text-[#A5A8B5] text-sm">

                        Choose from available rooms, pick a time, and lock in your booking
                    </p>
                </div>

            </div>

            <div className="relative flex border-b border-gray-200 mb-[26px]">
                {["image View", "floor Plan", "list View"].map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab as "image View" | "floor Plan" | "list View");
                                localStorage.setItem("spacesActiveTab", tab);
                            }}
                            className={`relative  px-4 pb-2 text-sm font-medium transition-colors duration-200 ${isActive
                                ? "text-[#134562]"
                                : "text-[#A5A8B5] hover:text-[#134562]"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}

                            {isActive && (
                                <motion.div
                                    layoutId="tab-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#134562] rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center justify-center w-full gap-4 mt-6 mb-6">
                {steps.map((s, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = step > stepNumber;
                    const isActive = step === stepNumber;
                    const isFuture = step < stepNumber;

                    const isClickable = isCompleted;

                    return (
                        <div key={s.label} className="flex w-full items-center gap-2">
                            <button
                                onClick={() => {
                                    if (isClickable) setStep(stepNumber);
                                }}
                                className={`flex items-center gap-2 focus:outline-none ${isFuture ? 'cursor-not-allowed ' : 'cursor-pointer'
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-white 
              ${isCompleted ? 'bg-[#134562]' : isActive ? 'bg-[#134562]' : 'bg-[#DCDFE3] text-[#A5A8B5]'}`}
                                >
                                    {isCompleted ? '✔' : stepNumber}
                                </div>
                                <span
                                    className={`text-sm ${isActive || isCompleted ? 'text-[#134562]' : 'text-[#A5A8B5]'}`}
                                >
                                    {s.label}
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <div className="w-[130px] h-[2px] bg-[#DCDFE3]" />
                            )}
                        </div>
                    );
                })}
            </div>




            <div className="mt-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === "image View" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === "image View" ? 20 : -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >

                    {activeTab === "image View" && (
                        <div>
                            {step === 1 && (
                                <>
                                    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                                        <CustomDropdown
                                            value={selectedLocation}
                                            onChange={setSelectedLocation}
                                            options={locationOptions}
                                            placeholder="Location"
                                        />
                                        <CustomDropdown
                                            value={selectedWorkspace}
                                            onChange={setSelectedWorkspace}
                                            options={workspaceAreaOptions}
                                            placeholder="Workspace Area"
                                        />
                                        <CustomDropdown
                                            value={selectedFloor}
                                            onChange={setSelectedFloor}
                                            options={floorOptions}
                                            placeholder="Floor"
                                        />
                                        <CustomDropdown
                                            value={selectedCapacity}
                                            onChange={setSelectedCapacity}
                                            options={roomCapacityOptions}
                                            placeholder="Room Capacity"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
                                        {hubbleSpaces.map((space) => (
                                            <div key={space.id} className="bg-white rounded-lg mock mb-[15px]">
                                                <img
                                                    src={space.image}
                                                    alt={space.name}
                                                    className="rounded-t-[8px] mb-2 w-full object-cover"
                                                />
                                                <div className="p-3">
                                                    <p className="font-[400] text-[16px] text-[#1A1A1A] mb-[8px]">{space.name}</p>
                                                    <div className="flex items-center gap-2 text-[12px] text-[#6B7280] mb-[22px]">
                                                        <div className="flex items-center gap-[4px]">
                                                            <img src="/images/location.png" className="w-4 h-4" />
                                                            <span className="text-black font-[500] text-[12px]">Floor {space.floor}</span>
                                                        </div>
                                                        <div className="flex items-center gap-[4px]">
                                                            <Users size={16} />
                                                            <span className="text-black font-[500] text-[12px]">{space.participants} Participants</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        disabled={space.status === "booked"}
                                                        onClick={() => {
                                                            if (space.status !== "booked") {
                                                                setStep(2); // Move to select time
                                                            }
                                                        }}
                                                        className={`w-full text-sm px-4 py-2 rounded transition ${space.status === "booked"
                                                            ? "bg-[#DCDFE3] text-[#A5A8B5] cursor-not-allowed"
                                                            : "bg-[#134562] text-white hover:bg-[#103a4c]"
                                                            }`}
                                                    >
                                                        {space.status === "booked" ? "Booked" : "Check availability"}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <DayViewCalendar step={step} setStep={setStep} setShowModalContinue={setShowModalContinue} />
                            )}

                            {
                                step === 3 && (
                                    <AddTeamMembers
                                        setStep={setStep}
                                        setShowModalContinue={setShowModalContinue}
                                        showModalContinue={showModalContinue}
                                        onClose={() => setShowModalContinue(false)}
                                    />

                                )

                            }

                        </div>
                    )}


                    {activeTab === "floor Plan" && (
                        <div className="mt-4">
                            <div className=" flex flex-col md:flex-row gap-4 items-center w-full ">

                                <CustomDropdown
                                    value={selectedLocation}
                                    onChange={setSelectedLocation}
                                    options={locationOptions}
                                    placeholder="Location"
                                />
                                <CustomDropdown
                                    value={selectedFloor}
                                    onChange={setSelectedFloor}
                                    options={floorOptions}
                                    placeholder="Floor"
                                />

                            </div>
                            <img src="/images/floor.png" alt="Floor Plan" className="w-full mt-[32px] mx-auto rounded-lg border" />
                        </div>
                    )}

                    {activeTab === "list View" && (
                        <div className="text-center text-gray-400 text-sm mt-10">List View coming soon...</div>
                    )}
                </motion.div>
            </div>


        </div>
    );
};

export default BookRoom;
