"use client";
import React, { useState, useRef } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  FolderOpen,
  Trash2,
  Download,
} from "lucide-react";

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

const ArabicCVTemplate: React.FC = () => {
  const cvRef = useRef<HTMLDivElement>(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: "طارق السيد",
    title: "مطور تطبيقات متكامل (Full Stack)",
    email: "tarekelsayed@gmail.com",
    phone: "+201098765432",
    location: "القاهرة، مصر",
    website: "https://www.google.com",
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "GitHub", url: "github.com/tarekelsayed", icon: "github" },
    {
      platform: "LinkedIn",
      url: "linkedin.com/in/tarekelsayed",
      icon: "linkedin",
    },
    { platform: "Behance", url: "behance.net/tarekelsayed", icon: "globe" },
  ]);

  const [summary, setSummary] = useState(
    "مطور تطبيقات متكامل بخبرة تزيد عن 5 سنوات في بناء تطبيقات الويب القابلة للتوسع. يمتلك كفاءة عالية في أطر عمل JavaScript الحديثة وتقنيات الحوسبة السحابية."
  );

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      title: "مطور تطبيقات متكامل (Full Stack) - أول",
      company: "شركة التقنية المتقدمة",
      duration: "يناير 2022 - حتى الآن",
      description: [
        "قيادة تطوير بنية الخدمات المصغرة (microservices) التي تخدم أكثر من مليون مستخدم.",
        "تنفيذ خطوط أنابيب التكامل المستمر والتسليم المستمر (CI/CD) مما أدى لتقليل وقت النشر بنسبة 60٪.",
        "توجيه فريق مكون من 5 مطورين مبتدئين.",
      ],
    },
    {
      title: "مطور تطبيقات متكامل (Full Stack)",
      company: "حلول رقمية محدودة",
      duration: "يونيو 2019 - ديسمبر 2021",
      description: [
        "تطوير وصيانة أكثر من 10 تطبيقات ويب للعملاء.",
        "تحسين استعلامات قواعد البيانات لرفع الأداء بنسبة 40٪.",
        "التعاون مع فريق تجربة المستخدم (UX) لتطبيق تصميمات متجاوبة (Responsive).",
      ],
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      degree: "بكالوريوس في علوم الحاسب الآلي",
      institution: "جامعة التكنولوجيا",
      year: "2015 - 2019",
      details: "المعدل التراكمي: 3.8/4.0",
    },
  ]);

  const [skills, setSkills] = useState<string[]>([
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Git",
  ]);

  const [certifications, setCertifications] = useState<string[]>([
    "شهادة AWS Solutions Architect معتمدة",
    "شهادة Google Cloud Professional Developer",
    "شهادة MongoDB Certified Developer",
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      name: "منصة التجارة الإلكترونية",
      description:
        "بناء سوق إلكتروني متكامل الميزات مع دمج نظام الدفع وإدارة المخزون في الوقت الفعلي.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "github.com/tarekelsayed/ecommerce",
    },
    {
      name: "تطبيق إدارة المهام",
      description:
        "تطوير أداة تعاونية لإدارة المهام مع تحديثات فورية وميزات للفريق.",
      technologies: ["React", "Firebase", "Tailwind CSS"],
      link: "github.com/tarekelsayed/taskapp",
    },
  ]);

  const [languages, setLanguages] = useState<
    { language: string; level: string }[]
  >([
    { language: "العربية", level: "لغة أم" },
    { language: "الإنجليزية", level: "متقدم" },
    { language: "الفرنسية", level: "متوسط" },
  ]);

  const [customSections, setCustomSections] = useState<CustomSection[]>([
    {
      id: "1",
      title: "العمل التطوعي",
      items: [
        "مرشد برمجي في معسكر تدريب برمجي محلي (2020 - حتى الآن)",
        "مساهم في المصادر المفتوحة - وثائق React",
      ],
    },
  ]);

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: "قسم جديد",
      items: ["أضف محتواك هنا"],
    };
    setCustomSections([...customSections, newSection]);
  };

  const removeCustomSection = (id: string) => {
    setCustomSections(customSections.filter((section) => section.id !== id));
  };

  const handleDownloadPDF = () => {
    if (!cvRef.current) return;
    window.print();
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "github":
        return <Github className="w-4 h-4" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div dir="rtl" className="text-right">
      <style>{`
        
        @media print {
          @page {
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          [data-cv-content], [data-cv-content] * {
            visibility: visible;
          }
          [data-cv-content] {
            position: absolute;
            right: 0; 
            top: 0;
            width: 100%;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        
        <div className="max-w-4xl mx-auto mb-4 print-hide">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            حفظ كملف PDF
          </button>
        </div>

        <div
          ref={cvRef}
          data-cv-content
          className="max-w-4xl mx-auto bg-white shadow-lg"
        >
          
          <div className="border-b-2 border-gray-300 p-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              {personalInfo.name}
            </h1>
            <h2 className="text-xl text-gray-700 mb-4">{personalInfo.title}</h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700 justify-start">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{personalInfo.website}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 justify-start">
              {socialLinks.map((link, index) => (
                <a key={index} href={`https://www.google.com`}>
                  {getIcon(link.icon)}
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>

          
          <div className="p-8">
            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300">
                الملخص المهني
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                {summary}
              </p>
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold  text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-start">
                <Briefcase className="w-6 h-6" />
                الخبرة العملية
              </h3>
              {experiences.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-right">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {exp.title}
                      </h4>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {exp.duration}
                    </span>
                  </div>
                  
                  <ul className="list-disc text-gray-700 space-y-1 pr-8 text-right marker:text-gray-900">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-start">
                <GraduationCap className="w-6 h-6" />
                التعليم
              </h3>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div className="text-right">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {edu.degree}
                      </h4>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.details && (
                        <p className="text-gray-600 text-sm">{edu.details}</p>
                      )}
                    </div>
                    <span className="text-gray-600 text-sm">{edu.year}</span>
                  </div>
                </div>
              ))}
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-start">
                <Code className="w-6 h-6" />
                المهارات التقنية
              </h3>
              <div className="flex flex-wrap gap-2 justify-start">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-start">
                <Award className="w-6 h-6" />
                الشهادات
              </h3>
              
              <ul className="list-disc text-gray-700 space-y-2 pr-8 text-right marker:text-gray-900">
                {certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-start">
                <FolderOpen className="w-6 h-6" />
                المشاريع
              </h3>
              {projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {project.name}
                  </h4>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-1 justify-start">
                    
                    
                  </div>
                  {project.link && (
                    <a href={`https://www.google.com`}>{project.link}</a>
                  )}
                </div>
              ))}
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-start">
                <Languages className="w-6 h-6" />
                اللغات
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-800 font-medium">
                      {lang.language}
                    </span>
                    <span className="text-gray-600">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>

            
            {customSections.map((section) => (
              <section key={section.id} className="mb-8">
                <div className="flex justify-between  items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 pb-2 border-b-2 border-gray-300 flex items-center gap-2 justify-start">
                    {section.title}
                  </h3>
                  <button
                    onClick={() => removeCustomSection(section.id)}
                    className="text-red-500 hover:text-red-700 print-hide"
                    aria-label={`حذف قسم ${section.title}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <ul className="list-disc text-gray-700 space-y-2 pr-8 text-right marker:text-gray-900">
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArabicCVTemplate;
