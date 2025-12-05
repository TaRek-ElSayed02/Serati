'use client';
import { useState } from 'react';
import { Search, Edit2, Trash2, FileText, Calendar, Download, Eye, User, Loader, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import UserEdit from '../../components/UserEdit/UserEdit';
import { useCVs, useDeleteCV, useRefreshCVs, CV } from '../../hooks/useCVs';

export default function CVManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, cvId: '', cvTitle: '' });
  const [viewModal, setViewModal] = useState({ isOpen: false, cv: null as CV | null });
  const [editModal, setEditModal] = useState({ isOpen: false, cv: null as CV | null });
  
  const { data: cvs = [], isLoading, error, isFetching } = useCVs();
  const deleteCVMutation = useDeleteCV();
  const refreshCVs = useRefreshCVs();

  const { data: session, status } = useSession();

  const openDeleteModal = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, cvId: id, cvTitle: title });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, cvId: '', cvTitle: '' });
  };

  const deleteCV = async () => {
    try {
      await deleteCVMutation.mutateAsync(deleteModal.cvId);
      closeDeleteModal();
    } catch (err) {
      console.error('خطأ في حذف السيرة الذاتية:', err);
    }
  };

  const openViewModal = (cv: CV) => {
    setViewModal({ isOpen: true, cv });
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, cv: null });
  };

  const openEditModal = (cv: CV) => {
    setEditModal({ isOpen: true, cv });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, cv: null });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  const handleRefresh = () => {
    refreshCVs();
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin w-8 h-8 text-[#192A3D]" />
          <span className="text-lg text-[#192A3D]" style={{ fontFamily: 'cairo' }}>جاري تحميل السير الذاتية...</span>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">حدث خطأ</h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <button 
              onClick={handleRefresh}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedCVs = [...cvs].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    } else if (sortBy === 'date-asc') {
      return a.updatedAt.getTime() - b.updatedAt.getTime();
    } else if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const filteredCVs = sortedCVs.filter(cv => {
    const matchesSearch = cv.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cv.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCVs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCVs = filteredCVs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6" dir="rtl">

      {}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من حذف السيرة الذاتية <span className="font-semibold">{deleteModal.cvTitle}</span>؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={closeDeleteModal} 
                  disabled={deleteCVMutation.isPending}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50" 
                >
                  إلغاء
                </button>
                <button 
                  onClick={deleteCV} 
                  disabled={deleteCVMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50" 
                >
                  {deleteCVMutation.isPending && <Loader className="animate-spin w-4 h-4" />}
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {viewModal.isOpen && viewModal.cv && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{viewModal.cv.title}</h3>
                <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600 transition" >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">المسمى الوظيفي:</span>
                    <p className="text-gray-900 mt-1">{viewModal.cv.jobTitle}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">الحالة:</span>
                    <p className="text-gray-900 mt-1">{viewModal.cv.isactive === 'yes' ? 'مفعل' : 'غير مفعل'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">تاريخ الإنشاء:</span>
                    <p className="text-gray-900 mt-1">{formatDate(viewModal.cv.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">آخر تحديث:</span>
                    <p className="text-gray-900 mt-1">{formatDate(viewModal.cv.updatedAt)}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 flex gap-3">
                  <a href={viewModal.cv.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-2 bg-[#192A3D] text-white rounded-lg hover:bg-[#0f1a28] transition flex items-center justify-center gap-2" >
                    <Download size={18} /> تحميل السيرة الذاتية
                  </a>
                  <button onClick={closeViewModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition" >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {editModal.isOpen && editModal.cv && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-[90%] max-h-[100vh] overflow-y-auto">
            <div className="p-0">
              <div className="flex justify-start">
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
                  title="إغلاق"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <UserEdit initialData={editModal.cv} onClose={closeEditModal} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-start justify-start gap-2 text-gray-600">
              <User size={40} />
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">إدارة السير الذاتية</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={isFetching}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 font-medium disabled:opacity-50"
              title="إعادة تحميل البيانات"
            >
              <RefreshCw size={20} className={isFetching ? 'animate-spin' : ''} />
              {isFetching ? 'جاري التحديث...' : 'تحديث'}
            </button>
            <button 
              className="px-6 py-3 bg-[#192A3D] text-white rounded-lg hover:bg-[#0f1a28] transition flex items-center gap-2 font-medium cursor-pointer" 
              onClick={() => router.push('/dashboard/resume')}
            >
              <FileText size={20} /> إضافة سيرة ذاتية جديدة
            </button>
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-r-4 border-[#192A3D]">
          <div className="flex items-center justify-between max-w-xs">
            <div>
              <p className="text-gray-500 text-sm mb-1">إجمالي السير الذاتية</p>
              <p className="text-3xl font-bold text-[#192A3D]">{cvs.length}</p>
            </div>
            <div className="w-14 h-14 bg-opacity-10 rounded-lg flex items-center justify-center">
              <FileText size={28} className="text-[#192A3D]" />
            </div>
          </div>
        </div>

        {}
        {cvs.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center mb-6">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">لم تقم بإنشاء أي سيرة ذاتية!</h3>
            <p className="text-gray-500 mb-6">ابدأ بإنشاء سيرتك الذاتية الأولى لتظهر هنا</p>
            <button 
              onClick={() => router.push('/dashboard/resume')}
              className="px-8 py-3 bg-[#192A3D] text-white rounded-lg hover:bg-[#0f1a28] transition inline-flex items-center gap-2 font-medium"
            >
              <FileText size={20} />
              إنشاء سيرة ذاتية جديدة
            </button>
          </div>
        )}

        {}
        {cvs.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="البحث في السير الذاتية..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" 
                />
              </div>
            </div>

            {}
            <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-gray-600" />
                  <span className="text-gray-700 font-medium">الترتيب:</span>
                </div>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] bg-gray-50" 
                >
                  <option value="date-desc">التحديث (الأحدث أولاً)</option>
                  <option value="date-asc">التحديث (الأقدم أولاً)</option>
                  <option value="title-asc">العنوان (أ-ي)</option>
                  <option value="title-desc">العنوان (ي-أ)</option>
                </select>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {paginatedCVs.map((cv) => (
                <div key={cv.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{cv.title}</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="font-medium">الوظيفة:</span>
                        <span className="line-clamp-1">{cv.jobTitle}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="font-medium">الحالة:</span>
                        <span className="line-clamp-1">{cv.isactive === 'yes' ? 'مفعل' : 'غير مفعل'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>آخر تحديث: {formatDate(cv.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                      <button onClick={() => openViewModal(cv)} className="p-2 border border-[#192A3D] hover:bg-[#192A3D] hover:text-white text-[#192A3D] rounded-lg transition flex items-center justify-center" title="عرض" >
                        <Eye size={18} />
                      </button>
                      <button onClick={() => openEditModal(cv)} className="p-2 border border-[#2d4a5f] hover:bg-[#2d4a5f] hover:text-white text-[#2d4a5f] rounded-lg transition flex items-center justify-center" title="تعديل" >
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => openDeleteModal(cv.id, cv.title)} className="p-2 border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition flex items-center justify-center" title="حذف" >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 order-2 sm:order-1">
                    عرض {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredCVs.length)} من {filteredCVs.length} سيرة ذاتية
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
                          className={`px-4 py-2 rounded-lg transition ${currentPage === page ? 'bg-[#192A3D] text-white' : 'border border-gray-200 hover:bg-gray-50'}`} 
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
            )}
          </>
        )}
      </div>
    </div>
  );
}