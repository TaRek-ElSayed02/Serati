'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, Globe, User, Briefcase, GraduationCap, Award, Languages, FileText, Link, Loader, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCVById, useUpdateCV, CVData } from '../../hooks/useCVs';

interface CV {
    id: string;
    title: string;
    jobTitle: string;
    company: string;
    createdAt: Date;
    updatedAt: Date;
    fileUrl: string;
}

interface UserEditProps {
    initialData?: CV | null;
    onClose: () => void;
}

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

const API_BASE_URL = 'http://localhost:5000/api';

export default function UserEdit({ initialData, onClose }: UserEditProps) {
    const [language, setLanguage] = useState<'ar' | 'en'>('ar');
    const [activeTab, setActiveTab] = useState('personal');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [currentUsercvId, setCurrentUsercvId] = useState<number | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

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
    
    const router = useRouter();
    const { data: session, status } = useSession();
    
    const { data: cvData, isLoading: isLoadingCV, error: cvError, refetch: refetchCV } = useCVById(initialData?.id || null);
    const updateCVMutation = useUpdateCV();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && saveDisabled) {
            setSaveDisabled(false);
        }
    }, [countdown, saveDisabled]);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/auth/login');
        } else {
            checkUserRole();
        }
    }, [session, status, router]);

    const checkUserRole = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setIsAdmin(userData.role === 'admin');
            }
        } catch (error) {
            console.error('Error checking user role:', error);
        }
    };

    useEffect(() => {
        if (cvData && !isDataLoaded) {
            loadDataFromAPI(cvData);
            setIsDataLoaded(true);
        }
    }, [cvData, isDataLoaded]);

    useEffect(() => {
        if (initialData?.id && !isDataLoaded) {
            refetchCV();
        }
    }, [initialData?.id, isDataLoaded, refetchCV]);

    const loadDataFromAPI = (data: CVData) => {
        console.log('Loading data from API:', data);
        
        if (data.usercv?.id) {
            setCurrentUsercvId(data.usercv.id);
            console.log('Current usercv ID:', data.usercv.id);
        }
        
        setPersonalInfo({
            fullName: data.usercv.fullname || '',
            email: data.usercv.email || '',
            phone: data.usercv.phone || '',
            address: data.usercv.address || '',
            jobTitle: data.usercv.currentjob || '',
            summary: data.usercv.about || ''
        });

        setSocialLinks(data.social.map(social => ({
            id: social.id.toString(),
            platform: social.socialname,
            url: social.link,
            username: social.usernamesocial
        })));

        setExperiences(data.experiences.map(exp => ({
            id: exp.id.toString(),
            title: exp.jobtitle,
            jobTitle: exp.jobtitle,
            company: exp.companyname,
            location: exp.location,
            startDate: exp.startdate ? exp.startdate.split('T')[0] : '',
            endDate: exp.enddate ? exp.enddate.split('T')[0] : '',
            current: exp.worknow === 'yes',
            description: exp.description
        })));

        setEducation(data.education.map(edu => ({
            id: edu.id.toString(),
            degree: edu.degree,
            institution: edu.institution,
            location: '',
            certificatelink: edu.certificatelink || '',
            startDate: edu.startdate ? edu.startdate.split('T')[0] : '',
            endDate: edu.enddate ? edu.enddate.split('T')[0] : '',
            currentlyEnrolled: edu.currentlearn === 'yes',
            gpa: edu.GPA
        })));

        setSkills(data.skills.map(skill => ({
            id: skill.id.toString(),
            name: skill.skillname,
            type: skill.type as 'tech' | 'soft',
            level: skill.level
        })));

        setLanguages(data.languages.map(lang => ({
            id: lang.id.toString(),
            name: lang.languagename,
            proficiency: lang.level
        })));

        setCertificates(data.certificates.map(cert => ({
            id: cert.id.toString(),
            name: cert.certificatename,
            issuer: '',
            link: cert.link,
            startDate: cert.startdate ? cert.startdate.split('T')[0] : '',
            endDate: cert.enddate ? cert.enddate.split('T')[0] : '',
            current: false
        })));

        setProjects(data.projects.map(proj => ({
            id: proj.id.toString(),
            name: proj.projectname,
            content: proj.content
        })));

        setCustomSections(data.additional.map(add => ({
            id: add.id.toString(),
            title: add.sectiontitle,
            content: add.addcontent,
            startDate: add.startdate ? add.startdate.split('T')[0] : '',
            endDate: add.enddate ? add.enddate.split('T')[0] : '',
            current: false
        })));

        console.log('Data loaded successfully into form');
    };

