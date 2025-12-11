'use client';
import React, { useState, useMemo } from 'react';
import { Calendar, User, Clock, ChevronLeft, MessageSquare, Share2, BookOpen, Tag, ArrowRight } from 'lucide-react';

import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Link from 'next/link';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('جميع المقالات');
  const [sortOrder, setSortOrder] = useState('الأحدث');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // عدد المقالات في كل صفحة

  const blogPosts = [
    {
      id: 1,
      title: 'كيف تكتب سيرة ذاتية تجذب انتباه مسؤولي التوظيف في 2026',
      excerpt: 'دليل شامل لكتابة سيرة ذاتية احترافية تجعلك تتفوق على مئات المتقدمين للوظيفة، مع نصائح عملية وأمثلة واقعية.',
      author: 'أحمد محمد',
      date: '15 مارس 2025',
      category: 'نصائح مهنية',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800',
      featured: true,
      timestamp: new Date('2025-03-15').getTime()
    },
    {
      id: 2,
      title: '10 أخطاء شائعة في السيرة الذاتية تسبب رفض طلبك',
      excerpt: 'تجنب هذه الأخطاء الشائعة التي يرتكبها معظم الباحثين عن عمل والتي تؤدي إلى رفض سيرتهم الذاتية.',
      author: 'سارة العلي',
      date: '10 مارس 2025',
      category: 'تطوير المهارات',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-03-10').getTime()
    },
    {
      id: 3,
      title: 'تصميم السيرة الذاتية: الدليل النهائي للألوان والخطوط',
      excerpt: 'كيف تختار الألوان والخطوط المناسبة لسيرتك الذاتية لتعكس شخصيتك المهنية وتجذب انتباه القارئ.',
      author: 'محمد الخالد',
      date: '5 مارس 2025',
      category: 'تصميم',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-03-05').getTime()
    },
    {
      id: 4,
      title: 'كيفية تخصيص السيرة الذاتية لكل وظيفة تقدم لها',
      excerpt: 'لماذا تحتاج إلى تخصيص سيرتك الذاتية لكل وظيفة، وكيف تفعل ذلك بفعالية لزيادة فرصك في القبول.',
      author: 'نورة السعد',
      date: '28 فبراير 2025',
      category: 'استراتيجيات',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-28').getTime()
    },
    {
      id: 5,
      title: 'أسرار كتابة قسم المهارات في السيرة الذاتية',
      excerpt: 'كيف تعرض مهاراتك بطريقة احترافية تجعل مسؤول التوظيف يدرك قيمتك الفورية للمؤسسة.',
      author: 'خالد الفهد',
      date: '22 فبراير 2025',
      category: 'كتابة',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-22').getTime()
    },
    {
      id: 6,
      title: 'السيرة الذاتية الذكية: استخدام الكلمات المفتاحية',
      excerpt: 'كيفية استخدام الكلمات المفتاحية المناسبة لتمرير أنظمة التصفية التلقائية ووصول سيرتك لمسؤول التوظيف.',
      author: 'فاطمة القاسم',
      date: '18 فبراير 2025',
      category: 'تقنية',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-18').getTime()
    },
    {
      id: 7,
      title: 'نصائح لإجراء المقابلات الوظيفية الناجحة',
      excerpt: 'كيفية الاستعداد للمقابلات الوظيفية والإجابة على الأسئلة الصعبة بثقة واحترافية.',
      author: 'علي عبدالله',
      date: '15 فبراير 2025',
      category: 'نصائح مهنية',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-15').getTime()
    },
    {
      id: 8,
      title: 'كيفية كتابة خطاب التغطية المؤثر',
      excerpt: 'دليل عملي لكتابة خطاب تغطية يجذب انتباه مسؤولي التوظيف ويزيد من فرصك في الحصول على الوظيفة.',
      author: 'منى الرشيد',
      date: '12 فبراير 2025',
      category: 'كتابة',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-12').getTime()
    },
    {
      id: 9,
      title: 'أفضل المنصات للبحث عن وظائف في 2025',
      excerpt: 'دليل لأفضل المنصات والمواقع للبحث عن وظائف في مختلف المجالات والقطاعات.',
      author: 'سالم الحربي',
      date: '8 فبراير 2025',
      category: 'استراتيجيات',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-08').getTime()
    },
    {
      id: 10,
      title: 'كيفية بناء شبكة علاقات مهنية فعالة',
      excerpt: 'استراتيجيات عملية لبناء وتطوير شبكة علاقات مهنية تساعدك في التقدم الوظيفي.',
      author: 'لبنى القحطاني',
      date: '5 فبراير 2025',
      category: 'تطوير المهارات',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-05').getTime()
    },
    {
      id: 11,
      title: 'التطور المهني: كيف تخطط لمستقبلك الوظيفي',
      excerpt: 'خطوات عملية للتخطيط لمستقبلك المهني وتحديد الأهداف والتطور المستمر.',
      author: 'فهد العتيبي',
      date: '1 فبراير 2025',
      category: 'تطوير المهارات',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-01').getTime()
    },
    {
      id: 12,
      title: 'أدوات تقنية تساعدك في البحث عن عمل',
      excerpt: 'أهم الأدوات والتطبيقات التقنية التي يمكن أن تساعدك في رحلة البحث عن الوظيفة المناسبة.',
      author: 'نواف الشمري',
      date: '28 يناير 2025',
      category: 'تقنية',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-01-28').getTime()
    },
    {
      id: 13,
      title: 'كيفية التفاوض على الراتب والمزايا',
      excerpt: 'استراتيجيات وحيل ذكية للتفاوض على الراتب والمزايا الوظيفية بثقة واحترافية.',
      author: 'ريم السبيعي',
      date: '25 يناير 2025',
      category: 'نصائح مهنية',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-01-25').getTime()
    },
    {
      id: 14,
      title: 'السيرة الذاتية الإبداعية: متى تكون مناسبة؟',
      excerpt: 'متى يجب استخدام سيرة ذاتية إبداعية ومتى تكون السيرة الذاتية التقليدية هي الخيار الأفضل.',
      author: 'محمد النجدي',
      date: '22 يناير 2025',
      category: 'تصميم',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-01-22').getTime()
    },
    {
      id: 15,
      title: 'كيفية عرض المشاريع السابقة في السيرة الذاتية',
      excerpt: 'طريقة فعالة لعرض مشاريعك السابقة وإنجازاتك في سيرتك الذاتية لجذب انتباه مسؤولي التوظيف.',
      author: 'سلمى الحارثي',
      date: '18 يناير 2025',
      category: 'كتابة',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-01-18').getTime()
    }
  ];

  const categories = [
    'جميع المقالات',
    'نصائح مهنية',
    'تصميم',
    'كتابة',
    'استراتيجيات',
    'تطوير المهارات',
    'تقنية'
  ];

  const popularTags = [
    'سيرة ذاتية',
    'توظيف',
    'مهنة',
    'تصميم',
    'نصائح',
    'وظائف',
    'مهارات',
    'نجاح',
    'تطوير',
    'مهني'
  ];

  const filteredPosts = useMemo(() => {
    let filtered = [...blogPosts];

    if (selectedCategory !== 'جميع المقالات') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    filtered = filtered.filter(post => !post.featured);

    filtered.sort((a, b) => {
      if (sortOrder === 'الأحدث') {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });

    return filtered;
  }, [selectedCategory, sortOrder]);

  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [currentPage, filteredPosts, postsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / postsPerPage);
  }, [filteredPosts.length, postsPerPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  const featuredPost = blogPosts.find(post => post.featured);

  const handleCategorySelect = (category : string) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const handleSortChange = (order : string) => {
    setSortOrder(order);
    setCurrentPage(1); 
  };

  const handlePageChange = (pageNumber : number) => {
    setCurrentPage(pageNumber);
  };

  const handleShare = (postId :number) => {
    console.log('مشاركة المقال:', postId);
  };

  const handleReadMore = (postId:number) => {
    window.location.href = `/blog/${postId}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0A0F1F] to-[#151B2E] text-right">
      <Navbar />

      <main className="flex-grow" dir="rtl">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              المدونة
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              اكتشف أحدث النصائح والأدوات والإرشادات لإنشاء سيرة ذاتية احترافية تساعدك في الحصول على الوظيفة التي تستحقها
            </p>
          </div>
        </section>

        {featuredPost && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-br from-[#1A2035] to-[#0F1525] rounded-2xl overflow-hidden border border-gray-800">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block bg-blue-700/30 text-blue-400 text-sm font-medium px-4 py-1 rounded-full">
                      مقال مميز
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mb-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReadMore(featuredPost.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition w-fit flex items-center gap-2"
                  >
                    اقرأ المقال
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                <div
                  className="h-64 lg:h-auto bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredPost.image})` }}
                />
              </div>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedCategory === 'جميع المقالات' ? 'أحدث المقالات' : selectedCategory}
                  <span className="text-gray-400 text-sm font-normal mr-2">
                    ({filteredPosts.length} مقال)
                  </span>
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">فرز حسب:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-[#1A2035] border border-gray-800 text-white rounded-lg px-4 py-2 text-sm"
                  >
                    <option value="الأحدث">الأحدث</option>
                    <option value="الأقدم">الأقدم</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {currentPosts.length > 0 ? (
                  currentPosts.map(post => (
                    <div key={post.id} className="bg-[#1A2035] rounded-xl overflow-hidden border border-gray-800 hover:border-blue-700/50 transition group">
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-blue-400 text-sm font-medium">
                            {post.category}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {post.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold cursor-pointer text-white mb-3 group-hover:text-blue-400 transition">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleShare(post.id)}
                              className="text-gray-400 hover:text-white transition"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReadMore(post.id)}
                              className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                            >
                              <span className="text-sm">اقرأ المزيد</span>
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-400 text-lg">لا توجد مقالات في هذه الفئة</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center bg-[#1A2035] border border-gray-800 rounded-lg transition ${
                      currentPage === 1 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-white hover:bg-blue-700/20 hover:border-blue-700/50'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 flex items-center justify-center bg-[#1A2035] border border-gray-800 text-white rounded-lg hover:bg-blue-700/20 hover:border-blue-700/50 transition"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="text-gray-400 px-2">...</span>
                      )}
                    </>
                  )}

                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-lg transition ${
                        currentPage === number
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-[#1A2035] border-gray-800 text-gray-400 hover:text-white hover:bg-blue-700/20 hover:border-blue-700/50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="text-gray-400 px-2">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10 flex items-center justify-center bg-[#1A2035] border border-gray-800 text-white rounded-lg hover:bg-blue-700/20 hover:border-blue-700/50 transition"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center bg-[#1A2035] border border-gray-800 rounded-lg transition ${
                      currentPage === totalPages 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-white hover:bg-blue-700/20 hover:border-blue-700/50'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}

              {filteredPosts.length > 0 && (
                <div className="text-center mt-4 text-gray-400 text-sm">
                  عرض المقالات من {(currentPage - 1) * postsPerPage + 1} إلى{' '}
                  {Math.min(currentPage * postsPerPage, filteredPosts.length)} من أصل{' '}
                  {filteredPosts.length} مقال
                </div>
              )}
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-6 space-y-8">
                <div className="bg-[#1A2035] rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    فئات المقالات
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategorySelect(category)}
                        className={`flex items-center justify-between w-full p-3 text-right rounded-lg hover:bg-[#0A0F1F] transition group ${
                          selectedCategory === category 
                            ? 'bg-[#0A0F1F] text-white' 
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <span>{category}</span>
                        {selectedCategory === category && (
                          <ChevronLeft className="w-4 h-4 opacity-100 transition" />
                        )}
                        {selectedCategory !== category && (
                          <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              مقالات قد تعجبك
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              اكتشف المزيد من المحتوى القيم الذي يساعدك في تطوير مسارك المهني
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts
              .filter(post => post.id !== featuredPost?.id)
              .slice(0, 3)
              .map(post => (
                <div key={post.id} className="bg-[#1A2035] rounded-xl p-6 border border-gray-800 hover:border-blue-700/50 transition group">
                  <div className="mb-4">
                    <span className="inline-block bg-blue-700/20 text-blue-400 text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <span className="text-gray-400 text-sm">{post.date}</span>
                    <button
                      onClick={() => handleReadMore(post.id)}
                      className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1 text-sm"
                    >
                      <span>اقرأ المقال</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-12 md:p-16 text-center border border-blue-800/30">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              هل أنت مستعد لإنشاء سيرتك الذاتية؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              ابدأ الآن مجاناً وأنشئ سيرة ذاتية احترافية تفتح لك أبواب الفرص
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
                style={{ color: "white" }}
              >
                ابدأ مجاناً
              </Link>
              <Link
                href="/templates"
                className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-8 py-4 rounded-lg text-lg font-semibold transition"
                style={{ color: "white" }}
              >
                استعرض القوالب
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}