'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  type FormErrors = {
    firstName?: string;
    lastName?: string;
    username?: string;
    phone?: string;
    birthDate?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    return password.length >= 8 && hasLetters && hasNumbers;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{11}$/;
    return phoneRegex.test(phone);
  };

  const validateBirthDate = () => {
    const day = parseInt(formData.birthDay);
    const month = parseInt(formData.birthMonth);
    const year = parseInt(formData.birthYear);
    const currentYear = new Date().getFullYear();

    if (!day || !month || !year) return false;
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1960 || year > currentYear) return false;

    if (month === 2 && day > 28) return false;
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;

    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'الاسم الأخير مطلوب';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'اسم المستخدم يجب أن يحتوي على حروف إنجليزية وأرقام فقط';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم التليفون مطلوب';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'رقم التليفون يجب أن يكون 11 رقم';
    }

    if (!validateBirthDate()) {
      newErrors.birthDate = 'تاريخ الميلاد غير صحيح';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حروف وأرقام';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    setErrors(newErrors);
    setServerError('');

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        const formattedData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstname: formData.firstName,
          lastname: formData.lastName,
          phone: formData.phone,
          DOB: `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
        };

        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'فشل في إنشاء الحساب');
        }

        if (result.success) {
          router.push('/auth/login?message=registration_success&email=' + encodeURIComponent(formData.email));
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        setServerError(error.message || 'حدث خطأ أثناء إنشاء الحساب');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 lg:p-12 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/pexels-goumbik-590044.jpg)',
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 w-full max-w-2xl mb-10">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'cairo' }}>
              إنشاء حساب جديد
            </h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'cairo' }}>
              سجل الآن وابدأ رحلتك معنا
            </p>
          </div>


          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm text-center" style={{ fontFamily: 'cairo' }}>
                {serverError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            { }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                  الاسم الأول
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="أدخل اسمك الأول"
                    className={`w-full text-right px-4 py-3 pr-12 border-2 ${errors.firstName ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                    style={{ fontFamily: 'cairo' }}
                    disabled={isLoading}
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 text-right" style={{ fontFamily: 'cairo' }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                  الاسم الأخير
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="أدخل اسمك الأخير"
                    className={`w-full text-right px-4 py-3 pr-12 border-2 ${errors.lastName ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                    style={{ fontFamily: 'cairo' }}
                    disabled={isLoading}
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 text-right" style={{ fontFamily: 'cairo' }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>


            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                اسم المستخدم
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                      handleInputChange('username', value);
                    }
                  }}
                  placeholder="username123"
                  className={`w-full text-left px-4 py-3 pl-12 border-2 ${errors.username ? 'border-red-400' : 'border-gray-200'
                    } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                  style={{ direction: 'ltr' }}
                  disabled={isLoading}
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 text-right" style={{ fontFamily: 'cairo' }}>
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                رقم التليفون
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="01xxxxxxxxx"
                  className={`w-full text-left px-4 py-3 pl-12 border-2 ${errors.phone ? 'border-red-400' : 'border-gray-200'
                    } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                  style={{ direction: 'ltr' }}
                  disabled={isLoading}
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 text-right" style={{ fontFamily: 'cairo' }}>
                  {errors.phone}
                </p>
              )}
            </div>


            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                تاريخ الميلاد
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    value={formData.birthDay}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 2);
                      const month = parseInt(formData.birthMonth);
                      let maxDay = 31;
                      if (month === 2) {
                        maxDay = 28;
                      } else if ([4, 6, 9, 11].includes(month)) {
                        maxDay = 30;
                      }
                      if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= maxDay)) {
                        handleInputChange('birthDay', val);
                      }
                    }}
                    placeholder="اليوم"
                    min="1"
                    max="31"
                    className={`w-full text-center px-3 py-3 border-2 ${errors.birthDate ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                    style={{ fontFamily: 'cairo' }}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.birthMonth}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 2);
                      if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
                        handleInputChange('birthMonth', val);
                        const month = parseInt(val);
                        const day = parseInt(formData.birthDay);
                        if (day) {
                          if (month === 2 && day > 28) {
                            handleInputChange('birthDay', '28');
                          } else if ([4, 6, 9, 11].includes(month) && day > 30) {
                            handleInputChange('birthDay', '30');
                          }
                        }
                      }
                    }}
                    placeholder="الشهر"
                    min="1"
                    max="12"
                    className={`w-full text-center px-3 py-3 border-2 ${errors.birthDate ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                    style={{ fontFamily: 'cairo' }}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.birthYear}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 4);
                      const currentYear = new Date().getFullYear();
                      if (val === '' || val.length <= 4) {
                        if (val === '' || (parseInt(val) <= currentYear && parseInt(val) >= 0)) {
                          handleInputChange('birthYear', val);
                        }
                      }
                    }}
                    placeholder="السنة"
                    min="1960"
                    max={new Date().getFullYear()}
                    className={`w-full text-center px-3 py-3 border-2 ${errors.birthDate ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                    style={{ fontFamily: 'cairo' }}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {errors.birthDate && (
                <p className="text-red-500 text-xs mt-1 text-right" style={{ fontFamily: 'cairo' }}>
                  {errors.birthDate}
                </p>
              )}
            </div>

            { }
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/[\u0600-\u06FF]/.test(value)) {
                      handleInputChange('email', value);
                    }
                  }}
                  placeholder="example@email.com"
                  className={`w-full text-left px-4 py-3 pl-12 border-2 ${errors.email ? 'border-red-400' : 'border-gray-200'
                    } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                  style={{ direction: 'ltr' }}
                  disabled={isLoading}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 text-right" style={{ fontFamily: 'cairo' }}>
                  {errors.email}
                </p>
              )}
            </div>

            { }
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full text-left px-4 py-3 pl-12 pr-12 border-2 ${errors.password ? 'border-red-400' : 'border-gray-200'
                    } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                  style={{ direction: 'ltr' }}
                  disabled={isLoading}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 text-right" style={{ fontFamily: 'cairo' }}>
                  {errors.password}
                </p>
              )}
            </div>

            { }
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full text-left px-4 py-3 pl-12 pr-12 border-2 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                    } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white disabled:opacity-50`}
                  style={{ direction: 'ltr' }}
                  disabled={isLoading}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 text-right" style={{ fontFamily: 'cairo' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#192A3D] text-white py-3 rounded-xl font-semibold hover:bg-[#192A3DE6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-6"
              style={{ fontFamily: 'cairo' }}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  جاري إنشاء الحساب...
                </>
              ) : (
                'إنشاء الحساب'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500" style={{ fontFamily: 'cairo' }}>
                أو
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600" style={{ fontFamily: 'cairo' }}>
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-[#192A3D99] hover:text-[#192A3DE6] font-semibold">
              سجل الدخول
            </Link>
          </p>
        </div>
      </div>
      <style jsx>{`
@import url('https:
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;