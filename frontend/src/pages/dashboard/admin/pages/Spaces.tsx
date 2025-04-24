import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminModal from "../components/AdminModal";
import CustomDropdown from "../components/CustomDropdown";
import { useNavigate } from "react-router-dom";
import AddNewFloorPlan from "../components/AddNewFloorPlan";
import { useSeats } from "../../../../hooks/useSeats";
import { useAdmin } from "../../../../contexts/AdminContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { bookSeat } from "../../../../api/services/seatService";
import { useRooms } from "../../../../hooks/useRooms";

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
    const { userRole } = useAdmin();
    const { data: seats, isLoading, isError } = useSeats();
    const { data: rooms, isLoading: isRoomsLoading, isError: isRoomError } = useRooms();

    console.log(rooms, isRoomsLoading, isRoomError);
    console.log(seats)


    const [showModal, setShowModal] = useState(false);
    const [activeTabSpa, setActiveTabSpa] = useState<"image View" | "floor Plan" | "list View">(() => {
        return (localStorage.getItem("activeTabSpa") as "image View" | "floor Plan" | "list View") || "image View";
    });
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCapacity, setSelectedCapacity] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookedSeatDetails, setBookedSeatDetails] = useState<{ seat: string; location: string } | null>(null);
    const [showChangeSeatModal, setShowChangeSeatModal] = useState(false);
    const [selectedNewSeat, setSelectedNewSeat] = useState<{ seat: string; location: string, id: Number } | null>(null);

    const queryClient = useQueryClient();

    const [bookingSeatId, setBookingSeatId] = useState<string | null>(null);

    const { mutate: mutateBookSeat } = useMutation({
        mutationFn: (seatId: string) => bookSeat(seatId),
        onSuccess: (_data, seatId) => {
            const bookedSeat = seats?.find(seat => String(seat.id) === seatId);
            if (bookedSeat) {
                setBookedSeatDetails({
                    seat: bookedSeat.seat_no,
                    location: bookedSeat.seat_no || "Unknown Location",
                });
            }
            queryClient.invalidateQueries({ queryKey: ["seats"] });
            toast.success("Seat booked successfully");
            setShowSuccessModal(true);
            setBookingSeatId(null);
        },
        onError: () => {
            toast.error("Something went wrong booking the seat");
            setBookingSeatId(null);
        },
    });



    const navigate = useNavigate();

    // Load on mount
    useEffect(() => {
        const storedDetails = localStorage.getItem("bookedSeatDetails");
        if (storedDetails) {
            setBookedSeatDetails(JSON.parse(storedDetails));
        }
    }, []);

    // Save on change
    useEffect(() => {
        if (bookedSeatDetails) {
            localStorage.setItem("bookedSeatDetails", JSON.stringify(bookedSeatDetails));
        }
    }, [bookedSeatDetails]);


    return (
        <div className="max-940:px-[15px] px-[50px] max-860:px-[10px] font-manrope">
            <div className="block md:flex items-center justify-between mb-6 ">
                <div>
                    <h2 className="text-xl font-bold text-black mb-[4px]">
                        {
                            userRole === "admin" ? "Spaces" : "Book a seat"
                        }
                    </h2>
                    <p className="text-[#A5A8B5] text-sm">
                        {
                            userRole === "admin" ? "Create and manage your workspaces with ease." : "Choose from available seats and lock in your booking"
                        }
                    </p>
                </div>
                {
                    userRole === "admin" && (
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
                                    className="w-4 h-4 group-hover:hidden"
                                />
                                <img
                                    src="/images/add.png"
                                    alt="Add Hover"
                                    className="w-4 h-4 hidden group-hover:block"
                                />
                                Add Floor Plan
                            </button>

                        </div>
                    )
                }


            </div>

            <div className="relative flex border-b border-gray-200 mb-[26px]">
                {["image View", "floor Plan", "list View"].map((tab) => {
                    const isActive = activeTabSpa === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTabSpa(tab as "image View" | "floor Plan" | "list View");
                                localStorage.setItem("activeTabSpa", tab);
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
                    key={activeTabSpa}
                    initial={{ opacity: 0, x: activeTabSpa === "image View" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTabSpa === "image View" ? 20 : -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >

                    {activeTabSpa === "image View" && (
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
                            {isLoading && (
                                <p className="text-center mt-[20px] text-gray-500">Loading seats...</p>
                            )}

                            {isError && (
                                <p className="text-center mt-[20px] text-red-500">Unable to fetch seats.</p>
                            )}

                            {!isLoading && !isError && seats?.length === 0 && (
                                <p className="text-center mt-[20px] text-gray-400">No seats available.</p>
                            )}

                            {!isLoading && !isError && (seats ?? []).length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
                                    {seats?.map((seat) => (
                                        <div key={seat.id} className="bg-white rounded-lg mock mb-[15px]">
                                            <img
                                                src={seat.seat_img}
                                                alt={String(seat.floor)}
                                                className="rounded-t-[8px] mb-2 w-full  object-cover"
                                            />

                                            <div className=" p-3">
                                                <div className="flex items-center gap-2 text-sm mb-2  ">
                                                    <p className="font-[400] text-[14px] text-[#1A1A1A]">Seat {seat.seat_no}</p>
                                                    <div className="flex items-center gap-[2px]">
                                                        <img src="/images/location.png" className="w-4 h-4" />
                                                        <span className="text-[#000000] font-[500] text-[12px]">Floor {seat.floor}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <button
                                                        disabled={!seat.is_available || bookingSeatId === String(seat.id)}
                                                        onClick={() => {
                                                            if (seat.is_available) {
                                                                setBookingSeatId(String(seat.id));
                                                                if (bookedSeatDetails) {
                                                                    setSelectedNewSeat({ seat: seat.seat_no, location: seat.seat_no || "Unknown Location", id: seat.id });
                                                                    setShowChangeSeatModal(true);
                                                                } else {
                                                                    mutateBookSeat(String(seat.id));
                                                                }
                                                            }
                                                        }}
                                                        className={`w-full text-sm  px-4 py-2 rounded flex justify-center items-center gap-2 transition ${!seat.is_available
                                                            ? "bg-[#DCDFE3] text-[#A5A8B5] cursor-not-allowed"
                                                            : "bg-[#134562] text-white cursor-pointer hover:bg-[#103a4c]"
                                                            } ${bookingSeatId === String(seat.id) ? "animate-pulse" : ""}`}
                                                    >
                                                        {bookingSeatId === String(seat.id)
                                                            ? "Booking..."
                                                            : seat.is_available
                                                                ? "Book Seat"
                                                                : "Booked"}
                                                    </button>

                                                    {
                                                        userRole === "admin" && (
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
                            )}


                            {!isRoomsLoading && !isRoomError && userRole === "admin" && (rooms ?? []).length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
                                    {rooms?.map((room) => (
                                        <div key={room.id} className="bg-white rounded-lg mock mb-[15px]">
                                            <img
                                                src={room.room_img}
                                                alt={String(room.floor)}
                                                className="rounded-t-[8px] mb-2 w-full  object-cover"
                                            />

                                            <div className=" p-3">
                                                <p className="font-[400] text-[16px] text-[#1A1A1A] mb-[8px]">Room type : {room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)} Room {room.room_no}                                             </p>

                                                <div className="flex items-center gap-2 text-sm mb-2  ">
                                                    <p className="font-[400] text-[14px] text-[#1A1A1A]">Capacity : {room.room_capacity}</p>
                                                    <div className="flex items-center gap-[2px]">
                                                        <img src="/images/location.png" className="w-4 h-4" />
                                                        <span className="text-[#000000] font-[500] text-[12px]">Floor {room.floor}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <button
                                                        disabled={!room.is_available || bookingSeatId === String(room.id)}
                                                        // onClick={() => {
                                                        //     if (seat.is_available) {
                                                        //         setBookingSeatId(String(seat.id));
                                                        //         if (bookedSeatDetails) {
                                                        //             setSelectedNewSeat({ seat: seat.seat_no, location: seat.seat_no || "Unknown Location", id: seat.id });
                                                        //             setShowChangeSeatModal(true);
                                                        //         } else {
                                                        //             mutateBookSeat(String(seat.id));
                                                        //         }
                                                        //     }
                                                        // }}
                                                        className={`w-full text-sm  px-4 py-2 rounded flex justify-center items-center gap-2 transition ${!room.is_available
                                                            ? "bg-[#DCDFE3] text-[#A5A8B5] cursor-not-allowed"
                                                            : "bg-[#134562] text-white cursor-pointer hover:bg-[#103a4c]"
                                                            } ${bookingSeatId === String(room.id) ? "animate-pulse" : ""}`}
                                                    >
                                                        {bookingSeatId === String(room.id)
                                                            ? "Booking..."
                                                            : room.is_available
                                                                ? "Book Seat"
                                                                : "Booked"}
                                                    </button>

                                                    {
                                                        userRole === "admin" && (
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
                            )}

                        </div>


                    )}

                    {activeTabSpa === "floor Plan" && (
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

                    {activeTabSpa === "list View" && (
                        <div className="text-center text-gray-400 text-sm mt-10">List View coming soon...</div>
                    )}
                </motion.div>
            </div >



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
                        You've successfully booked Seat {bookedSeatDetails?.seat} at {bookedSeatDetails?.location}
                    </p>
                </div>
            </AdminModal >

            <AdminModal show={showChangeSeatModal} onClose={() => {
                setShowChangeSeatModal(false);
                setBookingSeatId(null);
            }} maxWidth="max-w-[500px]">
                <div className="text-center px-1 py-2">
                    <div className="flex justify-end items-start mb-[20px]">
                        <button type="button" onClick={() => { setShowChangeSeatModal(false); setBookingSeatId(null); }} className="text-gray-500 hover:text-gray-700">
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
                            if (selectedNewSeat) {
                                setBookingSeatId(selectedNewSeat.seat);
                                mutateBookSeat(String(selectedNewSeat.id), {
                                    onSuccess: () => {
                                        toast.success("Seat changed successfully");
                                        setBookedSeatDetails(selectedNewSeat);
                                        setShowChangeSeatModal(false);
                                        setBookingSeatId(null);
                                    },
                                    onError: () => {
                                        toast.error("Failed to change seat. Please try again.");
                                        setShowChangeSeatModal(false);
                                        setBookingSeatId(null);
                                    },
                                });
                            }
                        }}
                        disabled={bookingSeatId === selectedNewSeat?.seat}
                        className={`w-full px-6 py-2 font-medium rounded-[4px] text-[14px] text-white transition 
        ${bookingSeatId === selectedNewSeat?.seat ? "bg-gray-400 cursor-not-allowed" : "bg-[#134562] hover:bg-[#103a4c]"}`}
                    >
                        {bookingSeatId === selectedNewSeat?.seat ? (
                            <div className="flex items-center justify-center gap-2">
                                <span className="loader border-white w-4 h-4 rounded-full border-t-transparent border-2 animate-spin"></span>
                                Changing...
                            </div>
                        ) : (
                            "Change seat"
                        )}
                    </button>

                </div>
            </AdminModal>


        </div >
    );
};

export default Spaces;
