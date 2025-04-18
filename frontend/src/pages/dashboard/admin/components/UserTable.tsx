import { Trash2 } from "lucide-react";

const users = [
    {
        id: 1,
        name: "Bethany Hall",
        email: "bethanyhall@conova.com",
        role: "Manager",
        status: "Active",
        avatar: "/images/avatar1.png",
    },
    {
        id: 2,
        name: "Aaron Gayle",
        email: "aarongayle@conova.com",
        role: "Admin",
        status: "Active",
        avatar: "/images/avatar2.png",
    },
    {
        id: 3,
        name: "Jolie Noah",
        email: "jolienoah@conova.com",
        role: "Employee",
        status: "Active",
        avatar: "/images/avatar3.png",
    },
    {
        id: 4,
        name: "Kaiya Culhane",
        email: "kaiyaculhane@conova.com",
        role: "Learner",
        status: "Inactive",
        avatar: "/images/avatar4.png",
    },
    {
        id: 5,
        name: "Jaxson Vaccaro",
        email: "jaxsonvaccaro@conova.com",
        role: "Learner",
        status: "Invited",
        avatar: "/images/avatar5.png",
    },
];

const UserTable = () => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-[#EDFCF2] text-[#16B364]";
            case "Inactive":
                return "bg-[#DCDFE3] text-[#A5A8B5]";
            case "Invited":
                return "bg-[#FEFDF0] text-[#EAAA08]";
            default:
                return "bg-[#DCDFE3] text-[#A5A8B5]";
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 overflow-hidden custom-scrollbar mt-4 overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm text-left bg-white">

                <thead className="bg-[#FAFAFA] text-[14px] font-[100] text-black">
                    <tr>

                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email Address</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t text-black cursor-pointer hover:bg-gray-50">

                            <td className="px-4 py-3 flex items-center gap-3">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <span>{user.name}</span>
                            </td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                    <span>{user.role}</span>
                                    <svg className="w-3 h-3 ml-1" viewBox="0 0 10 6" fill="none">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" />
                                    </svg>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 flex gap-4">
                                <button className="text-gray-600 hover:text-blue-600 mt-[-33px]">
                                    <img src="/images/edit.png" className="w-4 h-4" />
                                </button>
                                <button className="text-red-500 hover:text-red-700 mt-[-33px]">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
