import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, DollarSign, PlusCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/assets/my-assets', icon: Package, text: 'My Assets' },
    { to: '/assets/revenue', icon: DollarSign, text: 'Revenue' },
    { to: '/assets/add-asset', icon: PlusCircle, text: 'Add Asset' },
  ];

  return (
    <aside className="w-64 bg-gray-800 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="mr-2" size={20} />
                <span>{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

