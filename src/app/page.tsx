'use client';
import React from 'react';
import { FileText, Zap, Download, CheckCircle, Star, ArrowRight } from 'lucide-react';
export default function Home() {
  const handleClick = () => {
    window.location.href = "/auth/register"
  };
  return (
    <div className="min-h-screen flex flex-col my-gradient " >

      <main className="flex-grow" dir="rtl">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              اصنع سيرتك الذاتية الاحترافية
              <br />
              <span className="text-blue-400">في دقائق معدودة</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              قوالب جاهزة ومصممة باحترافية تساعدك على إبراز مهاراتك وخبراتك بشكل مميز يجذب أصحاب العمل
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center gap-2 transition w-full sm:w-auto justify-center">
                <ArrowRight className="w-5 h-5" />
                ابدأ الآن
              </button>
              <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition w-full sm:w-auto">
                شاهد القوالب
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A2035] p-8 rounded-xl text-center border border-gray-800">
              <div className="text-4xl font-bold text-blue-400 mb-2">50,000+</div>
              <div className="text-gray-300">سيرة ذاتية تم إنشاؤها</div>
            </div>
            <div className="bg-[#1A2035] p-8 rounded-xl text-center border border-gray-800">
              <div className="text-4xl font-bold text-blue-400 mb-2">30+</div>
              <div className="text-gray-300">قالب احترافي</div>
            </div>
            <div className="bg-[#1A2035] p-8 rounded-xl text-center border border-gray-800">
              <div className="text-4xl font-bold text-blue-400 mb-2">98%</div>
              <div className="text-gray-300">رضا العملاء</div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              نوفر لك كل ما تحتاجه لإنشاء سيرة ذاتية متميزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#1A2035] p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">سريع وسهل</h3>
              <p className="text-gray-400">
                أنشئ سيرتك الذاتية في أقل من 10 دقائق باستخدام واجهة بسيطة وسهلة الاستخدام
              </p>
            </div>

            <div className="bg-[#1A2035] p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">قوالب احترافية</h3>
              <p className="text-gray-400">
                اختر من بين أكثر من 30 قالب مصمم بواسطة خبراء التوظيف
              </p>
            </div>

            <div className="bg-[#1A2035] p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">تحميل فوري</h3>
              <p className="text-gray-400">
                قم بتحميل سيرتك الذاتية بصيغة PDF بجودة عالية وجاهزة للطباعة
              </p>
            </div>

          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              كيف يعمل الموقع؟
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              ثلاث خطوات بسيطة للحصول على سيرة ذاتية احترافية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">اختر القالب</h3>
              <p className="text-gray-400">
                اختر القالب الذي يناسب مجالك المهني من بين عشرات القوالب المتاحة
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">أدخل معلوماتك</h3>
              <p className="text-gray-400">
                املأ البيانات الخاصة بك بسهولة باستخدام النماذج الذكية
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">حمّل وأرسل</h3>
              <p className="text-gray-400">
                حمّل سيرتك الذاتية بصيغة PDF وابدأ في التقديم على الوظائف فوراً
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-20">
          <div className=" rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              جاهز لبدء رحلتك المهنية؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف المستخدمين الذين حصلوا على وظائف أحلامهم بفضل سيرهم الذاتية الاحترافية
            </p>
            <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white text-[#0A0F1F] cursor-pointer px-8 py-4 rounded-lg text-lg font-semibold transition">
              ابدأ الآن
            </button>
          </div>
        </section>
      </main>

    </div>
  );
}