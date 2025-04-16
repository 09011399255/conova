import { Bell, Search } from "lucide-react";

const AdminNavbar = () => {
    return (
        <div className="bg-[#134260] text-white px-6 py-4 shadow-md">
            <div className="flex justify-between items-center">
                {/* Left: Logo and Welcome */}
                <div className="flex flex-col gap-1">
                    <img src="/images/logo.png" alt="Logo" className="" />
                    <div className="text-base">
                        Welcome, <span className="text-[#C9C9DF]">Elizabeth</span>
                    </div>
                </div>

                {/* Center: Search */}
                <div className="flex-1 mx-12 max-w-xl">
                    <div className="flex items-center gap-2 bg-[#0D364F] px-4 py-2 rounded-full">
                        <Search className="w-4 h-4 text-white" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none text-white text-sm flex-1 placeholder-white"
                        />
                    </div>
                </div>

                {/* Right: Notification and User Info */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Bell className="w-5 h-5 text-white" />
                        <span className="absolute top-0 right-0 bg-green-500 rounded-full w-2.5 h-2.5" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8">
                            <img src="/images/elizabeth.jpg" alt="Elizabeth" />
                        </div>
                        <div className="text-sm">
                            <div>Elizabeth</div>
                            <div className="text-[#C9C9DF] text-xs">Admin</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Navigation Tabs */}
            <div className="mt-4 flex items-center gap-6 text-sm text-[#C9C9DF]">
                <div className="relative text-white after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-white">
                    Overview
                </div>
                <div>Bookings</div>
                <div>Spaces</div>
                <div>Users & Roles</div>
                <div>Availability</div>
                <div>Reports & Analytics</div>
                <div>Integrations</div>
                <div>Settings</div>
            </div>

            {/* Bottom Right: Last Login */}
            <div className="mt-2 text-xs text-[#C9C9DF] flex justify-end">
                <div>
                    Last Login<br />
                    <span className="text-white">19th April, 2025 • 9:00AM</span>
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;
