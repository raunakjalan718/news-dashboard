"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from './landing.module.css';

// Feature data
const features = [
  {
    id: 1,
    title: "Stay Updated in Real Time",
    description: "Get the latest news as it happens — our dashboard fetches fresh headlines every second so you never miss out on what matters.",
    image: "/images/c1.jpg"
  },
  {
    id: 2,
    title: "Smart AI Summaries",
    description: "No time to read it all? Our AI instantly condenses each article into key highlights so you get the gist in seconds.",
    image: "/images/c2.jpg"
  },
  {
    id: 3,
    title: "One-Click Full Access",
    description: "Found something interesting? Jump straight to the original article with a single click and dive deeper anytime.",
    image: "/images/c3.png"
  },
  {
    id: 4,
    title: "Multi-Language Support",
    description: "Break language barriers with our platform supporting news in English, French, German, Spanish, and Italian - all at your fingertips.",
    image: "/images/c4.jpg"
  },
  {
    id: 5,
    title: "Elegant User Experience",
    description: "Navigate through a beautifully designed interface that makes reading news a pleasure with its intuitive controls and animations.",
    image: "/images/c5.jpg"
  },
  {
    id: 6,
    title: "Mobile Responsive Design",
    description: "Access your news dashboard from any device - the responsive design ensures perfect viewing whether on desktop, tablet, or phone.",
    image: "/images/c6.jpg"
  },
  {
    id: 7,
    title: "Personalized Reading Experience",
    description: "Enjoy content that adapts to your interests over time. Our AI learns your preferences and suggests articles you're most likely to enjoy.",
    image: "/images/c7.jpg"
  },
  {
    id: 8,
    title: "Offline Reading Mode",
    description: "Never worry about losing connection. Save important articles and access them later, even when you're not connected to the internet.",
    image: "/images/c8.jpg"
  }
];

export default function LandingPage() {
  const [language, setLanguage] = useState("us");
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const maxSlide = Math.ceil(features.length / 3) - 1;
  
  // FIX: Track window width in state to prevent Hydration Mismatch errors
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Add refs for elements to animate on scroll
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const featuresTitleRef = useRef<HTMLHeadingElement>(null);
  const featuresCarouselRef = useRef<HTMLDivElement>(null);
  const carouselButtonsRef = useRef<HTMLDivElement>(null);
  const carouselIndicatorsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
  // Page transition state
  const [isExiting, setIsExiting] = useState(false);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  
  // FIX: Handle Window Resize safely on the client only
  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    // FIX: Ensure localStorage is accessed safely
    if (typeof window !== 'undefined') {
        localStorage.setItem("preferredLanguage", e.target.value);
    }
  };

  const navigateTo = (path: string) => {
    setIsExiting(true);
    
    // Wait for exit animation to complete
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const goToNewsPage = () => {
    navigateTo("/news");
  };

  // Enhanced sequential animation effect for the title - restored to original speed
  useEffect(() => {
    if (titleRef.current) {
      const textElement = titleRef.current;
      const text = textElement.textContent || '';
      
      // Clear the original text
      textElement.textContent = '';
      
      // Animation configuration - original speed
      const letterDelay = 0.15; // Original speed
      
      // Split the text into individual characters and wrap each in a span
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        
        if (char === ' ') {
          span.innerHTML = '&nbsp;';
          span.style.animation = 'none';
        } else {
          span.textContent = char;
          
          // Calculate a sequential animation delay for each letter
          const delay = i * letterDelay;
          span.style.animationDelay = `${delay}s`;
        }
        
        // Add the new span to our text element
        textElement.appendChild(span);
      }
      
      // This helps ensure a smoother animation
      const spans = textElement.querySelectorAll('span');
      spans.forEach((span) => {
        if (span.style.animation !== 'none') {
          span.style.animationDuration = '1s'; // Original speed
        }
      });
    }
    
    // Add intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.scrolled);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe elements
    if (featuresTitleRef.current) {
      observer.observe(featuresTitleRef.current);
    }
    
    if (featuresCarouselRef.current) {
      observer.observe(featuresCarouselRef.current);
    }
    
    if (carouselButtonsRef.current) {
      observer.observe(carouselButtonsRef.current);
    }
    
    if (carouselIndicatorsRef.current) {
      observer.observe(carouselIndicatorsRef.current);
    }
    
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [styles.scrolled]);
  
  // Handle carousel navigation
  const nextSlide = () => {
    setCurrentSlide(prev => (prev === maxSlide ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? maxSlide : prev - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  // Calculate the transform position for the carousel
  const getTransformValue = () => {
    // FIX: Use state variable instead of window to ensure SSR compatibility
    // If windowWidth is 0 (initial server render), default to Desktop view to match server snapshot
    
    // For mobile (1 card per view)
    if (windowWidth > 0 && windowWidth <= 768) {
      return `translateX(-${currentSlide * 100}%)`;
    }
    
    // For tablets (2 cards per view)
    if (windowWidth > 0 && windowWidth <= 1024) {
      return `translateX(-${currentSlide * 50}%)`;
    }
    
    // For desktop (3 cards per view)
    return `translateX(-${currentSlide * (100/3)}%)`;
  };

  return (
    <div className={styles.fullscreenBackground}>
      <div className={styles.backgroundFixed}></div>
      <div 
        ref={contentWrapperRef} 
        className={`${styles.contentWrapper} ${isExiting ? styles.pageExiting : ''}`}
      >
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
          <h1 
            ref={titleRef} 
            className={`${styles.mainTitle} ${styles['bouncing-text']}`}
            // Suppress hydration warning because we modify this element in useEffect
            suppressHydrationWarning={true}
          >
            AI News
          </h1>
          
          <p 
            ref={subtitleRef}
            className={styles.subtitle}
          >
            STAY INFORMED WITH THE LATEST<br />
            NEWS, EXPERTLY SUMMARIZED BY AI
          </p>
          
          <button 
            ref={buttonRef}
            onClick={goToNewsPage}
            className={styles.exploreButton}
          >
            EXPLORE NEWS
          </button>
        </div>
        
        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 
            ref={featuresTitleRef}
            className={styles.featuresTitle}
          >
            Why Choose AI News
          </h2>
          
          <div 
            ref={featuresCarouselRef}
            className={styles.featuresCarousel}
          >
            <div 
              className={styles.carouselTrack} 
              style={{ 
                transform: getTransformValue()
              }}
            >
              {features.map((feature) => (
                <div key={feature.id} className={styles.featureCard}>
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className={styles.cardImage}
                  />
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{feature.title}</h3>
                    <p className={styles.cardDescription}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div 
              ref={carouselButtonsRef}
              className={styles.carouselButtons}
            >
              <button 
                onClick={prevSlide}
                className={styles.carouselButton}
                aria-label="Previous slide"
              >
                &#10094;
              </button>
              <button 
                onClick={nextSlide}
                className={styles.carouselButton}
                aria-label="Next slide"
              >
                &#10095;
              </button>
            </div>
            
            <div 
              ref={carouselIndicatorsRef}
              className={styles.carouselIndicators}
            >
              {[...Array(maxSlide + 1)].map((_, index) => (
                <span 
                  key={index}
                  className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer - matching the homepage footer */}
        <div 
          ref={footerRef}
          className={styles.footer}
        >
          <div className={styles.footerContent}>
            <p>Raunak Jalan</p>
            <p>jalan.raunak@outlook.com</p>
            <p>+91 8852977562</p>
          </div>
        </div>
      </div>
    </div>
  );
}
