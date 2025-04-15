import { Listbox, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown } from "lucide-react";

const roles = [
    { label: 'Choose role', value: '' },
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
];

export default function CustomRoleDropdown({
    value,
    onChange,
    error,
}: {
    value: string;
    onChange: (val: string) => void;
    error?: string;
}) {
    const selectedRole = roles.find((r) => r.value === value) || roles[0];

    return (
        <div className='w-full '>
            <label className="block text-sm text-black mb-1">Select Role</label>
            <Listbox value={value} onChange={onChange}>
                {({ open }) => (
                    <div className="relative w-full overflow-visible">
                        <Listbox.Button
                            className={`w-full text-left border px-4 py-2 rounded-md flex items-center justify-between ${error ? 'border-[#EF4444]' : 'border-[#D7D3D0]'} bg-tramsparent `}
                        >
                            <span>{selectedRole.label}</span>
                            <ChevronDown
                                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                            />
                        </Listbox.Button>

                        <Transition
                            as={Fragment}
                            show={open}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 -translate-y-2"
                        >
                            <ListboxOptions className="absolute z-10 left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {roles.map((role) => (
                                    <ListboxOption
                                        key={role.value}
                                        value={role.value}
                                        className={({ active, selected }) =>
                                            `cursor-pointer px-4 py-2 transition duration-150 ${active ? 'bg-[#134562] text-white' : 'text-gray-700'
                                            } ${selected ? 'font-semibold' : ''}`
                                        }
                                    >
                                        {role.label}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                )}
            </Listbox>
            {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
        </div>
    );
}
