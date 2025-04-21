import { useEffect, useState } from "react";
import AdminModal from "../admin/components/AdminModal";
import { Search } from "lucide-react";
import CustomDropdown from "../admin/components/CustomDropdown";
import { motion } from "framer-motion";
const locationOptions = [
    { label: 'Constain Office', value: 'constain' },
    { label: 'Berger Office', value: 'berger' },
    { label: 'Festac Office', value: 'festac' },
    { label: 'Lekki Office', value: 'lekki' },
];

const workspaceAreaOptions = [
    { label: 'Meeting Room', value: 'meeting' },
    { label: 'Open Desks', value: 'desks' },
    { label: 'Private Office', value: 'private' },
];

const teamData = {
    "My team": [
        { id: 1, name: "Jaylon Bothman", role: "UX designer", avatar: "/images/avatar1.png" },
        { id: 2, name: "Bethany Hall", role: "UX researcher", avatar: "/images/avatar2.png" },
        { id: 3, name: "Jolie Noah", role: "Frontend dev", avatar: "/images/avatar3.png" },
        { id: 4, name: "Maya Smith", role: "Backend dev", avatar: "/images/avatar4.png" },
        { id: 5, name: "Leo Walker", role: "DevOps engineer", avatar: "/images/avatar5.png" },
        { id: 6, name: "Aria Johnson", role: "Product Manager", avatar: "/images/avatar6.png" },
        { id: 7, name: "Noah Lee", role: "Sales Lead", avatar: "/images/avatar7.png" },
    ],
    Engineering: [
        { id: 8, name: "Maya Smith", role: "Backend dev", avatar: "/images/avatar7.png" },
        { id: 9, name: "Leo Walker", role: "DevOps engineer", avatar: "/images/avatar5.png" },
        { id: 10, name: "Aria Johnson", role: "Product Manager", avatar: "/images/avatar6.png" },
    ],
    Product: [
        { id: 11, name: "Aria Johnson", role: "Product Manager", avatar: "/images/avatar6.png" },
        { id: 12, name: "Jaylon Bothman", role: "UX designer", avatar: "/images/avatar1.png" },
        { id: 13, name: "Bethany Hall", role: "UX researcher", avatar: "/images/avatar2.png" },
        { id: 14, name: "Jolie Noah", role: "Frontend dev", avatar: "/images/avatar3.png" },
    ],
    Sales: [
        { id: 15, name: "Noah Lee", role: "Sales Lead", avatar: "/images/avatar7.png" },
        { id: 16, name: "Emma Brown", role: "Sales Associate", avatar: "/images/avatar8.png" },
        { id: 17, name: "Liam Davis", role: "Sales Manager", avatar: "/images/avatar9.png" },
        { id: 18, name: "Sophia Wilson", role: "Sales Executive", avatar: "/images/avatar10.png" },
        { id: 19, name: "Olivia Martinez", role: "Sales Coordinator", avatar: "/images/avatar11.png" },

    ],
};

const AddTeamMembers = ({
    setStep,
    setShowModalContinue,
    showModalContinue,
    onClose,
}: {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setShowModalContinue: React.Dispatch<React.SetStateAction<boolean>>;
    showModalContinue: boolean;
    onClose: () => void;
}) => {
    const [activeTabType, setActiveTabType] = useState<"My team" | "Engineering" | "Product" | "Sales">("My team");

    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

    const toggleMember = (id: number) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };



    useEffect(() => {
        const storedTabType = localStorage.getItem("activeTabType") as "My team" | "Engineering" | "Product" | "Sales";
        if (storedTabType) {
            setActiveTabType(storedTabType);
        }
    }, []);
    return (
        <AdminModal show={showModalContinue} onClose={onClose} maxWidth="max-w-[700px]">
            <div className="flex justify-between items-start ">
                <div>
                    <h2 className="text-[20px] font-[700] text-black">Add Team Members</h2>
                    <p className="text-[#A5A8B5] text-[14px] font-[400]">Click to add team members</p>
                </div>

                <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-[30px] mb-[28px] border-b border-[#DCDFE3] px-[8px] pt-[12px] pb-[16px]">
                {selectedMembers.map((id) => {
                    const allMembers = Object.values(teamData).flat();
                    const member = allMembers.find((m) => m.id === id);
                    if (!member) return null;
                    return (
                        <div key={id} className="flex items-center gap-2 bg-[#FAFAFA] border border-[#DCDFE3] rounded-[8px] px-1">
                            <img src={member.avatar} className="w-6 h-6 rounded-full" />
                            <span className="text-sm text-[#333]">{member.name}</span>
                            <button onClick={() => toggleMember(id)} className="text-black text-[22px]">×</button>
                        </div>
                    );
                })}
            </div>

            <div className="relative flex border-b border-gray-200 mb-[26px]">
                {["My team", "Engineering", "Product", "Sales"].map((tab) => {
                    const isActive = activeTabType === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTabType(tab as "My team" | "Engineering" | "Product" | "Sales");
                                localStorage.setItem("activeTabType", tab);
                            }}
                            className={`relative  px-4 pb-2 text-sm font-medium transition-colors duration-200 ${isActive
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

            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                <div className="flex-2 w-full">
                    <div className="flex items-center justify-center gap-2 border border-[#DCDFE3] px-4 py-[14px] rounded-[100px]">
                        <Search className="w-4 h-4 text-[#A5A8B5]" />
                        <input
                            type="text"
                            placeholder="Search by name or role"
                            className="bg-transparent outline-none text-[#A5A8B5] text-sm flex-1 placeholder-[#A5A8B5]"
                        />
                    </div>
                </div>
                <CustomDropdown
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    options={locationOptions}
                    placeholder="Availability"
                />
                <CustomDropdown
                    value={selectedWorkspace}
                    onChange={setSelectedWorkspace}
                    options={workspaceAreaOptions}
                    placeholder="Role"
                />

            </div>

            <div className="mt-8">
                <motion.div
                    key={activeTabType}
                    initial={{ opacity: 0, x: activeTabType === "My team" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTabType === "My team" ? 20 : -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        {teamData[activeTabType].map((member) => (
                            <div
                                key={member.id}
                                onClick={() => toggleMember(member.id)}
                                className="flex  items-center gap-3 px-2 py-1  border border-[#DCDFE3] rounded-lg cursor-pointer hover:shadow transition-all"
                            >
                                <img src={member.avatar} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-[#A5A8B5]">{member.role}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(member.id)}
                                    className="form-checkbox w-5 h-5 cursor-pointer accent-[#134562]"
                                />
                            </div>
                        ))}
                    </div>

                </motion.div>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={() => {
                        setShowModalContinue(false);
                        setStep(4); // or whatever the next step is
                    }}
                    className="bg-[#134562] text-white font-[500] text-[14px] px-6 py-2 rounded-[4px]"
                >
                    Continue
                </button>
            </div>


        </AdminModal>
    )
}

export default AddTeamMembers