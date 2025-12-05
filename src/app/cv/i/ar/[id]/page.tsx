'use client';
import React from 'react';
import {
  Github, Linkedin, Mail, Phone, MapPin, Globe, Award, Briefcase,
  GraduationCap, Code, Languages, FolderOpen, User, Download
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface CustomSection {
  id: string;
  title: string;
  items: string[];
}

const personalInfo = {
  name: 'طارق السيد',
  title: 'مطور تطبيقات متكامل (Full Stack)',
  email: 'tarekelsayed@gmail.com',
  phone: '+201098765432',
  location: 'القاهرة، مصر',
website: 'https://www.google.com',
};

const socialLinks: SocialLink[] = [
  { platform: 'GitHub', url: 'github.com/tarekelsayed', icon: 'github' },
  { platform: 'LinkedIn', url: 'linkedin.com/in/tarekelsayed', icon: 'linkedin' },
  { platform: 'Behance', url: 'behance.net/tarekelsayed', icon: 'globe' }
];

const summary: string = 'مطور تطبيقات متكامل بخبرة تزيد عن 5 سنوات في بناء تطبيقات الويب القابلة للتوسع. يمتلك كفاءة عالية في أطر عمل JavaScript الحديثة وتقنيات الحوسبة السحابية.';

const experiences: Experience[] = [
  {
    title: 'مطور تطبيقات متكامل (Full Stack) - أول',
    company: 'شركة التقنية المتقدمة',
    duration: 'يناير 2022 - حتى الآن',
    description: [
      'قيادة تطوير بنية الخدمات المصغرة (microservices) التي تخدم أكثر من مليون مستخدم.',
      'تنفيذ خطوط أنابيب التكامل المستمر والتسليم المستمر (CI/CD) مما أدى لتقليل وقت النشر بنسبة 60٪.',
      'توجيه فريق مكون من 5 مطورين مبتدئين.'
    ]
  },
  {
    title: 'مطور تطبيقات متكامل (Full Stack)',
    company: 'حلول رقمية محدودة',
    duration: 'يونيو 2019 - ديسمبر 2021',
    description: [
      'تطوير وصيانة أكثر من 10 تطبيقات ويب للعملاء.',
      'تحسين استعلامات قواعد البيانات لرفع الأداء بنسبة 40٪.',
      'التعاون مع فريق تجربة المستخدم (UX) لتطبيق تصميمات متجاوبة (Responsive).'
    ]
  }
];

const education: Education[] = [
  {
    degree: 'بكالوريوس في علوم الحاسب الآلي',
    institution: 'جامعة التكنولوجيا',
    year: '2015 - 2019',
    details: 'المعدل التراكمي: 3.8/4.0'
  }
];

const skills: string[] = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'CI/CD'
];

const certifications: string[] = [
  'شهادة AWS Solutions Architect معتمدة',
  'شهادة Google Cloud Professional Developer',
  'شهادة MongoDB Certified Developer'
];

const projects: Project[] = [
  {
    name: 'منصة التجارة الإلكترونية',
    description: 'بناء سوق إلكتروني متكامل الميزات مع دمج نظام الدفع وإدارة المخزون في الوقت الفعلي.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    link: 'github.com/tarekelsayed/ecommerce'
  },
  {
    name: 'تطبيق إدارة المهام',
    description: 'تطوير أداة تعاونية لإدارة المهام مع تحديثات فورية وميزات للفريق.',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    link: 'github.com/tarekelsayed/taskapp'
  }
];

const languages: { language: string; level: string }[] = [
  { language: 'العربية', level: 'لغة أم' },
  { language: 'الإنجليزية', level: 'متقدم' },
  { language: 'الفرنسية', level: 'متوسط' }
];

const customSections: CustomSection[] = [
  {
    id: '1',
    title: 'العمل التطوعي',
    items: [
      'مرشد برمجي في معسكر تدريب برمجي محلي (2020 - حتى الآن)',
      'مساهم في المصادر المفتوحة - وثائق React'
    ]
  }
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'github': return <Github className="w-4 h-4 text-gray-700" />;
    case 'linkedin': return <Linkedin className="w-4 h-4 text-gray-700" />;
    default: return <Globe className="w-4 h-4 text-gray-700" />;
  }
};

