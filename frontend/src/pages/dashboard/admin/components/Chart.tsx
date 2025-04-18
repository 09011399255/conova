import React, { useState } from "react";
import {
    Line
} from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend
);

const Chart: React.FC = () => {
    const [location, setLocation] = useState("Costain Office");

    const data = {
        labels: ["Apr 19", "Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25"],
        datasets: [
            {
                label: "Meeting rooms",
                data: [75, 65, 72, 73, 78, 79, 71],
                borderColor: "#16B364",
                backgroundColor: "#16B364",
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 6,
                fill: false,
            },
            {
                label: "Desks",
                data: [50, 60, 40, 50, 35, 30, 45],
                borderColor: "#134562",
                backgroundColor: "#134562",
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 6,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: "top" as const,
                labels: {
                    usePointStyle: true,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 25,
                },
            },
        },
    };

    return (
        <div className="bg-[#FAFAFA] p-5 rounded-[16px] border border-[#DCDFE3]">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border px-3 py-1 bg-[#fafafa] mb-[10px] md:mb-0 rounded-md text-sm outline-none cursor-pointer"
                >
                    <option>Costain Office</option>
                    <option>London HQ</option>
                    <option>Berlin Hub</option>
                </select>

                <div className="flex items-center mt-[-10px] md:mt-0 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-[#16B364]" />
                        <span>Meeting rooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-[#134562]" />
                        <span>Desks</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0 border p-[6px] border-[#F1F1F4] bg-[#FAFAFB]">
                    <button className="bg-[#134562] text-white text-sm px-4 py-1 rounded-md">Days</button>
                    <button className="text-[#A5A8B5] text-sm px-4 py-1 rounded-md hover:bg-[#134562] hover:text-white">Months</button>
                    <button className="text-[#A5A8B5] text-sm px-4 py-1 rounded-md hover:bg-[#134562] hover:text-white">Year</button>
                </div>
            </div>

            {/* Chart */}
            <Line data={data} options={options} className="cursor-pointer" />
        </div>
    );
};

export default Chart;
