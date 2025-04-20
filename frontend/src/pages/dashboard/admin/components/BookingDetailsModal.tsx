import Calendar from "react-calendar";
import dayjs from "dayjs";
import AdminModal from "./AdminModal";
import { useState } from "react";
import { motion } from "framer-motion";
import 'react-calendar/dist/Calendar.css';


export default function BookingDetailsModal({ show, onClose, booking }: { show: boolean; onClose: () => void; booking: any }) {
    if (!booking) return null;

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const bookedDates = [dayjs(booking.date).toDate()];

    const [activeTab, setActiveTab] = useState<"upcoming" | "pending" | "past">("upcoming");

    return (
        <AdminModal show={show} onClose={onClose} maxWidth="max-w-[583px]">
            <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-[20px] font-[700] text-black">Booking details</h2>
                    </div>

                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <img src={booking.avatar} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-[400]">{booking.name}</p>
                            <p className="text-[12px] font-[400] text-[#A5A8B5]">{booking.office}</p>
                        </div>
                    </div>

                    <button className="text-[15px] font-[500] text-[#134562] hover:underline">
                        View Profile
                    </button>

                </div>

                <Calendar
                    value={selectedDate}
                    onChange={(value) => value && setSelectedDate(value as Date)}
                    tileContent={({ date, view }) => view === "month" ? <Dot date={date} /> : null}
                    tileClassName={({ date, view }) => {
                        if (view !== 'month') return "";

                        const isBooked = bookedDates.some(booked =>
                            dayjs(booked).isSame(dayjs(date), 'day')
                        );

                        const isPast = dayjs(date).isBefore(dayjs(), "day");

                        return [
                            "p-[10px] text-sm  relative transition-all duration-150  rounded-[500px] flex justify-center items-center",
                            isBooked && "border border-[#134562] text-[#134562]",
                            isPast && "text-[#A5A8B5]"
                        ]
                            .filter(Boolean)
                            .join(" ");
                    }}
                    navigationLabel={({ date }) => (
                        <div className="text-base font-medium text-gray-800">{dayjs(date).format("MMMM YYYY")}</div>
                    )}
                    nextLabel={<span className="text-[#141B34] text-[25px] px-2 hover:text-blue-500">&gt;</span>}
                    prevLabel={<span className="text-[#141B34] text-[25px] px-2 hover:text-blue-500">&lt;</span>}
                    next2Label={null} // ✅ removes double next arrow
                    prev2Label={null} // ✅ removes double prev arrow
                    className="custom-calendar !rounded-2xl !bg-[#FAFAFA] !border !border-[#DCDFE3] p-4"
                />

                <div className="flex items-start justify-between mb-4 ">
                    <div className="relative flex border-b border-gray-200 mb-4 pr-[30px]">
                        {["upcoming", "pending", "past"].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as "upcoming" | "pending" | "past")}
                                    className={`relative pr-4 pl-3 pb-2 mt-[16px] text-sm font-medium transition-colors duration-200 ${isActive
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

                    <button className=" border flex items-center mt-[16px] justify-center gap-1    border-[#134562] hover:text-white text-[#134562]font-[500] text-[14px] px-4 py-2 rounded hover:bg-[#103a4c]">
                        <img
                            src="/images/export.png"
                            alt="Download"
                            className="inline-block w-4 h-4"
                        />
                        Export CSV
                    </button>
                </div>



                <div className="border-t pt-4 text-sm space-y-1">
                    <p><strong>Space:</strong> {booking.space}</p>
                    <p><strong>Date:</strong> {booking.date}</p>
                    <p><strong>Time:</strong> {booking.time}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                </div>


                <div className="flex justify-end">
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800">Close</button>
                </div>
            </div>
        </AdminModal>
    );
}
const Dot = ({ date }: { date: Date }) => {
    const showDot = [25, 28, 29, 30].includes(date.getDate()); // dummy logic
    return showDot ? (
        <div className="absolute bottom-[5px] w-1 h-1 bg-[#134562] rounded-full" />
    ) : null;
};

