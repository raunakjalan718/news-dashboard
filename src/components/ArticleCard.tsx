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
        <div className={styles.imageContainer}>
          <img 
            src={article.urlToImage} 
            alt={article.title} 
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
