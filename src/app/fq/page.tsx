"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Toast, {
  showToast,
  validateFormWithToast,
} from "../components/Toast/Toast";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0A0F1F] to-[#151B2E] text-right">
      <Toast />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              الأسئلة الشائعة
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              قد تجد إجابة سؤالك هنا
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-15">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-[#1A2035] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                كم من الوقت يستغرق إنشاء السيرة الذاتية؟
              </h3>
              <p className="text-gray-400">
                يمكنك إنشاء سيرة ذاتية احترافية في أقل من 10 دقائق باستخدام
                قوالبنا الجاهزة والنماذج الذكية.
              </p>
            </div>

            <div className="bg-[#1A2035] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                هل يمكنني تعديل السيرة الذاتية بعد إنشائها؟
              </h3>
              <p className="text-gray-400">
                بالتأكيد! يمكنك تعديل سيرتك الذاتية في أي وقت من خلال لوحة
                التحكم الخاصة بك. جميع التعديلات تُحفظ تلقائياً.
              </p>
            </div>

            <div className="bg-[#1A2035] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                ما هي صيغ التحميل المتاحة؟
              </h3>
              <p className="text-gray-400">
                يمكنك تحميل سيرتك الذاتية بصيغة PDF بجودة عالية، جاهزة للطباعة
                والإرسال للشركات.
              </p>
            </div>

            <div className="bg-[#1A2035] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                كيف يمكنني الحصول على الدعم؟
              </h3>
              <p className="text-gray-400">
                يمكنك التواصل معنا عبر واتساب أو البريد الإلكتروني، وسنرد عليك
                في أقرب وقت ممكن خلال ساعات العمل.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
