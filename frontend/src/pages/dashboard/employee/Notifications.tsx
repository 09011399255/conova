const notificationsData = [
    {
        id: 1,
        message: "Check-in failed – Not within allowed geofence",
        timeAgo: "Just now",
        type: "error",
        action: "Retry"
    },
    {
        id: 2,
        type: "invite",
        message: "An invite was sent from Uthman to join a meeting",
        room: "Brainstorming room, First floor",
        floor: "First floor",
        schedule: "Monday, April 25",
        participants: 4,
        timeRange: "12:00 PM - 01:00 PM",
        location: "Floor 3 east wing",
        meetingDescription: "A collaborative session to explore creative directions, review mockups, and align on visual goals for the upcoming product sprint. Bring your sketches, moodboards, and wild ideas!",
        teamMembers: [
            { name: "Bethany Hall", avatar: "/images/avatar1.png" },
            { name: "Jolie Noah", avatar: "/images/avatar2.png" },
            { name: "Jaylon Bothman", avatar: "/images/avatar3.png" },
            { name: "Jaylon Bothman", avatar: "/images/avatar4.png" },
            { name: "Jaylon Bothman", avatar: "/images/avatar5.png" },

        ],
        timeAgo: "5 minutes ago",
        action: "View details"
    },
    {
        id: 3,
        message: "Your hurdle room booking was successful",
        timeAgo: "2 minutes ago",
        action: "View details"
    },
    {
        id: 4,
        type: "seat",
        message: "Your booking for Seat 15C has been confirmed",
        floor: "Floor 1",
        seat: "Seat 15C",
        schedule: "Monday, April 25",
        timeRange: "12:00 PM - 01:00 PM",
        timeAgo: "5 minutes ago",
        action: "View details"
    },
    {
        id: 5,
        type: "meeting",
        message: "Meeting with design team in 10 mins",
        room: "Brainstorming room, First floor",
        floor: "First floor",
        schedule: "Monday, April 25",
        participants: 4,
        timeRange: "12:00 PM - 01:00 PM",
        timeAgo: "5 minutes ago",
        action: "View details",
        location: "Floor 3 east wing",
        meetingDescription: "A collaborative session to explore creative directions, review mockups, and align on visual goals for the upcoming product sprint. Bring your sketches, moodboards, and wild ideas!",
        teamMembers: [
            { name: "Bethany Hall", avatar: "/images/avatar1.png" },
            { name: "Jolie Noah", avatar: "/images/avatar2.png" },
            { name: "Jaylon Bothman", avatar: "/images/avatar3.png" },
            { name: "Jaylon Bothman", avatar: "/images/avatar4.png" },
            { name: "Jaylon Bothman", avatar: "/images/avatar5.png" },

        ],
    }
];


import { Clock, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import AdminModal from '../admin/components/AdminModal';
import InviteModal from './InviteModal';

type TeamMember = {
    name: string;
    avatar: string;
};

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



const NotificationsList = () => {

    const [selectedInvite, setSelectedInvite] = useState<InviteData | null>(null);
    return (
        <div className='max-940:px-[15px] mt-[34px] px-[50px] max-860:px-[10px]'>
            <div className="p-4 border border-[#DCDFE3] rounded-[16px] bg-white">
                <h2 className="text-[16px] font-[600] text-black mb-[12px]">Recent Notifications</h2>
                <div className="space-y-4">
                    {notificationsData.map(notification => (
                        <div
                            key={notification.id}
                            className="border border-[#DCDFE3] p-4 rounded-[16px] block md:flex justify-between items-center"
                        >
                            <div>
                                <p className=" text-black font-[600] text-[14px] mb-[12px]">{notification.message}</p>
                                <div className="text-[14px] font-[400] text-[#A5A8B5]  space-y-1">
                                    <div className="flex items-center  gap-[16px]">
                                        {notification.room && (
                                            <div className="flex items-center gap-1 mb-[12px]">
                                                <MapPin size={16} />
                                                <span className='text-black font-[500] text-[14px]'> {notification.room}</span>
                                            </div>
                                        )}
                                        {notification.participants && (
                                            <div className="flex items-center gap-1 mb-[12px]">
                                                <Users size={16} />
                                                <span className='text-black font-[500] text-[14px]'>{notification.participants} Participants</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-[16px]'>

                                        {notification.timeRange && (
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                <span className='text-black font-[500] text-[14px]'>{notification.timeRange}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            <span >{notification.timeAgo}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {notification.action && (
                                <button
                                    className={`px-4 py-[8px] mt-[20px] md:mt-0 w-[150px] border rounded ${notification.action === 'Retry'
                                        ? 'bg-[#134562] text-white'
                                        : 'border-[#134562] text-[#134562] hover:bg-[#134562] hover:text-white'
                                        }`}
                                    onClick={() => {
                                        if (notification.type === "invite" || notification.type === "meeting") {
                                            setSelectedInvite({
                                                type: notification.type,
                                                room: notification.room!,
                                                floor: notification.floor!,
                                                schedule: notification.schedule!,
                                                timeRange: notification.timeRange!,
                                                location: notification.location!,
                                                meetingDescription: notification.meetingDescription!,
                                                teamMembers: notification.teamMembers!,
                                                participants: notification.participants,
                                            });
                                        } else if (notification.type === "seat") {
                                            setSelectedInvite({
                                                type: notification.type,
                                                seat: notification.seat!,
                                                floor: notification.floor!,
                                                schedule: notification.schedule!,
                                                timeRange: notification.timeRange!,
                                            });
                                        }
                                    }}


                                >
                                    {notification.action}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {selectedInvite && (
                <AdminModal show={true} onClose={() => setSelectedInvite(null)} maxWidth="max-w-[500px]">
                    <InviteModal onClose={() => setSelectedInvite(null)} data={selectedInvite} />
                </AdminModal>
            )}
        </div>
    );
};

export default NotificationsList;
