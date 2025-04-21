type Status = "Upcoming" | "Checked in" | "Pending";

const scheduleData: {
  id: number;
  title: string;
  location?: string;
  time: string;
  status: Status;
}[] = [
    {
      id: 1,
      title: "Design brief meeting",
      location: "Brainstorming room, First floor",
      time: "10:00AM - 11:00PM",
      status: "Upcoming"
    },
    {
      id: 2,
      title: "Successfully checked in",
      time: "Today at 10:00AM",
      status: "Checked in"
    },
    {
      id: 3,
      title: "Standup meeting with design team",
      time: "10:00AM - 11AM",
      status: "Pending"
    }
  ];


import { MapPin, Clock } from "lucide-react";

const statusColors = {
  Upcoming: "bg-gray-100 text-[#10384F]",
  "Checked in": "bg-[#EDFCF2] text-[#16B364]",
  Pending: "bg-[#FEFDF0] text-[#EAAA08]"
};

const ScheduleList = () => {
  return (
    <div className='max-940:px-[15px] mt-[32px] px-[50px] max-860:px-[10px]'>

      <div className="p-4 border border-[#DCDFE3] rounded-[16px] bg-white">
        <h2 className="text-[16px] font-[600] text-black mb-[12px]">Today's Schedule</h2>
        <div className="space-y-4">
          {scheduleData.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg block md:flex justify-between items-center"
            >
              <div className="space-y-1 mb-[20px] md:mb-0">
                <p className="text-black font-[600] text-[14px] mb-[12px]">{item.title}</p>
                <div className="text-sm text-[#A5A8B5] flex flex-col gap-1">
                  <div className="flex items-center gap-[16px]">
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span className="text-black font-[500] text-[14px]">{item.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span className="text-black font-[500] text-[14px]">{item.time}</span>
                    </div>
                  </div>

                </div>
              </div>
              <span
                className={`text-sm px-[17px] py-[6px]   text-center w-[120px] rounded-full font-medium ${statusColors[item.status]}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export default ScheduleList;
