import { Switch } from "@headlessui/react";
import { Moon } from "lucide-react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css"; // Optional if you don’t use analog view



type ScheduleItem = {
    day: string;
    enabled: boolean;
    from: string;
    to: string;
};

export default function WeeklySchedule({
    schedule,
    toggleDay,
    updateTime,
}: {
    schedule: ScheduleItem[];
    toggleDay: (index: number) => void;
    updateTime: (index: number, field: "from" | "to", value: string) => void;
}) {


    return (
        <div className="grid grid-cols-1 w-full lg:grid-cols-2 mb-[32px] gap-6 gap-y-4">
            {schedule.map((day, idx) => (
                <div key={day.day} className=" block md:flex items-center gap-[18px]">
                    <div className="flex items-center gap-[10px] mb-[20px] md:mb-[0px]">

                        <Switch
                            checked={day.enabled}
                            onChange={() => toggleDay(idx)}
                            className={`${day.enabled ? "bg-[#134562]" : "bg-gray-300"}
              relative inline-flex h-5 w-10  items-center rounded-full transition-colors`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition 
                ${day.enabled ? "translate-x-5" : "translate-x-1"}`}
                            />
                        </Switch>

                        <span className="text-sm w-[80px] text-black">
                            {day.day}
                        </span>
                    </div>


                    {day.enabled ? (
                        <>
                            <div className="flex items-center mb-[10px] md:mb-[0px] justify-between gap-[100px] px-2 py-1 rounded-[8px] border border-[#DCDFE3] text-[#A5A8B5]">
                                <span className="text-sm text-[#A5A8B5] mr-[25px]">From</span>
                                <TimePicker
                                    onChange={(val) => updateTime(idx, "from", val || "")}
                                    value={day.from}
                                    format="hh:mm a"
                                    className="custom-time-picker"
                                    disableClock
                                    clearIcon={null}
                                />
                            </div>
                            <div className="flex items-center gap-[100px] justify-between px-2 py-1 rounded-[8px] border border-[#DCDFE3] text-[#A5A8B5]">
                                <span className="text-sm text-[#A5A8B5] mr-[25px]">To</span>
                                <TimePicker
                                    onChange={(val) => updateTime(idx, "to", val || "")}
                                    value={day.to}
                                    format="hh:mm a"
                                    className="custom-time-picker"
                                    disableClock
                                    clearIcon={null}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center ml-[0px] w-full  bg-[#DCDFE3] text-[#A5A8B5] text-sm px-4 py-2 rounded-md ">
                            <Moon className="w-4 h-4 mr-2" /> Closed
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
