import React, { useState } from 'react';
import { format, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdminModal from '../admin/components/AdminModal';
import AddMeetingDetails from './AddMeetingDetails';

const hours = Array.from({ length: 21 }, (_, i) => {
    const hour = 8 * 60 + i * 30;
    const h = Math.floor(hour / 60);
    const m = hour % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const label = `${((h + 11) % 12 + 1).toString().padStart(2, '0')}:${m === 0 ? '00' : m} ${ampm}`;
    return { label, hour: h, minute: m };
});

const bookedSlots = [
    {
        title: 'Huddle Room 2',
        description: 'Design Brainstorm – Product Team',
        from: '2025-04-05T08:00:00',
        to: '2025-04-05T09:30:00',
    },
    {
        title: 'Huddle Room 1',
        description: 'Engineering team',
        from: '2025-04-05T15:00:00',
        to: '2025-04-05T16:30:00',
    },
];

const DayViewCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const filteredSlots = bookedSlots.filter(slot => {
        const slotDate = new Date(slot.from);
        return isSameDay(slotDate, selectedDate);
    });

    const startOfSelectedMonth = startOfMonth(selectedDate);
    const endOfSelectedMonth = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({
        start: startOfSelectedMonth,
        end: endOfSelectedMonth,
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState<{ hour: number; minute: number } | null>(null);

    const handleRowClick = (hour: number, minute: number) => {
        setSelectedTime({ hour, minute });
        setShowModal(true);
    };

    return (
        <div className="bg-white rounded-[16px] border w-full">
            <div className="p-4 border-b">
                {/* Header */}
                <div className="flex justify-between mb-4 items-center">
                    <div>
                        <div className="text-sm font-medium">
                            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
                        </div>
                        <div className="text-xs text-gray-500">{format(selectedDate, 'MMMM dd, yyyy')}</div>
                    </div>
                </div>

                {/* Month and day scroll bar */}
                <div className="flex items-center justify-between mb-2">
                    <button className='p-2 bg-[#FAFAFA] ' onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>
                        <ChevronLeft size={16} />
                    </button>
                    <div className="text-sm font-medium">{format(selectedDate, 'MMMM yyyy')}</div>
                    <button className='p-2 bg-[#FAFAFA]' onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {daysInMonth.map((day, index) => {
                        const isSelected = isSameDay(day, selectedDate);
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(day)}
                                className={`w-10 h-10 rounded-full text-sm flex items-center justify-center transition-all
                  ${isSelected ? 'sect text-black ' : isToday(day) ? 'text-black' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Grid */}
            <div className="relative grid grid-cols-[100px_1fr] rounded overflow-hidden">
                {hours.map((time, i) => (
                    <React.Fragment key={i}>
                        {/* Time label */}
                        <div className="h-12 border-t border-r text-xs text-black px-4 flex items-center justify-center">
                            {time.label}
                        </div>

                        {(() => {
                            const isBooked = filteredSlots.some(slot => {
                                const start = new Date(slot.from);
                                const end = new Date(slot.to);
                                const slotMin = time.hour * 60 + time.minute;
                                const startMin = start.getHours() * 60 + start.getMinutes();
                                const endMin = end.getHours() * 60 + end.getMinutes();
                                return slotMin >= startMin && slotMin < endMin;
                            });

                            return (
                                <div
                                    onClick={!isBooked ? () => handleRowClick(time.hour, time.minute) : undefined}
                                    className={`h-12 border-t relative border transition-all ${isBooked
                                        ? ' cursor-not-allowed'
                                        : 'hover:border-[#134562]  cursor-pointer'
                                        }`}
                                />
                            );
                        })()}

                    </React.Fragment>
                ))}

                {/* Booked Slot Rendering */}
                {filteredSlots.map((slot, i) => {
                    const start = new Date(slot.from);
                    const end = new Date(slot.to);
                    const startMin = start.getHours() * 60 + start.getMinutes();
                    const endMin = end.getHours() * 60 + end.getMinutes();
                    const top = ((startMin - 480) / 30) * 48;
                    const height = ((endMin - startMin) / 30) * 48;

                    return (
                        <div
                            key={i}
                            className="absolute left-[92px] px-2"
                            style={{ top: `${top}px`, height: `${height}px` }}
                        >
                            <div className="bg-gray-100 border-l-4 flex  pt-[31px] pb-[59px] pl-[31px] w-[300px] justify-center flex-col border-[#16B364] h-full text-xs shadow-sm">
                                <div className="font-[400] text-[16px] mb-[8px] text-black ">{slot.title}</div>
                                <div className="font-[400] text-[16px] mb-[8px]">{format(start, 'hh:mm a')} - {format(end, 'hh:mm a')}</div>
                                <div className="font-[400] text-[16px] ">{slot.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AdminModal show={showModal} onClose={() => setShowModal(false)} maxWidth="max-w-[583px]">
                <AddMeetingDetails
                    onClose={() => setShowModal(false)}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                />
            </AdminModal>
        </div>
    );
};

export default DayViewCalendar;
