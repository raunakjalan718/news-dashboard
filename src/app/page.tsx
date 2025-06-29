"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import styles from './landing.module.css';

export default function LandingPage() {
  const [language, setLanguage] = useState("us");
  const router = useRouter();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    localStorage.setItem("preferredLanguage", e.target.value);
  };

  const goToNewsPage = () => {
    router.push("/news");
  };

  return (
    <div className={styles.fullscreenBackground}>
      {/* Top bar with language selector and LIVE icon */}
      <div className={styles.topBar}>
        {/* Language dropdown - top left */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className={styles.languageSelect}
        >
          <option value="us">English (US)</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="es">Español</option>
          <option value="it">Italiano</option>
        </select>

        {/* LIVE icon - top right */}
        <div className={styles.liveIconContainer} onClick={goToNewsPage}>
          <Image 
            src="/images/live.gif" 
            alt="LIVE" 
            width={240}
            height={120}
            priority
          />
        </div>
      </div>

      {/* Center content */}
      <div className={styles.centerContent}>
        <h1 className={styles.mainTitle}>AI News</h1>
        
        <p className={styles.subtitle}>
          STAY INFORMED WITH THE LATEST<br />
          NEWS, EXPERTLY SUMMARIZED BY AI
        </p>
        
        <button 
          onClick={goToNewsPage}
          className={styles.exploreButton}
        >
          EXPLORE NEWS
        </button>
      </div>
    </div>
  );
}
