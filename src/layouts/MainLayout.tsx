import {
  BarChart3,
  Bell,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { alerts } from '../data/mockData';

const MainLayout: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const user = state.user;
  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Care Plans', path: '/care-plans', icon: ClipboardList },
    { name: 'Messages', path: '/messages', icon: MessageCircle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar for mobile */}
      <div
        className={`${
          sidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden'
        } lg:hidden`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>

        {/* Sidebar panel */}
        <div
          className={`relative max-w-xs w-full h-full bg-white shadow-xl flex flex-col transform transition ease-in-out duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={closeSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-shrink-0 px-4 py-6 flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-emerald-600 text-xl font-bold">
                LifeChef Health
              </span>
            </Link>
          </div>

          <div className="flex-1 mt-5 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={closeSidebar}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0`}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-center">
                <Link to="/dashboard" className="flex items-center">
                  <span className="text-emerald-600 text-xl font-bold">
                    <img src="https://www.lifechef.com/assets/frozen/logo-health.svg" alt="LifeChef Health Logo" className="h-15 w-auto" />
                    
                  </span>
                </Link>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            {/* {user && (
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="sm"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.role === 'clinician' ? 'Clinician' : 'Care Team'}</p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 lg:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Member Improvement Plan
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                  {unreadAlertsCount > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadAlertsCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      {alerts.filter(alert => !alert.isRead).length === 0 ? (
                        <div className="px-4 py-6 text-sm text-gray-500 text-center">
                          No new notifications
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto">
                          {alerts
                            .filter(alert => !alert.isRead)
                            .slice(0, 5)
                            .map(alert => (
                              <div
                                key={alert.id}
                                className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                                role="menuitem"
                              >
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                                  <p className="text-xs text-gray-500">
                                    {formatNotificationTime(alert.timestamp)}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                      <div className="border-t border-gray-100 px-4 py-2">
                        <Link
                          to="/patients"
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all alerts
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center">
                      {user && (
                        <>
                          <Avatar
                            src={user.avatar}
                            alt={user.name}
                            size="sm"
                          />
                          <span className="ml-2 text-gray-700 hidden md:inline-block">
                            {user.name}
                          </span>
                          <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500 truncate">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;