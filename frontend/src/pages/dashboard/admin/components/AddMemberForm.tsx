import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(13, 'Phone number must be at least 13 characters'),
    email: z.string().email('Invalid email'),
    role: z.string().min(1, 'Role is required'),
});

type FormValues = z.infer<typeof schema>;

export default function AddMemberForm({ onClose }: { onClose: () => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormValues) => {
        console.log('Form data:', data);
        onClose(); // or handle submission logic here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-[20px] font-[700] text-black">Add New Member</h2>
                    <p className="text-[#A5A8B5] text-[14px] font-[400]">Fill the details below to add a new team member</p>
                </div>

                <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                </button>
            </div>

            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium">Full Name <span className='text-[#EF4444]'>*</span> </label>
                <input
                    {...register('fullName')}
                    placeholder="Enter name"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Phone Number */}
            <div>
                <label className="block text-sm font-medium">Phone Number  <span className='text-[#EF4444]'>*</span></label>
                <input
                    {...register('phone')}
                    placeholder="+234..."
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium">Email Address  <span className='text-[#EF4444]'>*</span></label>
                <input
                    {...register('email')}
                    type="email"
                    placeholder="Enter email address"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Role */}
            <div>
                <label className="block text-sm font-medium">Select Role(s)  <span className='text-[#EF4444]'>*</span></label>
                <select
                    {...register('role')}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    defaultValue=""
                >
                    <option value="" disabled>Choose role</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                </select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-right">
                <button
                    type="submit"
                    className="px-6 py-2 bg-[#134562] text-white rounded-md text-sm hover:bg-[#0f3a4c]"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
