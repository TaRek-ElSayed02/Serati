

    
    
    

    

    

    

    

    

    

            

                
                

        

                        

'use client';
import { useState, useEffect } from 'react';
import { Save, Globe, User, Mail, Phone, Calendar, Lock, X, CheckCircle, Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserSettings {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    dateOfBirth: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = (): string => {
    if (typeof document === 'undefined') return '';
    
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }
    
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('authToken');
        return token || '';
    }
    
    return '';
};

const fetchCurrentUserData = async (): Promise<any> => {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `فشل في جلب البيانات: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'فشل في جلب البيانات');
        }

        return data.data;
    } catch (error: any) {
        console.error('Error in fetchCurrentUserData:', error);
        throw error;
    }
};

const updateUserProfile = async (userData: any): Promise<any> => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `فشل في تحديث البيانات: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || 'فشل في تحديث البيانات');
    }

    return data;
};

const updatePassword = async (passwordData: any): Promise<any> => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/users/password/change`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `فشل في تحديث كلمة المرور: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
        throw new Error(data.message || 'فشل في تحديث كلمة المرور');
    }

    return data;
};

const updateUserAsAdmin = async (userId: string, userData: any): Promise<any> => {
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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `فشل في تحديث البيانات: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
        throw new Error(data.message || 'فشل في تحديث البيانات');
    }

    return data;
};

export default function Settings() {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [userSettings, setUserSettings] = useState<UserSettings>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        dateOfBirth: ''
    });

    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const loadUserData = async () => {
            setIsLoadingData(true);
            setError('');

            try {
                const userData = await fetchCurrentUserData();
                
                setUserSettings({
                    firstName: userData.firstname || '',
                    lastName: userData.lastname || '',
                    username: userData.username || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    dateOfBirth: userData.DOB ? formatDateForInput(userData.DOB) : '',
                });
                
                console.log('تم تحميل بيانات المستخدم:', userData);
            } catch (error: any) {
                console.error('خطأ في تحميل البيانات:', error);
                setError(error.message || 'فشل في تحميل بيانات المستخدم');
            } finally {
                setIsLoadingData(false);
            }
        };

        if (status === 'authenticated') {
            loadUserData();
        }
    }, [status]);

    const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/auth/login');
        }
    }, [session, status, router]);

    if (status === 'loading' || isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="flex items-center gap-3">
                    <Loader className="animate-spin w-8 h-8 text-[#192A3D]" />
                    <span className="text-lg text-[#192A3D]" style={{ fontFamily: 'cairo' }}>
                        {isLoadingData ? 'جاري تحميل البيانات...' : 'جاري التحميل...'}
                    </span>
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

    const isRTL = true;

    const t = {
        title: 'إعدادات الحساب',

        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        username: 'اسم المستخدم',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        dateOfBirth: 'تاريخ الميلاد',
        password: 'كلمة المرور',
        newPassword: 'كلمة المرور الجديدة',
        confirmPassword: 'تأكيد كلمة المرور',

        firstNamePlaceholder: 'أدخل الاسم الأول',
        lastNamePlaceholder: 'أدخل اسم العائلة',
        usernamePlaceholder: 'أدخل اسم المستخدم',
        emailPlaceholder: 'example@email.com',
        phonePlaceholder: '+20 123 456 7890',
        passwordPlaceholder: '••••••••',
        newPasswordPlaceholder: 'أدخل كلمة المرور الجديدة',
        confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور الجديدة',

        save: 'حفظ التغييرات',
        cancel: 'إلغاء',
        changePassword: 'تغيير كلمة المرور',
        savePassword: 'حفظ كلمة المرور',

        confirmTitle: 'تأكيد التغييرات',
        confirmMessage: 'هل أنت متأكد من حفظ التغييرات على بياناتك الشخصية؟',
        changePasswordTitle: 'تغيير كلمة المرور',
        oldPassword: 'كلمة المرور القديمة',
        oldPasswordPlaceholder: 'أدخل كلمة المرور القديمة',
        confirm: 'تأكيد الحفظ',
        passwordError: 'كلمة المرور القديمة غير صحيحة',
        passwordMismatch: 'كلمات المرور غير متطابقة',
        passwordLengthError: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',

        successTitle: 'تم الحفظ بنجاح!',
        successMessage: 'تم حفظ التغييرات على حسابك بنجاح',
        passwordSuccessMessage: 'تم تغيير كلمة المرور بنجاح',
        close: 'إغلاق',

        accountInfo: 'المعلومات الشخصية',
        securityInfo: 'الأمان وكلمة المرور',
        changePasswordNote: 'لتغيير كلمة المرور، اضغط على زر "تغيير كلمة المرور"',
    };

    const handleSaveClick = () => {
        setShowConfirmModal(true);
        setError('');
    };

    const handlePasswordChangeClick = () => {
        setShowPasswordModal(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setError('');
    };

    const handleConfirmSave = async () => {
        setIsLoading(true);
        setError('');

        try {
            const userData: any = {
                firstname: userSettings.firstName,
                lastname: userSettings.lastName,
                username: userSettings.username,
                email: userSettings.email,
                phone: userSettings.phone,
                DOB: userSettings.dateOfBirth,
            };

            let response;

            if ((session as any)?.user?.role === 'admin') {
                if ((session as any)?.user?.id) {
                    response = await updateUserAsAdmin((session as any).user.id, userData);
                } else {
                    throw new Error('معرف المستخدم غير متوفر');
                }
            } else {
                response = await updateUserProfile(userData);
            }

            console.log('تم حفظ الإعدادات بنجاح:', response);

            setShowConfirmModal(false);
            setSuccessMessage(t.successMessage);
            setShowSuccessModal(true);

        } catch (error: any) {
            console.error('خطأ في حفظ الإعدادات:', error);
            setError(error.message || 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmPasswordChange = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError('جميع الحقول مطلوبة');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError(t.passwordLengthError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(t.passwordMismatch);
            return;
        }

        setIsLoading(true);
        setPasswordError('');

        try {
            const passwordData = {
                oldPassword,
                newPassword
            };

            const response = await updatePassword(passwordData);

            console.log('تم تغيير كلمة المرور بنجاح:', response);

            setShowPasswordModal(false);
            setSuccessMessage(t.passwordSuccessMessage);
            setShowSuccessModal(true);

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error: any) {
            console.error('خطأ في تغيير كلمة المرور:', error);
            setPasswordError(error.message || 'فشل في تغيير كلمة المرور');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModals = () => {
        setShowConfirmModal(false);
        setShowPasswordModal(false);
        setShowSuccessModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-6 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto">
                {}
                <div className="mb-6">
                    <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">{t.title}</h1>
                    {session.user.role === 'admin' && (
                        <p className="text-sm text-gray-600 mt-2">وضع المسؤول: يمكنك تعديل بيانات أي مستخدم</p>
                    )}
                </div>

                {}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="text-[#192A3D]" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">{t.accountInfo}</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {}
                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.firstName}
                                </label>
                                <input
                                    type="text"
                                    value={userSettings.firstName}
                                    onChange={(e) => setUserSettings({ ...userSettings, firstName: e.target.value })}
                                    placeholder={t.firstNamePlaceholder}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]"
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.lastName}
                                </label>
                                <input
                                    type="text"
                                    value={userSettings.lastName}
                                    onChange={(e) => setUserSettings({ ...userSettings, lastName: e.target.value })}
                                    placeholder={t.lastNamePlaceholder}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]"
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.username}
                                </label>
                                <input
                                    type="text"
                                    value={userSettings.username}
                                    onChange={(e) => setUserSettings({ ...userSettings, username: e.target.value })}
                                    placeholder={t.usernamePlaceholder}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]"
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.email}
                                </label>
                                <input
                                    type="email"
                                    value={userSettings.email}
                                    onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                                    placeholder={t.emailPlaceholder}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]"
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.phone}
                                </label>
                                <input
                                    type="tel"
                                    value={userSettings.phone}
                                    onChange={(e) => setUserSettings({ ...userSettings, phone: e.target.value })}
                                    placeholder={t.phonePlaceholder}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]"
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.dateOfBirth}
                                </label>
                                <input
                                    type="date"
                                    value={userSettings.dateOfBirth}
                                    onChange={(e) => setUserSettings({ ...userSettings, dateOfBirth: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Lock className="text-[#192A3D]" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">{t.securityInfo}</h2>
                    </div>

                    <div className="space-y-4">
                        <p className="text-gray-600">{t.changePasswordNote}</p>
                        
                        <button
                            onClick={handlePasswordChangeClick}
                            className="px-6 py-3 bg-[#192A3D] text-white rounded-lg hover:bg-[#192A3D]/90 cursor-pointer transition flex items-center gap-2 font-semibold"
                        >
                            <Lock size={18} />
                            {t.changePassword}
                        </button>
                    </div>
                </div>

                {}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={handleSaveClick}
                        disabled={isLoading}
                        className="px-8 py-3 bg-[#192A3D] text-white cursor-pointer rounded-xl shadow-lg hover:bg-[#0f1a28] transition flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin w-5 h-5" />
                        ) : (
                            <Save size={20} />
                        )}
                        {isLoading ? 'جاري الحفظ...' : t.save}
                    </button>
                </div>
            </div>

            {}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{t.confirmTitle}</h3>
                            <button
                                onClick={handleCloseModals}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                disabled={isLoading}
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">{t.confirmMessage}</p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCloseModals}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleConfirmSave}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-[#192A3D] text-white cursor-pointer rounded-lg hover:bg-[#0f1a28] transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading && <Loader className="animate-spin w-4 h-4" />}
                                {t.confirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{t.changePasswordTitle}</h3>
                            <button
                                onClick={handleCloseModals}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                disabled={isLoading}
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.oldPassword}
                                </label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => {
                                        setOldPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    placeholder={t.oldPasswordPlaceholder}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.newPassword}
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    placeholder={t.newPasswordPlaceholder}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                                    {t.confirmPassword}
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    placeholder={t.confirmPasswordPlaceholder}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] disabled:opacity-50"
                                />
                            </div>

                            {passwordError && (
                                <p className="text-red-500 text-sm">{passwordError}</p>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCloseModals}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleConfirmPasswordChange}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-[#192A3D] text-white rounded-lg hover:bg-[#0f1a28] transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading && <Loader className="animate-spin w-4 h-4" />}
                                {t.savePassword}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
                        <div className="flex justify-center mb-4">
                            <CheckCircle size={64} className="text-green-500" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.successTitle}</h3>
                        <p className="text-gray-600 mb-6">{successMessage}</p>

                        <button
                            onClick={handleCloseModals}
                            className="w-full px-6 py-3 bg-[#192A3D] text-white rounded-xl hover:bg-[#0f1a28] transition font-semibold"
                        >
                            {t.close}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}