// src/services/translationService.ts
import axios from 'axios';

// Using a more reliable mirror or the main instance
// Note: Public LibreTranslate instances often rate-limit cloud IPs (like Vercel).
// Ideally, self-host this or use a paid API for production.
const TRANSLATE_URL = 'https://de.libretranslate.com/translate';

export const translateText = async (text: string, targetLang: string) => {
  // If target is English (US), no need to call API (assuming source is English)
  if (targetLang === 'us' || targetLang === 'en') return text;

  const langCode = {
    'us': 'en',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'it': 'it'
  }[targetLang] || 'en';
  
  try {
    const response = await axios.post(TRANSLATE_URL, {
      q: text,
      source: 'auto',
      target: langCode,
      format: 'text',
      api_key: "" // Leave empty for free tier usage
    }, {
      headers: { "Content-Type": "application/json" }
    });
    
    return response.data.translatedText;
  } catch (error) {
    // Fail silently and return original text so the UI doesn't break
    console.error('Translation service unavailable (likely rate limited):', error);
    return text; 
  }
};
