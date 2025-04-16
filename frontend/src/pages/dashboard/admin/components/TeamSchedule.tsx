import { useState } from "react";
import DatePicker from "react-datepicker";
import { Tooltip } from "react-tooltip";

import 'react-datepicker/dist/react-datepicker.css';
import 'react-tooltip/dist/react-tooltip.css';


interface TeamMember {
    name: string;
    role: string;
    image: string;
    schedule: {
        [key: string]: {
            status: "Present" | "Absent" | "Closed";
            tooltip?: string;
        };
    };
}

const days = ["M", "T", "W", "T", "F", "S", "S"];

const team: TeamMember[] = [
    {
        name: "Bethany Hall",
        role: "Director of Marketing",
        image: "/images/team1.png",
        schedule: {
            M: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            T: { status: "Present", tooltip: "Resume at 8:45am\nLeft at 5:10pm" },
            W: { status: "Absent", tooltip: "Absent" },
            T2: { status: "Present", tooltip: "Resume at 6:30am\nLeft at 5:30pm" },
            F: { status: "Present", tooltip: "Resume at 9:30am\nLeft at 5:30pm" },
            S: { status: "Closed", tooltip: "Closed" },
            S2: { status: "Closed", tooltip: "Closed" },
        },
    },
    {
        name: "Aaron Gayle",
        role: "Chief People Officer",
        image: "/images/team2.png",
        schedule: {
            M: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 7:30pm" },
            T: { status: "Present", tooltip: "Resume at 1:30am\nLeft at 8:30pm" },
            W: { status: "Present", tooltip: "Resume at 10:30am\nLeft at 5:30pm" },
            T2: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 3:20pm" },
            F: { status: "Present", tooltip: "Resume at 3:30am\nLeft at 5:30pm" },
            S: { status: "Closed", tooltip: "Closed" },
            S2: { status: "Closed", tooltip: "Closed" },
        },
    },
    {
        name: "Jolie Noah",
        role: "Operation Manager",
        image: "/images/team3.png",
        schedule: {
            M: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            T: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            W: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            T2: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            F: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            S: { status: "Closed", tooltip: "Closed" },
            S2: { status: "Closed", tooltip: "Closed" },
        },
    },
    {
        name: "Nicolas Kosar",
        role: "Chief Executive Officer",
        image: "/images/team4.png",
        schedule: {
            M: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            T: { status: "Present", tooltip: "Resume at 10:30am\nLeft at 5:30pm" },
            W: { status: "Absent", tooltip: "Absent" },
            T2: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            F: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            S: { status: "Closed", tooltip: "Closed" },
            S2: { status: "Closed", tooltip: "Closed" },
        },
    },
    {
        name: "Kaiya Culhane",
        role: "Chief Operating Officer",
        image: "/images/team5.png",
        schedule: {
            M: { status: "Present", tooltip: "Resume at 8:30am\nLeft at 5:30pm" },
            T: { status: "Present", tooltip: "Resume at 9:30am\nLeft at 5:45am" },
            W: { status: "Absent", tooltip: "Absent" },
            T2: { status: "Present", tooltip: "Resume at 2:30am\nLeft at 5:30pm" },
            F: { status: "Present", tooltip: "Resume at 1:30am\nLeft at 5:30pm" },
            S: { status: "Closed", tooltip: "Closed" },
            S2: { status: "Closed", tooltip: "Closed" },
        },
    },
    {
        name: "Jaxson Vaccaro",
        role: "Head of Design",
        image: "/images/team6.png",
        schedule: {
            M: { status: "Absent", tooltip: "Absent" },
            T: { status: "Present", tooltip: "Resume at 8:30pm\nLeft at 5:30pm" },
            W: { status: "Present", tooltip: "Resume at 10:30am\nLeft at 4:30pm" },
            T2: { status: "Present", tooltip: "Resume at 12:30pm\nLeft at 6:30pm" },
            F: { status: "Present", tooltip: "Resume at 1:30am\nLeft at 5:30am" },
            S: { status: "Closed", tooltip: "Closed" },
            S2: { status: "Closed", tooltip: "Closed" },
        },
    },
];


const TeamSchedule = () => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;

    return (
        <div className="bg-[#FAFAFA] z-[1] relative px-[16px] py-[24px] rounded-[16px] border border-[#DCDFE3]  mt-[24px]">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h2 className=" text-black font-[700] text-[20px]">Team Schedule</h2>
                    <div className="relative hidden sm:block">
                        <DatePicker
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update: [Date | null, Date | null]) => {
                                setDateRange(update);
                            }}
                            dateFormat="MMM d"
                            placeholderText="Select date range"
                            className="border px-4 py-2 rounded-md  text-sm bg-transparent w-full cursor-pointer"
                            calendarClassName="z-50"
                            popperPlacement="bottom-end"
                            isClearable
                        />
                    </div>
                </div>

                <button className="text-[16px] font-[700] text-[#134562] hover:underline">See all</button>

            </div>
            <div className="relative sm:hidden block  ">
                <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update: [Date | null, Date | null]) => {
                        setDateRange(update);
                    }}
                    dateFormat="MMM d"
                    placeholderText="Select date range"
                    className="border px-4 py-2  rounded-md text-sm bg-transparent w-full cursor-pointer"
                    calendarClassName="z-50"
                    popperPlacement="bottom-end"
                    isClearable
                />
            </div>

            <div>
                {team.map((member, index) => (
                    <div
                        key={index}
                        className="block sm:flex items-center justify-between gap-4 py-3 border-t first:border-t-0 "
                    >
                        {/* Avatar */}
                        <div className="flex items-center gap-4 mb-5 sm:mb-0">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            {/* Info */}
                            <div className="flex-1">
                                <div className="text-[16    px] font-[400]">{member.name}</div>
                                <div className="text-[12px] text-[#A5A8B5]">{member.role}</div>
                            </div>
                        </div>


                        {/* Schedule */}
                        <div className="flex gap-2">
                            {days.map((d, i) => {
                                const dayKey = d + (d === "T" && i > 2 ? "2" : d === "S" && i > 5 ? "2" : "");
                                const day = member.schedule[dayKey];
                                const isClosed = day?.status === "Closed";
                                const isAbsent = day?.status === "Absent";

                                return (
                                    <div
                                        key={i}
                                        className={`sm:w-8 sm:h-8 w-[50px] h-[50px] max-400:h-[40px] rounded-full flex items-center justify-center border ${isClosed
                                            ? "bg-[#DCDFE3] text-[#A5A8B5] border border-[#DCDFE3]"
                                            : isAbsent
                                                ? "border border-[#DCDFE3] text-[#A5A8B5]"
                                                : "border border-[#134562] text-[16px] text-[#134562]"
                                            } cursor-pointer relative text-sm`}
                                        data-tooltip-id={`tooltip-${index}-${i}`}
                                        data-tooltip-content={day?.tooltip || ""}
                                    >
                                        {d}
                                        {day?.tooltip && (
                                            <Tooltip
                                                id={`tooltip-${index}-${i}`}
                                                place="top"
                                                className="whitespace-pre-line !font-[400] !text-[12px] !bg-[#134562] !text-white"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamSchedule;
