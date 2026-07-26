import { axiosInstance } from '@/lib/api';

export interface SamplePaper {
  id: string;
  title: string;
  slug: string;
  subject: string;
  type: string;
  level: string;
  pages: number;
  excerpt: string;
  author: string;
  keywords: string[];
  featured: boolean;
  download_count: number;
  /** Open papers expose full content publicly; closed ones are excerpt-only */
  is_open?: boolean;
  created_at: string;
}

export interface DetailedPaper extends SamplePaper {
  /** Full content when the caller has access, otherwise the excerpt */
  content: string;
  /** Whether the caller may read the full content */
  has_access?: boolean;
  /** The caller's access-request state on this paper (null = none) */
  access_status?: 'pending' | 'accepted' | 'rejected' | null;
}

export interface PapersResponse {
  papers: SamplePaper[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface AccessRequestResult {
  access_status: 'pending' | 'accepted' | 'rejected';
  request_id?: string;
  detail?: string;
}

/** Peel the StandardAPIResponse envelope ({success, data, ...}) when present. */
function unwrap<T>(data: any): T {
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data.data as T;
  }
  return data as T;
}

export const papersApi = {
  async getPapers(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    subject?: string;
    type?: string;
    level?: string;
    ordering?: string;
  }): Promise<PapersResponse> {
    const response = await axiosInstance.get('/sample-papers/', { params });
    return unwrap<PapersResponse>(response.data);
  },

  async getPaperBySlug(slug: string): Promise<DetailedPaper> {
    const response = await axiosInstance.get(`/sample-papers/${slug}/`);
    return unwrap<DetailedPaper>(response.data);
  },

  /** Ask the admin for full access to a closed paper (idempotent). */
  async requestAccess(slug: string): Promise<AccessRequestResult> {
    const response = await axiosInstance.post(`/sample-papers/${slug}/request-access/`);
    return unwrap<AccessRequestResult>(response.data);
  },
};
