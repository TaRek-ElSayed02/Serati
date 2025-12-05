'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, Globe, User, Briefcase, GraduationCap, Award, Languages, FileText, Link, Loader, CheckCircle, XCircle } from 'lucide-react';

const mockSession = {
    user: {
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com'
    }
};

interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    jobTitle: string;
    summary: string;
}

interface Experience {
    id: string;
    title: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface SocialLink {
    id: string;
    platform: string;
    url: string;
    username?: string;
}

interface Education {
    id: string;
    degree: string;
    institution: string;
    location: string;
    certificatelink: string;
    startDate: string;
    endDate: string;
    currentlyEnrolled: boolean;
    gpa: string;
}

interface Skill {
    id: string;
    name: string;
    type: 'tech' | 'soft';
    level: string;
}

interface Language {
    id: string;
    name: string;
    proficiency: string;
}

interface Certificate {
    id: string;
    name: string;
    issuer: string;
    link: string;
    startDate: string;
    endDate: string;
    current: boolean;
}

interface CustomSection {
    id: string;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    current: boolean;
}

interface Project {
    id: string;
    name: string;
    content: string;
}

export default function CVCreator() {
    const [language, setLanguage] = useState<'ar' | 'en'>('ar');
    const [activeTab, setActiveTab] = useState('personal');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const [session] = useState(mockSession);
    const [status] = useState('authenticated');
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        jobTitle: '',
        summary: ''
    });
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [customSections, setCustomSections] = useState<CustomSection[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && saveDisabled) {
            setSaveDisabled(false);
        }
    }, [countdown, saveDisabled]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="flex items-center gap-3">
                    <Loader className="animate-spin w-8 h-8 text-[#192A3D]" />
                    <span className="text-lg text-[#192A3D]">جاري التحميل...</span>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <p className="text-lg text-[#192A3D]">غير مصرح بالدخول، جاري التوجيه...</p>
                </div>
            </div>
        );
    }

    const isRTL = language === 'ar';

    const translations = {
        ar: {
            title: 'إنشاء السيرة الذاتية',
            selectLanguage: 'اختر اللغة',
            arabic: 'عربي',
            english: 'English',
            personalInfo: 'المعلومات الشخصية',
            experience: 'الخبرات',
            education: 'التعليم',
            skills: 'المهارات',
            languagesTab: 'اللغات',
            certificates: 'الشهادات',
            projects: 'المشاريع',
            customSections: 'أقسام إضافية',
            fullName: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            phone: 'رقم الهاتف',
            address: 'العنوان',
            jobTitlePersonal: 'المسمى الوظيفي الحالي',
            summary: 'نبذة تعريفية',
            summaryPlaceholder: 'اكتب نبذة مختصرة عنك وعن خبراتك...',
            addExperience: 'إضافة خبرة',
            jobTitle: 'المسمى الوظيفي',
            company: 'اسم الشركة',
            location: 'الموقع',
            startDate: 'تاريخ البدء',
            endDate: 'تاريخ الانتهاء',
            currentJob: 'أعمل حالياً في هذه الوظيفة',
            description: 'الوصف',
            descriptionPlaceholder: 'اكتب وصفاً للمهام والمسؤوليات...',
            addEducation: 'إضافة مؤهل دراسي',
            degree: 'الدرجة العلمية',
            institution: 'المؤسسة التعليمية',
            currentlyEnrolled: 'أدرس حاليًا هنا',
            graduationDate: 'تاريخ التخرج',
            gpa: 'المعدل التراكمي',
            addSkill: 'إضافة مهارة',
            skillName: 'اسم المهارة',
            skillType: 'نوع المهارة',
            technicalSkills: 'مهارات تقنية (Technical)',
            softSkills: 'مهارات ناعمة (Soft)',
            skillLevel: 'مستوى الإتقان',
            beginner: 'مبتدئ',
            intermediate: 'متوسط',
            advanced: 'متقدم',
            expert: 'خبير',
            addLanguage: 'إضافة لغة',
            languageName: 'اسم اللغة',
            proficiency: 'مستوى الإتقان',
            basic: 'أساسي',
            conversational: 'محادثة',
            fluent: 'طليق',
            native: 'لغة أم',
            addCertificate: 'إضافة شهادة',
            certificateName: 'اسم الشهادة / الدورة',
            issuer: 'الجهة المانحة',
            certificateLink: 'رابط الشهادة',
            certificateStartDate: 'تاريخ البدء',
            certificateEndDate: 'تاريخ الانتهاء',
            inProgress: 'حاليًا/غير منتهي',
            addProject: 'إضافة مشروع',
            projectName: 'اسم المشروع',
            projectContent: 'محتوى المشروع',
            projectPlaceholder: 'اكتب تفاصيل المشروع...',
            addCustomSection: 'إضافة قسم جديد',
            sectionTitle: 'عنوان القسم',
            sectionContent: 'المحتوى',
            sectionPlaceholder: 'اكتب محتوى القسم...',
            sectionActive: 'ما زال مستمرًا (Present)',
            save: 'حفظ',
            preview: 'معاينة',
            delete: 'حذف',
            socialMedia: 'وسائل التواصل الاجتماعي',
            addSocialMedia: 'إضافة وسيلة تواصل',
            platform: 'المنصة',
            url: 'الرابط',
            username: 'اسم المستخدم (اختياري)',
            selectPlatform: 'اختر المنصة',
            other: 'أخرى',
            saving: 'جاري الحفظ...',
            saveSuccess: 'تم حفظ السيرة الذاتية بنجاح!',
            saveError: 'حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.',
            personalInfoError: 'فشل حفظ المعلومات الشخصية',
            dataValidationError: 'يرجى ملء جميع الحقول المطلوبة',
            saveDisabledMessage: 'يمكنك الحفظ مرة أخرى بعد'
        },
        en: {
            title: 'Create CV',
            selectLanguage: 'Select Language',
            arabic: 'عربي',
            english: 'English',
            personalInfo: 'Personal Information',
            experience: 'Work Experience',
            education: 'Education',
            skills: 'Skills',
            languagesTab: 'Languages',
            certificates: 'Certificates',
            projects: 'Projects',
            customSections: 'Custom Sections',
            fullName: 'Full Name',
            email: 'Email Address',
            phone: 'Phone Number',
            address: 'Address',
            jobTitlePersonal: 'Current Job Title',
            summary: 'Professional Summary',
            summaryPlaceholder: 'Write a brief summary about yourself and your experience...',
            addExperience: 'Add Experience',
            jobTitle: 'Job Title',
            company: 'Company Name',
            location: 'Location',
            startDate: 'Start Date',
            endDate: 'End Date',
            currentJob: 'Currently working here',
            description: 'Description',
            descriptionPlaceholder: 'Describe your responsibilities and achievements...',
            addEducation: 'Add Education',
            degree: 'Degree',
            institution: 'Institution',
            currentlyEnrolled: 'Currently Enrolled Here',
            graduationDate: 'Graduation Date',
            gpa: 'GPA',
            addSkill: 'Add Skill',
            skillName: 'Skill Name',
            skillType: 'Skill Type',
            technicalSkills: 'Technical Skills',
            softSkills: 'Soft Skills',
            skillLevel: 'Proficiency Level',
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced',
            expert: 'Expert',
            addLanguage: 'Add Language',
            languageName: 'Language Name',
            proficiency: 'Proficiency',
            basic: 'Basic',
            conversational: 'Conversational',
            fluent: 'Fluent',
            native: 'Native',
            addCertificate: 'Add Certificate',
            certificateName: 'Certificate Name / Course',
            issuer: 'Issuing Organization',
            certificateLink: 'Certificate Link',
            certificateStartDate: 'Start Date',
            certificateEndDate: 'Completion Date',
            inProgress: 'Present / In Progress',
            addProject: 'Add Project',
            projectName: 'Project Name',
            projectContent: 'Project Content',
            projectPlaceholder: 'Write project details...',
            addCustomSection: 'Add Custom Section',
            sectionTitle: 'Section Title',
            sectionContent: 'Content',
            sectionPlaceholder: 'Write section content...',
            sectionActive: 'Still Active (Present)',
            save: 'Save',
            preview: 'Preview',
            delete: 'Delete',
            socialMedia: 'Social Media',
            addSocialMedia: 'Add Social Media',
            platform: 'Platform',
            url: 'URL',
            username: 'Username',
            selectPlatform: 'Select Platform',
            other: 'Other',
            saving: 'Saving...',
            saveSuccess: 'CV saved successfully!',
            saveError: 'An error occurred while saving. Please try again.',
            personalInfoError: 'Failed to save personal information',
            dataValidationError: 'Please fill in all required fields',
            saveDisabledMessage: 'You can save again after'
        }
    };
    const t = translations[language];

    const addExperience = () => {
        setExperiences([...experiences, { id: Date.now().toString(), title: '', jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }]);
    };
    const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
        setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };
    const deleteExperience = (id: string) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const addEducation = () => {
        setEducation([...education, {
            id: Date.now().toString(),
            degree: '',
            institution: '',
            location: '',
            certificatelink: '',
            startDate: '',
            endDate: '',
            currentlyEnrolled: false,
            gpa: ''
        }]);
    };
    const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
        setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };
    const deleteEducation = (id: string) => {
        setEducation(education.filter(edu => edu.id !== id));
    };

    const addSkill = () => {
        setSkills([...skills, { id: Date.now().toString(), name: '', type: 'tech', level: 'intermediate' }]);
    };
    const updateSkill = (id: string, field: keyof Skill, value: string) => {
        setSkills(skills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill));
    };
    const deleteSkill = (id: string) => {
        setSkills(skills.filter(skill => skill.id !== id));
    };

    const addLanguage = () => {
        setLanguages([...languages, { id: Date.now().toString(), name: '', proficiency: 'conversational' }]);
    };
    const updateLanguage = (id: string, field: keyof Language, value: string) => {
        setLanguages(languages.map(lang => lang.id === id ? { ...lang, [field]: value } : lang));
    };
    const deleteLanguage = (id: string) => {
        setLanguages(languages.filter(lang => lang.id !== id));
    };

    const addCertificate = () => {
        setCertificates([...certificates, {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            link: '',
            startDate: '',
            endDate: '',
            current: false
        }]);
    };
    const updateCertificate = (id: string, field: keyof Certificate, value: string | boolean) => {
        setCertificates(certificates.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
    };
    const deleteCertificate = (id: string) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const addCustomSection = () => {
        setCustomSections([...customSections, {
            id: Date.now().toString(),
            title: '',
            content: '',
            startDate: '',
            endDate: '',
            current: false
        }]);
    };
    const updateCustomSection = (id: string, field: keyof CustomSection, value: string | boolean) => {
        setCustomSections(customSections.map(section => section.id === id ? { ...section, [field]: value } : section));
    };
    const deleteCustomSection = (id: string) => {
        setCustomSections(customSections.filter(section => section.id !== id));
    };

    const addProject = () => {
        setProjects([...projects, { id: Date.now().toString(), name: '', content: '' }]);
    };
    const updateProject = (id: string, field: keyof Project, value: string) => {
        setProjects(projects.map(project => project.id === id ? { ...project, [field]: value } : project));
    };
    const deleteProject = (id: string) => {
        setProjects(projects.filter(project => project.id !== id));
    };

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { id: Date.now().toString(), platform: '', url: '', username: '' }]);
    };
    const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
        setSocialLinks(socialLinks.map(link => link.id === id ? { ...link, [field]: value } : link));
    };
    const deleteSocialLink = (id: string) => {
        setSocialLinks(socialLinks.filter(link => link.id !== id));
    };

    const handleSave = async () => {
        if (!session?.user?.id) {
            setSaveMessage({ type: 'error', text: language === 'ar' ? 'خطأ: لم يتم العثور على معرف المستخدم' : 'Error: User ID not found' });
            return;
        }

        if (!personalInfo.fullName || !personalInfo.email) {
            setSaveMessage({ type: 'error', text: t.dataValidationError });
            return;
        }

        setIsSaving(true);
        setSaveMessage({ type: '', text: '' });

        try {
            console.log('Saving personal info...');
            const token = localStorage.getItem('authToken');
            const userCVResponse = await fetch('http://localhost:5000/api/usercv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    userid: session.user.id,
                    fullname: personalInfo.fullName,
                    email: personalInfo.email,
                    phone: personalInfo.phone,
                    address: personalInfo.address,
                    about: personalInfo.summary,
                    currentjob: personalInfo.jobTitle,
                    templateid: 1,
                    imagename: null
                })
            });

            if (!userCVResponse.ok) {
                const errorData = await userCVResponse.json();
                throw new Error(errorData.message || t.personalInfoError);
            }

            const userCVData = await userCVResponse.json();
            console.log('UserCV saved successfully:', userCVData);

            const usercvid = userCVData.data?.id || 
                             userCVData.data?.usercvid || 
                             userCVData.id || 
                             userCVData.usercvid ||
                             userCVData.data?.insertId ||
                             userCVData.insertId;
            
            if (!usercvid) {
                console.error('Full response:', userCVData);
                throw new Error('لم يتم الحصول على معرف السيرة الذاتية. الرجاء التحقق من رد الخادم.');
            }

            console.log('New Usercv ID:', usercvid);

            const savePromises = [];

            socialLinks.forEach(link => {
                if (link.platform && link.url) {
                    const socialData = {
                        usercvid: usercvid,
                        socialname: link.platform,
                        usernamesocial: link.username || '',
                        link: link.url
                    };
                    console.log('Saving social link:', socialData);
                    savePromises.push(
                        fetch('http://localhost:5000/api/social', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include',
                            body: JSON.stringify(socialData)
                        }).then(async res => {
                            if (!res.ok) {
                                const error = await res.json();
                                console.error('Social link save error:', error);
                                throw new Error(error.message || 'Failed to save social link');
                            }
                            return res.json();
                        })
                    );
                }
            });

            experiences.forEach(exp => {
                if (exp.jobTitle && exp.company) {
                    const expData = {
                        usercvid: usercvid,
                        jobtitle: exp.jobTitle,
                        companyname: exp.company,
                        location: exp.location,
                        startdate: exp.startDate,
                        enddate: exp.current ? '' : exp.endDate,
                        description: exp.description,
                        worknow: exp.current === true ? 'yes' : 'no'
                    };
                    console.log('Saving experience:', expData);
                    savePromises.push(
                        fetch('http://localhost:5000/api/experience', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include',
                            body: JSON.stringify(expData)
                        }).then(async res => {
                            if (!res.ok) {
                                const error = await res.json();
                                console.error('Experience save error:', error);
                                throw new Error(error.message || 'Failed to save experience');
                            }
                            return res.json();
                        })
                    );
                }
            });

            education.forEach(edu => {
                if (edu.degree && edu.institution) {
                    const eduData = {
                        usercvid: usercvid,
                        degree: edu.degree,
                        institution: edu.institution,
                        startdate: edu.startDate,
                        enddate: edu.currentlyEnrolled ? '' : edu.endDate,
                        currentlearn: edu.currentlyEnrolled === true ? 'yes' : 'no',
                        certificatelink: edu.certificatelink || '',
                        GPA: edu.gpa || ''
                    };
                    console.log('Saving education:', eduData);
                    savePromises.push(
                        fetch('http://localhost:5000/api/education', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include',
                            body: JSON.stringify(eduData)
                        }).then(async res => {
                            if (!res.ok) {
                                const error = await res.json();
                                console.error('Education save error:', error);
                                throw new Error(error.message || 'Failed to save education');
                            }
                            return res.json();
                        })
                    );
                }
            });

            skills.forEach(skill => {
                if (skill.name) {
                    const skillData = {
                        usercvid: usercvid,
                        skillname: skill.name,
                        level: skill.level,
                        type: skill.type
                    };
                    console.log('Saving skill:', skillData);
                    savePromises.push(
                        fetch('http://localhost:5000/api/skills', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include',
                            body: JSON.stringify(skillData)
                        }).then(async res => {
                            if (!res.ok) {
                                const error = await res.json();
                                console.error('Skill save error:', error);
                                throw new Error(error.message || 'Failed to save skill');
                            }
                            return res.json();
                        })
                    );
                }
            });

            languages.forEach(lang => {
                if (lang.name) {
                    let apiLevel = lang.proficiency;
                    if (apiLevel === 'conversational') apiLevel = 'intermediate';
                    if (apiLevel === 'fluent') apiLevel = 'advanced';
                    if (apiLevel === 'native') apiLevel = 'native';
                    if (apiLevel === 'basic') apiLevel = 'beginner';
                    
                    const langData = {
                        usercvid: usercvid,
                        languagename: lang.name,
                        level: apiLevel
                    };
                    console.log('Saving language:', langData);
                    savePromises.push(
                        fetch('http://localhost:5000/api/language', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include',
                            body: JSON.stringify(langData)
                        }).then(async res => {
                            if (!res.ok) {
                                const error = await res.json();
                                console.error('Language save error:', error);
                                throw new Error(error.message || 'Failed to save language');
                            }
                            return res.json();
                        })
                    );
                }
            });


            certificates.forEach(cert => {
                if (cert.name) {
                    const certData = {
                        usercvid: usercvid,
                        certificatename: cert.name,
                        link: cert.link,
                        startdate: cert.startDate,
                        enddate: cert.current ? '' : cert.endDate
                    };
                    console.log('Saving certificate:', certData);
                    savePromises.push(
                        fetch('http://localhost:5000/api/certificate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include',
                            body: JSON.stringify(certData)
                        }).then(async res => {
                            if (!res.ok) {
                                const error = await res.json();
                                console.error('Certificate save error:', error);
                                throw new Error(error.message || 'Failed to save certificate');
                            }
                            return res.json();
                        })
                    );
                }
            });


            projects.forEach(project => {
                if (project.name && project.content) {
                    const projectData = {
                        usercvid: usercvid,
                        projectname: project.name,
                        content: project.content
                    };
                    console.log('Saving project:', projectData);
                    savePromises.push(
                        fetch('http://localhost:5000/api/project', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include',
                            body: JSON.stringify(projectData)
                        }).then(async res => {
                            if (!res.ok) {
                                const error = await res.json();
                                console.error('Project save error:', error);
                                throw new Error(error.message || 'Failed to save project');
                            }
                            return res.json();
                        })
                    );
                }
            });


            customSections.forEach(section => {
                if (section.title && section.content) {
                    const sectionData = {
                        usercvid: usercvid,
                        sectiontitle: section.title,
                        addcontent: section.content,
                        startdate: section.startDate,
                        enddate: section.current ? '' : section.endDate
                    };
                    console.log('Saving custom section:', sectionData);
                    savePromises.push(
                        fetch('http://localhost:5000/api/additional', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include',
                            body: JSON.stringify(sectionData)
                        }).then(async res => {
                            if (!res.ok) {
                                const error = await res.json();
                                console.error('Custom section save error:', error);
                                throw new Error(error.message || 'Failed to save custom section');
                            }
                            return res.json();
                        })
                    );
                }
            });


            console.log(`Saving ${savePromises.length} additional items...`);
            await Promise.all(savePromises);

            console.log('All data saved successfully!');
            setSaveMessage({ type: 'success', text: t.saveSuccess });

            setPersonalInfo({
                fullName: '',
                email: '',
                phone: '',
                address: '',
                jobTitle: '',
                summary: ''
            });
            setExperiences([]);
            setEducation([]);
            setSkills([]);
            setLanguages([]);
            setCertificates([]);
            setProjects([]);
            setCustomSections([]);
            setSocialLinks([]);

            setSaveDisabled(true);
            setCountdown(120);

            setTimeout(() => {
                setSaveMessage({ type: '', text: '' });
            }, 5000);

        } catch (error) {
            console.error('Error saving CV:', error);
            setSaveMessage({ 
                type: 'error', 
                text: error instanceof Error ? error.message : t.saveError 
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-6 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">{t.title}</h1>
                    <div className="flex items-center gap-3 bg-white rounded-xl shadow-md p-2">
                        <Globe size={20} className="text-gray-600" />
                        <button onClick={() => setLanguage('ar')} className={`px-4 py-2 rounded-lg transition font-medium ${language === 'ar' ? 'bg-[#192A3D] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {t.arabic}
                        </button>
                        <button onClick={() => setLanguage('en')} className={`px-4 py-2 rounded-lg transition font-medium ${language === 'en' ? 'bg-[#192A3D] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {t.english}
                        </button>
                    </div>
                </div>

                {saveMessage.text && (
                    <div className={`mb-6 p-4 rounded-xl shadow-md flex items-center gap-3 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {saveMessage.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <span className="font-medium">{saveMessage.text}</span>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md mb-6 overflow-x-auto">
                    <div className="flex border-b border-gray-200 min-w-max">
                        {[
                            { id: 'personal', label: t.personalInfo, icon: User },
                            { id: 'social', label: t.socialMedia, icon: Globe },
                            { id: 'experience', label: t.experience, icon: Briefcase },
                            { id: 'education', label: t.education, icon: GraduationCap },
                            { id: 'skills', label: t.skills, icon: Award },
                            { id: 'certificates', label: t.certificates, icon: FileText },
                            { id: 'projects', label: t.projects, icon: Briefcase },
                            { id: 'languages', label: t.languagesTab, icon: Languages },
                            { id: 'custom', label: t.customSections, icon: Plus }
                        ].map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center m-auto gap-2 px-4 sm:px-6 py-3 lg:px-2 sm:py-4 font-semibold transition whitespace-nowrap ${activeTab === tab.id ? 'text-[#192A3D] border-b-2 border-[#192A3D]' : 'text-gray-600 hover:text-gray-900'}`}>
                                <tab.icon size={18} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">

                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.fullName}</label>
                                    <input type="text" value={personalInfo.fullName} onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                </div>
                                <div>
                                    <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.jobTitlePersonal}</label>
                                    <input type="text" value={personalInfo.jobTitle} onChange={(e) => setPersonalInfo({ ...personalInfo, jobTitle: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                </div>
                                <div>
                                    <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                                    <input type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                </div>
                                <div>
                                    <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
                                    <input type="tel" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.address}</label>
                                    <input type="text" value={personalInfo.address} onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.summary}</label>
                                <textarea value={personalInfo.summary} onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })} placeholder={t.summaryPlaceholder} rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                            </div>
                        </div>
                    )}
                    {activeTab === 'social' && (
                        <div className="space-y-4">
                            {socialLinks.map((link, index) => (
                                <div key={link.id} className="p-4 border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">{t.socialMedia} {index + 1}</h3>
                                        <button onClick={() => deleteSocialLink(link.id)} className="p-2 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.platform}</label>
                                            <select value={link.platform} onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]">
                                                <option value="">{t.selectPlatform}</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="github">GitHub</option>
                                                <option value="twitter">Twitter</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="behance">Behance</option>
                                                <option value="dribbble">Dribble</option>
                                                <option value="portfolio">Portfolio</option>
                                                <option value="website">Website</option>
                                                <option value="other">{t.other}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.username}</label>
                                            <input type="text" value={link.username || ''} onChange={(e) => updateSocialLink(link.id, 'username', e.target.value)} placeholder="@username" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.url}</label>
                                            <input type="url" value={link.url} onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addSocialLink} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                <Plus size={20} /> {t.addSocialMedia}
                            </button>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="space-y-6">
                            {experiences.map((exp, index) => (
                                <div key={exp.id} className="p-4 border border-gray-200 rounded-xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">{t.experience} {index + 1}</h3>
                                        <button onClick={() => deleteExperience(exp.id)} className="p-2 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.jobTitle}</label>
                                            <input type="text" value={exp.jobTitle} onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.company}</label>
                                            <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.location}</label>
                                            <input type="text" value={exp.location} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.startDate}</label>
                                            <input type="date" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.endDate}</label>
                                            <input type="date" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] disabled:bg-gray-100" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="w-4 h-4 text-[#192A3D] border-gray-300 rounded focus:ring-[#192A3D]" />
                                                <span className="text-sm text-gray-700">{t.currentJob}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.description}</label>
                                        <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder={t.descriptionPlaceholder} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addExperience} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                <Plus size={20} /> {t.addExperience}
                            </button>
                        </div>
                    )}

                    {activeTab === 'education' && (
                        <div className="space-y-6">
                            {education.map((edu, index) => (
                                <div key={edu.id} className="p-4 border border-gray-200 rounded-xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">{t.education} {index + 1}</h3>
                                        <button onClick={() => deleteEducation(edu.id)} className="p-2 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.degree}</label>
                                            <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.institution}</label>
                                            <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.location}</label>
                                            <input type="text" value={edu.location} onChange={(e) => updateEducation(edu.id, 'location', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.startDate}</label>
                                            <input type="date" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.endDate}</label>
                                            <input type="date" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} disabled={edu.currentlyEnrolled} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] disabled:bg-gray-100" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={edu.currentlyEnrolled} onChange={(e) => updateEducation(edu.id, 'currentlyEnrolled', e.target.checked)} className="w-4 h-4 text-[#192A3D] border-gray-300 rounded focus:ring-[#192A3D]" />
                                                <span className="text-sm text-gray-700">{t.currentlyEnrolled}</span>
                                            </label>
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.gpa}</label>
                                            <input type="text" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.5 / 4.0" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Link size={14} className="inline" />{t.certificateLink}</label>
                                            <input type="url" value={edu.certificatelink} onChange={(e) => updateEducation(edu.id, 'certificatelink', e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEducation} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                <Plus size={20} /> {t.addEducation}
                            </button>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="space-y-4">
                            {skills.map((skill) => (
                                <div key={skill.id} className="p-4 border border-gray-200 rounded-xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.skillName}</label>
                                                <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                            </div>
                                            <div>
                                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.skillLevel}</label>
                                                <select value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]">
                                                    <option value="beginner">{t.beginner}</option>
                                                    <option value="intermediate">{t.intermediate}</option>
                                                    <option value="advanced">{t.advanced}</option>
                                                    <option value="expert">{t.expert}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.skillType}</label>
                                                <div className="flex gap-4 mt-6">
                                                    <label className="flex items-center gap-1 cursor-pointer">
                                                        <input type="radio" name={`skill-type-${skill.id}`} value="tech" checked={skill.type === 'tech'} onChange={() => updateSkill(skill.id, 'type', 'tech')} className="w-4 h-4 text-[#192A3D] border-gray-300 focus:ring-[#192A3D]" />
                                                        <span className="text-sm text-gray-700">{t.technicalSkills}</span>
                                                    </label>
                                                    <label className="flex items-center gap-1 cursor-pointer">
                                                        <input type="radio" name={`skill-type-${skill.id}`} value="soft" checked={skill.type === 'soft'} onChange={() => updateSkill(skill.id, 'type', 'soft')} className="w-4 h-4 text-[#192A3D] border-gray-300 focus:ring-[#192A3D]" />
                                                        <span className="text-sm text-gray-700">{t.softSkills}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteSkill(skill.id)} className="p-2 hover:bg-red-50 rounded-lg transition flex-shrink-0">
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addSkill} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                <Plus size={20} /> {t.addSkill}
                            </button>
                        </div>
                    )}

                    {activeTab === 'languages' && (
                        <div className="space-y-4">
                            {languages.map((lang) => (
                                <div key={lang.id} className="p-4 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.languageName}</label>
                                            <input type="text" value={lang.name} onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.proficiency}</label>
                                            <select value={lang.proficiency} onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]">
                                                <option value="basic">{t.basic}</option>
                                                <option value="conversational">{t.conversational}</option>
                                                <option value="fluent">{t.fluent}</option>
                                                <option value="native">{t.native}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteLanguage(lang.id)} className="p-2 hover:bg-red-50 rounded-lg transition">
                                        <Trash2 size={18} className="text-red-600" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={addLanguage} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                <Plus size={20} /> {t.addLanguage}
                            </button>
                        </div>
                    )}

                    {activeTab === 'certificates' && (
                        <div className="space-y-4">
                            {certificates.map((cert, index) => (
                                <div key={cert.id} className="p-4 border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">{t.certificates} {index + 1}</h3>
                                        <button onClick={() => deleteCertificate(cert.id)} className="p-2 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.certificateName}</label>
                                            <input type="text" value={cert.name} onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.issuer}</label>
                                            <input type="text" value={cert.issuer} onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Link size={14} className="inline" />{t.certificateLink}</label>
                                            <input type="url" value={cert.link} onChange={(e) => updateCertificate(cert.id, 'link', e.target.value)} placeholder="https://cert.link..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.certificateStartDate}</label>
                                            <input type="date" value={cert.startDate} onChange={(e) => updateCertificate(cert.id, 'startDate', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.certificateEndDate}</label>
                                            <input type="date" value={cert.endDate} onChange={(e) => updateCertificate(cert.id, 'endDate', e.target.value)} disabled={cert.current} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] disabled:bg-gray-100" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={cert.current} onChange={(e) => updateCertificate(cert.id, 'current', e.target.checked)} className="w-4 h-4 text-[#192A3D] border-gray-300 rounded focus:ring-[#192A3D]" />
                                                <span className="text-sm text-gray-700">{t.inProgress}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addCertificate} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                <Plus size={20} /> {t.addCertificate}
                            </button>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            {projects.map((project, index) => (
                                <div key={project.id} className="p-4 border border-gray-200 rounded-xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">{t.projects} {index + 1}</h3>
                                        <button onClick={() => deleteProject(project.id)} className="p-2 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.projectName}</label>
                                        <input type="text" value={project.name} onChange={(e) => updateProject(project.id, 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                    </div>
                                    <div>
                                        <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.projectContent}</label>
                                        <textarea value={project.content} onChange={(e) => updateProject(project.id, 'content', e.target.value)} placeholder={t.projectPlaceholder} rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addProject} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                <Plus size={20} /> {t.addProject}
                            </button>
                        </div>
                    )}

                    {activeTab === 'custom' && (
                        <div className="space-y-6">
                            {customSections.map((section, index) => (
                                <div key={section.id} className="p-4 border border-gray-200 rounded-xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">{t.customSections} {index + 1}</h3>
                                        <button onClick={() => deleteCustomSection(section.id)} className="p-2 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.sectionTitle}</label>
                                            <input type="text" value={section.title} onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.startDate}</label>
                                                <input type="date" value={section.startDate} onChange={(e) => updateCustomSection(section.id, 'startDate', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                            </div>
                                            <div>
                                                <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.endDate}</label>
                                                <input type="date" value={section.endDate} onChange={(e) => updateCustomSection(section.id, 'endDate', e.target.value)} disabled={section.current} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D] disabled:bg-gray-100" />
                                            </div>
                                            <div className="flex items-center">
                                                <label className="flex items-center mt-8 gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={section.current} onChange={(e) => updateCustomSection(section.id, 'current', e.target.checked)} className="w-4 h-4 text-[#192A3D] border-gray-300 rounded focus:ring-[#192A3D]" />
                                                    <span className="text-sm text-gray-700">{t.sectionActive}</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-start text-sm font-medium text-gray-700 mb-2">{t.sectionContent}</label>
                                            <textarea value={section.content} onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)} placeholder={t.sectionPlaceholder} rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addCustomSection} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                <Plus size={20} /> {t.addCustomSection}
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving || saveDisabled}
                        className="flex-1 px-6 py-3 bg-[#192A3D] text-white rounded-xl shadow-lg hover:bg-[#0f1a28] transition flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader className="animate-spin" size={20} /> 
                                {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                            </>
                        ) : saveDisabled ? (
                            <>
                                <Save size={20} /> 
                                {language === 'ar' 
                                    ? `${t.saveDisabledMessage} ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
                                    : `${t.saveDisabledMessage} ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
                                }
                            </>
                        ) : (
                            <>
                                <Save size={20} /> {t.save}
                            </>
                        )}
                    </button>
                    <button className="flex-1 px-6 py-3 border-2 border-[#192A3D] text-[#192A3D] rounded-xl shadow-lg hover:bg-[#192A3D] hover:text-white transition flex items-center justify-center gap-2 font-semibold">
                        <Eye size={20} /> {t.preview}
                    </button>
                </div>
            </div>
        </div>
    );
}