const makeApiRequest = async (url: string, method: string, data?: any) => {
    const token = localStorage.getItem('authToken');
    
    const basePath = isAdmin ? '/admin' : '';
    const apiUrl = url.replace(API_BASE_URL, `${API_BASE_URL}${basePath}`);
    
    const response = await fetch(apiUrl, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Request failed';
        
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
    }

    return response.json();
};

const updatePersonalInfo = async () => {
    if (!initialData?.id) return;

    const data = {
        fullname: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        address: personalInfo.address,
        about: personalInfo.summary,
        currentjob: personalInfo.jobTitle
    };

    const endpoint = isAdmin 
        ? `${API_BASE_URL}/admin/usercv/${initialData.id}`
        : `${API_BASE_URL}/usercv/${initialData.id}`;
    
    await makeApiRequest(endpoint, 'PATCH', data);
};

const manageSocialLinks = async () => {
    if (!currentUsercvId) throw new Error('Usercv ID not found');

    for (const link of socialLinks) {
        if (link.id.startsWith('new-')) {
            const data = {
                usercvid: currentUsercvId,
                socialname: link.platform,
                usernamesocial: link.username || '',
                link: link.url
            };
            const endpoint = isAdmin ? '/admin/social' : '/social';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${link.id}`, 'POST', data);
        } else {
            const data = {
                socialname: link.platform,
                usernamesocial: link.username || '',
                link: link.url
            };
            const endpoint = isAdmin ? '/admin/social' : '/social';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${link.id}`, 'PATCH', data);
        }
    }
};

const manageExperiences = async () => {
    if (!currentUsercvId) throw new Error('Usercv ID not found');

    for (const exp of experiences) {
        if (exp.id.startsWith('new-')) {
            const data = {
                usercvid: currentUsercvId,
                jobtitle: exp.jobTitle,
                companyname: exp.company,
                location: exp.location,
                startdate: exp.startDate || null,
                enddate: exp.current ? null : (exp.endDate || null),
                description: exp.description,
                worknow: exp.current ? 'yes' : 'no'
            };
            const endpoint = isAdmin ? '/admin/experience' : '/experience';
            await makeApiRequest(`${API_BASE_URL}${endpoint}`, 'POST', data);
        } else {
            const data = {
                jobtitle: exp.jobTitle,
                companyname: exp.company,
                location: exp.location,
                startdate: exp.startDate || null,
                enddate: exp.current ? null : (exp.endDate || null),
                description: exp.description,
                worknow: exp.current ? 'yes' : 'no'
            };
            const endpoint = isAdmin ? '/admin/experience' : '/experience';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${exp.id}`, 'PATCH', data);
        }
    }
};

const manageEducation = async () => {
    if (!currentUsercvId) throw new Error('Usercv ID not found');

    for (const edu of education) {
        if (edu.id.startsWith('new-')) {
            const data = {
                usercvid: currentUsercvId,
                degree: edu.degree,
                institution: edu.institution,
                startdate: edu.startDate || null,
                enddate: edu.currentlyEnrolled ? null : (edu.endDate || null),
                currentlearn: edu.currentlyEnrolled ? 'yes' : 'no',
                certificatelink: edu.certificatelink || '',
                GPA: edu.gpa || ''
            };
            const endpoint = isAdmin ? '/admin/education' : '/education';
            await makeApiRequest(`${API_BASE_URL}${endpoint}`, 'POST', data);
        } else {
            const data = {
                degree: edu.degree,
                institution: edu.institution,
                startdate: edu.startDate || null,
                enddate: edu.currentlyEnrolled ? null : (edu.endDate || null),
                currentlearn: edu.currentlyEnrolled ? 'yes' : 'no',
                certificatelink: edu.certificatelink || '',
                GPA: edu.gpa || ''
            };
            const endpoint = isAdmin ? '/admin/education' : '/education';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${edu.id}`, 'PATCH', data);
        }
    }
};

const manageSkills = async () => {
    if (!currentUsercvId) throw new Error('Usercv ID not found');

    for (const skill of skills) {
        if (skill.id.startsWith('new-')) {
            const data = {
                usercvid: currentUsercvId,
                skillname: skill.name,
                level: skill.level,
                type: skill.type
            };
            const endpoint = isAdmin ? '/admin/skills' : '/skills';
            await makeApiRequest(`${API_BASE_URL}${endpoint}`, 'POST', data);
        } else {
            const data = {
                skillname: skill.name,
                level: skill.level,
                type: skill.type
            };
            const endpoint = isAdmin ? '/admin/skills' : '/skills';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${skill.id}`, 'PATCH', data);
        }
    }
};

const manageLanguages = async () => {
    if (!currentUsercvId) throw new Error('Usercv ID not found');

    for (const lang of languages) {
        if (lang.id.startsWith('new-')) {
            const data = {
                usercvid: currentUsercvId,
                languagename: lang.name,
                level: lang.proficiency
            };
            const endpoint = isAdmin ? '/admin/language' : '/language';
            await makeApiRequest(`${API_BASE_URL}${endpoint}`, 'POST', data);
        } else {
            const data = {
                languagename: lang.name,
                level: lang.proficiency
            };
            const endpoint = isAdmin ? '/admin/language' : '/language';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${lang.id}`, 'PATCH', data);
        }
    }
};

const manageCertificates = async () => {
    if (!currentUsercvId) throw new Error('Usercv ID not found');

    for (const cert of certificates) {
        if (cert.id.startsWith('new-')) {
            const data = {
                usercvid: currentUsercvId,
                certificatename: cert.name,
                link: cert.link || '',
                startdate: cert.startDate || null,
                enddate: cert.current ? null : (cert.endDate || null)
            };
            const endpoint = isAdmin ? '/admin/certificate' : '/certificate';
            await makeApiRequest(`${API_BASE_URL}${endpoint}`, 'POST', data);
        } else {
            const data = {
                certificatename: cert.name,
                link: cert.link || '',
                startdate: cert.startDate || null,
                enddate: cert.current ? null : (cert.endDate || null)
            };
            const endpoint = isAdmin ? '/admin/certificate' : '/certificate';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${cert.id}`, 'PATCH', data);
        }
    }
};

const manageProjects = async () => {
    if (!currentUsercvId) throw new Error('Usercv ID not found');

    for (const project of projects) {
        if (project.id.startsWith('new-')) {
            const data = {
                usercvid: currentUsercvId,
                projectname: project.name,
                content: project.content
            };
            const endpoint = isAdmin ? '/admin/project' : '/project';
            await makeApiRequest(`${API_BASE_URL}${endpoint}`, 'POST', data);
        } else {
            const data = {
                projectname: project.name,
                content: project.content
            };
            const endpoint = isAdmin ? '/admin/project' : '/project';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${project.id}`, 'PATCH', data);
        }
    }
};

const manageAdditionalSections = async () => {
    if (!currentUsercvId) throw new Error('Usercv ID not found');

    for (const section of customSections) {
        if (section.id.startsWith('new-')) {
            const data = {
                usercvid: currentUsercvId,
                sectiontitle: section.title,
                addcontent: section.content,
                startdate: section.startDate || null,
                enddate: section.current ? null : (section.endDate || null)
            };
            const endpoint = isAdmin ? '/admin/additional' : '/additional';
            await makeApiRequest(`${API_BASE_URL}${endpoint}`, 'POST', data);
        } else {
            const data = {
                sectiontitle: section.title,
                addcontent: section.content,
                startdate: section.startDate || null,
                enddate: section.current ? null : (section.endDate || null)
            };
            const endpoint = isAdmin ? '/admin/additional' : '/additional';
            await makeApiRequest(`${API_BASE_URL}${endpoint}/${section.id}`, 'PATCH', data);
        }
    }
};

const deleteItem = async (type: string, id: string) => {
    const endpoint = isAdmin ? `/admin/${type}` : `/${type}`;
    await makeApiRequest(`${API_BASE_URL}${endpoint}/${id}`, 'DELETE');
};

    if (status === 'loading' || isLoadingCV) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="flex items-center gap-3">
                    <Loader className="animate-spin w-8 h-8 text-[#192A3D]" />
                    <span className="text-lg text-[#192A3D]" style={{ fontFamily: 'cairo' }}>جاري تحميل البيانات...</span>
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

    const isRTL = language === 'ar';

    const translations = {
        ar: {
            title: 'تعديل السيرة الذاتية',
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
            saveSuccess: 'تم تحديث السيرة الذاتية بنجاح!',
            saveError: 'حدث خطأ أثناء التحديث. يرجى المحاولة مرة أخرى.',
            personalInfoError: 'فشل تحديث المعلومات الشخصية',
            dataValidationError: 'يرجى ملء جميع الحقول المطلوبة',
            saveDisabledMessage: 'يمكنك الحفظ مرة أخرى بعد',
            loading: 'جاري التحميل...',
            adminMode: 'وضع المدير',
            userMode: 'وضع المستخدم',
        },
        en: {
            title: 'Edit CV',
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
            saveSuccess: 'CV updated successfully!',
            saveError: 'An error occurred while updating. Please try again.',
            personalInfoError: 'Failed to update personal information',
            dataValidationError: 'Please fill in all required fields',
            saveDisabledMessage: 'You can save again after',
            loading: 'Loading...',
            adminMode: 'Admin Mode',
            userMode: 'User Mode',
        }
    };
    const t = translations[language];

    const addExperience = () => {
        setExperiences([...experiences, { 
            id: `new-${Date.now()}`,
            title: '', 
            jobTitle: '', 
            company: '', 
            location: '', 
            startDate: '', 
            endDate: '', 
            current: false, 
            description: '' 
        }]);
    };

    const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
        setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const deleteExperience = async (id: string) => {
        if (!id.startsWith('new-')) {
            await deleteItem('experience', id);
        }
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const addEducation = () => {
        setEducation([...education, {
            id: `new-${Date.now()}`,
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

    const deleteEducation = async (id: string) => {
        if (!id.startsWith('new-')) {
            await deleteItem('education', id);
        }
        setEducation(education.filter(edu => edu.id !== id));
    };

    const addSkill = () => {
        setSkills([...skills, { 
            id: `new-${Date.now()}`,
            name: '', 
            type: 'tech', 
            level: 'intermediate' 
        }]);
    };

    const updateSkill = (id: string, field: keyof Skill, value: string) => {
        setSkills(skills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill));
    };

    const deleteSkill = async (id: string) => {
        if (!id.startsWith('new-')) {
            await deleteItem('skills', id);
        }
        setSkills(skills.filter(skill => skill.id !== id));
    };

    const addLanguage = () => {
        setLanguages([...languages, { 
            id: `new-${Date.now()}`,
            name: '', 
            proficiency: 'conversational' 
        }]);
    };

    const updateLanguage = (id: string, field: keyof Language, value: string) => {
        setLanguages(languages.map(lang => lang.id === id ? { ...lang, [field]: value } : lang));
    };

    const deleteLanguage = async (id: string) => {
        if (!id.startsWith('new-')) {
            await deleteItem('language', id);
        }
        setLanguages(languages.filter(lang => lang.id !== id));
    };

    const addCertificate = () => {
        setCertificates([...certificates, {
            id: `new-${Date.now()}`,
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

    const deleteCertificate = async (id: string) => {
        if (!id.startsWith('new-')) {
            await deleteItem('certificate', id);
        }
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const addCustomSection = () => {
        setCustomSections([...customSections, {
            id: `new-${Date.now()}`,
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

    const deleteCustomSection = async (id: string) => {
        if (!id.startsWith('new-')) {
            await deleteItem('additional', id);
        }
        setCustomSections(customSections.filter(section => section.id !== id));
    };

    const addProject = () => {
        setProjects([...projects, { 
            id: `new-${Date.now()}`,
            name: '', 
            content: '' 
        }]);
    };

    const updateProject = (id: string, field: keyof Project, value: string) => {
        setProjects(projects.map(project => project.id === id ? { ...project, [field]: value } : project));
    };

    const deleteProject = async (id: string) => {
        if (!id.startsWith('new-')) {
            await deleteItem('project', id);
        }
        setProjects(projects.filter(project => project.id !== id));
    };

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { 
            id: `new-${Date.now()}`,
            platform: '', 
            url: '', 
            username: '' 
        }]);
    };

    const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
        setSocialLinks(socialLinks.map(link => link.id === id ? { ...link, [field]: value } : link));
    };

    const deleteSocialLink = async (id: string) => {
        if (!id.startsWith('new-')) {
            await deleteItem('social', id);
        }
        setSocialLinks(socialLinks.filter(link => link.id !== id));
    };

    const handleSave = async () => {
        if (!session?.user?.id || !initialData?.id) {
            setSaveMessage({ type: 'error', text: language === 'ar' ? 'خطأ: لم يتم العثور على معرف المستخدم أو السيرة الذاتية' : 'Error: User ID or CV ID not found' });
            return;
        }

        if (!currentUsercvId) {
            setSaveMessage({ type: 'error', text: language === 'ar' ? 'خطأ: لم يتم العثور على معرف السيرة الذاتية' : 'Error: CV ID not found' });
            return;
        }

        if (!personalInfo.fullName || !personalInfo.email) {
            setSaveMessage({ type: 'error', text: t.dataValidationError });
            return;
        }

        setIsSaving(true);
        setSaveMessage({ type: '', text: '' });

        try {
            await updatePersonalInfo();
            await manageSocialLinks();
            await manageExperiences();
            await manageEducation();
            await manageSkills();
            await manageLanguages();
            await manageCertificates();
            await manageProjects();
            await manageAdditionalSections();

            console.log('All sections updated successfully!');
            setSaveMessage({ type: 'success', text: t.saveSuccess });

            setIsDataLoaded(false);
            await refetchCV();

            setSaveDisabled(true);
            setCountdown(120);

            setTimeout(() => {
                setSaveMessage({ type: '', text: '' });
            }, 5000);

        } catch (error) {
            console.error('Error updating CV:', error);
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
                {}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">{t.title}</h1>
                        {isAdmin && (
                            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                <Shield size={16} />
                                <span>{t.adminMode}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        {}
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
                </div>

                {}
                {saveMessage.text && (
                    <div className={`mb-6 p-4 rounded-xl shadow-md flex items-center gap-3 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {saveMessage.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <span className="font-medium">{saveMessage.text}</span>
                    </div>
                )}

                {}
                {isLoadingCV && (
                    <div className="flex items-center justify-center py-8">
                        <Loader className="animate-spin w-6 h-6 text-[#192A3D] mr-2" />
                        <span className="text-gray-600">{t.loading}</span>
                    </div>
                )}

                {}
                {cvError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-red-800">{cvError.message}</p>
                    </div>
                )}

                {}
                {!isLoadingCV && !cvError && (
                    <>
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

                        {}
                        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">

                            {}
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

                            {}
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
                                                    <input type="url" value={link.url} onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)} placeholder="https://example.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addSocialLink} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                        <Plus size={20} /> {t.addSocialMedia}
                                    </button>
                                </div>
                            )}

                            {}
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

                            {}
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
                                                    <input type="url" value={edu.certificatelink} onChange={(e) => updateEducation(edu.id, 'certificatelink', e.target.value)} placeholder="https://example.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
                                                    </div>
                                                </div>
                                        </div>
                                    ))}
                                    <button onClick={addEducation} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#192A3D] hover:text-[#192A3D] transition flex items-center justify-center gap-2">
                                        <Plus size={20} /> {t.addEducation}
                                    </button>
                                </div>
                            )}

                            {}
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

                            {}
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

                            {}
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
                                                    <input type="url" value={cert.link} onChange={(e) => updateCertificate(cert.id, 'link', e.target.value)} placeholder="https://example.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192A3D]" />
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

                            {}
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

                            {}
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

                        {}
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl shadow-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 font-semibold"
                            >
                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
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
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}