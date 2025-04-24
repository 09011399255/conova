import { useState } from "react";
import AdminModal from "../admin/components/AdminModal";
import QRModalContent from "./QrModal";
import { useQuery } from "@tanstack/react-query";
import { getQRCode } from "../../../api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Activities = () => {
    const [showQRModal, setShowQRModal] = useState(false);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["qr-code"],
        queryFn: getQRCode,
        enabled: false, // do not fetch automatically
    });

    const handleShowQR = async () => {
        setShowQRModal(true);
        await refetch();
        console.log("QR Code data:", data);
    };

    const formatDayWithSuffix = (date: Date) => {
        const day = date.getDate();
        const suffix =
            day % 10 === 1 && day !== 11
                ? "st"
                : day % 10 === 2 && day !== 12
                    ? "nd"
                    : day % 10 === 3 && day !== 13
                        ? "rd"
                        : "th";

        const weekday = format(date, "EEEE");
        const month = format(date, "MMM");

        return `${weekday} ${day}${suffix} ${month}`;
    };

    const navigate = useNavigate()
    return (
        <>
            <AdminModal show={showQRModal} onClose={() => setShowQRModal(false)} maxWidth="max-w-[400px]">
                <QRModalContent onClose={() => setShowQRModal(false)} qrCodeUrl={data?.qr_url}
                    isLoading={isLoading}
                    isError={isError} />
            </AdminModal>
            <div

                className={`rounded-[16px] px-[16px] py-[24px] flex flex-col bg-[#134562] gap-2 border `}
            >
                <div className="flex items-center justify-between mb-[16px] ">
                    <span className="text-[16px] font-[400] text-white ">Attendance overview</span>
                    <img src="/images/calender.png" alt="icon" className="w-5 h-5" />
                </div>
                <div className="text-[24px] font-[700]">
                    <span className="text-white text-[24px] font-[700] mr-[2px]">80%</span>
                    <span className="text-[#A5A8B5] text-[14px] font-[700]">This week</span>
                </div>
                <div className=" flex flex-col justify-center items-center mt-[10px]">
                    <span className="text-[#134562] rounded-[4px] px-[6px] py-[4px] bg-[#FFFFFF] text-[10px] font-[400]">+5 %  from last week</span>
                    <div className="relative mt-[-20px]">
                        <img src="/images/path.png" alt="graph" className="" />
                        <img src="/images/dot.png" alt="graph" className="absolute top-[28px] left-[40%]" />

                    </div>
                </div>
            </div>
            <div

                className={`rounded-[16px] px-[16px] py-[24px] flex flex-col gap-2 border `}
            >
                <div className="flex items-center justify-between mb-[16px] ">
                    <span className="text-[16px] font-[600] text-black ">Attendance Status</span>
                    <span className="rounded-[40px] bg-[#FEF2F2] text-[#EF4444] font-[400] text-[10px] px-[8px] py-[5px]">Not checked in</span>
                </div>

                <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center gap-2">
                        <img src="/images/cal2.png" alt="icon" className="w-5 h-5" />
                        <span className="text-[14px] font-[600] text-black">{formatDayWithSuffix(new Date())}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="/images/clock2.png" alt="icon" className="w-5 h-5" />
                        <span className="text-[12px] font-[500] text-black">10:00AM </span>
                    </div>
                </div>

                <button className="bg-[#134562] mt-[26px] text-white rounded-[4px] text-center w-full px-[24px] py-[12px] text-[14px] font-[500]" onClick={handleShowQR}
                >Show QR Code</button>
            </div>
            <div

                className={`rounded-[16px] px-[16px] py-[24px] flex flex-col gap-2 border `}
            >
                <div className="flex items-center justify-between mb-[16px] ">
                    <span className="text-[16px] font-[600] text-black ">Current Seat</span>
                    <span className="rounded-[40px] text-[#134562] change font-[400] text-[10px] px-[22px] py-[5px]">Booked</span>
                </div>

                <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center gap-2">
                        <img src="/images/seat.png" alt="icon" className="w-5 h-5" />
                        <span className="text-[14px] font-[600] text-black">Seat 15c floor 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="/images/clock2.png" alt="icon" className="w-5 h-5" />
                        <span className="text-[12px] font-[500] text-black">10:00AM - 05:00pm</span>
                    </div>
                </div>

                <button className="border border-[#134562] mt-[26px] text-[#134562] hover:bg-[#134562] hover:text-white rounded-[4px] text-center w-full px-[24px] py-[12px] text-[14px] font-[500]" onClick={
                    () => navigate("/dashboard/spaces")
                }>Change Seat</button>
            </div>
            <div

                className={`rounded-[16px] px-[16px] py-[24px] flex flex-col gap-2 border `}
            >
                <div className="flex items-center justify-between mb-[16px] ">
                    <span className="text-[16px] font-[600] text-black ">Next meeting</span>
                    <span className="rounded-[40px] bg-[#EDFCF2] text-[#16B364] font-[400] text-[10px] px-[22px] py-[5px]">Confirmed</span>
                </div>

                <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center gap-2">
                        <img src="/images/conf.png" alt="icon" className="w-5 h-5" />
                        <span className="text-[14px] font-[600] text-black">Conference room 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="/images/clock2.png" alt="icon" className="w-5 h-5" />
                        <span className="text-[12px] font-[500] text-black">10:00AM - 05:00pm</span>
                    </div>
                </div>

                <button className="border border-[#134562] mt-[26px] text-[#134562] hover:bg-[#134562] hover:text-white rounded-[4px] text-center w-full px-[24px] py-[12px] text-[14px] font-[500]">View all</button>
            </div>
        </>)
}

export default Activities