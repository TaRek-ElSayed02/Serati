"use client";
import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim()) {
      setError("البريد الإلكتروني مطلوب");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("البريد الإلكتروني غير صحيح");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/forget/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("resetEmail", email);
        setIsSubmitted(true);
      } else {
        setError(data.message || "حدث خطأ أثناء إرسال OTP");
      }
    } catch (error) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className=" flex items-center  min-h-[calc(100vh-8rem)] justify-center p-4 lg:p-2  relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/pexels-goumbik-590044.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={32} />
            </div>
            <h1
              className="text-2xl font-bold text-gray-800 mb-3"
              style={{ fontFamily: "cairo" }}
            >
              تم إرسال البريد الإلكتروني
            </h1>
            <p className="text-gray-600 mb-6" style={{ fontFamily: "cairo" }}>
              تم إرسال رمز التحقق (OTP) إلى بريدك الإلكتروني. يرجى التحقق من
              صندوق الوارد الخاص بك.
            </p>
            <a
              href="/auth/verifycode"
              className="inline-flex items-center gap-2 text-[#192A3D99] hover:text-[#192A3DE6] font-semibold"
              style={{ fontFamily: "cairo" }}
            >
              <ArrowRight size={20} />
              الانتقال للتحقق من الكود
            </a>
          </div>
        </div>

        <style jsx>{`
@import url('https:
        `}</style>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center p-0 lg:p-2 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(/pexels-goumbik-590044.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 w-[90%] max-w-md mt-[-80]">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "cairo" }}
            >
              نسيت كلمة المرور؟
            </h1>
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "cairo" }}
            >
              أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق (OTP)
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2 text-right"
                style={{ fontFamily: "cairo" }}
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/[\u0600-\u06FF]/.test(value)) {
                      setEmail(value);
                      if (error) setError("");
                    }
                  }}
                  placeholder="example@email.com"
                  className={`w-full text-left px-4 py-3 pl-12 border-2 ${
                    error ? "border-red-400" : "border-gray-200"
                  } rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white`}
                  style={{ direction: "ltr" }}
                />
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {error && (
                <p
                  className="text-red-500 text-xs mt-1 text-right"
                  style={{ fontFamily: "cairo" }}
                >
                  {error}
                </p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#192A3D] cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-[#192A3D99] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "cairo" }}
            >
              {isLoading ? "جاري الإرسال..." : "إرسال كود التحقق"}
            </button>
          </div>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-4 bg-white text-gray-500"
                style={{ fontFamily: "cairo" }}
              >
                أو
              </span>
            </div>
          </div>
          <p
            className="text-center text-sm text-gray-600"
            style={{ fontFamily: "cairo" }}
          >
            تذكرت كلمة المرور؟{" "}
            <a
              href="/auth/login"
              className="text-[#192A3D99] hover:text-[#192A3DE6] font-semibold"
            >
              سجل الدخول
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
export default ForgotPasswordPage;
