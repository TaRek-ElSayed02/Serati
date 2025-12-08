'use client';
import React from 'react';
import { FileText, Users, Zap, CheckCircle, Shield, Palette, Layout, Settings } from 'lucide-react';

import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

export default function About() {
const handleClick = () => {
    window.location.href = "/auth/register"
};
    
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0A0F1F] to-[#151B2E] text-right">
      <Navbar />
      
      <main className="flex-grow" dir="rtl">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              من نحن؟
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              نحن منصة متخصصة في مساعدة الباحثين عن عمل على إنشاء سير ذاتية احترافية بطريقة سهلة وبسيطة. 
              هدفنا هو تمكينك من الحصول على الوظيفة التي تحلم بها من خلال سيرة ذاتية متميزة تبرز مهاراتك وخبراتك
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-[#1A2035] rounded-2xl p-8 md:p-12 border border-gray-800">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">قصتنا</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                بدأت فكرة CV Builder من تجربة شخصية واجهها مؤسسونا أثناء البحث عن عمل. لاحظنا أن الكثير من الأشخاص الموهوبين يفقدون فرصاً وظيفية رائعة بسبب سير ذاتية غير احترافية أو سيئة التنسيق.
              </p>
              <p>
                قررنا أن نبني حلاً يجعل إنشاء السيرة الذاتية أمراً سهلاً ومتاحاً للجميع. منصة لا تحتاج إلى خبرة في التصميم أو مهارات تقنية معقدة. فقط بيانات بسيطة، وفي دقائق تحصل على سيرة ذاتية احترافية جاهزة للتحميل والإرسال.
              </p>
              <p>
                اليوم، نفخر بأننا ساعدنا آلاف الأشخاص على الحصول على وظائفهم المثالية من خلال سير ذاتية متميزة صممتها منصتنا.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              كيف نساعدك؟
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              نحن نقدم لك تجربة متكاملة لإنشاء وإدارة سيرتك الذاتية
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#1A2035] rounded-xl p-8 border border-gray-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-700/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">فورم بسيط وسهل</h3>
                  <p className="text-gray-300 leading-relaxed">
                    املأ نموذج بسيط بمعلوماتك الشخصية، خبراتك العملية، مهاراتك، والشهادات التي حصلت عليها. 
                    النموذج مصمم بطريقة ذكية لتوجيهك خطوة بخطوة دون أي تعقيد
                  </p>
                </div>
              </div>
              <div className="pr-16 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-300">حقول ذكية تملأ تلقائياً</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-300">اقتراحات لصياغة أفضل</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-300">حفظ تلقائي للبيانات</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1A2035] rounded-xl p-8 border border-gray-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-700/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">نتيجة فورية</h3>
                  <p className="text-gray-300 leading-relaxed">
                    بمجرد الانتهاء من إدخال بياناتك، تظهر لك سيرتك الذاتية مباشرة بتصميم احترافي جاهز للتحميل. 
                    لا داعي للانتظار أو التعقيدات التقنية
                  </p>
                </div>
              </div>
              <div className="pr-16 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-300">معاينة مباشرة أثناء الكتابة</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-300">تحميل بصيغة PDF عالية الجودة</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-300">جاهزة للطباعة والإرسال</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1A2035] to-[#0F1525] rounded-2xl p-8 md:p-12 border border-gray-800">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-blue-700/40 rounded-lg flex items-center justify-center">
                <Layout className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">لوحة تحكم شخصية</h3>
                <p className="text-gray-300 mt-1">أدر حسابك وسيرك الذاتية بكل سهولة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#0A0F1F] rounded-lg p-6 border border-gray-800">
                <div className="w-10 h-10 bg-blue-700/20 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">تعديل سهل</h4>
                <p className="text-gray-400 text-sm">
                  عدّل بياناتك في أي وقت بضغطة واحدة. جميع التغييرات تنعكس فوراً على سيرتك الذاتية
                </p>
              </div>

              <div className="bg-[#0A0F1F] rounded-lg p-6 border border-gray-800">
                <div className="w-10 h-10 bg-blue-700/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">سير متعددة</h4>
                <p className="text-gray-400 text-sm">
                  أنشئ عدة نسخ من سيرتك الذاتية لوظائف مختلفة. خصص كل سيرة حسب الوظيفة المستهدفة
                </p>
              </div>

              <div className="bg-[#0A0F1F] rounded-lg p-6 border border-gray-800">
                <div className="w-10 h-10 bg-blue-700/20 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">قوالب متنوعة</h4>
                <p className="text-gray-400 text-sm">
                  غيّر التصميم والقالب متى شئت. جرّب أشكال مختلفة حتى تجد الأنسب لك
                </p>
              </div>

              <div className="bg-[#0A0F1F] rounded-lg p-6 border border-gray-800">
                <div className="w-10 h-10 bg-blue-700/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">أمان البيانات</h4>
                <p className="text-gray-400 text-sm">
                  بياناتك محمية بأعلى معايير الأمان. نحن نحترم خصوصيتك ولا نشارك معلوماتك مع أي جهة
                </p>
              </div>

              <div className="bg-[#0A0F1F] rounded-lg p-6 border border-gray-800">
                <div className="w-10 h-10 bg-blue-700/20 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">حفظ تلقائي</h4>
                <p className="text-gray-400 text-sm">
                  لا تقلق من فقدان عملك. كل تعديل يحفظ تلقائياً في حسابك الشخصي
                </p>
              </div>

              <div className="bg-[#0A0F1F] rounded-lg p-6 border border-gray-800">
                <div className="w-10 h-10 bg-blue-700/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">دعم مستمر</h4>
                <p className="text-gray-400 text-sm">
                  فريقنا جاهز لمساعدتك في أي وقت. نقدم دعماً فنياً سريعاً وفعالاً
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              قيمنا ومبادئنا
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              نؤمن بأن النجاح المهني يبدأ بسيرة ذاتية قوية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">السهولة</h3>
              <p className="text-gray-300 leading-relaxed">
                نؤمن بأن التكنولوجيا يجب أن تكون في خدمة الإنسان. لذلك صممنا منصة بسيطة يمكن لأي شخص استخدامها
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">الجودة</h3>
              <p className="text-gray-300 leading-relaxed">
                نضع معايير عالية لتصميم قوالبنا. كل قالب مراجع من قبل خبراء التوظيف لضمان احترافيته
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">الخصوصية</h3>
              <p className="text-gray-300 leading-relaxed">
                بياناتك ملكك وحدك. نحن نحمي معلوماتك الشخصية ولا نشاركها مع أي طرف ثالث
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className=" rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              هل أنت مستعد للبدء؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف المستخدمين الذين حصلوا على وظائفهم المثالية بفضل سيرهم الذاتية الاحترافية
            </p>
          <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white text-[#0A0F1F] cursor-pointer px-8 py-4 rounded-lg text-lg font-semibold transition">
              ابدأ الآن
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}