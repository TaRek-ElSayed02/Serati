"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  const logo = "/favicon.ico";

  const footerLinks = {
    pages: [
      { name: "الرئيسية", href: "/" },
      { name: "عن الشركة", href: "/about" },
      { name: "المدونة", href: "/blog" },
      { name: "اتصل بنا", href: "/contact" },
    ],
    services: [
      { name: "إنشاء سيرة ذاتية", href: "/create" },
      { name: "القوالب", href: "/templates" },
      { name: "الأسعار", href: "/pricing" },
      { name: "الأسئلة الشائعة", href: "/fq" },
    ],
    social: [
      { name: "فيسبوك", href: "#", icon: Facebook },
      { name: "تويتر", href: "#", icon: Twitter },
      { name: "لينكد إن", href: "#", icon: Linkedin },
      { name: "إنستغرام", href: "#", icon: Instagram },
    ],
  };

  return (
    <footer className="bg-[#0A0F1F] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
          dir="rtl"
        >
          <div className="space-y-3">
            <div className="bg-white p-1 rounded-lg inline-block">
              <Link href="/" className="inline-block">
                <Image
                  src={logo}
                  alt="لوجو سيرَتي"
                  width={60}
                  height={60}
                  className="w-15 h-15 object-contain hover:scale-110 transition-transform duration-300"
                />
              </Link>
            </div>
            <h3 className="text-2xl font-bold" style={{ fontFamily: "Cairo" }}>
              منصة سيرَتي
            </h3>
            <p
              className="text-gray-300 text-sm leading-relaxed"
              style={{ fontFamily: "Cairo" }}
            >
              منصتك المثالية لإنشاء سيرة ذاتية احترافية تبرز مهاراتك وخبراتك
              بأفضل شكل ممكن
            </p>
          </div>

          <div>
            <h4
              className="text-lg font-semibold mb-4 text-[#4ECDC4]"
              style={{ fontFamily: "Cairo" }}
            >
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              {footerLinks.pages.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#4ECDC4] transition-colors duration-300 text-sm"
                    style={{ fontFamily: "Cairo" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-lg font-semibold mb-4 text-[#4ECDC4]"
              style={{ fontFamily: "Cairo" }}
            >
              خدماتنا
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#4ECDC4] transition-colors duration-300 text-sm"
                    style={{ fontFamily: "Cairo" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-lg font-semibold mb-4 text-[#4ECDC4]"
              style={{ fontFamily: "Cairo" }}
            >
              تواصل معنا
            </h4>
            <div className="space-y-3">
              <p
                className="text-gray-300 text-sm flex items-center gap-2"
                style={{ fontFamily: "Cairo" }}
              >
                <a
                  href="mailto:info@serati.com"
                  className="flex items-center gap-2"
                >
                  <Mail size={16} className="text-[#4ECDC4]" />
                  info@serati.com
                </a>
              </p>
              <p
                className="text-gray-300 text-sm flex items-center gap-2"
                style={{ fontFamily: "Cairo" }}
              >
                <a href="tel:+201558166468" className="flex items-center gap-2">
                  <Phone size={16} className="text-[#4ECDC4]" />
                  +201558166468
                </a>
              </p>

              <div className="flex gap-3 mt-4">
                {footerLinks.social.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-[#2d3561] hover:bg-[#4ECDC4] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      aria-label={social.name}
                    >
                      <IconComponent size={20} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 my-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm" style={{ fontFamily: "Cairo" }}>
            © {new Date().getFullYear()} منصة سيرَتي. جميع الحقوق محفوظة
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-[#4ECDC4] text-sm transition-colors"
              style={{ fontFamily: "Cairo" }}
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-[#4ECDC4] text-sm transition-colors"
              style={{ fontFamily: "Cairo" }}
            >
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
