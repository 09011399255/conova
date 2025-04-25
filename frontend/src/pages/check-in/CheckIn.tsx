import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCheckInUser, postCheckInUser } from "../../api/services/checkInService";


const CheckIn = () => {
    const { personal_token } = useParams<{ personal_token: string }>();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["check-in-user", personal_token],
        queryFn: () => fetchCheckInUser(personal_token!),
        enabled: !!personal_token,
    });

    const mutation = useMutation({
        mutationFn: () => postCheckInUser(personal_token!),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["check-in-user", personal_token],
            });
            setTimeout(() => {
                window.close();
            }, 500);
        },
    });

    if (isLoading) {
        return (
            <div className="bg-[#134562] h-screen font-manrope w-full flex items-center justify-center animate-pulse">
                <p className="text-[20px] font-[700] text-black">Loading employee details...</p>
            </div>
        );
    }

    if (error || !data) {
        const errorMessage = (error as any)?.message?.includes("Invalid or expired QR code")
            ? "Invalid or expired QR code."
            : "Error fetching user.";
        return <div className="bg-[#134562] font-manrope h-screen w-full flex items-center justify-center ">
            <p className="text-[20px] font-[700] text-black">{errorMessage}</p> </div>
    }

    const {
        is_checked,
        user: { full_name, email, profile_picture },
    } = data;

    const profileImage = profile_picture ?? "/images/avatar.jpg";

    return (
        <div className="bg-[#134562] h-[100vh] pt-[50px] relative w-full flex font-manrope flex-col items-center">
            <img src="/images/web.png" alt="Logo" className="w-[180px] pb-[150px] relative z-[50]" />
            <img src="/images/vt1.png" alt="Hero" className="absolute top-0 left-0 w-[150px] opacity-50 z-0" />
            <img src="/images/vt2.png" alt="Hero" className="absolute top-0 right-0 opacity-50 z-0" />

            <div className="flex items-center justify-center z-[10]">
                <div className="bg-white rounded-[16px] py-[24px] px-[60px] w-[350px] text-center space-y-4">
                    <h2 className="text-[20px] font-[700] text-black">Employee details</h2>

                    <div className="flex flex-col items-center space-y-2">
                        <img
                            src={profileImage}
                            alt="Employee avatar"
                            className="w-24 h-24 rounded-full object-cover mb-[20px]" />
                        <h3 className="text-[20px] font-[400] text-black mb-[8px]">{full_name}</h3>
                        <p className="text-[15px] font-[400] text-[#6B6B6B]">{email}</p>
                    </div>

                    <button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        className={`w-full mt-[40px] py-2 rounded-[4px] font-[500] text-[14px] transition-all
                            ${mutation.isPending
                                ? "bg-gray-400 animate-pulse cursor-not-allowed"
                                : is_checked
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-[#134562] hover:bg-[#15405b] text-white"
                            }`}
                    >
                        {mutation.isPending
                            ? is_checked
                                ? "Checking out..."
                                : "Checking in..."
                            : is_checked
                                ? "Check-out"
                                : "Check-in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckIn;
