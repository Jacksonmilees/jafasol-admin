import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDownIcon, BellIcon, NotificationIcon as MegaphoneIcon } from '../icons/Icons';
import { ActiveView, SystemAlert, Announcement, AlertLevel } from '../../types';
import { MOCK_ANNOUNCEMENTS, MOCK_SYSTEM_ALERTS } from '../../constants';


interface HeaderProps {
    onLogout: () => void;
    setActiveView: (view: ActiveView) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, setActiveView }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const recentNotifications = useMemo(() => {
    const alerts = MOCK_SYSTEM_ALERTS.map(a => ({...a, type: 'alert'}));
    const announcements = MOCK_ANNOUNCEMENTS.map(a => ({...a, type: 'announcement'}));
    // Simple combination for demo purposes. A real app would sort by a real timestamp.
    return [...alerts.slice(0,3), ...announcements.slice(0,2)].slice(0, 5);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, notificationRef]);

  const handleLinkClick = (view: ActiveView) => {
    setActiveView(view);
    setIsDropdownOpen(false);
  }
  
  const handleNotificationClick = (view: ActiveView) => {
    setActiveView(view);
    setIsNotificationOpen(false);
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Search Bar */}
          <div className="flex-1 flex">
            <div className="w-full flex md:ml-0">
              <label htmlFor="search-field" className="sr-only">Search</label>
              <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input id="search-field" className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search schools, users..." type="search" name="search" />
              </div>
            </div>
          </div>
          
          {/* Right side */}
          <div className="ml-4 flex items-center md:ml-6">
             {/* Notifications Dropdown */}
            <div className="relative" ref={notificationRef}>
                 <button onClick={() => setIsNotificationOpen(prev => !prev)} className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" />
                 </button>
                 {isNotificationOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 md:w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="p-2 border-b">
                            <h3 className="text-md font-semibold text-gray-800 px-2">Notifications</h3>
                        </div>
                        <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {recentNotifications.map((item) => {
                                const isAlert = item.type === 'alert';
                                const alert = item as SystemAlert & {type: string};
                                const announcement = item as Announcement & {type: string};
                                
                                return (
                                <li key={item.id} className="p-3 hover:bg-gray-50">
                                    <div className="flex space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className={`rounded-full p-2 ${isAlert ? 'bg-red-100' : 'bg-indigo-100'}`}>
                                                {isAlert ? <BellIcon className="h-5 w-5 text-red-500" /> : <MegaphoneIcon className="h-5 w-5 text-primary" />}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{isAlert ? alert.description : announcement.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{isAlert ? alert.timestamp : announcement.sentAt}</p>
                                        </div>
                                    </div>
                                </li>
                                )
                            })}
                        </ul>
                        <div className="p-2 border-t bg-gray-50 rounded-b-md">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('notifications');}} className="block text-center text-sm font-medium text-primary hover:underline">
                                View all notifications
                            </a>
                        </div>
                    </div>
                 )}
            </div>

            {/* Profile dropdown */}
            <div className="ml-3 relative" ref={dropdownRef}>
              <div>
                <button 
                  type="button" 
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                  id="user-menu-button" 
                  aria-expanded={isDropdownOpen} 
                  aria-haspopup="true"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                >
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src="https://picsum.photos/seed/admin/40/40" alt="Admin" />
                  <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">Super Admin</span>
                  <ChevronDownIcon className="hidden md:block h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              {isDropdownOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                  role="menu" 
                  aria-orientation="vertical" 
                  aria-labelledby="user-menu-button" 
                  tabIndex={-1}
                >
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('settings'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex={-1}>
                    System Settings
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex={-1}>
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;