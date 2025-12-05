'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
const Footer = () => {
  const logo = '/favicon.ico';
  
  return (
    <footer 
      className="bg-[#192A3D] text-white py-3 fixed bottom-0 left-0 w-full" 
      style={{ zIndex: 1000 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="flex items-center gap-2">
            <p className="mb-0 text-center" style={{ fontFamily: 'cairo' }}>
              بواسطة منصة سيرَتي
            </p>
            <Link href="/" className="inline-block">
              <Image 
                src={logo} 
                alt="لوجو سيرَتي"
                width={44}
                height={44}
                className="w-11 h-11 object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
@import url('https:
        
        * {
          font-family: 'Cairo', sans-serif;
        }
      `}</style>
    </footer>
  );
};

export default Footer;