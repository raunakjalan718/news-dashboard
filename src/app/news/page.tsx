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
  
  // FIX: Add mounted state to prevent hydration mismatches between server and client
  const [mounted, setMounted] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Language options configuration
  const languageOptions = [
    { value: "us", label: "English (US)" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" },
    { value: "it", label: "Italiano" }
  ];
  
  // Get current language label
  const getCurrentLanguageLabel = () => {
    // FIX: Only render language-specific label after mount to avoid hydration mismatch
    if (!mounted) return "English (US)";
    
    const option = languageOptions.find(opt => opt.value === language);
    return option ? option.label : "English (US)";
  };
  
  useEffect(() => {
    setMounted(true);
    fetchArticles();
    
    // Check localStorage only on the client side
    if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem("preferredLanguage");
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }
    
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fetchArticles, setLanguage]);

  const handleLanguageChange = (value: string) => {
    console.log(`Changing language to: ${value}`);
    setLanguage(value);
    localStorage.setItem("preferredLanguage", value);
    
    // Force refresh articles with the new language
    setTimeout(() => {
      fetchArticles();
    }, 100);
    
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
      {/* Top bar with language selector, refresh button, and home button */}
      <div className={styles.topBar}>
        {/* Custom language dropdown - left */}
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
        
        {/* Refresh button - center */}
        <button onClick={handleRefresh} className={styles.refreshButton}>
          Refresh News
        </button>

        {/* Home button - right */}
        <button 
          onClick={goToLanding}
          className={styles.landingButton}
        >
          Home
        </button>
      </div>

      {/* News article grid */}
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
        ) : (articles || []).length > 0 ? (
          <div className={styles.articleGrid}>
            {/* FIX: Handle potential undefined articles or titles safely */}
            {(articles || []).map((article, index) => (
              <Link 
                key={index} 
                href={`/article/${encodeURIComponent(article?.title || '')}`}
                className={styles.articleLink}
              >
                <ArticleCard article={article} />
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noArticlesMessage}>
            <p>No articles available for this language. Try selecting a different language or refreshing.</p>
            <button onClick={handleRefresh} className={styles.refreshButton}>
              Refresh News
            </button>
          </div>
        )}
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
