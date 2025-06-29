// src/app/article/[id]/page.tsx (CORRECTED)

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image"; // 1. IMPORT next/image
import { getArticleById } from "@/services/newsService";
import { summarizeText } from "@/services/aiService";
import styles from '../../newsPage.module.css';

// 2. DEFINE a type for the article to replace 'any'
interface Article {
  title: string;
  source: { name: string };
  publishedAt: string;
  urlToImage?: string | null;
  content?: string | null;
  description?: string | null;
  url?: string;
}

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(params.id as string);
  
  // 3. USE the new Article type instead of 'any'
  const [article, setArticle] = useState<Article | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
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
      <div className={styles.topBar}>
        <button 
          onClick={goToNews}
          className={styles.landingButton}
        >
          Back to News
        </button>
        <button 
          onClick={goToLanding}
          className={styles.landingButton}
        >
          Home
        </button>
      </div>
      
      <div className={styles.articleContainer}>
        <h1 className={styles.articleTitle}>{article.title}</h1>
        
        <div className={styles.articleMeta}>
          <p>{article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}</p>
        </div>
        
        {article.urlToImage && (
          // Add position: 'relative' to this container's CSS for 'fill' to work
          <div className={styles.articleImageContainer}>
            {/* 4. REPLACE <img> with next/image <Image> component */}
            <Image 
              src={article.urlToImage} 
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              style={{ objectFit: 'cover' }} // Maintains aspect ratio
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