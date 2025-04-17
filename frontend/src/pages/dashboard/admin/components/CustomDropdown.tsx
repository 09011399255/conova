import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { Fragment } from 'react';

interface Option {
    label: string;
    value: string;
}

export default function CustomDropdown({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    rounded = true
}: {
    value: string;
    onChange: (val: string) => void;
    options: Option[];
    placeholder?: string;
    rounded?: boolean;
}) {
    const selected = options.find(opt => opt.value === value) || { label: placeholder, value: '' };

    return (
        <div className="relative w-full min-w-0">
            <Listbox value={value} onChange={onChange}>
                {({ open }) => (
                    <>
                        <Listbox.Button
                            className={`w-full px-4 py-[10px] flex items-center justify-between text-sm
                                ${rounded ? 'rounded-[8px]' : 'rounded-md'}
                                bg-white outline-none transition-all
                                ${value
                                    ? 'border-2 border-[#292524] text-[#000000]' // selected state
                                    : 'border border-[#DCDFE3] text-[#A5A8B5]'   // placeholder/default
                                }`}
                        >
                            <span>{selected.label}</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''
                                    } ${value ? 'text-[#000000]' : 'text-[#A5A8B5]'}`}
                            />
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            show={open}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 -translate-y-2"
                        >
                            <Listbox.Options
                                className="absolute z-50 mt-1 w-full min-w-full bg-white border border-gray-200 rounded-[8px] custom-scrollbar max-h-[200px] overflow-y-auto text-sm"
                            >
                                {options.map(opt => (
                                    <Listbox.Option
                                        key={opt.value}
                                        value={opt.value}
                                        className={({ active }) =>
                                            `cursor-pointer rounded-[3px] z-100 border-b border-[#DCDFE3] px-4 py-4 ${active ? 'bg-[#134562] text-white' : 'text-black'
                                            }`
                                        }
                                    >
                                        {opt.label}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </>
                )}
            </Listbox>
        </div>
    );
}
