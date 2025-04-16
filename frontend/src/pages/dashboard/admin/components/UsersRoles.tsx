import { useState } from "react";
import { motion } from "framer-motion";
import UserTable from "./UserTable";
import AddMemberForm from "./AddMemberForm";
import AdminModal from "./AdminModal";

const tabs = ["All Users", "User Roles"];

const UsersRoles = () => {
    const [activeTab, setActiveTab] = useState("All Users");
    const [showModal, setShowModal] = useState(false);


    return (
        <div className="max-940:px-[15px] px-[50px] max-860:px-[10px] font-manrope">
            <div className="block md:flex items-center justify-between mb-6 ">
                <div>
                    <h2 className="text-xl font-bold text-black">Users and Roles</h2>
                    <p className="text-[#A5A8B5] text-sm">Invite or manage your organization’s members</p>
                </div>

                <button onClick={() => setShowModal(true)} className="bg-[#134562] mt-[10px] md:mt-0 hover:bg-[#103a4c] text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
                    <img src="/images/add.png" alt="Add" className="w-4 h-4" />
                    Add Members
                </button>
            </div>

            <div className="flex w-full bg-[#f7f7f9] p-2 rounded-md mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-6 py-2  text-sm w-full font-medium transition-colors duration-300 rounded-[4px] ${activeTab === tab ? "bg-[#134562] text-white" : "bg-[#FAFAFB] text-[#A5A8B5]"
                            }`}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="tab-pill"
                                className="absolute inset-0 bg-[#134562] rounded-[4px] z-[-1]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                            />
                        )}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "All Users" ? (
                        <UserTable />
                    ) : (
                        <div className="text-gray-500 text-sm">User roles management coming soon...</div>
                    )}
                </motion.div>
            </div>

            <AdminModal show={showModal} onClose={() => setShowModal(false)}>
                <AddMemberForm onClose={() => setShowModal(false)} />
            </AdminModal>
        </div>
    );
};

export default UsersRoles;
