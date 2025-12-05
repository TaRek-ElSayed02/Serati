'use client';
import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, TrendingUp, Activity, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, fetchUserCVs, User, UserCV, validateToken, setAuthToken } from '../api/services';

const calculateStats = (users: User[], cvs: UserCV[]) => {
  const activeCVs = cvs.filter(cv => cv.isactive === 'yes').length;
  const inactiveCVs = cvs.filter(cv => cv.isactive === 'no').length;
  const activeRate = cvs.length > 0 ? ((activeCVs / cvs.length) * 100).toFixed(1) : '0.0';

  return {
    totalUsers: users.length,
    activeUsers: activeCVs,
    inactiveUsers: inactiveCVs,
    totalCVs: cvs.length,
    activeRate: parseFloat(activeRate)
  };
};

const analyzeDataByPeriod = (data: (User | UserCV)[], dateField: 'created_at' | 'modified_at' = 'created_at') => {
  const now = new Date();
  
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('ar-EG', { weekday: 'long' });
    const count = data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate.toDateString() === date.toDateString();
    }).length;
    return { name: dayName, registrations: count };
  });

  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (3 - i) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const count = data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= weekStart && itemDate <= weekEnd;
    }).length;
    
    return { name: `الأسبوع ${i + 1}`, registrations: count };
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const monthName = month.toLocaleDateString('ar-EG', { month: 'long' });
    
    const count = data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate.getMonth() === month.getMonth() && 
             itemDate.getFullYear() === month.getFullYear();
    }).length;
    
    return { name: monthName, registrations: count };
  });

  const yearlyData = Array.from({ length: 8 }, (_, i) => {
    const year = now.getFullYear() - (0 - i);
    const count = data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate.getFullYear() === year;
    }).length;
    
    return { name: year.toString(), registrations: count };
  });

  return { dailyData, weeklyData, monthlyData, yearlyData };
};

