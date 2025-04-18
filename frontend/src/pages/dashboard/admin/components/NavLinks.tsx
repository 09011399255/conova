import { NavLink } from 'react-router-dom';
import { useAdmin } from '../../../../contexts/AdminContext';

const navLinks = [
    { name: 'Overview', path: '/dashboard/overview' },
    { name: 'Bookings', path: '/dashboard/bookings' },

    { name: 'Book a seat', path: '/dashboard/spaces', adminOnly: false },
    { name: 'Book a room', path: '/dashboard/book-room', adminOnly: false },

    { name: 'Spaces', path: '/dashboard/spaces', adminOnly: true },
    { name: 'Users & Roles', path: '/dashboard/users-roles', adminOnly: true },
    { name: 'Availability', path: '/dashboard/availability', adminOnly: true },
    { name: 'Reports & Analytics', path: '/dashboard/reports', adminOnly: true },

    { name: 'Integrations', path: '/integrations' },
    { name: 'Settings', path: '/settings' },
];


export const NavLinks = () => {
    const { isAdmin } = useAdmin();

    return (
        <div className="mt-[20px] max-860:hidden mb-[31px] flex items-center gap-6 text-[#A5A8B5]">
            {navLinks
                .filter(link =>
                    link.adminOnly === undefined ||
                    (link.adminOnly && isAdmin) ||
                    (link.adminOnly === false && !isAdmin)
                )
                .map(({ name, path }) => (
                    <NavLink
                        key={name}
                        to={path}
                        className={({ isActive }) =>
                            `relative transition hover:text-white text-[16px] ${isActive
                                ? 'text-white after:absolute after:left-1/2 after:-bottom-[15px] after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-white'
                                : ''
                            }`
                        }
                    >
                        {name}
                    </NavLink>
                ))}
        </div>
    );
};

export const NavLinksMobile = ({ closeSidebar }: { closeSidebar: () => void }) => {
    const { isAdmin } = useAdmin();

    return (
        <div className="flex flex-col gap-[30px] relative justify-center">
            {navLinks
                .filter(link =>
                    link.adminOnly === undefined ||
                    (link.adminOnly && isAdmin) ||
                    (link.adminOnly === false && !isAdmin)
                )
                .map(({ name, path }) => (
                    <NavLink
                        key={name}
                        to={path}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `relative transition hover:text-white text-[#A5A8B5] text-[16px] ${isActive
                                ? 'text-white after:absolute after:left-[20%] after:-bottom-[15px] after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-white'
                                : ''
                            }`
                        }
                    >
                        {name}
                    </NavLink>
                ))}
        </div>
    );
};
