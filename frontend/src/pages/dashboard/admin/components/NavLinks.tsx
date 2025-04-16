import { NavLink } from 'react-router-dom';

const navLinks = [
  { name: 'Overview', path: '/dashboard' },
  { name: 'Bookings', path: '/bookings' },
  { name: 'Spaces', path: '/spaces' },
  { name: 'Users & Roles', path: '/users-roles' },
  { name: 'Availability', path: '/availability' },
  { name: 'Reports & Analytics', path: '/reports-analytics' },
  { name: 'Integrations', path: '/integrations' },
  { name: 'Settings', path: '/settings' },
];

const NavLinks = () => {
  return (
    <div className="mt-[20px] max-860:hidden mb-[31px] flex items-center gap-6  text-[#A5A8B5]">
      {navLinks.map(({ name, path }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `relative transition text-[16px] ${
              isActive
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

export default NavLinks;
