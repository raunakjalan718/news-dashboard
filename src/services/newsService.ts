import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface Article {
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  source: {
    name: string;
  };
  urlToImage?: string;
  url: string;
  author?: string;
}

// Mock data for fallback or testing (Updated with working image URLs)
export const MOCK_ARTICLES: Article[] = [
  {
    title: "AI Breakthrough: New Model Surpasses Human Performance",
    description: "Scientists have unveiled a new AI architecture that demonstrates unprecedented reasoning capabilities.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisl.",
    publishedAt: new Date().toISOString(),
    source: { name: "Tech Daily" },
    urlToImage: "https://picsum.photos/800/600?random=1",
    url: "#"
  },
  {
    title: "Global Markets Rally Amid Tech Sector Growth",
    description: "Stock markets worldwide reached new highs today as technology stocks continued their upward trajectory.",
    content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: { name: "Finance Now" },
    urlToImage: "https://picsum.photos/800/600?random=2",
    url: "#"
  },
  {
    title: "Sustainable Energy: Solar Efficiency Breaks Records",
    description: "Researchers have achieved 40% efficiency in new solar panel prototypes, promising a greener future.",
    content: "Detailed analysis of the solar panel efficiency breakthrough and its implications for the global energy market.",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    source: { name: "Green Earth" },
    urlToImage: "https://picsum.photos/800/600?random=3",
    url: "#"
  }
];

/**
 * Fetches top headlines from the News API
 * @param country - Country code (default: 'us')
 * @returns Promise<Article[]> - Array of news articles
 */
export const getTopHeadlines = async (country = 'us'): Promise<Article[]> => {
  // Return mocks immediately if no API key is set
  if (!API_KEY) {
    console.warn('No API Key found, using mock data');
    return MOCK_ARTICLES;
  }

  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country: country,
        pageSize: 10,
        apiKey: API_KEY
      }
    });
    
    if (response.data?.articles && Array.isArray(response.data.articles)) {
      // Filter out articles with tag '[Removed]' which NewsAPI often returns
      return response.data.articles.filter((article: Article) => article.title !== '[Removed]');
    } else {
      console.error('Invalid response format from News API');
      return MOCK_ARTICLES;
    }
  } catch (error) {
    // Note: NewsAPI Free Tier often blocks Vercel server requests (Status 426).
    // This catch block ensures the site still works (using mocks) in that scenario.
    console.error('Error fetching news (likely API limit or Cloud Block):', error);
    return MOCK_ARTICLES;
  }
};

/**
 * Fetches a specific article by its title
 * @param id - The article title
 * @returns Promise<Article | undefined> - The found article or undefined
 */
export const getArticleById = async (id: string): Promise<Article | undefined> => {
  try {
    // Attempt to fetch fresh headlines to find the article
    const articles = await getTopHeadlines();
    const found = articles.find(article => article.title === id);
    
    if (found) return found;
    
    // Fallback: Check mock data if not found in live data
    return MOCK_ARTICLES.find(article => article.title === id);
  } catch (error) {
    console.error('Error fetching article:', error);
    return MOCK_ARTICLES.find(article => article.title === id);
  }
};

/**
 * Search for articles by keyword
 * @param query - Search term
 * @returns Promise<Article[]> - Array of matching articles
 */
export const searchArticles = async (query: string): Promise<Article[]> => {
  if (!API_KEY) return [];

  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        pageSize: 10,
        apiKey: API_KEY
      }
    });
    
    if (response.data?.articles && Array.isArray(response.data.articles)) {
       return response.data.articles.filter((article: Article) => article.title !== '[Removed]');
    } else {
      console.error('Invalid response format from News API');
      return [];
    }
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
};
