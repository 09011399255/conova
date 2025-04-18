import { useState } from "react";

const roles = ["Employee", "Learner", "Manager", "Admin"];

const permissions = [
    {
        section: "Bookings",
        icon: "/images/bookings.png",
        items: [
            { action: "View own bookings", roles: [true, true, true, true] },
            { action: "Book workspace", roles: [true, true, true, true] },
            { action: "Cancel or reschedule own booking", roles: [true, true, true, true] },
            { action: "Cancel others’ booking", roles: [false, false, true, true] },
            { action: "Approve/reject booking requests", roles: [false, false, true, true] },
            { action: "Override blackout hours", roles: [false, false, false, true] }
        ]
    },
    {
        section: "Workspace & Floor plan",
        icon: "/images/floorplan.png",
        items: [
            { action: "View space list & availability", roles: [true, true, true, true] },
            { action: "View interactive floor plan", roles: [false, false, true, true] },
            { action: "Add/edit workspaces (desks/rooms)", roles: [false, false, false, true] },
            { action: "Set pricing for workspaces", roles: [false, false, false, true] },
            { action: "Configure floor plan visuals", roles: [false, false, false, true] }
        ]
    },
    {
        section: "Users and roles",
        icon: "/images/users.png",
        items: [
            { action: "View users", roles: [false, false, true, true] },
            { action: "Manage own profile & preferences", roles: [true, true, true, true] },
            { action: "Add/edit other users", roles: [false, false, true, true] },
            { action: "Assign/revoke roles", roles: [false, false, false, true] },
            { action: "View activity logs", roles: [false, false, true, true] }
        ]
    },
    {
        section: "Reports & Analytics",
        icon: "/images/reports.png",
        items: [
            { action: "View workspace utilization reports", roles: [false, false, true, true] },
            { action: "View peak booking hours", roles: [false, false, true, true] },
            { action: "Access real-time occupancy dashboards", roles: [false, false, false, true] },
            { action: "Create custom reports", roles: [false, false, false, true] },
            { action: "Export reports", roles: [false, false, false, true] }
        ]
    },
    {
        section: "Notification & Messaging",
        icon: "/images/notifications.png",
        items: [
            { action: "Receive email/SMS booking reminders", roles: [true, true, true, true] },
            { action: "Configure message templates", roles: [false, false, false, true] },
            { action: "Manually send/broadcast messages", roles: [false, false, true, true] }
        ]
    },
    {
        section: "System settings",
        icon: "/images/settings.png",
        items: [
            { action: "View system settings", roles: [false, false, true, true] },
            { action: "Modify user profile (logo, timezone, etc)", roles: [false, false, true, true] },
            { action: "Manage integrations (Google, Zoom, Slack)", roles: [false, false, true, true] },
            { action: "Set blackout dates & default availability", roles: [false, false, false, true] },
            { action: "Perform system backups", roles: [false, false, false, true] }
        ]
    },
    {
        section: "Integrations",
        icon: "/images/integrations.png",
        items: [
            { action: "View connected services", roles: [false, false, true, true] },
            { action: "Connect new integrations", roles: [false, false, true, true] },
            { action: "Configure integration settings", roles: [false, false, false, true] },
            { action: "Disconnect integrations", roles: [false, false, false, true] }
        ]
    }
];

export default function PermissionMatrix() {
    const [matrix, setMatrix] = useState(permissions);

    const toggle = (sIdx: number, pIdx: number, rIdx: number) => {
        setMatrix(prev =>
            prev.map((section, i) =>
                i === sIdx
                    ? {
                        ...section,
                        items: section.items.map((perm, j) =>
                            j === pIdx
                                ? {
                                    ...perm,
                                    roles: perm.roles.map((val, k) => (k === rIdx ? !val : val))
                                }
                                : perm
                        )
                    }
                    : section
            )
        );
    };

    return (
        <div className="overflow-hidden custom-scrollbar mt-4 overflow-x-auto">
            <table className="min-w-[800px] w-full border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-left">
                        <th className="w-1/3 text-black font-[700] text-[16px]">Actions</th>
                        {roles.map(role => (
                            <th key={role} className="text-center text-[16px] font-[400] text-black">{role}</th>
                        ))}
                    </tr>
                </thead>
                <tbody >
                    {matrix.map((section, sIdx) => (
                        <>
                            <tr key={section.section} className="bg-[#FAFAFA] border-2 border-[#DCDFE3] ">
                                <td colSpan={roles.length + 1} className="py-2 pl-[10px] bg-[#FAFAFA] border-b-[1px] border-t-[1px] border-[#DCDFE3]">
                                    <div className="w-full flex items-center gap-2 text-[14px] font-[400] text-[#134562]">
                                        <img src={section.icon} alt="section-icon" className="w-5 h-5" />
                                        {section.section}
                                    </div>
                                </td>
                            </tr>

                            {section.items.map((perm, pIdx) => (
                                <tr key={perm.action} className="">
                                    <td className="py-2 pr-4 text-black font-[400] text-[16px] pl-[10px]">{perm.action}</td>
                                    {perm.roles.map((checked, rIdx) => (
                                        <td key={rIdx} className="text-center ">
                                            <label className="inline-flex cursor-pointer items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggle(sIdx, pIdx, rIdx)}
                                                    className="peer hidden"
                                                />
                                                <span className="w-5 h-5 rounded-[6px] border border-[#DCDFE3] peer-checked:bg-[#134562] peer-checked:border-[#134562] flex items-center justify-center text-white text-xs font-bold">
                                                    ✓
                                                </span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
