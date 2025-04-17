import BookingTabs from "../components/BookingTabs";
import Chart from "../components/Chart";
import TeamSchedule from "../components/TeamSchedule";

const BookingSection = () => {
    return (
        <div className="flex flex-col max-940:px-[15px]  px-[50px] max-860:px-[10px] lg:flex-row gap-[22px] p-4">
            <div className="w-full lg:w-7/12">
                <h2 className="font-[700] text-[20px] text-black mb-[16px] mt-[16px]">Bookings</h2>
                <Chart />
                <TeamSchedule />
            </div>

            <div className="w-full lg:w-5/12 flex flex-col ">
                <div className="flex items-center gap-3 mb-[16px] mt-[16px]">
                    <h2 className="font-[700] text-[20px] text-black ">Upcoming Bookings</h2>
                    <img src="/images/danger.png" alt="Booking" className="w-5 h-5" />
                </div>

                <div>
                    <BookingTabs />
                </div>
            </div>
        </div>
    );
};

export default BookingSection;
