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

// Mock data for fallback or testing
export const MOCK_ARTICLES: Article[] = [
  {
    title: "Sample News Article 1",
    description: "This is a sample article description for testing purposes.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisl.",
    publishedAt: "2025-06-25T14:30:00Z",
    source: { name: "Sample News" },
    urlToImage: "https://source.unsplash.com/random/800x600/?news",
    url: "https://example.com/article1"
  },
  {
    title: "Sample News Article 2",
    description: "Another sample article for your news dashboard project.",
    content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    publishedAt: "2025-06-24T10:15:00Z",
    source: { name: "Sample News" },
    urlToImage: "https://source.unsplash.com/random/800x600/?technology",
    url: "https://example.com/article2"
  },
  // Add more mock articles as needed
];

/**
 * Fetches top headlines from the News API
 * @param country - Country code (default: 'us')
 * @returns Promise<Article[]> - Array of news articles
 */
export const getTopHeadlines = async (country = 'us'): Promise<Article[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country: country,
        pageSize: 10, // Updated from 7 to 10 articles
        apiKey: API_KEY
      }
    });
    
    if (response.data?.articles && Array.isArray(response.data.articles)) {
      return response.data.articles;
    } else {
      console.error('Invalid response format from News API');
      return MOCK_ARTICLES;
    }
  } catch (error) {
    console.error('Error fetching news:', error);
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
    const articles = await getTopHeadlines();
    return articles.find(article => article.title === id);
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
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        pageSize: 10,
        apiKey: API_KEY
      }
    });
    
    if (response.data?.articles && Array.isArray(response.data.articles)) {
      return response.data.articles;
    } else {
      console.error('Invalid response format from News API');
      return [];
    }
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
};
