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
  created_at: string;
}

export interface DetailedPaper extends SamplePaper {
  content: string;
}

export interface PapersResponse {
  papers: SamplePaper[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
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
    return response.data;
  },

  async getPaperBySlug(slug: string): Promise<DetailedPaper> {
    const response = await axiosInstance.get(`/sample-papers/${slug}/`);
    return response.data;
  },
};