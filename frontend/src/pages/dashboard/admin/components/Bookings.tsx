import { Calendar, Search } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import BookingTable from "./BookingTable";
const spaceTypes = [
    { label: 'Meeting Room', value: 'meeting' },
    { label: 'Desks', value: 'desks' },
];

const officeLocations = [
    { label: 'Constain Office', value: 'co' },
    { label: 'Berger Office', value: 'bo' },
    { label: 'Festac Office', value: 'fo' },
    { label: 'Lekki Office', value: 'lo' },
    { label: 'Constain Office', value: 'co' },
    { label: 'Berger Office', value: 'bo' },
    { label: 'Festac Office', value: 'fo' },
    { label: 'Lekki Office', value: 'lo' },

];

const statusOptions = [
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },

];


const Bookings = () => {
    const [selectedSpaceType, setSelectedSpaceType] = useState('');
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="max-940:px-[15px] px-[50px] max-860:px-[10px] font-manrope">
                <div>
                    <h2 className="font-[700] text-[20px] text-black mb-2">Bookings Management</h2>
                    <p className="text-[#A5A8B5] text-[16px] font-[400]">Approve, deny or create workplace bookings for your organization</p>
                </div>

                <div className="relative flex border-b border-gray-200 mb-4 mt-[19px]">
                    {["request"].map((tab) => {
                        return (
                            <button
                                key={tab}

                                className="relative pb-2 pl-[3px] pr-[20px] font-[600] border-b-2 border-[#134562] text-[14px] transition-colors duration-200 
                                         text-[#134562]"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}


                            </button>
                        );
                    })}
                </div>

                <div className=" flex flex-col md:flex-row gap-4 items-center w-full ">
                    <div className="flex-2 w-full md:min-w-[350px]">
                        <div className="flex items-center justify-center gap-2 border border-[#DCDFE3] px-4 py-[14px] rounded-[100px]">
                            <Search className="w-4 h-4 text-[#A5A8B5]" />
                            <input
                                type="text"
                                placeholder="Search Employees"
                                className="bg-transparent outline-none text-[#A5A8B5] text-sm flex-1 placeholder-[#A5A8B5]"
                            />
                        </div>
                    </div>

                    <CustomDropdown
                        value={selectedSpaceType}
                        onChange={setSelectedSpaceType}
                        options={spaceTypes}
                        placeholder="Space types"
                    />
                    <CustomDropdown
                        value={selectedOffice}
                        onChange={setSelectedOffice}
                        options={officeLocations}
                        placeholder="Office location"
                    />
                    <CustomDropdown
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        options={statusOptions}
                        placeholder="Status"
                    />
                    <div className="w-full md:w-[250px]">
                        <div className="relative w-full md:w-[250px] border px-4 py-2 border-[#E4E4E7] text-[#71717A] text-sm rounded-md">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => {
                                    setSelectedDate(date);
                                    setIsOpen(false); // close after picking
                                }}
                                onClickOutside={() => setIsOpen(false)}
                                open={isOpen}
                                dateFormat="MMM d"
                                placeholderText="Date picker"
                                className="w-full bg-transparent outline-none cursor-default pointer-events-none select-none"
                                popperPlacement="bottom-end"
                                showPopperArrow={false}
                            />

                            {/* Toggle calendar icon button */}
                            <button
                                type="button"
                                onClick={() => setIsOpen(prev => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                            >
                                <Calendar className="h-4 w-4 text-[#71717A]" />
                            </button>
                        </div>
                    </div>


                </div>

                <BookingTable />



            </div>

        </>
    )
}

export default Bookings