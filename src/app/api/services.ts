const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  DOB: string;
  role: string;
  created_at: string;
  modified_at: string;
}

export interface UserCV {
  id: string;
  userid: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  templateid: number;
  imagename: string;
  isactive: string;
  currentjob: string;
  created_at: string;
  modified_at: string;
}

interface UsersResponse {
  success: boolean;
  data: User[];
}

interface UserCVsResponse {
  success: boolean;
  data: UserCV[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserWithCVs extends User {
  cvCount: number;
  cvs: UserCV[];
}

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=None;Secure`;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const getAuthToken = (): string => {
  let token = getCookie('authToken');
  
  if (!token && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('authToken');
  }
  
  if (!token) {
    throw new Error('لم يتم العثور على token في cookies أو localStorage');
  }
  
  return token;
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('غير مصرح بالوصول - التوكن غير صالح');
      }
      if (response.status === 403) {
        throw new Error('غير مسموح بالوصول إلى هذا المورد');
      }
      throw new Error(`فشل في جلب المستخدمين: ${response.status} ${response.statusText}`);
    }

    const data: UsersResponse = await response.json();
    
    if (!data.success) {
      throw new Error('فشل في جلب البيانات من الخادم');
    }

    return data.data;
  } catch (error) {
    console.error('خطأ في fetchUsers:', error);
    throw error;
  }
};

export interface UpdateUserData {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  phone?: string;
  DOB?: string;
  role?: string;
}

export const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('غير مصرح بالوصول - التوكن غير صالح');
      }
      if (response.status === 403) {
        throw new Error('غير مسموح بتعديل هذا المستخدم');
      }
      if (response.status === 404) {
        throw new Error('المستخدم غير موجود');
      }
      throw new Error(`فشل في تعديل المستخدم: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'فشل في تعديل المستخدم');
    }

    return data.data;
  } catch (error) {
    console.error('خطأ في updateUser:', error);
    throw error;
  }
};

export const fetchUserCVs = async (): Promise<UserCV[]> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/usercv`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('غير مصرح بالوصول - التوكن غير صالح');
      }
      if (response.status === 403) {
        throw new Error('غير مسموح بالوصول إلى هذا المورد');
      }
      throw new Error(`فشل في جلب السير الذاتية: ${response.status} ${response.statusText}`);
    }

    const data: UserCVsResponse = await response.json();
    
    if (!data.success) {
      throw new Error('فشل في جلب البيانات من الخادم');
    }

    return data.data;
  } catch (error) {
    console.error('خطأ في fetchUserCVs:', error);
    throw error;
  }
};

export const fetchUsersWithCVs = async (): Promise<UserWithCVs[]> => {
  try {
    const [users, cvs] = await Promise.all([fetchUsers(), fetchUserCVs()]);

    const usersWithCVCount = users.map((user) => {
      const userCVs = cvs.filter((cv) => cv.userid === user.id);
      return {
        ...user,
        cvCount: userCVs.length,
        cvs: userCVs,
      };
    });

    return usersWithCVCount;
  } catch (error) {
    console.error('خطأ في fetchUsersWithCVs:', error);
    throw error;
  }
};

export const validateToken = (): boolean => {
  let token = getCookie('authToken');
  if (!token && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('authToken');
  }
  
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      deleteCookie('authToken');
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      return false;
    }
    
    return true;
  } catch {
    return true;
  }
};

export const setAuthToken = (token: string, days: number = 30): void => {
  setCookie('authToken', token, days);
  
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};
export const removeAuthToken = (): void => {
  console.log(' بدء حذف التوكن...');
  
  deleteCookie('authToken');
  console.log(' تم محاولة حذف التوكن من cookies');
  
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log(' تم حذف التوكن من localStorage');
    } catch (error) {
      console.error(' خطأ في حذف من localStorage:', error);
    }
  }
  
  const remainingCookie = getCookie('authToken');
  const remainingLocal = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  if (!remainingCookie && !remainingLocal) {
    console.log(' تم حذف التوكن بنجاح من جميع المواقع');
  } else {
    console.warn(' التوكن لا يزال موجوداً:', { 
      cookie: remainingCookie ? 'موجود' : 'محذوف',
      localStorage: remainingLocal ? 'موجود' : 'محذوف'
    });
  }
};

export const clearAllAuthData = (): void => {
  console.log(' بدء تنظيف جميع بيانات المصادقة...');
  
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const cookieName = cookie.split('=')[0].trim();
      if (cookieName.includes('auth') || cookieName.includes('token') || cookieName.includes('session')) {
        deleteCookie(cookieName);
        console.log(` حذف cookie: ${cookieName}`);
      }
    }
    deleteCookie('authToken');
  }
  
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const keysToRemove = ['authToken', 'user', 'token', 'session'];
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(` حذف من localStorage: ${key}`);
    });
  }
  
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
    console.log(' تم مسح sessionStorage');
  }
  
  console.log(' تم تنظيف جميع بيانات المصادقة');
};

export const debugAuthToken = (): void => {
  console.log(' فحص حالة التوكن:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const cookieToken = getCookie('authToken');
  console.log(' Cookies:');
  console.log('  authToken:', cookieToken ? `موجود (${cookieToken.substring(0, 20)}...)` : ' غير موجود');
  console.log('  All cookies:', document.cookie || 'فارغ');
  
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const localToken = localStorage.getItem('authToken');
    console.log('\n localStorage:');
    console.log('  authToken:', localToken ? `موجود (${localToken.substring(0, 20)}...)` : ' غير موجود');
    console.log('  user:', localStorage.getItem('user') || ' غير موجود');
    console.log('  All keys:', Object.keys(localStorage));
  }
  
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    console.log('\n sessionStorage:');
    console.log('  Keys:', Object.keys(sessionStorage));
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

export const checkAuthStatus = async (): Promise<boolean> => {
  if (!validateToken()) {
    return false;
  }

  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
};

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAuthToken = debugAuthToken;
  (window as any).clearAllAuthData = clearAllAuthData;
  (window as any).removeAuthToken = removeAuthToken;
  console.log(' دوال الاختبار متاحة في console:');
  console.log('  - debugAuthToken() : فحص حالة التوكن');
  console.log('  - clearAllAuthData() : حذف جميع البيانات');
  console.log('  - removeAuthToken() : حذف التوكن فقط');
}