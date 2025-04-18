import { useState } from "react";

interface TeamMember {
    name: string;
    avatar: string;
}

type InviteData = {
    type?: string;
    room?: string;
    floor: string;
    schedule: string;
    timeRange: string;
    location?: string;
    meetingDescription?: string;
    teamMembers?: TeamMember[];
    participants?: number;
    seat?: string; // 👈 Add this
};



interface InviteModalProps {
    onClose: () => void;
    data: InviteData;
}

const InviteModal = ({ onClose, data }: InviteModalProps) => {
    const [responded, setResponded] = useState(false);

    const handleResponse = () => {
        setResponded(true);
        // Optional: Call onClose() after delay or not at all depending on desired UX
        // onClose(); 
    };
    return (

        <div className="">
            <div className="flex justify-between items-start mb-[30px]">
                <div>
                    <h2 className="text-[20px] font-[700] text-black">
                        <h2 className="text-[20px] font-[700] text-black">
                            {data.type === "invite"
                                ? "Meeting Invite"
                                : data.type === "meeting"
                                    ? "Meeting Details"
                                    : data.type === "seat"
                                        ? "Seat Details"
                                        : "Notification"}
                        </h2>
                    </h2>
                </div>

                <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                </button>
            </div>
            {data.type === 'seat' ? (
                <div className="bg-[#FAFAFA] border border-t-[10px] rounded-[16px] p-4 border-t-[#134562] border-[#DCDFE3]">
                    <h3 className="font-[600] text-[16px] mb-[2px]">{data.seat}</h3>
                    <p className="font-[500] text-[15px] mb-[4px]">{data.floor}</p>
                    <p className="text-[14px] font-[500]">
                        Scheduled for {data.schedule} {data.timeRange && ` ${data.timeRange}`}
                    </p>
                </div>
            ) : (
                <>
                    <div
                        className={`bg-[#FAFAFA] border border-t-[10px] rounded-[16px] p-4 ${data.type === 'invite'
                            ? 'border-t-[#16B364]'
                            : data.type === 'meeting'
                                ? 'border-t-[#134562]'
                                : 'border-t-[#DCDFE3]'
                            } border-[#DCDFE3]`}
                    >
                        <h3 className="font-[600] text-[16px] mb-[2px]">{data.room}</h3>
                        <p className="font-[500] text-[15px] mb-[4px]">{data.floor}</p>
                        <p className="text-[14px] font-[500]">Schedule for {data.schedule}</p>
                        <p className="mt-[22px] mb-[8px]"><span className="font-[500] text-[14px]">Time:</span> <span className="text-[#16B364] font-[400] text-[12px]">{data.timeRange}</span></p>
                        <p><span className="font-[500] text-[14px]">Location:</span> <span className="text-[#16B364] font-[400] text-[12px]">{data.location}</span></p>
                        {data.participants && (
                            <p className="mt-2">
                                <span className="font-[500] text-[14px]">Participants:</span>{" "}
                                <span className="text-[#16B364] font-[400] text-[12px]">{data.participants}</span>
                            </p>
                        )}

                        <div className="border mt-4 p-4 border-[#DCDFE3] rounded-[8px]">
                            <h4 className="font-[400] mb-2">Meeting Description</h4>
                            <p className="text-[#A5A8B5] text-[14px]">{data.meetingDescription}</p>
                        </div>

                        <div className="mt-[30px]">
                            <h4 className="mb-2 font-[500]">Team members</h4>
                            <div className="flex flex-wrap gap-2">
                                {(data.teamMembers ?? []).map((member, index) => (
                                    <div key={index} className="flex items-center gap-1 border border-[#DCDFE3] px-3 py-2 rounded-[8px] bg-[#FAFAFA] shadow-sm">
                                        <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                                        <span className="text-[14px]">{member.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {data.type === "invite" && !responded && (
                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={handleResponse}
                                    className="bg-[#16B364] font-[500] text-[14px] text-white w-[140px] py-2 rounded"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={handleResponse}
                                    className="bg-[#EF4444] font-[500] text-[14px] text-white w-[140px] py-2 rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

        </div>
    );
};

export default InviteModal;
