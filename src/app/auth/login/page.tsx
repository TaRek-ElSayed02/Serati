"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Loader } from "lucide-react";
import Link from "next/link";
import { signIn, useSession, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { setAuthToken } from "../../api/services";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    const message = searchParams?.get("message");
    const emailParam = searchParams?.get("email");

    if (message === "registration_success" && emailParam) {
      setSuccessMessage(
        `تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول باستخدام ${emailParam}`
      );
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const userWithToken = session?.user as { token?: string } | undefined;
    if (userWithToken?.token) {
      setAuthToken(userWithToken.token, 30);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (
          result.error.includes("credentials") ||
          result.error.includes("Invalid")
        ) {
          setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else {
          setError("حدث خطأ أثناء تسجيل الدخول");
        }
        console.error("Login error:", result.error);
      } else {
        // حفظ التوكن في التخزين المحلي/الكوكيز قبل الانتقال للوحة التحكم
        const newSession = await getSession();
        const userWithToken = newSession?.user as { token?: string } | undefined;
        if (userWithToken?.token) {
          setAuthToken(userWithToken.token, 30);
        }
        // استخدام window.location.href لإجبار إعادة تحميل الصفحة وتحديث الجلسة
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login exception:", error);
      setError("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center p-4 lg:p-12 relative bg-cover bg-center bg-no-repeat min-h-[calc(100vh-4rem)]"
      style={{
        backgroundImage: "url(/pexels-goumbik-590044.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 w-full max-w-md lg:mt-[-60]">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 mb-20 lg:mb-0 border border-white/20">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "cairo" }}
            >
              تسجيل الدخول
            </h1>
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "cairo" }}
            >
              مرحبًا بعودتك !
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p
                className="text-green-700 text-sm text-center"
                style={{ fontFamily: "cairo" }}
              >
                {successMessage}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p
                className="text-red-700 text-sm text-center"
                style={{ fontFamily: "cairo" }}
              >
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full text-left px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white"
                  style={{ direction: "ltr" }}
                  required
                  disabled={isLoading}
                />
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2 text-right"
                style={{ fontFamily: "cairo" }}
              >
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-left px-4 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#192A3D99] focus:outline-none transition-colors bg-white"
                  style={{ direction: "ltr" }}
                  required
                  disabled={isLoading}
                />
                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div
              className="flex items-center justify-between text-sm"
              style={{ direction: "rtl" }}
            >
              <Link
                href="/auth/forgetpassword"
                className="text-[#192A3D99] hover:text-[#192A3DE6] cursor-pointer font-medium"
                style={{ fontFamily: "cairo", marginRight: "auto" }}
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#192A3D] text-white py-3 rounded-xl font-semibold hover:bg-[#192A3DE6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg flex items-center justify-center gap-2"
              style={{ fontFamily: "cairo" }}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

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
            className="text-center mt-6 text-sm text-gray-600"
            style={{ fontFamily: "cairo" }}
          >
            ليس لديك حساب؟{" "}
            <Link
              href="/auth/register"
              className="text-[#192A3D99] hover:text-[#192A3DE6] font-semibold"
            >
              سجل الآن
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
@import url('https:
      `}</style>
    </div>
  );
};

export default LoginPage;
