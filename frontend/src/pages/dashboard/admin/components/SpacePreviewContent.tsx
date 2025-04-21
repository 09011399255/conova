import dayjs from "dayjs";
import { Moon } from "lucide-react";

type ScheduleItem = {
    day: string;
    enabled: boolean;
    from: string;
    to: string;
};

type SpacePreviewContentProps = {
    data: any;
    imageFile: File | null;
    onClose: () => void;
    schedule: ScheduleItem[];
};

const SpacePreviewContent = ({ data, imageFile, onClose, schedule }: SpacePreviewContentProps) => {
    return (
        <div className="font-manrope max-w-[600px]">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-[18px] font-bold text-[#000]">Preview</h2>
                    <p className="text-sm text-[#A5A8B5]">
                        Below is the details of the space
                    </p>
                </div>
                <button
                    className=""
                    onClick={onClose}
                >
                    <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                </button>

            </div>

            <div className="rounded-md overflow-hidden mb-4 h-[180px]">
                {imageFile ? (
                    <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="bg-gray-100 h-full flex items-center justify-center text-sm text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <div className="text-sm mb-4">
                <div className="flex justify-between items-start gap-4">
                    {/* Left column */}
                    <div >
                        <p className="font-[600] text-[16px] text-black mb-[2px] ">{data.name}</p>
                        <p className="text-black font-[400] text-[14px]">{data.floor}</p>

                    </div>

                    {/* Right column */}
                    <div className="text-right font-[500] text-[13px] text-black whitespace-nowrap">
                        <p className="mb-[2px]">Location: {data.location}</p>
                        <p>Space Type: {data.spaceType}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4  justify-between text-sm mt-[16px]">
                <div>
                    <span>
                        Capacity:{" "}
                        <span className="text-[#16B364] p-2 rounded-full bg-[#EDFCF2] font-semibold">
                            {data.capacity}
                        </span>
                    </span>
                </div>
                <div>
                    <span>
                        Restricted: <span className="text-[#EAAA08] bg-[#FEFDF0]  p-2 rounded-full">No</span>
                    </span>
                </div>
                <div>
                    <span>
                        Requires approval: <span className="text-[#EAAA08] bg-[#FEFDF0]  p-2 rounded-full">No</span>
                    </span>
                </div>



            </div>



            <div>
                <div className="relative flex border-b border-gray-200 mb-[18px] mt-[28px]">
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
                <div className="space-y-1">
                    {schedule.map(({ day, enabled, from, to }) => (
                        <div
                            key={day}
                            className={`flex items-center gap-4 px-3 py-2 rounded-md ${enabled ? "bg-white" : ""
                                } `}
                        >
                            <span className="w-24 font-medium text-sm text-gray-800">{day}</span>

                            {enabled ? (
                                <div className="flex gap-3 w-full">
                                    <div className="flex items-center justify-between gap-2 w-1/2 border border-[#DCDFE3] rounded-md px-2 py-1">
                                        <label className="text-[#A5A8B5] text-sm w-[50px] shrink-0">From</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={dayjs(`2000-01-01T${from}`).format("h:mm A")}
                                            className="w-full px-2 py-1 text-sm bg-transparent rounded-md text-black text-right"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 w-1/2 px-2 py-1 border border-[#DCDFE3] rounded-md">
                                        <label className="text-[#A5A8B5] text-sm w-[30px] shrink-0">To</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={dayjs(`2000-01-01T${to}`).format("h:mm A")}
                                            className="w-full px-2 py-1 text-sm bg-transparent rounded-md text-black text-right"
                                        />
                                    </div>

                                </div>
                            ) : (
                                <div className="flex items-center ml-[0px] w-full  bg-[#DCDFE3] text-[#A5A8B5] text-sm px-4 py-2 rounded-md ">
                                    <Moon className="w-4 h-4 mr-2" /> Closed
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpacePreviewContent;
