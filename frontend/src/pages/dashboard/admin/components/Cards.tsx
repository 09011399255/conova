import React from "react";
import { useAdmin } from "../../../../contexts/AdminContext";
import Activities from "../../employee/Activities";
const cards = [
    {
        title: "Total bookings today",
        value: "2",
        bgColor: "bg-[#134562]",
        border: "border-[#134562]",

        textColor: "text-white",
        icon: "/images/calender.png",
    },
    {
        title: "Current Occupancy",
        value: "78%",
        bgColor: "bg-[#FAFAFA]",
        border: "border-[#DCDFE3]",
        textColor: "text-black",
        icon: "/images/clock.png",
    },
    {
        title: "Total cancellations",
        value: "3",
        bgColor: "bg-[#FAFAFA]",
        border: "border-[#DCDFE3]",
        textColor: "text-black",
        icon: "/images/calender2.png",
    },
    {
        title: "Peak hours this week",
        value: "10AM - 12AM",
        bgColor: "bg-[#FAFAFA]",
        border: "border-[#DCDFE3]",
        textColor: "text-black",
        icon: "/images/chat.png",
    },
];

const Cards: React.FC = () => {
    const { isAdmin } = useAdmin();


    return (
        <div className="grid grid-cols-1  sm:grid-cols-2 max-940:px-[15px] px-[50px] max-860:px-[10px] lg:grid-cols-4 gap-[20px]">
            {
                isAdmin ?
                    cards.map((card, idx) => (
                        <div
                            key={idx}
                            className={`rounded-[16px] px-[16px] py-[24px] flex flex-col gap-2 border ${card.border} ${card.bgColor} ${card.textColor}`}
                        >
                            <div className="flex items-center justify-between mb-[10px]">
                                <span className="text-[16px] font-normal">{card.title}</span>
                                <img src={card.icon} alt="icon" className="w-5 h-5" />
                            </div>
                            <div className="text-[24px] font-[700]">{card.value}</div>
                        </div>
                    ))
                    : <Activities />
            }



        </div >
    );
};

export default Cards;
