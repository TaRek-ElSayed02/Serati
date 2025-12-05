'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Home,
  BarChart3,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  User2,
  Briefcase,
  ClipboardList   
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { removeAuthToken, clearAllAuthData } from '../../api/services';

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  link?: string;
  children?: MenuItem[];
}

interface SideBarProps {
  children?: React.ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(() => [
    { name: 'الإحصائيات', icon: BarChart3, link: '/dashboard' },
    {
      name: 'الموقع الرئيسي',
      icon: Home,
      children: [
        { name: 'المستخدمين', icon: User2, link: '/dashboard/users' },
      ],
    },
    {
      name: 'السيرة الذاتية',
      icon: Briefcase,
      children: [
        { name: 'إضافة سيرة ذاتية', icon: PlusCircle, link: '/dashboard/resume' },
        { name: 'السير الذاتية', icon: ClipboardList, link: '/dashboard/cvs' }
      ],
    },
    { name: 'الإعدادات', icon: Settings, link: '/dashboard/settings' }
  ], []);

  useEffect(() => {
    const findActiveItem = (items: MenuItem[]) => {
      for (const item of items) {
        if (item.link === pathname) {
          setActiveItem(item.name);
          return;
        }
        if (item.children) {
          for (const child of item.children) {
            if (child.link === pathname) {
              setActiveItem(child.name);
              return;
            }
          }
        }
      }
    };
    
    findActiveItem(menuItems);
  }, [pathname, menuItems]);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 1200;
      setIsMobile(mobile);
      if (!mobile) {
        setIsCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        !isCollapsed
      ) {
        setIsCollapsed(true);
        setOpenGroups([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenGroups([]);
    }
  };

  const handleItemClick = (itemName: string, link?: string, hasChildren?: boolean) => {
    if (link) {
      setActiveItem(itemName);
      router.push(link);
      if (isMobile) {
        setIsCollapsed(true);
      }
    } else if (hasChildren) {
      setOpenGroups((prev) => {
        if (prev.includes(itemName)) {
          return prev.filter((g) => g !== itemName);
        } else {
          return [itemName];
        }
      });
    }
  };

 const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      console.log(' بدء عملية تسجيل الخروج...');
      
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log(' تم حذف البيانات من localStorage');
      } catch (e) {
        console.warn('localStorage clear failed:', e);
      }
      
      try {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        console.log(' تم حذف الكوكيز');
      } catch (e) {
        console.warn('Cookies clear failed:', e);
      }
      
      try {
        clearAllAuthData();
        removeAuthToken();
        console.log(' تم تنفيذ دوال الحذف الإضافية');
      } catch (e) {
        console.warn('Auth data clear failed:', e);
      }
      
      try {
        await signOut({ 
          redirect: false,
          callbackUrl: '/auth/login'
        });
        console.log(' تم تسجيل الخروج من NextAuth');
      } catch (e) {
        console.warn('NextAuth signout failed:', e);
      }

      try {
        await fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        console.log(' تم تسجيل الخروج من الباكند');
      } catch (e) {
        console.warn('Backend logout failed:', e);
      }

      console.log(' إعادة توجيه المستخدم...');
      router.push('/auth/login');
      
