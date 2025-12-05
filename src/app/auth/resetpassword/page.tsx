'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    try {
      const email = localStorage.getItem('resetEmail');
      const otp = localStorage.getItem('verifiedOTP');

      console.log('بيانات الإرسال:', { email, otp, passwordLength: password.length });

      if (!email || !otp) {
        setError('انتهت صلاحية الجلسة. يرجى إعادة العملية من البداية.');
        return;
      }

const response = await fetch('http:
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });

      const data = await response.json();
      console.log('استجابة الخادم:', data);

      if (response.ok) {
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('verifiedOTP');
        
        console.log('تم إعادة تعيين كلمة المرور بنجاح');
        
        router.push('/auth/login?message=password_reset_success');
      } else {
        setError(data.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
      }
    } catch (error) {
      console.error('خطأ في الإرسال:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center p-4 lg:p-12 relative bg-cover bg-center bg-no-repeat min-h-[calc(100vh-4rem)]"
      style={{
        backgroundImage: 'url(/pexels-goumbik-590044.jpg)',
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 w-full max-w-md lg:mt-[-60] ">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 mb-20 lg:mb-0 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#192A3D]/10 rounded-full mb-4">
              <KeyRound className="text-[#192A3D]" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'cairo' }}>
              إعادة تعيين كلمة المرور
            </h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'cairo' }}>
              أدخل كلمة المرور الجديدة الخاصة بك
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-right px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white"
                  style={{ direction: 'ltr' }}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 text-right" style={{ fontFamily: 'cairo' }}>
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-right px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white"
                  style={{ direction: 'ltr' }}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center" style={{ fontFamily: 'cairo' }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#192A3D] cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-[#192A3DE6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'cairo' }}
            >
              {isLoading ? 'جاري التعيين...' : 'تعيين كلمة المرور'}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500" style={{ fontFamily: 'cairo' }}>أو</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600" style={{ fontFamily: 'cairo' }}>
            تذكرت كلمة المرور؟{' '}
            <a href="/auth/login" className="text-[#192A3D99] hover:text-[#192A3DE6] font-semibold">
              تسجيل الدخول
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
@import url('https:
      `}</style>
    </div>
  );
};

export default ResetPassword;