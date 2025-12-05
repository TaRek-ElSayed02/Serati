'use client';
import { useState } from 'react';
import { Search, Edit2, Trash2, Filter, Calendar, Loader, RefreshCw, User, Mail, Phone, Cake, Shield, Eye, FileText, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUsers, useDeleteUser, useUpdateUser } from '../../hooks/useUsers';
import { UserWithCVs } from '../../api/services';
import AdminEdit from '../../components/AdminEdit/AdminEdit';

interface CV {
  id: string;
  title: string;
  jobTitle: string;
  company: string;
  isactive: string;
  createdAt: Date;
  updatedAt: Date;
  fileUrl: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter,] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: '',
    userName: '',
isSelfDelete: false
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: UserWithCVs | null }>({ isOpen: false, user: null });
  const [editFormData, setEditFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    DOB: '',
    role: ''
  });
  const [cvsModal, setcvsModal] = useState<{ isOpen: boolean; user: UserWithCVs | null }>({ isOpen: false, user: null });

  const [cvEditModal, setCvEditModal] = useState<{ isOpen: boolean; cvId: string | null }>({ isOpen: false, cvId: null });

  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const { data: users = [], isLoading, isError, refetch } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();

  const convertUserCVToCV = (userCV: any): CV | null => {
    if (!userCV) return null;
    
    return {
      id: userCV.id,
      title: userCV.title || 'سيرة ذاتية',
      jobTitle: userCV.currentjob || '',
      company: userCV.company || '',
      isactive: userCV.isactive || 'no',
      createdAt: new Date(userCV.created_at || userCV.modified_at || Date.now()),
      updatedAt: new Date(userCV.modified_at || userCV.created_at || Date.now()),
      fileUrl: userCV.fileUrl || ''
    };
  };

  if (sessionStatus === 'loading' || isLoading) {
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
    router.push('/auth/login');
    return null;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#192A3D] text-white rounded-lg hover:bg-[#0f1a28]"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const openDeleteModal = (id: string, name: string) => {
    const isSelfDelete = id === session.user.id;

    setDeleteModal({
      isOpen: true,
      userId: id,
      userName: `${name}`,
      isSelfDelete
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      userId: '',
      userName: '',
      isSelfDelete: false
    });
  };

  const openEditModal = (user: UserWithCVs) => {
    setEditModal({ isOpen: true, user });
    setEditFormData({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      DOB: user.DOB || '',
      role: user.role || 'user'
    });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, user: null });
    setEditFormData({
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      phone: '',
      DOB: '',
      role: ''
    });
  };

  const openCVsModal = (user: UserWithCVs) => {
    setcvsModal({ isOpen: true, user });
  };

  const closeCVsModal = () => {
    setcvsModal({ isOpen: false, user: null });
  };

  const openCVEditModal = (cvId: string) => {
    setCvEditModal({ isOpen: true, cvId });
  };

  const closeCVEditModal = () => {
    setCvEditModal({ isOpen: false, cvId: null });
  };

  const handleSaveUser = () => {
    if (!editModal.user) return;

    const updateData: Record<string, any> = ;
    (Object.keys(editFormData) as Array<keyof typeof editFormData>).forEach(key => {
      const newValue = editFormData[key];
      const oldValue = editModal.user?.[key as keyof UserWithCVs];
      if (newValue && newValue !== oldValue) {
        updateData[key] = newValue;
      }
    });

    if (Object.keys(updateData).length === 0) {
      closeEditModal();
      return;
    }

    updateUserMutation.mutate(
      { userId: editModal.user.id, userData: updateData },
      {
        onSuccess: () => {
          closeEditModal();
        },
        onError: (error: any) => {
          alert(error.message || 'حدث خطأ أثناء التعديل');
        }
      }
    );
  };

  const deleteUser = () => {
    if (deleteModal.userId === session.user.id) {
      alert('لا يمكنك حذف حسابك الشخصي');
      closeDeleteModal();
      return;
    }

    deleteUserMutation.mutate(deleteModal.userId, {
      onSuccess: () => {
        closeDeleteModal();
      },
      onError: (error: any) => {
        if (error.message.includes('لا يمكنك حذف حسابك الشخصي')) {
          alert(error.message);
        }
        closeDeleteModal();
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;

    if (sortBy === 'date-desc') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'date-asc') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortBy === 'name-asc') {
      return `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`);
    } else if (sortBy === 'name-desc') {
      return `${b.firstname} ${b.lastname}`.localeCompare(`${a.firstname} ${a.lastname}`);
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || (roleFilter === 'مدير' && user.role === 'admin') || (roleFilter === 'مستخدم' && user.role === 'user');
    const matchesStatus = statusFilter === 'all';
    return matchesSearch && matchesRole && matchesStatus;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6" dir="rtl">
      
      {cvEditModal.isOpen && cvEditModal.cvId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-[90%] max-h-[100vh] overflow-y-auto">
            <div className="flex justify-start p-2">
              <button
                onClick={closeCVEditModal}
                className="text-gray-400 hover:text-gray-600 transition p-1"
                title="إغلاق"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-0">
              <AdminEdit 
                initialData={convertUserCVToCV(cvsModal.user?.cvs?.find((cv: any) => cv.id === cvEditModal.cvId))} 
                onClose={closeCVEditModal} 
              />
            </div>
          </div>
        </div>
      )}

      
      {cvsModal.isOpen && cvsModal.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#192A3D] flex items-center justify-center text-white text-lg font-semibold">
                    {getInitials(cvsModal.user.firstname, cvsModal.user.lastname)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      السير الذاتية - {cvsModal.user.firstname} {cvsModal.user.lastname}
                    </h3>
                    <p className="text-gray-600 text-sm">إجمالي {cvsModal.user.cvCount || 0} سيرة ذاتية</p>
                  </div>
                </div>
                <button
                  onClick={closeCVsModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cvsModal.user.cvs && cvsModal.user.cvs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cvsModal.user.cvs.map((cv: any) => (
                    <div key={cv.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition overflow-hidden">
                      <div className="p-4">
                        <div className="mb-3">
                          <h4 className="text-lg font-bold text-gray-900 line-clamp-2">{cv.title || 'سيرة ذاتية'}</h4>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="font-medium">الوظيفة:</span>
                            <span className="line-clamp-1">{cv.currentjob || 'غير محدد'}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="font-medium">الحالة:</span>
                            <span className="line-clamp-1">{cv.isactive}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>آخر تحديث: {cv.modified_at ? formatDate(cv.modified_at) : 'غير متاح'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => router.push(`/cv/ni/ar/${cv.id}`)}
                            className="p-2 border border-[#192A3D] hover:bg-[#192A3D] hover:text-white text-[#192A3D] rounded-lg transition flex items-center justify-center gap-2"
                            title="عرض"
                          >
                            <Eye size={16} />
                            <span className="text-sm">عرض</span>
                          </button>
                          <button
                            onClick={() => openCVEditModal(cv.id)}
                            className="p-2 border border-[#2d4a5f] hover:bg-[#2d4a5f] hover:text-white text-[#2d4a5f] rounded-lg transition flex items-center justify-center gap-2"
                            title="تعديل"
                          >
                            <Edit2 size={16} />
                            <span className="text-sm">تعديل</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">لا توجد سير ذاتية لهذا المستخدم</p>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={closeCVsModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              {deleteModal.isSelfDelete ? (
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <AlertCircle size={48} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-red-600 mb-2">غير مسموح</h3>
                  <p className="text-gray-600 mb-6">
                    لا يمكنك حذف حسابك الشخصي.
                    <br />
                    يرجى التواصل مع مدير النظام إذا كنت ترغب في حذف حسابك.
                  </p>
                  <button
                    onClick={closeDeleteModal}
                    className="px-6 py-2 bg-[#192A3D] text-white rounded-lg hover:bg-[#0f1a28] transition"
                  >
                    فهمت
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">تأكيد الحذف</h3>
                  <p className="text-gray-600 mb-6">
                    هل أنت متأكد من حذف المستخدم <span className="font-semibold">{deleteModal.userName}</span>؟
                    هذا الإجراء لا يمكن التراجع عنه.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={closeDeleteModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={deleteUser}
                      disabled={deleteUserMutation.isPending}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {deleteUserMutation.isPending ? 'جاري الحذف...' : 'حذف'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      
      {editModal.isOpen && editModal.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">تعديل بيانات المستخدم</h3>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-[#192A3D] flex items-center justify-center text-white text-lg font-semibold">
                    {getInitials(editModal.user.firstname, editModal.user.lastname)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {editModal.user.firstname} {editModal.user.lastname}
                    </h4>
                    <p className="text-gray-600 text-sm">{editModal.user.email}</p>
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} />
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      value={editFormData.firstname}
                      onChange={(e) => setEditFormData({ ...editFormData, firstname: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-white"
                      placeholder="أدخل الاسم الأول"
                    />
                  </div>

                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} />
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      value={editFormData.lastname}
                      onChange={(e) => setEditFormData({ ...editFormData, lastname: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-white"
                      placeholder="أدخل الاسم الأخير"
                    />
                  </div>

                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} />
                      اسم المستخدم
                    </label>
                    <input
                      type="text"
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-white"
                      placeholder="أدخل اسم المستخدم"
                    />
                  </div>

                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail size={16} />
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-white"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>

                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone size={16} />
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-white"
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>

                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Cake size={16} />
                      تاريخ الميلاد
                    </label>
                    <input
                      type="date"
                      value={editFormData.DOB}
                      onChange={(e) => setEditFormData({ ...editFormData, DOB: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-white"
                    />
                  </div>

                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Shield size={16} />
                      الدور
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <input
                          type="radio"
                          name="role"
                          value="user"
                          checked={editFormData.role === 'user'}
                          onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                          className="text-[#192A3D] focus:ring-[#192A3D]"
                        />
                        <div>
                          <span className="block font-medium text-gray-900">مستخدم</span>
                          <span className="block text-sm text-gray-600">صلاحيات محدودة</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={editFormData.role === 'admin'}
                          onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                          className="text-[#192A3D] focus:ring-[#192A3D]"
                        />
                        <div>
                          <span className="block font-medium text-gray-900">مدير</span>
                          <span className="block text-sm text-gray-600">صلاحيات كاملة</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={closeEditModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveUser}
                    disabled={updateUserMutation.isPending}
                    className="px-6 py-3 bg-[#192A3D] text-white rounded-lg hover:bg-[#0f1a28] transition font-medium disabled:opacity-50"
                  >
                    {updateUserMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl lg:text-5xl sm:text-2xl ml-auto font-bold text-gray-900">إدارة المستخدمين</h1>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-[#192A3D] text-white rounded-lg hover:bg-[#0f1a28] transition"
          >
            <RefreshCw size={18} />
            <span>تحديث</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث عن المستخدمين..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <span className="text-gray-700 font-medium">الفلاتر:</span>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-gray-50"
              >
                <option value="all">جميع الأدوار</option>
                <option value="مدير">مدير</option>
                <option value="مستخدم">مستخدم</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-600" />
                <span className="text-gray-700 font-medium">الترتيب:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-gray-50"
              >
                <option value="date-desc">تاريخ الإنشاء (الأحدث أولاً)</option>
                <option value="date-asc">تاريخ الإنشاء (الأقدم أولاً)</option>
                <option value="name-asc">الاسم (أ-ي)</option>
                <option value="name-desc">الاسم (ي-أ)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الملف الشخصي</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الاسم الكامل</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عدد الCVs</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رقم الهاتف</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الدور</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">تاريخ الإنشاء</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإعدادات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-9 py-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                        {getInitials(user.firstname, user.lastname)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 font-medium">{`${user.firstname} ${user.lastname}`}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openCVsModal(user)}
                        className="text-[#192A3D] hover:text-[#0f1a28] font-semibold hover:underline cursor-pointer"
                      >
                        {user.cvCount || 0}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a href={`tel:${user.phone}`} className="hover:text-[#192A3D] transition-colors">
                        {user.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-[#192A3D] text-white' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user.id, `${user.firstname} ${user.lastname}`)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-gray-200">
            {paginatedUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                      {getInitials(user.firstname, user.lastname)}
                    </div>
                    <div>
                      <span className="text-[#192A3D] font-medium">{`${user.firstname} ${user.lastname}`}</span>
                      <span className={`block mt-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit ${user.role === 'admin' ? 'bg-[#192A3D] text-white' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mr-12">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">البريد:</span>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">الهاتف:</span>
                    <a href={`tel:${user.phone}`} className="hover:text-[#192A3D] transition-colors">
                      {user.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">عدد CVs:</span>
                    <button
                      onClick={() => openCVsModal(user)}
                      className="text-[#192A3D] hover:text-[#0f1a28] font-semibold hover:underline cursor-pointer"
                    >
                      {user.cvCount || 0}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-xs">{formatDate(user.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 mr-12">
                  <button
                    onClick={() => openEditModal(user)}
                    className="flex-1 p-2 border border-gray-200 hover:bg-gray-100 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} className="text-gray-600" />
                    <span className="text-sm font-medium">تعديل</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(user.id, `${user.firstname} ${user.lastname}`)}
                    className="flex-1 p-2 border border-red-200 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} className="text-red-600" />
                    <span className="text-sm font-medium text-red-600">حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              عرض {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredUsers.length)} من {filteredUsers.length} مستخدم
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2 flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                السابق
              </button>

              <div className="hidden sm:flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition ${currentPage === page
                        ? 'bg-[#192A3D] text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}