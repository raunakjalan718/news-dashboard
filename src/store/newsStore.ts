import { create } from 'zustand';
import { getTopHeadlines, Article, MOCK_ARTICLES } from '@/services/newsService';

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
    // Update language state immediately
    set({ language });
    // Trigger fetch with new language
    get().fetchArticles();
  },
  
  fetchArticles: async () => {
    const { language } = get();
    set({ loading: true, error: null });
    
    try {
      const articles = await getTopHeadlines(language);
      
      // Safety check: ensure we always have an array
      if (articles && articles.length > 0) {
        set({ articles, loading: false });
      } else {
        // Fallback to mocks if API returns empty (likely due to API limits)
        console.warn("API returned no articles, using fallback data");
        set({ articles: MOCK_ARTICLES, loading: false });
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      // Fallback to mocks on error so the UI doesn't break
      set({ 
        articles: MOCK_ARTICLES, 
        loading: false, 
        error: 'Live news currently unavailable. Showing sample data.' 
      });
    }
  },
}));
