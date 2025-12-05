"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const VerifyCode = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(100);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    startCountdown();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  const startCountdown = () => {
    setCountdown(100);
    setResendDisabled(true);
  };

  const handleChange = (index: number, value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "");

    if (sanitized.length === 0) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    if (sanitized.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = sanitized;
      setOtp(newOtp);

      if (index < 5 && sanitized) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    if (sanitized.length > 1) {
      const chars = sanitized.slice(0, 6).split("");
      const newOtp = [...otp];
      chars.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowRight") {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("الرجاء إدخال الكود المكون من 6 أرقام");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        setError("لم يتم العثور على البريد الإلكتروني. يرجى إعادة العملية.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/forget/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: code }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("verifiedOTP", code);
        router.push("/auth/resetpassword");
      } else {
        setError(data.message || "كود التحقق غير صحيح");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    startCountdown();

    try {
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        setError("لم يتم العثور على البريد الإلكتروني");
        setResendDisabled(false);
        return;
      }

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

      if (!response.ok) {
        setError(data.message || "حدث خطأ أثناء إعادة الإرسال");
        setResendDisabled(false);
      } else {
        setError("");
      }
    } catch (error) {
      setError("حدث خطأ في الاتصال بالخادم");
      setResendDisabled(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="flex items-center justify-center p-4 lg:p-12 relative bg-cover bg-center bg-no-repeat min-h-[calc(100vh-4rem)]"
      style={{
        backgroundImage: "url(/pexels-goumbik-590044.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 w-full max-w-md mt-[-60]">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#192A3D]/10 rounded-full mb-4">
              <Mail className="text-[#192A3D]" size={32} />
            </div>
            <h1
              className="text-3xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "cairo" }}
            >
              التحقق من الكود
            </h1>
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "cairo" }}
            >
              تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني
            </p>

            {}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2">
                <span
                  className="text-blue-700 text-sm font-medium"
                  style={{ fontFamily: "cairo" }}
                >
                  الكود صالح لمدة:
                </span>
                <div
                  className={`px-3 py-1 rounded-full font-bold text-sm ${
                    countdown > 30
                      ? "bg-green-100 text-green-700"
                      : countdown > 10
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {formatTime(countdown)}
                </div>
              </div>
              {countdown === 0 && (
                <p
                  className="text-red-600 text-xs mt-2 font-medium"
                  style={{ fontFamily: "cairo" }}
                >
                  انتهت صلاحية الكود، يرجى طلب كود جديد
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-3 text-center"
                style={{ fontFamily: "cairo" }}
              >
                ادخل الكود الخاص بك
              </label>
              <div className="flex gap-2 justify-center mb-2" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white"
                    style={{ fontFamily: "monospace" }}
                  />
                ))}
              </div>
              {error && (
                <p
                  className="text-red-500 text-xs mt-1 text-center"
                  style={{ fontFamily: "cairo" }}
                >
                  {error}
                </p>
              )}
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600" style={{ fontFamily: "cairo" }}>
                لم يصلك الكود؟{" "}
              </span>
              <button
                onClick={handleResend}
                disabled={resendDisabled}
                className={`${
                  resendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#192A3D] cursor-pointer hover:text-[#192A3DE6] font-semibold"
                } transition-colors`}
                style={{ fontFamily: "cairo" }}
              >
                {resendDisabled
                  ? `إعادة إرسال (${formatTime(countdown)})`
                  : "إعادة إرسال"}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#192A3D] cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-[#192A3DE6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "cairo" }}
            >
              {isLoading ? "جاري التحقق..." : "تحقق من الكود"}
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

export default VerifyCode;
