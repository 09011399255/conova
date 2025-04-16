import Chart from "./Chart"
import TeamSchedule from "./TeamSchedule"

const BookingSection = () => {
    return (
        <div className="flex flex-col max-940:px-[15px] px-[50px] max-860:px-[10px] lg:flex-row gap-4 p-4">
            {/* Left section - wider */}
            <div className="w-full lg:w-7/12">
                {/* Bookings Chart */}
                <h2 className="font-[700] text-[20px] text-black mb-2">Bookings</h2>
                <Chart />
                <TeamSchedule />
                {/* Insert your chart or graph here */}
            </div>

            {/* Right section - narrower */}
            <div className="w-full lg:w-5/12">
                {/* Upcoming Bookings */}
                <div className="flex items-center gap-3">
                    <h2 className="font-[700] text-[20px] text-black">Upcoming Bookings</h2>
                    <img src="/images/danger.png" alt="Booking" className="w-5 h-5" />
                </div>

                {/* Insert booking cards here */}
            </div>
        </div>

    )
}

export default BookingSection