const ArabicCV: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          .print-hidden {
            display: none !important;
          }
          
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          
          .print-container {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .cv-content {
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
      
      <div dir="ltr" className="min-h-screen bg-gray-100 p-8 text-right print-container">
        
        <div className="print-hidden max-w-4xl mx-auto mb-4 flex justify-end">
          <button
            onClick={handlePrint}
            className="bg-[#192A3D] cursor-pointer hover:bg-[#192A3D]/80 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>PDF تحميل</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto bg-white shadow-xl grid grid-cols-12 cv-content">
          
          
          <div className="col-span-4 bg-gray-50 border-l border-gray-200 p-6 flex flex-col items-center space-y-8 order-2">
            
            
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-md flex items-center justify-center bg-gray-200">
              <User className="w-16 h-16 text-gray-600" />
            </div>

            
            <section className="w-full text-right">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-1 mb-3">معلومات التواصل</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2 justify-end">
                  <span>{personalInfo.email}</span>
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span>{personalInfo.phone}</span>
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span>{personalInfo.location}</span>
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex items-center gap-2 justify-end">
<a href={`https:
                  <Globe className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              
              <div className="flex gap-4 mt-3 pt-3 border-t justify-end">
                {socialLinks.map((link, index) => (
<a key={index} href={`https:
                    {getIcon(link.icon)}
                  </a>
                ))}
              </div>
            </section>

            
            <section className="w-full text-right">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2 justify-end">
                المهارات
                <Code className="w-5 h-5 text-gray-700" />
              </h3>
              <div className="flex flex-wrap gap-2 justify-end">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            
            <section className="w-full text-right">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2 justify-end">
                اللغات
                <Languages className="w-5 h-5 text-gray-700" />
              </h3>
              <div className="space-y-1 text-sm">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{lang.level}</span>
                    <span className="text-gray-800 font-medium">{lang.language}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          
          <div className="col-span-8 p-8 order-1">
            
            
            <header className="mb-8 pb-4 border-b-4 border-gray-600">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{personalInfo.name}</h1>
              <h2 className="text-2xl text-gray-600 font-semibold">{personalInfo.title}</h2>
            </header>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-end">
                نبذة عني
                <User className="w-6 h-6 text-gray-700" />
              </h3>
              <p className="text-gray-700 leading-relaxed text-right">{summary}</p>
            </section>
            
            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-end">
                التعليم
                <GraduationCap className="w-6 h-6 text-gray-700" />
              </h3>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">{edu.year}</span>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{edu.degree}</h4>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.details && <p className="text-gray-600 text-sm">{edu.details}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-end">
                الخبرة العملية
                <Briefcase className="w-6 h-6 text-gray-700" />
              </h3>
              {experiences.map((exp, index) => (
                <div key={index} className="mb-6 border-r-4 border-gray-200 pr-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-500 text-sm">{exp.duration}</span>
                    <div className="text-right">
                      <h4 className="text-lg font-semibold text-gray-800">{exp.title}</h4>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                    </div>
                  </div>
                  <ul dir='rtl' className="list-disc text-gray-700 space-y-1 pr-5 text-sm marker:text-gray-600">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
            
            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-end">
                الشهادات
                <Award className="w-6 h-6 text-gray-700" />
              </h3>
              <ul dir='rtl' className="list-disc text-gray-700 space-y-2 pr-5 text-sm marker:text-gray-600">
                {certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-end">
                المشاريع
                <FolderOpen className="w-6 h-6 text-gray-700" />
              </h3>
              {projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">{project.name}</h4>
                  <p className="text-gray-700 mb-1 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-1 justify-end">
                  </div>
                  {project.link && (
<a href={`https:
                      {project.link}
                    </a>
                  )}
                </div>
              ))}
            </section>

            
            {customSections.map((section) => (
              <section key={section.id} className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-end">
                  {section.title}
                </h3>
                <ul dir='rtl' className="list-disc text-gray-700 space-y-2 pr-5 text-sm marker:text-gray-600">
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ArabicCV;