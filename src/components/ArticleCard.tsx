// src/components/ArticleCard.tsx (CORRECTED)

import Image from 'next/image'; // 1. IMPORT next/image
import styles from './ArticleCard.module.css';

export default function ArticleCard({ article }: { 
  article: {
    title: string;
    urlToImage?: string;
    description?: string;
    source: {
      name: string;
    };
    publishedAt: string;
  }
}) {
  return (
    <div className={styles.card}>
      {article.urlToImage && (
        // Add position: 'relative' to this container's CSS for 'fill' to work
        <div className={styles.imageContainer}>
          {/* 2. REPLACE <img> with next/image <Image> component */}
          <Image 
            src={article.urlToImage} 
            alt={article.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{article.title}</h2>
        <p className={styles.source}>
          {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
        </p>
        <p className={styles.description}>{article.description}</p>
      </div>
    </div>
  );
}