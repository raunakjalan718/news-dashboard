"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticleById, Article } from "@/services/newsService";
import { summarizeText } from "@/services/aiService";
import styles from '../../newsPage.module.css';

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  
  // Safe ID extraction
  const rawId = params?.id;
  const id = typeof rawId === 'string' ? decodeURIComponent(rawId) : null;
  
  // FIX: Replaced <any> with proper Article type
  const [article, setArticle] = useState<Article | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!id) {
        setLoading(false);
        return;
    }

    const fetchArticleAndSummarize = async () => {
      try {
        setLoading(true);
        const fetchedArticle = await getArticleById(id);
        
        // Ensure fetchedArticle is not undefined before setting
        if (fetchedArticle) {
            setArticle(fetchedArticle);
            
            if (fetchedArticle.content) {
              setSummary("Generating AI summary...");
              const articleSummary = await summarizeText(fetchedArticle.content);
              setSummary(articleSummary);
            }
        } else {
            // Handle case where article is not found
            setArticle(null);
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
      <div className={styles.topBar}>
        <button onClick={goToNews} className={styles.landingButton}>
          Back to News
        </button>
        <button onClick={goToLanding} className={styles.landingButton}>
          Home
        </button>
      </div>
      
      <div className={styles.articleContainer}>
        <h1 className={styles.articleTitle}>{article.title}</h1>
        
        <div className={styles.articleMeta}>
          <p>{article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}</p>
        </div>
        
        {article.urlToImage && (
          <div className={styles.articleImageContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
