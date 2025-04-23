import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { Eye, EyeOff } from 'lucide-react'
import { RegisterSchema, registerSchema } from '../../../schemas/registerSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AdminModal from '../admin/components/AdminModal'
import EditProfileModal from './EditProfileModal'

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({
        roomUpdates: true,
        emailUpdates: true,
        checkIn: true,
        general: true,
    })

    const [deleteConfirmed, setDeleteConfirmed] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const {
        register,
        // formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });



    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false)


    return (
        <div className="max-940:px-[15px] px-[50px] mb-[30px] max-860:px-[10px] font-manrope">
            {/* Profile */}
            <div className=" mb-[32px]">
                <div>
                    <h1 className='text-[18px] mb-[12px] font-[400]'>Profile settings</h1>
                </div>

                <div className="rounded-[16px] border border-[#DCDFE3] p-4 block md:flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="/images/empl.png"
                            className="h-12 w-12 rounded-full"
                            alt="avatar"
                        />
                        <div>
                            <p className="font-[400] text-[18px]">Saurav Uthman</p>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <img src="/images/email.png" alt="employee" className="h-4 w-4" />
                                <p className="text-[#A5A8B5] font-[400] text-[14px]">sauravuthman@gmail.com</p>

                            </div>
                        </div>

                    </div>

                    <button onClick={() => setShowEditModal(true)} className=" border mt-[20px] md:mt-0 border-[#134562] text-[#134562] font-[500] text-[14px] hover:bg-[#134562] px-4 py-2 rounded hover:text-[#fff]">

                        Edit Profile
                    </button>

                </div>

            </div>

            {/* Notification Settings */}
            <div className="mb-[32px]">
                <div>
                    <h1 className='text-[18px] mb-[12px] font-[400]'>Notification settings</h1>
                </div>
                <div className='rounded-[16px] border border-[#DCDFE3] p-4'>
                    {[
                        {
                            label: 'Room Booking Updates',
                            description: 'Receive alerts when your meeting room is approved, rejected, or modified.',
                            key: 'roomUpdates',
                            icon: '/images/cal3.png',
                        },
                        {
                            label: 'Email Notifications',
                            description: 'Stay updated with booking status and activity via email.',
                            key: 'emailUpdates',
                            icon: '/images/email3.png',
                        },
                        {
                            label: 'Check-in Reminders',
                            description: 'Get reminders before your scheduled check-in time.',
                            key: 'checkIn',
                            icon: '/images/cal3.png',
                        },
                        {
                            label: 'General Notifications',
                            description: 'Enable or mute general activity alerts.',
                            key: 'general',
                            icon: '/images/not.png',
                        },
                    ].map((item) => (
                        <>
                            <div key={item.key} className="flex items-center mb-0 md:mb-[28px] justify-between">
                                <div className="flex items-center md:items-start gap-2">
                                    <div className=' p-[8px] rounded-full bg-[#FAFAFA]'>
                                        <img
                                            src={item.icon}
                                            alt={item.label}
                                            className="h-6 w-6 "
                                        />
                                    </div>
                                    <div>
                                        <p className="font-[400] text-[16px]">{item.label}</p>
                                        <p className="text-[#A5A8B5] hidden md:block font-[400] text-[14px] max-w-[400px]">{item.description}</p>
                                    </div>

                                </div>
                                <Switch
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(val) =>
                                        setNotifications((prev) => ({ ...prev, [item.key]: val }))
                                    }
                                    className={`${notifications[item.key as keyof typeof notifications]
                                        ? "bg-[#134562]"
                                        : "bg-gray-300"
                                        } relative inline-flex h-5 w-10 items-center rounded-full transition-colors`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition 
      ${notifications[item.key as keyof typeof notifications]
                                                ? "translate-x-5"
                                                : "translate-x-1"
                                            }`}
                                    />
                                </Switch>


                            </div>
                            <p className="text-[#A5A8B5] mt-[5px] mb-[10px] block md:hidden font-[400] text-[14px] max-w-[400px]">{item.description}</p>

                        </>
                    ))}
                </div>

            </div>

            {/* Preferences */}
            <div className="mb-[32px]">
                <div>
                    <h1 className='text-[18px] mb-[12px] font-[400]'>Preferences</h1>
                </div>
                <div className='rounded-[16px] border border-[#DCDFE3] p-4'>

                    <div className="grid grid-cols-1 gap-4">
                        <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                                <img src="/images/lang.png" alt="location" className="" />
                                <label className="block font-[400] text-[16px] text-[#A5A8B5]">Language</label>

                            </div>
                            <select className=" border rounded-lg px-3 py-2">
                                <option>English (US)</option>
                                <option>English (UK)</option>
                                <option>French</option>
                            </select>
                        </div>
                        <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                                <img src="/images/zone.png" alt="location" className="" />
                                <label className="block font-[400] text-[16px] text-[#A5A8B5]">Timezone</label>

                            </div>
                            <select className=" border rounded-lg px-3 py-2">
                                <option>UTC +01:00</option>
                                <option>UTC +05:30</option>
                                <option>UTC -08:00</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>

            {/* Password and Security */}
            <div className="mb-[32px]">
                <h1 className='text-[18px] mb-[12px] font-[400]'>Password and Security</h1>
                <div className='rounded-[16px] border border-[#DCDFE3] p-4'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="">
                            <label className="block text-sm ml-[3px]  text-black">
                                Enter Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                                        }`} placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-4 text-[#134562]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                        </div>
                        <div className="">
                            <label className="block text-sm ml-[3px]   text-black">
                                New password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                                        }`} placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-2 top-4 text-[#134562]"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                        </div>
                        <div className="">
                            <label className="block text-sm ml-[3px]  text-black">
                                Confirm  password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 border-[#D7D3D0] text-[#292524] focus:border-[#000000]"
                                        }`} placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    className="absolute right-2 top-4 text-[#134562]"
                                >
                                    {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>


                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="border bg-[#134562] hover:text-white text-white font-[500] text-[14px] px-4 py-2 rounded hover:bg-[#103a4c] mt-[31px]">
                            Update password
                        </button>
                    </div>

                </div>
            </div>



            < div className="" >
                <h1 className='text-[18px] mb-[12px] font-[400]'>Delete Account</h1>

                <div className='rounded-[16px] border border-[#DCDFE3] p-4'>
                    <p className="text-[#A5A8B5] font-[400] text-[15px] max-w-[800px] mb-[20px]">
                        If you delete your account, you will lose access to all Front Account services,
                        and your personal data will be permanently erased. You have 24 days to cancel the
                        deletion if you change your mind.
                    </p>

                    <div className="flex items-center gap-2 mb-[42px]">
                        <input
                            id="confirm"
                            type="checkbox"
                            className="rounded  accent-[#134562] cursor-pointer w-4 h-4 border border-[#DCDFE3]"
                            checked={deleteConfirmed}
                            onChange={() => setDeleteConfirmed(!deleteConfirmed)}
                        />
                        <label htmlFor="confirm" className="text-sm">
                            I confirm that I want to delete my account.
                        </label>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <button
                            className="bg-[#EF4444] w-[140px] font-[500] text-[14px] text-white py-2 rounded disabled:opacity-50"
                            disabled={!deleteConfirmed}
                        >
                            Delete Account
                        </button>
                        <button className=" border w-[140px] border-[#134562] text-[#134562] hover:bg-[#134562] font-[500] text-[14px] px-4 py-2 rounded hover:text-[#fff]">

                            Learn more
                        </button>
                    </div>
                </div>

            </div >

            <AdminModal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="max-w-[500px]">
                <EditProfileModal
                    onClose={() => setShowEditModal(false)}
                    image="/images/empl.png"
                    fullName="Suarau Uthman"
                    email="Suarauuthman@gmail.com" />
            </AdminModal>

        </div >
    )
}
