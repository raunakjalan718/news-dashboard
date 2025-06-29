// src/app/news/page.tsx (CORRECTED)

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNewsStore } from "@/store/newsStore";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import styles from '../newsPage.module.css';

export default function NewsPage() {
  const { articles, loading, error, fetchArticles, language, setLanguage } = useNewsStore();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const languageOptions = [
    { value: "us", label: "English (US)" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" },
    { value: "it", label: "Italiano" }
  ];
  
  const getCurrentLanguageLabel = () => {
    return languageOptions.find(opt => opt.value === language)?.label || "English (US)";
  };
  
  // 1. SPLIT useEffect for better dependency management
  // This effect fetches articles whenever the language changes
  useEffect(() => {
    fetchArticles();
  }, [language, fetchArticles]);

  // This effect runs once on mount to setup listeners and initial language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setLanguage]); // setLanguage is stable, so this runs only once

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("preferredLanguage", value);
    // 2. REMOVED setTimeout hack. The useEffect above will handle fetching.
    setShowDropdown(false);
  };

  const handleRefresh = () => {
    fetchArticles();
  };

  const goToLanding = () => {
    router.push("/");
  };

  return (
    <div className={styles.fullscreenBackground}>
      <div className={styles.topBar}>
        <div className={styles.languageDropdownContainer} ref={dropdownRef}>
          <button 
            className={styles.languageDropdownToggle}
            onClick={() => setShowDropdown(!showDropdown)}
            aria-haspopup="listbox"
            aria-expanded={showDropdown}
          >
            {getCurrentLanguageLabel()}
            <span className={styles.dropdownArrow}>▼</span>
          </button>
          
          {showDropdown && (
            <div className={styles.languageDropdownMenu} role="listbox">
              {languageOptions.map((option) => (
                <div 
                  key={option.value}
                  className={`${styles.languageOption} ${language === option.value ? styles.selectedOption : ''}`}
                  onClick={() => handleLanguageChange(option.value)}
                  role="option"
                  aria-selected={language === option.value}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button onClick={handleRefresh} className={styles.refreshButton}>
          Refresh News
        </button>

        <button 
          onClick={goToLanding}
          className={styles.landingButton}
        >
          Home
        </button>
      </div>

      <div className={styles.newsContentContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading the latest news...</p>
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            {error}
          </div>
        ) : articles.length > 0 ? (
          <div className={styles.articleGrid}>
            {articles.map((article, index) => (
              <Link 
                key={index} 
                href={`/article/${encodeURIComponent(article.title)}`}
                className={styles.articleLink}
              >
                <ArticleCard article={article} />
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noArticlesMessage}>
            <p>No articles available for this language. Try selecting a different language or refreshing.</p>
          </div>
        )}
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