      setTimeout(() => {
        router.refresh();
      }, 500);

    } catch (error) {
      console.error(' Logout error:', error);
      try {
        localStorage.clear();
        document.cookie.split(";").forEach(c => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (e) {
        console.error('Emergency cleanup failed:', e);
      }
      router.push('/auth/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };
const getSidebarWidth = () => {
    if (isMobile) {
      return isCollapsed ? 'w-0' : 'w-22';
    }
    const hasOpenGroups = openGroups.length > 0;
    if (isCollapsed && hasOpenGroups) {
      return 'w-16';
    }
    return isCollapsed ? 'w-16' : 'w-64';
  };

  const getIconSize = () => {
    if (isMobile) return 28;
    return 20;
  };

  return (
    <div className="flex bg-gray-100 relative">
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 bg-[#192A3D]/80 hover:bg-[#192A3D] text-white rounded-full p-2 shadow-lg transition-all duration-200"
        >
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      )}

      <div className={`transition-all duration-300 ease-in-out w-full ${isMobile && !isCollapsed ? 'opacity-30' : 'opacity-100'}`}>
        <div className="p-1">{children}</div>
      </div>

      <div
        ref={sidebarRef}
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out fixed right-0 top-0 h-full z-40 ${getSidebarWidth()} ${
          isMobile && isCollapsed ? 'hidden' : 'block'
        }`}
      >
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -left-4 top-2 bg-[#192A3D]/80 hover:bg-[#192A3D] text-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        )}

        {!isMobile && !isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-end">
              <span className="ml-3 font-bold text-gray-800 text-lg">لوحة التحكم</span>
            </div>
            {session?.user && (
              <div className="mt-2 text-sm text-gray-600 text-right">
                مرحباً، {session.user.name || session.user.email}
              </div>
            )}
          </div>
        )}

        <nav className={`flex-1 py-6 h-[calc(100vh-180px)] ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.name;
              const isGroupOpen = openGroups.includes(item.name);
              const iconSize = getIconSize();

              if (item.children) {
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleItemClick(item.name, undefined, true)}
                      className={`w-full flex items-center justify-center px-3 py-4 rounded-lg transition-all duration-200 group relative ${
                        isGroupOpen ? 'bg-[#192A3D]/50 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                     >
                      <IconComponent
                        size={iconSize}
                        className={`${isGroupOpen ? 'text-white' : 'text-gray-500'}`}
                      />
                      
                      {!isMobile && !isCollapsed && (
                        <>
                          <span className="ml-3 font-medium flex-1 text-right">{item.name}</span>
                          {isGroupOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </>
                      )}

                      {isCollapsed && !isMobile && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20">
                          {item.name}
                          <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
                        </div>
                      )}
                    </button>

                    {isGroupOpen && (
                      <ul className={`mt-2 space-y-1 ${isCollapsed || isMobile ? 'px-0' : 'pl-4'}`}>
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = activeItem === child.name;
                          return (
                            <li key={child.name}>
                              <button
                                onClick={() => handleItemClick(child.name, child.link)}
                                className={`w-full flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                                  isChildActive ? 'bg-[#192A3D]/50 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <ChildIcon
                                  size={iconSize - 2}
                                  className={`${isChildActive ? 'text-white' : 'text-gray-500'}`}
                                />
                                
                                {!isMobile && !isCollapsed && (
                                  <span className="text-sm flex-1 text-right mr-2">{child.name}</span>
                                )}

                                {isCollapsed && !isMobile && (
                                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20">
                                    {child.name}
                                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
                                  </div>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleItemClick(item.name, item.link!)}
                    className={`w-full flex items-center justify-center px-3 py-4 rounded-lg transition-all duration-200 group relative ${
                      isActive ? 'bg-[#192A3D]/50 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent
                      size={iconSize}
                      className={`${isActive ? 'text-white' : 'text-gray-500'}`}
                    />
                    
                    {!isMobile && !isCollapsed && (
                      <span className="ml-3 font-medium flex-1 text-right">{item.name}</span>
                    )}

                    {isCollapsed && !isMobile && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20">
                        {item.name}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-2 absolute bottom-0 w-full bg-white">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center justify-center px-3 py-4 rounded-lg transition-all duration-200 group relative ${
              isLoggingOut 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut 
              size={getIconSize()} 
              className={isLoggingOut ? 'text-gray-400' : 'text-red-500'} 
            />
            
            {!isMobile && !isCollapsed && (
              <span className="font-medium flex-1 text-right mr-3">
                {isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
              </span>
            )}

            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20">
                {isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}