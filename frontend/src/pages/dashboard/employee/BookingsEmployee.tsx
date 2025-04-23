import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bookings } from "../../../data/bookings";

const BookingsEmployee = () => {
  console.log("kapai");

  const [activeTab, setActiveTab] = useState<
    "Upcoming(3)" | "Cancelled(5)" | "Past(10)"
  >(() => {
    return (
      (localStorage.getItem("spacesActiveTab") as
        | "Upcoming(3)"
        | "Cancelled(5)"
        | "Past(10)") || "Upcoming(3)"
    );
  });

  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    null
  );

  return (
    <>
      <div className="block md:flex items-center justify-between mb-6 ">
        <div>
          <h2 className="text-xl font-bold text-black mb-[4px]">My bookings</h2>
          <p className="text-[#A5A8B5] text-sm">
            View, edit, or cancel your recent workspace reservations
          </p>
        </div>

        <div className="flex gap-3 mt-[20px] md:mt-0">
          <button className=" border flex items-center justify-center gap-1    border-[#134562] text-[#134562]font-[500] text-[14px] px-4 py-2 hover:text-white rounded hover:bg-[#103a4c]">
            <img
              src="/images/date.png"
              alt="Download"
              className="inline-block w-4 h-4"
            />
            Date range
          </button>
          <button className=" border flex items-center justify-center gap-1    border-[#134562] text-[#134562]font-[500] hover:text-white text-[14px] px-4 py-2 rounded hover:bg-[#103a4c]">
            <img
              src="/images/export.png"
              alt="Download"
              className="inline-block w-4 h-4"
            />
            Export
          </button>
        </div>
      </div>

      <div className="relative flex border-b border-gray-200 mb-[26px]">
        {["Upcoming(3)", "Cancelled(5)", "Past(10)"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(
                  tab as "Upcoming(3)" | "Cancelled(5)" | "Past(10)"
                );
                localStorage.setItem("spacesActiveTab", tab);
              }}
              className={`relative  px-4 pb-2 text-sm font-medium transition-colors duration-200 ${
                isActive
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
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "Upcoming(3)" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === "Upcoming(3)" ? 20 : -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {activeTab === "Upcoming(3)" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {bookings[activeTab].map((booking) => {
                const isExpanded = expandedBookingId === booking.id.toString();

                return (
                  <div
                    key={booking.id}
                    className="border px-[16px] py-[24px] border-[#DCDFE3] rounded-[16px] space-y-2"
                  >
                    {/* Booking Header */}
                    <div className="flex justify-between items-start mb-[25px]">
                      <div>
                        <h3 className="font-[600] text-[16px]">
                          {booking.name}
                        </h3>
                        <p className="text-[14px] font-[400]">
                          {booking.floor}
                        </p>
                        <p className="text-[12px] font-[500]">
                          Schedule for {booking.date}
                        </p>
                      </div>

                      {booking.type === "room" && (
                        <div className="flex gap-2 items-center mr-[-20px]">
                          <button className="bg-[#134562] font-[500] text-[14px] text-white w-[100px] py-2 rounded">
                            Check-in
                          </button>
                          <button>
                            <img
                              src="/images/three.png"
                              className="w-[80%]"
                              alt="More options"
                            />
                          </button>
                        </div>
                      )}

                      {booking.type === "seat" && (
                        <div className="block justify-end text-right md:flex gap-4">
                          <button className="bg-[#134562] mb-[10px] md:mb-0 font-[500] text-[14px] text-white w-[140px] py-2 rounded">
                            Change seat
                          </button>
                          <button className="border border-[#134562] font-[500] text-[14px] text-[#134562] w-[140px] py-2 rounded">
                            Cancel seat
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Booking Times + See More */}
                    <div className="block md:flex items-center justify-between">
                      <div className="flex gap-3 text-black font-[500] text-[12px] items-center">
                        <div>
                          <p>Booked From: {booking.from}</p>
                          <p>Checked In At: {booking.checkedIn}</p>
                        </div>
                        <div>
                          <p>Booked To: {booking.to}</p>
                          <p>Checked Out At: {booking.checkedOut}</p>
                        </div>
                      </div>

                      {booking.type === "room" && (
                        <div
                          onClick={() =>
                            setExpandedBookingId(
                              isExpanded ? null : booking.id.toString()
                            )
                          }
                          className="text-[14px] mt-[20px] md:mt-0 flex gap-2 items-center font-[500] text-right text-[#134562] cursor-pointer"
                        >
                          <span>{isExpanded ? "See less" : "See more"}</span>
                          <img
                            src="/images/see.png"
                            className={`inline-block w-4 h-4 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            alt="Arrow"
                          />
                        </div>
                      )}
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-[23px]  space-y-3"
                        >
                          <div className="mt-[23px] border-t border-[#DCDFE3]">
                            {/* Description */}
                            <div className="mt-[12px]">
                              <h4 className="font-[400] text-[14px]">
                                Meeting Description
                              </h4>
                              <p className="text-[#A5A8B5] font-[400] text-[14px]">
                                A collaborative session to explore creative
                                directions, review mockups, and align on visual
                                goals for the upcoming product sprint. Bring
                                your sketches, moodboards, and wild ideas!
                              </p>
                            </div>

                            {/* Team Members */}
                            <div>
                              <h4 className="font-[500] text-[14px] mb-[12px] mt-[50px]">
                                Team members
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {booking.team?.map((member) => (
                                  <div
                                    key={member.name}
                                    className={`flex items-center gap-2 border border-[#DCDFE3] px-2 py-2 rounded-[8px]`}
                                  >
                                    <img
                                      src={member.avatar}
                                      className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-sm font-medium">
                                      {member.name}
                                    </span>
                                    <button
                                      className={`px-2 py-1 rounded-[40px] ml-[3px] text-sm font-medium ${
                                        member.status === "accepted"
                                          ? "bg-[#EDFCF2] text-[#16B364]"
                                          : member.status === "rejected"
                                          ? "bg-[#FEF2F2] text-[#EF4444]"
                                          : "bg-gray-400"
                                      }`}
                                    >
                                      {member.status}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "Cancelled(5)" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {bookings[activeTab].map((booking) => (
                <div
                  key={booking.id}
                  className="relative px-[16px] py-[24px] border border-[#DCDFE3] rounded-[16px] space-y-2 "
                >
                  {/* Cancelled badge */}

                  {/* Main content */}
                  <div className="flex justify-between items-start mb-[25px]">
                    <div>
                      <h3 className="font-[600] text-[16px]">{booking.name}</h3>
                      <p className="text-[14px] font-[400]">{booking.floor}</p>
                      <p className="text-[12px] font-[500]">
                        Schedule for {booking.date}
                      </p>
                    </div>
                    {booking.status === "cancelled" && (
                      <span className=" text-[12px] bg-[#FEF2F2] text-[#EF4444] font-[400] px-3 py-[4px] rounded-[40px]">
                        Cancelled
                      </span>
                    )}
                  </div>

                  <div className="block md:flex items-center justify-between">
                    <div className="flex  gap-3 text-black font-[500] text-[12px] items-center">
                      <div>
                        <p>Booked From: {booking.from}</p>
                        <p>Checked In At: {booking.checkedIn}</p>
                      </div>
                      <div>
                        <p>Booked To: {booking.to}</p>
                        <p>Checked Out At: {booking.checkedOut}</p>
                      </div>
                    </div>

                    {booking.type === "room" && (
                      <div className="text-[14px] mt-[20px] md:mt-0 flex gap-2 items-center font-[500] text-right text-[#134562] cursor-pointer">
                        <span>See more</span>
                        <img
                          src="/images/see.png"
                          className="inline-block w-4 h-4"
                          alt="Arrow"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Past(10)" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {bookings[activeTab].map((booking) => (
                <div
                  key={booking.id}
                  className="relative border px-[16px] py-[24px] border-[#DCDFE3] rounded-[16px] bg-white"
                >
                  <div className="flex justify-between items-start mb-[25px]">
                    <div>
                      <h3 className="font-[600] text-[16px]">{booking.name}</h3>
                      <p className="text-[14px] font-[400]">{booking.floor}</p>
                      <p className="text-[12px] font-[500]">
                        Schedule for {booking.date}
                      </p>
                    </div>
                    {booking.status === "past" && (
                      <span className=" text-[12px] change bg-[#FEF2F2] text-[#10384F] font-[400] px-6 py-[4px] rounded-[40px]">
                        Past
                      </span>
                    )}
                  </div>

                  <div className="block md:flex items-center justify-between">
                    <div className="flex  gap-3 text-black font-[500] text-[12px] items-center">
                      <div>
                        <p>Booked From: {booking.from}</p>
                        <p>Checked In At: {booking.checkedIn}</p>
                      </div>
                      <div>
                        <p>Booked To: {booking.to}</p>
                        <p>Checked Out At: {booking.checkedOut}</p>
                      </div>
                    </div>

                    {booking.type === "room" && (
                      <div className="text-[14px] mt-[20px] md:mt-0 flex gap-2 items-center font-[500] text-right text-[#134562] cursor-pointer">
                        <span>See more</span>
                        <img
                          src="/images/see.png"
                          className="inline-block w-4 h-4"
                          alt="Arrow"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default BookingsEmployee;
