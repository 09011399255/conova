const bookings = [
    {
        id: 1,
        avatar: "/images/avatar1.png",
        name: "Bethany Hall",
        office: "Costain Office",
        space: "Huddle Room 3",
        date: "17-Apr-2025",
        time: "9:00am - 5:00pm",
        status: "Confirmed",
    },
    {
        id: 2,
        avatar: "/images/avatar2.png",
        name: "Aaron Gayle",
        office: "Bergen Office",
        space: "Desk 34",
        date: "17-Apr-2025",
        time: "12:00pm - 5:00pm",
        status: "Pending",
    },
    {
        id: 3,
        avatar: "/images/avatar3.png",
        name: "Jolie Noah",
        office: "Feaster Office",
        space: "Desk 12",
        date: "17-Apr-2025",
        time: "10:00am - 11:00am",
        status: "Cancelled",
    },
    {
        id: 4,
        avatar: "/images/avatar4.png",
        name: "Nicolas Kosar",
        office: "Lakki Office",
        space: "Brainstorm Room 2",
        date: "17-Apr-2025",
        time: "10:00am - 11:00am",
        status: "Confirmed",
    },
    {
        id: 5,
        avatar: "/images/avatar5.png",
        name: "Kaiya Culhane",
        office: "Victoria Island Office",
        space: "Desk 10",
        date: "17-Apr-2025",
        time: "9:00am - 5:00pm",
        status: "Confirmed",
    },
    {
        id: 6,
        avatar: "/images/avatar6.png",
        name: "Jaxson Vaccaro",
        office: "Ikoyi Office",
        space: "Conference Room",
        date: "17-Apr-2025",
        time: "12:00pm - 5:00pm",
        status: "Confirmed",
    },
    {
        id: 7,
        avatar: "/images/avatar7.png",
        name: "Marley Calzoni",
        office: "Magodo Office",
        space: "Desk 20",
        date: "17-Apr-2025",
        time: "10:00am - 11:00am",
        status: "Confirmed",
    },
    {
        id: 8,
        avatar: "/images/avatar8.png",
        name: "Martin Aminoff",
        office: "Yaba Office",
        space: "Desk 6",
        date: "17-Apr-2025",
        time: "12:00pm - 5:00pm",
        status: "Confirmed",
    },
    {
        id: 9,
        avatar: "/images/avatar9.png",
        name: "Lindsey Vetrovs",
        office: "Surulere Office",
        space: "Desk 17",
        date: "17-Apr-2025",
        time: "10:00am - 11:00am",
        status: "Confirmed",
    },
    {
        id: 10,
        avatar: "/images/avatar10.png",
        name: "Jaylon Baptista",
        office: "Ketu Office",
        space: "Huddle Room 1",
        date: "17-Apr-2025",
        time: "9:00am - 5:00pm",
        status: "Confirmed",
    },
    {
        id: 11,
        avatar: "/images/avatar11.png",
        name: "Kaylynn Kenter",
        office: "Ijesha Office",
        space: "Huddle Room 1",
        date: "17-Apr-2025",
        time: "12:00pm - 5:00pm",
        status: "Confirmed",
    }
];


import { useState } from "react";

const ITEMS_PER_PAGE = 9;

export default function BookingTable() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = bookings.slice(start, start + ITEMS_PER_PAGE);
    const [selectedBookings, setSelectedBookings] = useState<number[]>([]);


    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-[#EDFCF2] text-[#16B364]";
            case "Pending":
                return "bg-[#FEFDF0] text-[#EAAA08]";
            case "Cancelled":
                return "bg-[#FEF2F2] text-[#EF4444]";
            default:
                return "bg-gray-100 text-gray-500";
        }
    };

    return (
        <>
            {selectedBookings.length > 0 && (
                <div className="flex justify-between items-center mt-[12px]">
                    <span className="text-sm text-black">
                        {selectedBookings.length} selected
                    </span>
                    <button className=" border flex items-center justify-center gap-1    border-[#134562] text-[#134562]font-[500] text-[14px] px-4 py-2 rounded hover:bg-[#103a4c]">
                        <img
                            src="/images/export.png"
                            alt="Download"
                            className="inline-block w-4 h-4"
                        />
                        Export CSV
                    </button>
                </div>
            )}
            <div className="mt-[16px] bg-white rounded-xl border border-[#DCDFE3]">


                <table className="w-full text-sm text-left border border-[#FAFAFA] rounded-md overflow-hidden">
                    <thead className="bg-[#FAFAFA]  text-black text-[14px] font-[100]">
                        <tr >
                            <th className="px-3 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedBookings.length === bookings.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedBookings(bookings.map((b) => b.id));
                                        } else {
                                            setSelectedBookings([]);
                                        }
                                    }}
                                    className="w-4 h-4 cursor-pointer accent-[#134562]"
                                />
                            </th>


                            <th className="px-4 py-4">Name & Office</th>
                            <th className="px-4 py-4">Space</th>
                            <th className="px-4 py-4">Date</th>
                            <th className="px-4 py-4">Time</th>
                            <th className="px-4 py-4">Status</th>
                            <th className="px-4 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCDFE3]">
                        {paginatedData.map((booking) => (
                            <tr key={booking.id} className="cursor-pointer hover:bg-gray-50">
                                <td className="px-3 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedBookings.includes(booking.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedBookings((prev) => [...prev, booking.id]);
                                            } else {
                                                setSelectedBookings((prev) => prev.filter((id) => id !== booking.id));
                                            }
                                        }}
                                        className="w-4 h-4 cursor-pointer accent-[#134562]"
                                    />
                                </td>
                                <td className="px-4 py-3 flex items-center gap-3">
                                    <img
                                        src={booking.avatar}
                                        alt={booking.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                        <p className="text-[#000000] font-medium">{booking.name}</p>
                                        <p className="text-xs text-[#000000]">{booking.office}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[#000000]">{booking.space}</td>
                                <td className="px-4 py-3 text-[#000000]">{booking.date}</td>
                                <td className="px-4 py-3 text-[#000000]">{booking.time}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 flex gap-4 items-center">
                                    <button className="text-sm text-black hover:underline">
                                        View details
                                    </button>
                                    <button>
                                        <img src="/images/edit.png" className="w-5 h-5 text-gray-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
            {/* Pagination */}

            <div className="flex items-center justify-between p-2 mt-4 text-sm text-[#000000]">
                <span>
                    {start + 1}-{Math.min(start + ITEMS_PER_PAGE, bookings.length)} of{" "}
                    {bookings.length}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded hover:bg-gray-100 disabled:text-gray-300"
                    >
                        &lt;
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-2 py-1 rounded ${currentPage === i + 1
                                ? "bg-gray-200 text-gray-900"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 text-[#000000] rounded hover:bg-gray-100 disabled:text-gray-300"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </>
    );
}
