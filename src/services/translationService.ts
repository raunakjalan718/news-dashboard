// src/services/translationService.ts
import axios from 'axios';

// Using LibreTranslate (open-source translation API)
const LIBRE_TRANSLATE_URL = 'https://libretranslate.com/translate';

export const translateText = async (text: string, targetLang: string) => {
  const langCode = {
    'us': 'en',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'it': 'it'
  }[targetLang] || 'en';
  
  try {
    const response = await axios.post(LIBRE_TRANSLATE_URL, {
      q: text,
      source: 'auto',
      target: langCode,
      format: 'text'
    });
    
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fall back to original text
  }
};
