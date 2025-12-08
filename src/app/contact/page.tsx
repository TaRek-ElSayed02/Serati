'use client';
import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import * as yup from 'yup';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Toast, { showToast, validateFormWithToast } from '../components/Toast/Toast';

// إنشاء Schema للتحقق باستخدام Yup
const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required('الاسم الكامل مطلوب')
    .min(3, 'الاسم يجب أن يكون على الأقل 3 أحرف')
    .max(100, 'الاسم لا يمكن أن يتجاوز 100 حرف'),
  email: yup
    .string()
    .required('البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صالح'),
  phone: yup
    .string()
    .required('رقم الهاتف مطلوب')
    .matches(
      /^[\+]?[0-9\s\-\(\)]+$/,
      'رقم الهاتف يجب أن يحتوي على أرقام فقط'
    )
    .min(8, 'رقم الهاتف قصير جداً')
    .max(20, 'رقم الهاتف طويل جداً'),
  message: yup
    .string()
    .required('الرسالة مطلوبة')
    .min(10, 'الرسالة قصيرة جداً (10 أحرف على الأقل)')
    .max(1000, 'الرسالة طويلة جداً (1000 حرف كحد أقصى)')
});

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // تنظيف قيمة رقم الهاتف لإزالة المسافات والرموز غير المرغوبة
    let cleanedValue = value;
    if (name === 'phone') {
      // السماح فقط بالأرقام، علامة +، المسافات، الأقواس، والشرطات
      cleanedValue = value.replace(/[^\d\+\s\(\)-]/g, '');
    }
    
    setFormData({
      ...formData,
      [name]: cleanedValue
    });

    // تنظيف الخطأ عند البدء في الكتابة
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // دالة للتحقق من الحقول باستخدام Yup
  const validateForm = async (): Promise<boolean> => {
    try {
      await contactSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      if (validationErrors instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        validationErrors.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        
        // إظهار أول خطأ في التوست
        const firstError = Object.values(newErrors)[0];
        if (firstError) {
          showToast(firstError, 'error');
        }
      }
      return false;
    }
  };

  // تحسين دالة التحقق القديمة للتوافق مع Yup
  const validateFormWithToastEnhanced = async (): Promise<boolean> => {
    const isValid = await validateForm();
    return isValid;
  };

  const handleWhatsAppSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    const { name, email, phone, message } = formData;

    const whatsappMessage = `*رسالة جديدة من موقع CV Builder*%0A%0A*الاسم:* ${name}%0A*البريد الإلكتروني:* ${email}%0A*رقم الهاتف:* ${phone}%0A%0A*الرسالة:*%0A${message}`;
    const whatsappURL = `https://wa.me/201558166468?text=${whatsappMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    showToast('تم فتح واتساب لإرسال الرسالة!', 'success');
    
    // تنظيف الفورم بعد الإرسال
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleEmailSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    const { name, email, phone, message } = formData;

    const emailSubject = `رسالة جديدة من ${name} - CV Builder`;
    const emailBody = `الاسم: ${name}%0D%0Aالبريد الإلكتروني: ${email}%0D%0Aرقم الهاتف: ${phone}%0D%0A%0D%0Aالرسالة:%0D%0A${message}`;
    const mailtoURL = `mailto:info@serati.com?subject=${emailSubject}&body=${emailBody}`;
    
    window.location.href = mailtoURL;
    
    showToast('تم فتح البريد الإلكتروني لإرسال الرسالة!', 'success');
    
    // تنظيف الفورم بعد الإرسال
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  // دالة لتحسين عرض رقم الهاتف أثناء الكتابة
  const formatPhoneForDisplay = (phone: string) => {
    // إزالة جميع غير الأرقام
    const cleaned = phone.replace(/\D/g, '');
    
    // تنسيق الرقم المصري
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `+20 ${cleaned.slice(0, 3)}`;
    } else if (cleaned.length <= 9) {
      return `+20 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
    } else {
      return `+20 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    }
  };

  // دالة للتحقق من رقم الهاتف عند فقدان التركيز
  const handlePhoneBlur = () => {
    if (formData.phone.trim()) {
      // التحقق باستخدام Yup عند فقدان التركيز
      contactSchema
        .validateAt('phone', { phone: formData.phone })
        .then(() => {
          if (errors.phone) {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.phone;
              return newErrors;
            });
          }
        })
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            setErrors(prev => ({
              ...prev,
              phone: error.message
            }));
          }
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0A0F1F] to-[#151B2E] text-right">
      <Toast />
      
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              تواصل معنا
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              نحن هنا لمساعدتك ! تواصل معنا عبر واتساب أو البريد الإلكتروني وسنرد عليك في أقرب وقت ممكن
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto" dir='rtl'>
            <div className="bg-[#1A2035] rounded-2xl p-8 md:p-12 border border-gray-800">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">أرسل لنا رسالة</h2>
                <p className="text-gray-300">املأ النموذج أدناه وسنتواصل معك في أقرب وقت</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2" htmlFor="name">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#0A0F1F] border rounded-lg text-white focus:outline-none transition ${
                        errors.name ? 'border-red-500' : 'border-gray-700 focus:border-blue-600'
                      }`}
                      placeholder="أدخل اسمك الكامل"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2" htmlFor="email">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#0A0F1F] border rounded-lg text-white focus:outline-none transition ${
                        errors.email ? 'border-red-500' : 'border-gray-700 focus:border-blue-600'
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2" htmlFor="phone">
                    رقم الهاتف *
                    <span className="text-gray-400 text-sm font-normal mr-2">
                      (أرقام فقط، +، مسافات، أقواس، شرطات)
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handlePhoneBlur}
                    className={`w-full px-4 py-3 bg-[#0A0F1F] border rounded-lg text-white focus:outline-none transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-700 focus:border-blue-600'
                    }`}
                    placeholder="+20 1XX XXX XXXX"
                  />
                  {errors.phone ? (
                    <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                  ) : formData.phone && (
                    <p className="mt-2 text-sm text-green-500">
                      رقم الهاتف صالح ✓
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2" htmlFor="message">
                    رسالتك *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#0A0F1F] border rounded-lg text-white focus:outline-none transition resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-700 focus:border-blue-600'
                    }`}
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                  <div className="flex justify-between items-center mt-2">
                    {errors.message ? (
                      <p className="text-sm text-red-500">{errors.message}</p>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {formData.message.length}/1000 حرف
                      </span>
                    )}
                    {formData.message.length >= 10 && !errors.message && (
                      <span className="text-sm text-green-500">✓</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleWhatsAppSubmit}
                    className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={Object.keys(errors).length > 0}
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    إرسال عبر واتساب
                  </button>
                  <button
                    onClick={handleEmailSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={Object.keys(errors).length > 0}
                  >
                    <Mail className="w-5 h-5" />
                    إرسال عبر الإيميل
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-15">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              أسئلة شائعة
            </h2>
            <p className="text-gray-300">
              قد تجد إجابة سؤالك هنا
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-[#1A2035] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-2">كم من الوقت يستغرق إنشاء السيرة الذاتية؟</h3>
              <p className="text-gray-400">
                يمكنك إنشاء سيرة ذاتية احترافية في أقل من 10 دقائق باستخدام قوالبنا الجاهزة والنماذج الذكية.
              </p>
            </div>

            <div className="bg-[#1A2035] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-2">هل يمكنني تعديل السيرة الذاتية بعد إنشائها؟</h3>
              <p className="text-gray-400">
                بالتأكيد! يمكنك تعديل سيرتك الذاتية في أي وقت من خلال لوحة التحكم الخاصة بك. جميع التعديلات تُحفظ تلقائياً.
              </p>
            </div>

            <div className="bg-[#1A2035] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-2">ما هي صيغ التحميل المتاحة؟</h3>
              <p className="text-gray-400">
                يمكنك تحميل سيرتك الذاتية بصيغة PDF بجودة عالية، جاهزة للطباعة والإرسال للشركات.
              </p>
            </div>

            <div className="bg-[#1A2035] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-2">كيف يمكنني الحصول على الدعم؟</h3>
              <p className="text-gray-400">
                يمكنك التواصل معنا عبر واتساب أو البريد الإلكتروني، وسنرد عليك في أقرب وقت ممكن خلال ساعات العمل.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}