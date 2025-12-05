'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Home, Info, FileText, User, Settings, Edit, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [isLoggedIn,] = useState(false); 
  const anchorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const Logo = '/favicon.ico';
  const userInfo = {
    firstname: 'طارق',
    lastname: 'السيد',
    domainname: 'tareek'
  };

  const pages = [
    { label: 'الرئيسية', path: '/', icon: <Home size={20} /> },
    { label: 'عن الشركة', path: '/about', icon: <Info size={20} /> },
    { label: 'المدونة', path: '/blog', icon: <FileText size={20} /> }
  ];
  const getDisplayName = () => {
    return `${userInfo.firstname || ''} ${userInfo.lastname || ''}`.trim() || 'المستخدم';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        setShowUserOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
    if (!mobileDrawerOpen) {
      setShowUserOptions(false);
    }
  };

  const toggleUserOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowUserOptions(!showUserOptions);
  };

  const UserAvatar = ({ className = "" }) => {
    return (
      <div className={`rounded-full flex items-center justify-center bg-[#34495e] text-white font-bold ${className}`}>
        <User size={20} />
      </div>
    );
  };

  const UserOptionsMenu = ({ onClose }: { onClose: () => void }) => (
    <div className="hidden md:block w-80 max-w-[320px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-[#192A3D] text-white text-center p-6">
        <UserAvatar className="w-14 h-14 mx-auto mb-2 bg-white/20 text-xl" />
        <h3 className="font-semibold text-lg mb-1" style={{ fontFamily: 'cairo' }}>
          {getDisplayName()}
        </h3>
        <p className="text-sm opacity-90" style={{ fontFamily: 'cairo' }}>
          مرحباً بك
        </p>
      </div>

      <div className="py-2" style={{ direction: 'rtl' }}>
        <a
          href={`/`}
          onClick={(e) => {
            e.preventDefault();
            onClose?.();
          }}
          className="flex items-center gap-3 px-6 py-3 hover:bg-blue-50 transition-all duration-200 hover:translate-x-[-4px]"
        >
          <User size={20} className="text-[#192A3D]" />
          <span className="text-gray-800 font-medium" style={{ fontFamily: 'cairo' }}>
            الملف الشخصي
          </span>
        </a>

        <a
          href="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            onClose?.();
          }}
          className="flex items-center gap-3 px-6 py-3 hover:bg-blue-50 transition-all duration-200 hover:translate-x-[-4px]"
        >
          <Settings size={20} className="text-[#192A3D]" />
          <span className="text-gray-800 font-medium" style={{ fontFamily: 'cairo' }}>
            لوحة التحكم
          </span>
        </a>

        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onClose?.();
          }}
          className="flex items-center gap-3 px-6 py-3 hover:bg-blue-50 transition-all duration-200 hover:translate-x-[-4px]"
        >
          <Edit size={20} className="text-[#192A3D]" />
          <span className="text-gray-800 font-medium" style={{ fontFamily: 'cairo' }}>
            تعديل الحساب
          </span>
        </Link>

        <div className="border-t border-gray-200 mx-4 my-2"></div>

        <button
          onClick={() => {
            console.log('Logout clicked');
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-6 py-3 hover:bg-red-50 transition-all duration-200 hover:translate-x-[-4px]"
        >
          <LogOut size={20} className="text-red-500" />
          <span className="text-red-500 font-medium" style={{ fontFamily: 'cairo' }}>
            تسجيل الخروج
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <nav className="bg-[#192A3D] text-white py-3">
      <div className="max-w-7xl mx-auto px-4">
        {}
        <div className="hidden md:flex items-center justify-between">
          <Link href="/" className="transition-transform duration-300 hover:scale-105">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Image src={Logo} alt="Logo" width={32} height={32} />
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <Link
                href="/auth/login"
                className="bg-white text-[#192A3D] px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
                style={{ fontFamily: 'cairo' }}
              >
                تسجيل الدخول
              </Link>
            ) : (
              <div className="relative" ref={anchorRef}>
                <button
                  onClick={toggleUserOptions}
                  className="transition-all duration-300 hover:scale-105 focus:outline-none"
                >
                  <UserAvatar className="w-10 h-10" />
                </button>

                {showUserOptions && (
                  <div
                    ref={menuRef}
                    className="absolute left-0 mt-2 z-50 animate-fadeIn"
                    style={{ direction: 'rtl' }}
                  >
                    <UserOptionsMenu onClose={() => setShowUserOptions(false)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {}
        <div className="flex md:hidden items-center justify-between">
          <Link href="/" className="transition-transform duration-300 hover:scale-105">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Image src={Logo} alt="Logo" width={32} height={32} />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDrawer}
              className="bg-white text-[#192A3D] p-2 rounded-xl transition-all duration-300 hover:rotate-90"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {}
      {mobileDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleDrawer}
          ></div>
          <div
            className={`fixed top-0 left-0 h-full w-3/4 max-w-[250px] bg-[#192A3D] z-50 transform transition-transform duration-300 ${
              mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-6 border-b border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={toggleDrawer}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300 hover:rotate-90"
                >
                  <X size={24} />
                </button>
                <Link href="/" onClick={toggleDrawer}>
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Image src={Logo} alt="Logo" width={32} height={32} />
                  </div>
                </Link>
              </div>

              {isLoggedIn && (
                <div className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl backdrop-blur-xl border border-gray-700/10">
                  <UserAvatar className="w-12 h-12 border-2 border-gray-700/20" />
                  <div>
                    <h3 className="font-semibold text-lg text-[#2c3e50]" style={{ fontFamily: 'cairo' }}>
                      {getDisplayName()}
                    </h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'cairo' }}>
                      مرحباً بك
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="py-4 px-2" style={{ direction: 'rtl' }}>
              {}
              <div className="mb-4">
                {pages.map((page, index) => (
                  <a
                    key={page.label}
                    href={page.path}
                    onClick={toggleDrawer}
                    className="flex items-center justify-end gap-3 px-4 py-3 mb-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:translate-x-2"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <span className="text-white font-semibold" style={{ fontFamily: 'cairo' }}>
                      {page.label}
                    </span>
                    <div className="text-white">
                      {page.icon}
                    </div>
                  </a>
                ))}
              </div>

              <div className="border-t border-white/20 my-6 mx-4"></div>

              {}
              {isLoggedIn ? (
                <>
                  <a
                    href={`/`}
                    onClick={toggleDrawer}
                    className="flex items-center justify-end gap-3 px-4 py-3 mb-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="text-white font-semibold" style={{ fontFamily: 'cairo' }}>
                      الحساب الشخصي
                    </span>
                    <User size={20} className="text-white" />
                  </a>
                  <a
                    href="/dashboard"
                    onClick={toggleDrawer}
                    className="flex items-center justify-end gap-3 px-4 py-3 mb-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="text-white font-semibold" style={{ fontFamily: 'cairo' }}>
                      لوحة التحكم
                    </span>
                    <Settings size={20} className="text-white" />
                  </a>
                </>
              ) : (
                <div className="px-4">
                  <a
                    href="/auth/login"
                    onClick={toggleDrawer}
                    className="flex items-center justify-center gap-3 p-4 bg-[#192A3D] rounded-xl text-white border border-[#192A3D] hover:bg-white/70 hover:shadow-lg transition-all duration-300"
                    style={{ direction: 'rtl' }}
                  >
                    <span className="font-bold text-lg" style={{ fontFamily: 'cairo' }}>
                      تسجيل الدخول
                    </span>
                    <LogOut size={24} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

@import url('https:
        
        * {
          font-family: 'Cairo', sans-serif;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;