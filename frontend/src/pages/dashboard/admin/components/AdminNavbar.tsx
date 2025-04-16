import { Bell, Search, ChevronDown } from "lucide-react";
import NavLinks from "./NavLinks";

const AdminNavbar = () => {
    return (
        <div className="bg-[#134260] fixed  top-0 left-0 right-0 text-white max-940:px-[15px] px-[50px] max-860:px-[10px] py-4  overflow-hidden" >
            <div className="absolute top-[10px] left-0 w-[150px] h-full z-0 opacity-50" >
                <img src="/images/vector1.png" alt="Hero" className="w-full  h-full" />

            </div>
            <div className="absolute top-[100px] right-0  h-full z-0 opacity-50" >
                <img src="/images/vector2.png" alt="Hero" className="" />

            </div>

            <div className="flex justify-between items-center relative z-[50]">
                <div className="flex flex-col gap-1">
                    <img src="/images/logo.png" alt="Logo" className="w-[106.3px]" />
                </div>



                {/* Right: Notification and User Info */}
                <div className="flex items-center">
                    <div className="flex-1 mr-[30px] w-[400px] max-860:hidden">
                        <div className="flex items-center justify-center gap-2 border border-[#A5A8B5] px-4 py-[14px] rounded-[100px]">
                            <Search className="w-4 h-4 text-[#A5A8B5]" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent outline-none text-[#A5A8B5] text-sm flex-1 placeholder-[#A5A8B5]"
                            />
                        </div>
                    </div>

                    <div className="relative bg-white max-860:hidden rounded-full mr-[10px] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#A5A8B5] transition duration-200">
                        <img src="/images/drum.png" alt="Notification" className="w-[20px] h-[20px]" />
                        <span className="absolute top-0 right-0 bg-green-500 rounded-full w-2.5 h-2.5" />
                    </div>
                    <div className="flex items-center gap-2 max-860:hidden ">
                        <div className="w-10 h-10">
                            <img src="/images/avatar.png" alt="Elizabeth" className="" />
                        </div>
                        <div className="">
                            <div className="text-[#A5A8B5] text-[14px] font-[600]">Elizabeth</div>
                            <div className="text-[#A5A8B5] text-[12px]">Admin</div>
                        </div>

                        <div className="w-[20px] h-[20px] ml-[15px] flex items-center justify-center cursor-pointer border border-[#FFFFFF] rounded-full transition duration-200">
                            <ChevronDown className=" text-white w-4 mt-[0.9px]" />
                        </div>
                    </div>
                </div>

                <div className="items-center hidden gap-[14px] cursor-pointer max-860:flex ">
                    <div className="relative bg-white rounded-full mr-[10px] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#A5A8B5] transition duration-200">
                        <img src="/images/drum.png" alt="Notification" className="w-[20px] h-[20px]" />
                        <span className="absolute top-0 right-0 bg-green-500 rounded-full w-2.5 h-2.5" />
                    </div>
                    <img src="/images/menu.png" alt="Menu" className="cursor-pointer" />
                </div>

            </div>

            <div className="mt-4 flex items-center justify-between relative z-[50] max-860:hidden">
                <div className="text-[32px] font-[700]">
                    <h1 className="text-white">
                        Welcome, <span className="text-[#A5A8B5]">Elizabeth</span>
                    </h1>

                </div>

                <div className=" text-xs  flex  items-center gap-[12px] justify-center">
                    <img src="/images/wallet.png" alt="Wallet" className="w-[24px] h-[24px] inline-block mr-1" />
                    <div className="#A5A8B5 text-[16px] ">
                        <p className="text-[14px] text-[#A5A8B5]">     Last Login</p>

                        <p className="text-white mt-[10px] ">19th April, 2025 • 9:00AM</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full hidden max-860:block mt-[18px] relative z-[50]">
                <div className="flex items-center justify-center gap-2 border border-[#A5A8B5] px-4 py-[14px] rounded-[100px]">
                    <Search className="w-4 h-4 text-[#A5A8B5]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[#A5A8B5] text-sm flex-1 placeholder-[#A5A8B5]"
                    />
                </div>
            </div>


            <NavLinks />


        </div>
    );
};

export default AdminNavbar;
