"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticleById } from "@/services/newsService";
import { summarizeText } from "@/services/aiService";
import styles from '../../newsPage.module.css';

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  
  // FIX: Safely access params.id to prevent build errors when params are undefined
  const rawId = params?.id;
  const id = rawId ? decodeURIComponent(rawId as string) : null;
  
  const [article, setArticle] = useState<any>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // FIX: Don't attempt to fetch if ID is missing
    if (!id) {
        setLoading(false);
        return;
    }

    const fetchArticleAndSummarize = async () => {
      try {
        setLoading(true);
        const fetchedArticle = await getArticleById(id);
        setArticle(fetchedArticle);
        
        if (fetchedArticle && fetchedArticle.content) {
          setSummary("Generating AI summary...");
          const articleSummary = await summarizeText(fetchedArticle.content);
          setSummary(articleSummary);
        }
      } catch (error) {
        console.error("Error:", error);
        setSummary("Failed to generate summary");
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticleAndSummarize();
  }, [id]);

  const goToNews = () => {
    router.push("/news");
  };
  
  const goToLanding = () => {
    router.push("/");
  };
  
  if (loading) return (
    <div className={styles.fullscreenBackground}>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading article...</p>
      </div>
    </div>
  );
  
  if (!article) return (
    <div className={styles.fullscreenBackground}>
      <div className={styles.errorMessage}>Article not found</div>
    </div>
  );
  
  return (
    <div className={styles.fullscreenBackground}>
      {/* Top bar with matching button styles */}
      <div className={styles.topBar}>
        {/* Back to News button - styled like the landing button */}
        <button 
          onClick={goToNews}
          className={styles.landingButton}
        >
          Back to News
        </button>

        {/* Home button - renamed from "Go to Landing" */}
        <button 
          onClick={goToLanding}
          className={styles.landingButton}
        >
          Home
        </button>
      </div>
      
      {/* Article content */}
      <div className={styles.articleContainer}>
        <h1 className={styles.articleTitle}>{article.title}</h1>
        
        <div className={styles.articleMeta}>
          <p>{article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}</p>
        </div>
        
        {article.urlToImage && (
          <div className={styles.articleImageContainer}>
            <img 
              src={article.urlToImage} 
              alt={article.title}
              className={styles.articleImage}
            />
          </div>
        )}
        
        <div className={styles.summaryContainer}>
          <h2 className={styles.summaryTitle}>AI Summary</h2>
          <p className={styles.summaryText}>{summary}</p>
        </div>
        
        <div className={styles.articleContent}>
          <p>{article.content || article.description}</p>
          {article.url && (
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.sourceLink}
            >
              Read full article at source
            </a>
          )}
        </div>
      </div>
      
      {/* Footer with larger text */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <p>Raunak Jalan</p>
          <p>jalan.raunak@outlook.com</p>
          <p>+91 8852977562</p>
        </div>
      </div>
    </div>
  );
}
