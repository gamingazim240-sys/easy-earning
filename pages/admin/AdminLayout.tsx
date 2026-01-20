import { useState, useMemo, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);
  const { notifications, markNotificationsAsRead } = useData();

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
            setNotificationOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationToggle = () => {
    const willBeOpen = !isNotificationOpen;
    setNotificationOpen(willBeOpen);
    if (willBeOpen && unreadCount > 0) {
        // Mark as read after a short delay to allow the animation to start
        setTimeout(() => {
            markNotificationsAsRead();
        }, 500);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'fa-solid fa-table-columns' },
    { name: 'Manage Users', path: '/admin/users', icon: 'fa-solid fa-users' },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: 'fa-solid fa-briefcase' },
    { name: 'Manage Submissions', path: '/admin/submissions', icon: 'fa-solid fa-clipboard-check' },
    { name: 'Deposits', path: '/admin/deposits', icon: 'fa-solid fa-arrow-down-to-bracket' },
    { name: 'Withdrawals', path: '/admin/withdrawals', icon: 'fa-solid fa-arrow-up-from-bracket' },
    { name: 'Manage Notices', path: '/admin/notices', icon: 'fa-solid fa-bullhorn' },
    { name: 'Send Bonus', path: '/admin/send-bonus', icon: 'fa-solid fa-hand-holding-dollar' },
    { name: 'Settings', path: '/admin/settings', icon: 'fa-solid fa-gears' },
  ];

  const userLinks = [
    { name: 'User View', path: '/user/dashboard', icon: 'fa-solid fa-arrow-left' }
  ];
  
  const getPageTitle = () => {
    const currentPath = location.pathname;
    const link = navLinks.find(l => l.path === currentPath);
    return link ? link.name : 'Admin Panel';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-800 text-gray-200">
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(false)} className="text-gray-400 lg:hidden">
          <i className="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>
      <nav className="flex-grow p-4 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-gray-700'}`}
          >
            <i className={`${link.icon} w-5 text-center`}></i>
            <span>{link.name}</span>
          </NavLink>
        ))}
         <hr className="my-4 border-gray-700"/>
        {userLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-700"
          >
            <i className={`${link.icon} w-5 text-center`}></i>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );

  const notificationIconMap = {
      deposit: 'fa-arrow-down-to-bracket',
      submission: 'fa-clipboard-check',
      signup: 'fa-user-plus',
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <aside className="hidden lg:block w-64 h-full shadow-lg">
        <SidebarContent />
      </aside>

      <div className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg z-40 transform transition-transform lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 lg:hidden">
              <i className="fa-solid fa-bars fa-lg"></i>
            </button>
            <h1 className="text-xl font-bold text-gray-800">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
                <button onClick={handleNotificationToggle} className="text-gray-600 hover:text-gray-800 relative">
                    <i className="fa-regular fa-bell fa-lg"></i>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                        </span>
                    )}
                </button>
                {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20">
                        <div className="p-3 border-b font-semibold text-gray-700">Notifications</div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? notifications.map(n => (
                                <Link to={n.link} key={n.id} onClick={() => setNotificationOpen(false)} className={`flex items-start space-x-3 p-3 hover:bg-slate-50 transition-colors duration-300 ${!n.isRead ? 'bg-cyan-50' : ''}`}>
                                    <i className={`fa-solid ${notificationIconMap[n.type]} text-gray-400 mt-1`}></i>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">{n.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</p>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-center text-sm text-gray-500 p-4">No new notifications.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
