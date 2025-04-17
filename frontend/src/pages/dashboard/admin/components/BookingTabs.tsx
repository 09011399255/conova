import { useState } from "react";
import { motion } from "framer-motion";
const attendeeImages: Record<string, string> = {
    "Bethany Hall": "/images/att1.png",
    "Jolie Noah": "/images/att2.png",
    "Jaylon Bothman": "/images/att3.png",
};



const bookings = {
    confirmed: [
        {
            room: "Huddle Room 2",
            floor: "Floor 1",
            date: "Monday, April 25",
            time: "10:00AM - 11:00AM",
            attendees: ["Bethany Hall", "Jolie Noah", "Jaylon Bothman", "Jaylon Bothman", "Jaylon Bothman"],
            availability: "Capacity 5",
            restricted: false,
            approvalRequired: false,
            action: "Checked-In",
        },
        {
            room: "Huddle Room 2",
            floor: "Floor 1",
            date: "Monday, April 27",
            time: "10:00AM - 11:00AM",
            attendees: ["Bethany Hall", "Jolie Noah", "Jaylon Bothman", "Jaylon Bothman", "Jaylon Bothman"],
            availability: "Capacity 5",
            restricted: false,
            approvalRequired: false,
            action: "Reschedule",
        },
        {
            room: "Huddle Room 2",
            floor: "Floor 1",
            date: "Monday, April 27",
            time: "10:00AM - 11:00AM",
            attendees: ["Bethany Hall", "Jolie Noah", "Jaylon Bothman", "Jaylon Bothman", "Jaylon Bothman"],
            availability: "Capacity 5",
            restricted: false,
            approvalRequired: false,
            action: "Reschedule",
        },
        {
            room: "Huddle Room 2",
            floor: "Floor 1",
            date: "Monday, April 27",
            time: "10:00AM - 11:00AM",
            attendees: ["Bethany Hall", "Jolie Noah", "Jaylon Bothman", "Jaylon Bothman", "Jaylon Bothman"],
            availability: "Capacity 5",
            restricted: false,
            approvalRequired: false,
            action: "Reschedule",
        },
        {
            room: "Huddle Room 2",
            floor: "Floor 1",
            date: "Monday, April 27",
            time: "10:00AM - 11:00AM",
            attendees: ["Bethany Hall", "Jolie Noah", "Jaylon Bothman", "Jaylon Bothman", "Jaylon Bothman"],
            availability: "Capacity 5",
            restricted: false,
            approvalRequired: false,
            action: "Reschedule",
        },
    ],
    pending: [
        {
            room: "Huddle Room 2",
            floor: "Floor 1",
            date: "Wednesday, April 27",
            time: "10:00AM - 11:00AM",
            attendees: ["Bethany Hall", "Jolie Noah", "Jaylon Bothman", "Jaylon Bothman", "Jaylon Bothman"],
            availability: "Capacity 5",
            restricted: false,
            approvalRequired: false,
            action: "Cancel",
        },
        {
            room: "Huddle Room 2",
            floor: "Floor 1",
            date: "Wednesday, April 27",
            time: "10:00AM - 11:00AM",
            attendees: ["Bethany Hall", "Jolie Noah", "Jaylon Bothman", "Jaylon Bothman", "Jaylon Bothman"],
            availability: "Capacity 5",
            restricted: false,
            approvalRequired: false,
            action: "Cancel",
        },
    ],
};

const BookingTabs = () => {
    const [activeTab, setActiveTab] = useState<"confirmed" | "pending">("confirmed");

    const data = bookings[activeTab];

    return (
        <div className="">


            <div className="relative flex border-b border-gray-200 mb-4">
                {["confirmed", "pending"].map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as "confirmed" | "pending")}
                            className={`relative px-4 pb-2 text-sm font-medium transition-colors duration-200 ${isActive
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


            {/* Cards */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "confirmed" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "confirmed" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="max-h-[970px] overflow-y-auto pr-2 custom-scrollbar flex-1"

            >
                {data.map((booking, i) => (
                    <div
                        key={i}
                        className="border border-[#DCDFE3]  rounded-lg p-4 mb-4 flex flex-col sm:flex-row justify-between gap-4 bg-[#FAFAFA] shadow-sm"
                    >
                        {/* Left */}
                        <div>
                            <h2 className="font-[600] text-[16px] text-black">{booking.room}</h2>
                            <p className="text-[14px] font-[400] text-black">{booking.floor}</p>
                            <p className="text-sm font-[500] text-black mt-1">
                                Schedule for {booking.date}
                            </p>

                            <div className="mt-4">
                                <p className="text-sm font-medium mt-[20px] md:mt-0 mb-2">{booking.time}</p>
                                <div className="flex flex-wrap gap-2">
                                    {booking.attendees.map((name, j) => (
                                        <div
                                            key={j}
                                            className="flex items-center border rounded-full px-2 py-1 text-sm bg-gray-100"
                                        >
                                            <img
                                                src={attendeeImages[name] || "/images/avatar-placeholder.png"}
                                                alt={name}
                                                className="w-6 h-6 rounded-full mr-2 object-cover"
                                            />
                                            {name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col justify-between  md:items-end gap-2 whitespace-nowrap">
                            <div className="text-sm space-y-1 text-left my-[20px]">
                                <div>
                                    Availability:{" "}
                                    <span className="text-[#16B364] px-[8px] py-[4px] rounded-[60px] bg-[#EDFCF2]">{booking.availability}</span>
                                </div>
                                <div>
                                    Restricted:{" "}
                                    <span className="text-[#EAAA08] px-[8px] py-[4px] rounded-[60px] bg-[#FEFDF0]">
                                        {booking.restricted ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div>
                                    Requires approval:{" "}
                                    <span className="text-[#EAAA08] font-[400] px-[8px] py-[4px] rounded-[60px] bg-[#FEFDF0]">
                                        {booking.approvalRequired ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className=" flex flex-row   md:flex-col gap-3">

                                {/* Show Cancel for Reschedule */}
                                {booking.action === "Reschedule" && (
                                    <button className="px-4  w-full py-2 rounded-md text-sm font-semibold text-[#134562] border border-[#134562]">
                                        Cancel
                                    </button>
                                )}
                                <button
                                    className={`px-4 py-2 rounded-md text-sm font-semibold ${booking.action === "Cancel"
                                        ? "border border-[#134562] text-[#134562] w-full"
                                        : " bg-[#134562] text-white  w-full"
                                        }`}
                                >
                                    {booking.action}
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default BookingTabs;
