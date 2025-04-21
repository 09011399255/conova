import { useState } from "react";
import { motion } from "framer-motion";
import AdminModal from "../components/AdminModal";
import CustomDropdown from "../components/CustomDropdown";
import { mockSpaces } from "../../../../data/mockSpaces";
import { useNavigate } from "react-router-dom";
import AddNewFloorPlan from "../components/AddNewFloorPlan";
import { useAdmin } from "../../../../contexts/AdminContext";

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



const Spaces = () => {
    const { isAdmin } = useAdmin()

    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"image View" | "floor Plan" | "list View">(() => {
        return (localStorage.getItem("spacesActiveTab") as "image View" | "floor Plan" | "list View") || "image View";
    });
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCapacity, setSelectedCapacity] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookedSeatDetails, setBookedSeatDetails] = useState<{ seat: string; location: string } | null>(null);
    const [showChangeSeatModal, setShowChangeSeatModal] = useState(false);
    const [selectedNewSeat, setSelectedNewSeat] = useState<{ seat: string; location: string } | null>(null);



    const navigate = useNavigate();

    return (
        <div className="max-940:px-[15px] px-[50px] max-860:px-[10px] font-manrope">
            <div className="block md:flex items-center justify-between mb-6 ">
                <div>
                    <h2 className="text-xl font-bold text-black mb-[4px]">
                        {
                            isAdmin ? "Spaces" : "Book a seat"
                        }
                    </h2>
                    <p className="text-[#A5A8B5] text-sm">
                        {
                            isAdmin ? "Create and manage your workspaces with ease." : "Choose from available seats and lock in your booking"
                        }
                    </p>
                </div>
                {
                    isAdmin && (
                        <div className="flex gap-3">
                            <button onClick={() => navigate("/dashboard/spaces/new")} className="bg-[#134562] mt-[10px] md:mt-0 hover:bg-[#103a4c] text-white px-4 py-2.5 rounded flex items-center gap-2 text-sm">
                                <img src="/images/add.png" alt="Add" className="w-4 h-4" />
                                Add New Space
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="group border border-[#134562] mt-[10px] md:mt-0 hover:bg-[#103a4c] hover:text-white text-[#134562] px-4 py-2.5 rounded flex items-center gap-2 text-sm"
                            >
                                <img
                                    src="/images/add2.png"
                                    alt="Add"
                                    className="w-4 h-4 group-hover:hidden" // hide this one on hover
                                />
                                <img
                                    src="/images/add.png"
                                    alt="Add Hover"
                                    className="w-4 h-4 hidden group-hover:block" // show this one on hover
                                />
                                Add Floor Plan
                            </button>

                        </div>
                    )
                }


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
                            <div className=" flex flex-col md:flex-row gap-4 items-center w-full ">

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
                                {mockSpaces.map((space) => (
                                    <div key={space.id} className="bg-white rounded-lg mock mb-[15px]">
                                        <img
                                            src={space.image}
                                            alt={space.name}
                                            className="rounded-t-[8px] mb-2 w-full  object-cover"
                                        />
                                        <div className=" p-3">
                                            <div className="flex items-center gap-2 text-sm mb-2  ">
                                                <p className="font-[400] text-[14px] text-[#1A1A1A]">{space.name}</p>
                                                <div className="flex items-center gap-[2px]">
                                                    <img src="/images/location.png" className="w-4 h-4" />
                                                    <span className="text-[#000000] font-[500] text-[12px]">Floor {space.floor}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <button
                                                    disabled={space.status === "booked"}
                                                    onClick={() => {
                                                        if (space.status !== "booked") {
                                                            if (bookedSeatDetails) {
                                                                setSelectedNewSeat({ seat: space.name, location: space.location || "Unknown Location" });
                                                                setShowChangeSeatModal(true);
                                                            } else {
                                                                setBookedSeatDetails({ seat: space.name, location: space.location || "Unknown Location" });
                                                                setShowSuccessModal(true);
                                                            }
                                                        }
                                                    }}

                                                    className={`w-full text-sm  px-4 py-2 rounded flex justify-center items-center gap-2 transition ${space.status === "booked"
                                                        ? "bg-[#DCDFE3] text-[#A5A8B5] cursor-not-allowed"
                                                        : "bg-[#134562] text-white hover:bg-[#103a4c]"
                                                        }`}
                                                >
                                                    {space.status === "booked" ? "Booked" : "Book Seat"}
                                                </button>
                                                {
                                                    isAdmin && (
                                                        <button className="  border border-[#134562] text-sm  px-4 py-[9px] rounded flex justify-center items-center gap-2 transition">
                                                            <img src="/images/edit.png" alt="View" className="w-4 h-4" />
                                                        </button>
                                                    )
                                                }

                                            </div>

                                        </div>

                                    </div>
                                ))}
                            </div>
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



            <AdminModal show={showModal} onClose={() => setShowModal(false)} maxWidth="max-w-[583px]">
                <AddNewFloorPlan onClose={() => setShowModal(false)} />
            </AdminModal>

            <AdminModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} maxWidth="max-w-[500px]">
                <div className="text-center px-1 py-2">
                    <div className="flex justify-end items-start mb-[28px]">

                        <button type="button" onClick={() => setShowSuccessModal(false)} className="text-gray-500 hover:text-gray-700">
                            <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex justify-center mb-4">
                        <img src="/images/check-badge.png" alt="Success" className="w-[60px] h-[60px]" />
                    </div>
                    <h3 className="text-[14px] font-[400] mb-2">Seat Booked!</h3>
                    <p className="text-[14px] font-[400] text-[#A5A8B5]">
                        You've successfully booked {bookedSeatDetails?.seat} at {bookedSeatDetails?.location}
                    </p>
                    <button
                        onClick={() => {
                            setShowSuccessModal(false)
                        }}
                        className="mt-[36px] w-full bg-[#10384F] text-white px-6 py-2 font-[500] rounded-[4px] hover:bg-[#103a4c] text-[14px]"
                    >
                        Change seat
                    </button>
                </div>
            </AdminModal >

            <AdminModal show={showChangeSeatModal} onClose={() => setShowChangeSeatModal(false)} maxWidth="max-w-[500px]">
                <div className="text-center px-1 py-2">
                    <div className="flex justify-end items-start mb-[20px]">
                        <button type="button" onClick={() => setShowChangeSeatModal(false)} className="text-gray-500 hover:text-gray-700">
                            <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex justify-center mb-4">
                        <img src="/images/warning.png" alt="Warning" className="w-[48px] h-[48px]" />
                    </div>

                    <h3 className="text-[16px] font-semibold mb-1">Change seat?</h3>
                    <p className="text-[14px] text-[#6B7280] mb-6">
                        You already booked {bookedSeatDetails?.seat}.<br />
                        Do you want to switch to {selectedNewSeat?.seat} – Near Window?
                    </p>

                    <button
                        onClick={() => {
                            setBookedSeatDetails(selectedNewSeat);
                            setShowChangeSeatModal(false);
                        }}
                        className="w-full bg-[#134562] hover:bg-[#103a4c] text-white px-6 py-2 font-medium rounded-[4px] text-[14px]"
                    >
                        Change seat
                    </button>
                </div>
            </AdminModal>


        </div >
    );
};

export default Spaces;