const analyzeUserActivity = (cvs: UserCV[]) => {
  const now = new Date();
  
  const dailyActivity = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('ar-EG', { weekday: 'long' });
    
    const dayCVs = cvs.filter(cv => {
      const cvDate = new Date(cv.created_at);
      return cvDate.toDateString() === date.toDateString();
    });
    
    return {
      name: dayName,
      active: dayCVs.filter(cv => cv.isactive === 'yes').length,
      inactive: dayCVs.filter(cv => cv.isactive === 'no').length
    };
  });

  const weeklyActivity = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (3 - i) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekCVs = cvs.filter(cv => {
      const cvDate = new Date(cv.created_at);
      return cvDate >= weekStart && cvDate <= weekEnd;
    });
    
    return {
      name: `الأسبوع ${i + 1}`,
      active: weekCVs.filter(cv => cv.isactive === 'yes').length,
      inactive: weekCVs.filter(cv => cv.isactive === 'no').length
    };
  });

  const monthlyActivity = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const monthName = month.toLocaleDateString('ar-EG', { month: 'long' });
    
    const monthCVs = cvs.filter(cv => {
      const cvDate = new Date(cv.created_at);
      return cvDate.getMonth() === month.getMonth() && 
             cvDate.getFullYear() === month.getFullYear();
    });
    
    return {
      name: monthName,
      active: monthCVs.filter(cv => cv.isactive === 'yes').length,
      inactive: monthCVs.filter(cv => cv.isactive === 'no').length
    };
  });

  const yearlyActivity = Array.from({ length: 5 }, (_, i) => {
    const year = now.getFullYear() - (4 - i);
    
    const yearCVs = cvs.filter(cv => {
      const cvDate = new Date(cv.created_at);
      return cvDate.getFullYear() === year;
    });
    
    return {
      name: year.toString(),
      active: yearCVs.filter(cv => cv.isactive === 'yes').length,
      inactive: yearCVs.filter(cv => cv.isactive === 'no').length
    };
  });

  return { dailyActivity, weeklyActivity, monthlyActivity, yearlyActivity };
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [activityPeriod, setActivityPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const { data: users, isLoading: usersLoading, error: usersError, isFetching: usersFetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
staleTime: 5 * 60 * 1000,
gcTime: 10 * 60 * 1000,
refetchOnWindowFocus: false,
refetchOnMount: false,
    enabled: status === 'authenticated' && validateToken(),
  });

  const { data: cvs, isLoading: cvsLoading, error: cvsError, isFetching: cvsFetching } = useQuery({
    queryKey: ['usercvs'],
    queryFn: fetchUserCVs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: status === 'authenticated' && validateToken(),
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    // تأكد من حفظ التوكن محليًا إذا كان موجودًا في الجلسة ولم يُحفظ بعد
    const hasToken = validateToken();
    const sessUser = session?.user as { token?: string } | undefined;
    if (!hasToken && sessUser?.token) {
      setAuthToken(sessUser.token, 30);
    }
  }, [status, session]);

  const stats = useMemo(() => {
    if (!users || !cvs) return {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      totalCVs: 0,
      activeRate: 0
    };
    return calculateStats(users, cvs);
  }, [users, cvs]);

  const registrationData = useMemo(() => {
    if (!users) return { dailyData: [], weeklyData: [], monthlyData: [], yearlyData: [] };
    return analyzeDataByPeriod(users, 'created_at');
  }, [users]);

  const usersActivityData = useMemo(() => {
    if (!cvs) return { dailyActivity: [], weeklyActivity: [], monthlyActivity: [], yearlyActivity: [] };
    return analyzeUserActivity(cvs);
  }, [cvs]);

  const usersPieData = useMemo(() => [
    { name: 'نشط', value: stats.activeUsers, color: '#192A3D' },
    { name: 'معطل', value: stats.inactiveUsers, color: '#94a3b8' }
  ], [stats]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['usercvs'] });
  };

  const renderCustomLabel = (props: unknown) => {
    const typedProps = props as {
      cx: number;
      cy: number;
      midAngle: number;
      outerRadius: number;
      name: string;
      percent: number;
    };
    
    const { cx, cy, midAngle, outerRadius, name, percent } = typedProps;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${name} ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (status === 'loading' || usersLoading || cvsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin w-8 h-8 text-[#192A3D]" />
          <span className="text-lg text-[#192A3D]" style={{ fontFamily: 'cairo' }}>جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-lg text-[#192A3D]" style={{ fontFamily: 'cairo' }}>غير مصرح بالدخول، جاري التوجيه...</p>
        </div>
      </div>
    );
  }

  if (usersError || cvsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4" style={{ fontFamily: 'cairo' }}>
            حدث خطأ في تحميل البيانات
          </p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-3 bg-[#192A3D] text-white rounded-lg hover:bg-[#2a3f59] transition-all"
            style={{ fontFamily: 'cairo' }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const currentRegistrationData = period === 'daily' ? registrationData.dailyData :
                                  period === 'weekly' ? registrationData.weeklyData :
                                  period === 'monthly' ? registrationData.monthlyData :
                                  registrationData.yearlyData;

  const currentActivityData = activityPeriod === 'daily' ? usersActivityData.dailyActivity :
                              activityPeriod === 'weekly' ? usersActivityData.weeklyActivity :
                              activityPeriod === 'monthly' ? usersActivityData.monthlyActivity :
                              usersActivityData.yearlyActivity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900" style={{ fontFamily: 'cairo' }}>لوحة التحكم</h1>
          <button
            onClick={handleRefresh}
            disabled={usersFetching || cvsFetching}
            className="flex items-center gap-2 px-4 py-2 bg-[#192A3D] text-white rounded-lg hover:bg-[#2a3f59] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'cairo' }}
          >
            <RefreshCw className={`w-5 h-5 ${(usersFetching || cvsFetching) ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
          </button>
        </div>

        {(usersFetching || cvsFetching) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <Loader className="animate-spin w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600" style={{ fontFamily: 'cairo' }}>جاري تحديث البيانات...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-[#192A3D] hover:shadow-xl hover:border-[#2a3f59] transition-all">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-[#192A3D]" />
              <span className="text-sm font-medium text-slate-500" style={{ fontFamily: 'cairo' }}>إجمالي المستخدمين</span>
            </div>
            <h3 className="text-3xl font-bold text-[#192A3D]">{stats.totalUsers.toLocaleString()}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-[#192A3D] hover:shadow-xl hover:border-[#2a3f59] transition-all">
            <div className="flex items-center justify-between mb-4">
              <UserCheck className="w-10 h-10 text-[#192A3D]" />
              <span className="text-sm font-medium text-slate-500" style={{ fontFamily: 'cairo' }}>السير الذاتية النشطة</span>
            </div>
            <h3 className="text-3xl font-bold text-[#192A3D]">{stats.activeUsers.toLocaleString()}</h3>
            <p className="text-[#192A3D] text-sm mt-2" style={{ fontFamily: 'cairo' }}>{stats.activeRate}% من الإجمالي</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-[#192A3D] hover:shadow-xl hover:border-[#2a3f59] transition-all">
            <div className="flex items-center justify-between mb-4">
              <UserX className="w-10 h-10 text-[#192A3D]" />
              <span className="text-sm font-medium text-slate-500" style={{ fontFamily: 'cairo' }}>السير الذاتية المعطلة</span>
            </div>
            <h3 className="text-3xl font-bold text-[#192A3D]">{stats.inactiveUsers.toLocaleString()}</h3>
            <p className="text-slate-600 text-sm mt-2" style={{ fontFamily: 'cairo' }}>{(100 - stats.activeRate).toFixed(1)}% من الإجمالي</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-[#192A3D] hover:shadow-xl hover:border-[#2a3f59] transition-all">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-10 h-10 text-[#192A3D]" />
              <span className="text-sm font-medium text-slate-500" style={{ fontFamily: 'cairo' }}>عدد السير الذاتية</span>
            </div>
            <h3 className="text-3xl font-bold text-[#192A3D]">{stats.totalCVs.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[#192A3D]" />
              <h2 className="text-2xl font-bold text-[#192A3D]" style={{ fontFamily: 'cairo' }}>إحصائيات التسجيلات</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    period === p
                      ? 'bg-[#192A3D] text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-[#2a3f59] hover:text-white'
                  }`}
                  style={{ fontFamily: 'cairo' }}
                >
                  {p === 'daily' && 'يومي'}
                  {p === 'weekly' && 'أسبوعي'}
                  {p === 'monthly' && 'شهري'}
                  {p === 'yearly' && 'سنوي'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={currentRegistrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '14px', fontWeight: '500' }} />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#192A3D',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  padding: '12px 16px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                labelStyle={{ 
                  color: '#fff', 
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
                itemStyle={{
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  padding: '4px 0'
                }}
                formatter={(value: number) => [`${value} تسجيل`]}
                cursor={{ fill: 'rgba(25, 42, 61, 0.1)' }}
              />
              <Bar 
                dataKey="registrations" 
                fill="#192A3D" 
                radius={[8, 8, 0, 0]} 
                name="التسجيلات"
                label={{ 
                  position: 'top', 
                  fill: '#192A3D', 
                  fontSize: 14, 
                  fontWeight: 'bold' 
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#192A3D]" />
                <h2 className="text-2xl font-bold text-[#192A3D]" style={{ fontFamily: 'cairo' }}>نشاط السير الذاتية</h2>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivityPeriod(p)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      activityPeriod === p
                        ? 'bg-[#192A3D] text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-[#2a3f59] hover:text-white'
                    }`}
                    style={{ fontFamily: 'cairo' }}
                  >
                    {p === 'daily' && 'يومي'}
                    {p === 'weekly' && 'أسبوعي'}
                    {p === 'monthly' && 'شهري'}
                    {p === 'yearly' && 'سنوي'}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={currentActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '14px', fontWeight: '500' }} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#192A3D',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  labelStyle={{ 
                    color: '#fff', 
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  itemStyle={{
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    padding: '4px 0'
                  }}
                  formatter={(value: number, name: string) => {
                    const label = name === 'active' ? 'نشط' : 'معطل';
                    return [`${value} سيرة ذاتية`, label];
                  }}
                  cursor={{ stroke: '#192A3D', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value: string) => value === 'active' ? 'نشط' : 'معطل'}
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#192A3D"
                  strokeWidth={3}
                  name="active"
                  dot={{ fill: '#192A3D', r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="inactive"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  name="inactive"
                  dot={{ fill: '#94a3b8', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-[#192A3D]" />
              <h2 className="text-xl font-bold text-[#192A3D]" style={{ fontFamily: 'cairo' }}>نسبة النشاط</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={usersPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  dataKey="value"
                >
                  {usersPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#192A3D',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  labelStyle={{ 
                    color: '#fff', 
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  itemStyle={{
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value: number, name: string) => [`${value} سيرة ذاتية`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-[#192A3D]">
                <span className="text-[#192A3D] font-medium" style={{ fontFamily: 'cairo' }}>حالة الموقع</span>
                <span className="text-[#192A3D] font-bold" style={{ fontFamily: 'cairo' }}>
                  {stats.activeRate >= 80 ? ' ممتاز' : stats.activeRate >= 60 ? ' جيد' : ' يحتاج تحسين'}
                </span>
              </div>
              <p className="text-sm text-slate-600" style={{ fontFamily: 'cairo' }}>
                {stats.totalCVs > 0 
                  ? `الموقع يعمل بكفاءة ${stats.activeRate >= 80 ? 'عالية' : stats.activeRate >= 60 ? 'جيدة' : 'متوسطة'} مع نسبة نشاط ${stats.activeRate}% من السير الذاتية`
                  : 'لا توجد سير ذاتية بعد'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}