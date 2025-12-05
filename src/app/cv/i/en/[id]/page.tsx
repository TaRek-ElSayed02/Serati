
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
  name: 'Tarek Elsayed',
  title: 'Full Stack Developer',
  email: 'tarekelsayed@gmail.com',
  phone: '+201098765432',
  location: 'Cairo, Egypt',
website: 'https:
};

const socialLinks: SocialLink[] = [
  { platform: 'GitHub', url: 'github.com/tarekelsayed', icon: 'github' },
  { platform: 'LinkedIn', url: 'linkedin.com/in/tarekelsayed', icon: 'linkedin' },
  { platform: 'Behance', url: 'behance.net/tarekelsayed', icon: 'globe' }
];

const summary: string = 'Full-Stack Developer with over 5 years of experience building scalable web applications. Highly proficient in modern JavaScript frameworks and cloud computing technologies.';

const experiences: Experience[] = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Advanced Technology Co.',
    duration: 'Jan 2022 - Present',
    description: [
      'Led the development of a microservices architecture serving over a million users.',
      'Implemented CI/CD pipelines, reducing deployment time by 60%.',
      'Mentored a team of 5 junior developers.'
    ]
  },
  {
    title: 'Full Stack Developer',
    company: 'Digital Solutions Ltd',
    duration: 'Jun 2019 - Dec 2021',
    description: [
      'Developed and maintained over 10 client web applications.',
      'Optimized database queries, leading to a 40% performance improvement.',
      'Collaborated with the UX team to implement responsive designs.'
    ]
  }
];

const education: Education[] = [
  {
    degree: 'BSc in Computer Science',
    institution: 'Technology University',
    year: '2015 - 2019',
    details: 'GPA: 3.8/4.0'
  }
];

const skills: string[] = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'CI/CD'
];

const certifications: string[] = [
  'AWS Certified Solutions Architect',
  'Google Cloud Professional Developer',
  'MongoDB Certified Developer'
];

const projects: Project[] = [
  {
    name: 'E-commerce Platform',
    description: 'Built a fully-featured e-commerce marketplace with integrated payment and real-time inventory management.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    link: 'github.com/tarekelsayed/ecommerce'
  },
  {
    name: 'Task Management App',
    description: 'Developed a collaborative task management tool with instant updates and team features.',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    link: 'github.com/tarekelsayed/taskapp'
  }
];

const languages: { language: string; level: string }[] = [
  { language: 'Arabic', level: 'Native' },
  { language: 'English', level: 'Advanced' },
  { language: 'French', level: 'Intermediate' }
];

const customSections: CustomSection[] = [
  {
    id: '1',
    title: 'Volunteering',
    items: [
      'Coding Mentor at a local programming boot camp (2020 - Present)',
      'Open Source Contributor - React Documentation'
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

const EnglishCV: React.FC = () => {
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
            min-height: 100vh;
          }
          
          .sidebar-column {
            min-height: 100vh !important;
            height: auto !important;
          }
        }
      `}</style>
      
      <div dir="ltr" className="min-h-screen bg-gray-100 p-8 print-container">
        
        <div className="print-hidden max-w-4xl mx-auto mb-4 flex justify-start">
          <button
            onClick={handlePrint}
            className="bg-[#192A3D] hover:bg-[#192A3D]/80 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download as PDF</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto bg-white shadow-xl grid grid-cols-12 cv-content">

          
          <div className="sidebar-column col-span-4 bg-gray-50 border-r border-gray-200 p-6 flex flex-col items-center space-y-8">

            
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-md flex items-center justify-center bg-gray-200">
              <User className="w-16 h-16 text-gray-600" />
            </div>

            
            <section className="w-full text-left">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-1 mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-start items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-600" />
<a href={`https:
                </div>
              </div>

              <div dir='ltr' className="flex gap-4 mt-3 pt-3 border-t">
                {socialLinks.map((link, index) => (
<a key={index} href={`https:
                    {getIcon(link.icon)}
                  </a>
                ))}
              </div>
            </section>

            
            <section className="w-full text-left">
              <h3 className="text-xl justify-start font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-gray-700" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap justify-start gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            
            <section className="w-full text-left">
              <h3 className="text-xl justify-start font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-700" />
                Certifications
              </h3>
              <ul dir="ltr" className="list-disc text-gray-700 space-y-1 pl-5 text-sm">
                {certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </section>

            
            <section className="w-full text-left">
              <h3 className="text-xl justify-start font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2">
                <Languages className="w-5 h-5 text-gray-700" />
                Languages
              </h3>
              <div className="space-y-1 text-sm">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-800 font-medium">{lang.language}</span>
                    <span className="text-gray-600">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          
          <div className="col-span-8 p-8">

            
            <header className="mb-8 pb-4 border-b-4 border-gray-600">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{personalInfo.name}</h1>
              <h2 className="text-2xl text-gray-600 font-semibold">{personalInfo.title}</h2>
            </header>

            
            <section className="mb-8">
              <h3 className="text-2xl justify-start font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <User className="w-6 h-6 text-gray-700" />
                Professional Summary
              </h3>
              <p className="text-gray-700 leading-relaxed text-left">{summary}</p>
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl justify-start font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-gray-700" />
                Work Experience
              </h3>
              {experiences.map((exp, index) => (
                <div key={index} className="mb-6 border-l-4 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{exp.title}</h4>
                      <p className="text-gray-600 text-start font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 text-sm">{exp.duration}</span>
                  </div>
                  <ul dir="ltr" className="list-disc text-left text-gray-700 space-y-1 pl-5 text-sm marker:text-gray-600">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            
            <section className="mb-8">
              <h3 className="text-2xl justify-start font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-gray-700" />
                Education
              </h3>
              {education.map((edu, index) => (
                <div key={index} className="mb-4 text-left">
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

            
            <section className="mb-8">
              <h3 className="text-2xl justify-start font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-gray-700" />
                Projects
              </h3>
              {projects.map((project, index) => (
                <div key={index} className="mb-4 text-left">
                  <h4 className="text-lg font-semibold text-gray-800">{project.name}</h4>
                  <p className="text-gray-700 mb-1 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-1">
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
                <h3 className="text-2xl justify-start font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                  {section.title}
                </h3>
                <ul dir="ltr" className="list-disc text-left text-gray-700 space-y-2 pl-5 text-sm marker:text-gray-600">
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

export default EnglishCV;