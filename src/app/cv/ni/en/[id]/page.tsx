'use client';
import React, { useState, useRef } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, Code, Languages, FolderOpen, Trash2, Download } from 'lucide-react';

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

const CVTemplate: React.FC = () => {
  const cvRef = useRef<HTMLDivElement>(null);
  
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Tarek Elsayed',
    title: 'Full Stack Developer',
    email: 'tarekelsayed@gmail.com',
    phone: '+201098765432',
    location: 'Cairo, Egypt',
website: 'https:
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: 'GitHub', url: 'github.com/tarekelsayed', icon: 'github' },
    { platform: 'LinkedIn', url: 'linkedin.com/in/tarekelsayed', icon: 'linkedin' },
    { platform: 'Behance', url: 'behance.net/tarekelsayed', icon: 'globe' }
  ]);

  const [summary, setSummary] = useState('Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications. Proficient in modern JavaScript frameworks and cloud technologies.');

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Company Inc.',
      duration: 'Jan 2022 - Present',
      description: [
        'Led development of microservices architecture serving 1M+ users',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored team of 5 junior developers'
      ]
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Solutions Ltd.',
      duration: 'Jun 2019 - Dec 2021',
      description: [
        'Developed and maintained 10+ client web applications',
        'Optimized database queries improving performance by 40%',
        'Collaborated with UX team to implement responsive designs'
      ]
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      year: '2015 - 2019',
      details: 'GPA: 3.8/4.0'
    }
  ]);

  const [skills, setSkills] = useState<string[]>([
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git'
  ]);

  const [certifications, setCertifications] = useState<string[]>([
    'AWS Certified Solutions Architect',
    'Google Cloud Professional Developer',
    'MongoDB Certified Developer'
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      name: 'E-Commerce Platform',
      description: 'Built a full-featured online marketplace with payment integration and real-time inventory management',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: 'github.com/tarekelsayed/ecommerce'
    },
    {
      name: 'Task Management App',
      description: 'Developed a collaborative task management tool with real-time updates and team features',
      technologies: ['React', 'Firebase', 'Tailwind CSS'],
      link: 'github.com/tarekelsayed/taskapp'
    }
  ]);

  const [languages, setLanguages] = useState<{ language: string; level: string }[]>([
    { language: 'English', level: 'Native' },
    { language: 'Spanish', level: 'Intermediate' },
    { language: 'Arabic', level: 'Basic' }
  ]);

  const [customSections, setCustomSections] = useState<CustomSection[]>([
    {
      id: '1',
      title: 'Volunteer Work',
      items: [
        'Code Mentor at Local Coding Bootcamp (2020-Present)',
        'Open Source Contributor - React Documentation'
      ]
    }
  ]);

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: 'New Section',
      items: ['Add your content here']
    };
    setCustomSections([...customSections, newSection]);
  };

  const removeCustomSection = (id: string) => {
    setCustomSections(customSections.filter(section => section.id !== id));
  };

  const handleDownloadPDF = () => {
    if (!cvRef.current) return;
    window.print();
  };

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div dir="ltr" className="text-left">
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
            left: 0;
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
        {}
        <div className="max-w-4xl mx-auto mb-4 print-hide">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Save as PDF
          </button>
        </div>

        <div ref={cvRef} data-cv-content className="max-w-4xl mx-auto bg-white shadow-lg">
          {}
          <div className="border-b-2 border-gray-300 p-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{personalInfo.name}</h1>
            <h2 className="text-xl text-gray-700 mb-4">{personalInfo.title}</h2>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
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

            <div className="flex flex-wrap gap-3 mt-4">
              {socialLinks.map((link, index) => (
<a key={index} href={`https:
                  {getIcon(link.icon)}
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>

          {}
          <div className="p-8">
            {}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300">
                Professional Summary
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
            </section>

            {}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Work Experience
              </h3>
              {experiences.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{exp.title}</h4>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 text-sm">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Education
              </h3>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{edu.degree}</h4>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.details && <p className="text-gray-600 text-sm">{edu.details}</p>}
                    </div>
                    <span className="text-gray-600 text-sm">{edu.year}</span>
                  </div>
                </div>
              ))}
            </section>

            {}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <Code className="w-6 h-6" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Certifications
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                {certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </section>

            {}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <FolderOpen className="w-6 h-6" />
                Projects
              </h3>
              {projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">{project.name}</h4>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-1">
                    {
}
                  </div>
                  {project.link && (
<a href={`https:
                      {project.link}
                    </a>
                  )}
                </div>
              ))}
            </section>

            {}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <Languages className="w-6 h-6" />
                Languages
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-800 font-medium">{lang.language}</span>
                    <span className="text-gray-600">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>

            {}
            {
}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVTemplate;