import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:5000/api';

export interface UserCV {
  id: string;
  userid: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  templateid: number;
  imagename: string | null;
  isactive: string;
  currentjob: string;
  created_at: string;
  modified_at: string;
}

export interface SocialLink {
  id: number;
  usercvid: string;
  socialname: string;
  usernamesocial: string;
  link: string;
  created_at: string;
  modified_at: string;
}

export interface Skill {
  id: number;
  usercvid: string;
  skillname: string;
  level: string;
  type: string;
  created_at: string;
  modified_at: string;
}

export interface Project {
  id: number;
  usercvid: string;
  projectname: string;
  content: string;
  created_at: string;
  modified_at: string;
}

export interface Language {
  id: number;
  usercvid: string;
  languagename: string;
  level: string;
  created_at: string;
  modified_at: string;
}

export interface Experience {
  id: number;
  usercvid: string;
  jobtitle: string;
  companyname: string;
  location: string;
  startdate: string;
  enddate: string;
  description: string;
  worknow: string;
  created_at: string;
  modified_at: string;
}

export interface Education {
  id: number;
  usercvid: string;
  degree: string;
  institution: string;
  startdate: string;
  enddate: string;
  currentlearn: string;
  certificatelink: string;
  GPA: string;
  created_at: string;
  modified_at: string;
}

export interface Certificate {
  id: number;
  usercvid: string;
  certificatename: string;
  link: string;
  startdate: string;
  enddate: string;
  created_at: string;
  modified_at: string;
}

export interface AdditionalSection {
  id: number;
  usercvid: string;
  sectiontitle: string;
  addcontent: string;
  startdate: string;
  enddate: string;
  created_at: string;
  modified_at: string;
}

export interface CVData {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phone: string;
    DOB: string;
    role: string;
    created_at: string;
    modified_at: string;
  };
  usercv: UserCV;
  social: SocialLink[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
  additional: AdditionalSection[];
}

export interface CV {
  id: string;
  title: string;
  jobTitle: string;
  company: string;
  isactive: string;
  createdAt: Date;
  updatedAt: Date;
  fileUrl: string;
}

export const CVS_QUERY_KEY = ['cvs'];
export const CV_DETAIL_QUERY_KEY = (id: string) => ['cv', id];

const fetchUserCVs = async (): Promise<CV[]> => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}/usercv/my/cvs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`فشل في جلب السير الذاتية: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error('فشل في جلب البيانات من الخادم');
  }

  const formattedCVs: CV[] = data.data.map((cv: UserCV) => ({
    id: cv.id,
    title: `${cv.currentjob || 'سيرة ذاتية'} - ${cv.fullname || 'بدون اسم'}`,
    jobTitle: cv.currentjob || 'غير محدد',
    company: 'اسم الشركه',
    isactive: cv.isactive,
    createdAt: new Date(cv.created_at),
    updatedAt: new Date(cv.modified_at),
    fileUrl: `#`
  }));

  return formattedCVs;
};

const fetchCVById = async (id: string): Promise<CVData> => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const url = user.role === 'admin' 
    ? `${API_BASE_URL}/all/admin/${id}`
    : `${API_BASE_URL}/all/${id}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`فشل في جلب بيانات السيرة الذاتية: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error('فشل في جلب البيانات من الخادم');
  }

  return data.data;
};

export const useCVs = () => {
  return useQuery({
    queryKey: CVS_QUERY_KEY,
    queryFn: fetchUserCVs,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useCVById = (id: string | null) => {
  return useQuery({
    queryKey: CV_DETAIL_QUERY_KEY(id || ''),
    queryFn: () => fetchCVById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useDeleteCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cvId: string) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/usercv/${cvId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`فشل في حذف السيرة الذاتية: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'فشل في حذف السيرة الذاتية');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CVS_QUERY_KEY });
    },
  });
};

export const useRefreshCVs = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: CVS_QUERY_KEY });
  };
};

export const useUpdateCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const url = user.role === 'admin' 
        ? `${API_BASE_URL}/all/admin/${id}`
        : `${API_BASE_URL}/all/${id}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`فشل في تحديث السيرة الذاتية: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'فشل في تحديث السيرة الذاتية');
      }

      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CV_DETAIL_QUERY_KEY(variables.id) });
      queryClient.invalidateQueries({ queryKey: CVS_QUERY_KEY });
    },
  });
};