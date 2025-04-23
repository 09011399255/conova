import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { Search } from "lucide-react";
import ConnectIntegrationModal from "./ConnectIntegrationModal";
import AdminModal from "./AdminModal";
import IntegrationSuccessModal from "./IntegrationSuccessModal";

export const integrationsData = [
    {
        name: "Slack",
        description: "Get instant notifications and manage bookings right from Slack",
        status: "not_connected",
        category: "Communication Tools",
        icon: "/images/slack.png",
    },
    {
        name: "Google Calendar",
        description: "Sync your meetings and room bookings automatically with Google Calendar",
        status: "not_connected",
        category: "Calendar Tools",
        icon: "/images/google-calender.png",
    },
    {
        name: "Google Meet",
        description: "Automatically add Google Meet links to your room bookings",
        status: "not_connected",
        category: "Video Conferencing",
        icon: "/images/google-meet.png",
    },
    {
        name: "Microsoft Teams",
        description: "Collaborate and communicate with your team in real-time.",
        status: "not_connected",
        category: "Communication Tools",
        icon: "/images/microsoft-teams.png",
    },
    {
        name: "Zoom",
        description: "Automatically add Zoom links to your room bookings",
        status: "not_connected",
        category: "Video Conferencing",
        icon: "/images/zom.png",
    },
    {
        name: "Trello",
        description: "Sync your meetings and bookings with Trello boards and tasks.",
        status: "not_connected",
        category: "Project Management",
        icon: "/images/trello.png",
    },
    {
        name: "ChatGPT",
        description: "Generate ideas, and automate workflows with OpenAI’s assistant",
        status: "not_connected",
        category: "AI Tools",
        icon: "/images/gpt.png",
    },
    {
        name: "Calendly",
        description: "Sync your meetings and room bookings automatically with Calendly",
        status: "connected",
        category: "Calendar Tools",
        icon: "/images/microsoft-teams.png",
    },
    {
        name: "Copilot",
        description: "Get AI-powered assistance across Word, Excel, and more to supercharge your daily tasks",
        status: "connected",
        category: "AI Tools",
        icon: "/images/Copilot.png",
    },
];

const categoryOptions = [
    "All Categories",
    "Calendar Tools",
    "Video Conferencing",
    "AI Tools",
    "Communication Tools",
    "Project Management",
].map((category) => ({ label: category, value: category }));


export default function IntegrationsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedToolName, setSelectedToolName] = useState("");

    const openModal = (toolName: string) => {
        setSelectedToolName(toolName);
        setShowConnectModal(true);
    };
    const handleConnectSuccess = () => {
        setShowConnectModal(false);
        setShowSuccessModal(true);
    };


    const filteredTools =
        selectedCategory === "All Categories"
            ? integrationsData
            : integrationsData.filter((tool) => tool.category === selectedCategory);

    return (
        <div className="max-940:px-[15px] mb-[30px] px-[50px] max-860:px-[10px] font-manrope">
            <div>
                <h2 className="font-[700] text-[20px] text-black mb-[24px]">Integrations and apps</h2>
            </div>
            <div
                className=" px-6 py-4 rounded-[16px] mb-[32px] block md:flex items-center justify-between bg-no-repeat bg-right bg-cover"
                style={{ backgroundImage: "url('/images/bg.png')" }} >
                <div className="">
                    <div className="flex items-start gap-2">
                        <h2 className="text-[30px] md:text-[32px] font-[400] text-white mb-2">
                            Supercharge your workspace
                        </h2>
                        <img src="/images/light.png"  alt="Line" className="" />
                    </div>

                    <p className="text-[16px] font-[400] text-[#A5A8B5] max-w-[500px]">
                        Connect your favorite tools to streamline your workspace management, boost productivity, and keep everything in sync
                    </p>
                </div>

                <div className="flex mt-[30px] md:mt-0 items-center justify-center mr-[80px] md:mr-[100px]">
                    <img src="/images/connect.png" alt="Integrations" className="w-[200px] h-auto" />
                </div>
            </div>


            <div className="block sm:flex justify-between items-center gap-4 mb-6">
                <div className="w-full  sm:w-[300px] md:w-[519px] ">
                    <div className="flex items-center justify-center gap-2 border border-[#DCDFE3] px-4 py-[14px] rounded-[100px]">
                        <Search className="w-4 h-4 text-[#A5A8B5]" />
                        <input
                            type="text"
                            placeholder="Find integrations , apps and more"
                            className="bg-transparent outline-none text-[#A5A8B5] text-sm flex-1 placeholder-[#A5A8B5]"
                        />
                    </div>
                </div>
                <div className="w-full sm:w-[249px] mt-[10px] sm:mt-0">
                    <CustomDropdown
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        options={categoryOptions}
                        placeholder="All Categories"
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                    <div
                        key={tool.name}
                        className="bg-[#FAFAFA]  rounded-[16px] p-5 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-[21px]">
                            <img src={tool.icon} alt={tool.name} className=" mr-4" />
                            <span
                                className={`text-[10px] font-[400] px-3 py-2 rounded-[40px] ${tool.status === "connected"
                                    ? "text-[#16B364] bg-[#EDFCF2]"
                                    : "text-[#10384F] bg-gray-100"
                                    }`}
                            >
                                {tool.status === "connected" ? "Connected" : "Not connected"}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-[16px] font-[500] mb-[8px]">{tool.name}</h3>
                            <p className="text-[14px] font-[400] max-w-[350px] text-[#A5A8B5] mb-[24px]">{tool.description}</p>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <button
                                onClick={() => {
                                    if (tool.status !== "connected") {
                                        openModal(tool.name);
                                    }
                                }}

                                className={`text-[14px] font-[500] w-[145px] px-4 py-2 rounded-[4px] ${tool.status === "connected"
                                    ? "border border-[#A5A8B5] text-[#A5A8B5]"
                                    : "bg-[#134562] text-white hover:bg-[#0f354a]"
                                    }`}
                            >
                                {tool.status === "connected" ? "Manage" : "Connect"}
                            </button>
                            <button>
                                <span className="text-[#134562] font-[500] text-[14px]">Learn more</span>

                            </button>

                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button className="px-4 py-2 border w-[130px] font-[500] text-[#134562] border-[#134562] rounded-[4px] text-[14px] hover:bg-[#134562] hover:text-white">View all</button>
            </div>
            <AdminModal show={showConnectModal} onClose={() => setShowConnectModal(false)}>
                <ConnectIntegrationModal
                    toolName={selectedToolName}
                    onClose={() => setShowConnectModal(false)}
                    onConnectSuccess={handleConnectSuccess}
                />
            </AdminModal>

            <AdminModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                <IntegrationSuccessModal
                    toolName={selectedToolName}
                    onClose={() => setShowSuccessModal(false)}
                />
            </AdminModal>
        </div>
    );
}
