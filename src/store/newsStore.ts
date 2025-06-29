import { create } from 'zustand';
import { getTopHeadlines, Article } from '@/services/newsService';

interface NewsState {
  articles: Article[];
  loading: boolean;
  error: null | string;
  language: string;
  setLanguage: (language: string) => void;
  fetchArticles: () => Promise<void>;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  loading: false,
  error: null,
  language: 'us',
  setLanguage: (language) => {
    set({ language });
    get().fetchArticles();
  },
  fetchArticles: async () => {
    set({ loading: true });
    try {
      const articles = await getTopHeadlines(get().language);
      set({ articles, loading: false, error: null });
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      set({ loading: false, error: 'Failed to fetch news articles' });
    }
  },
}));
