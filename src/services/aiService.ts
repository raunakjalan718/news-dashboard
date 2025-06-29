import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

export const summarizeText = async (text: string) => {
  // For texts that are too long, we'll trim them
  const trimmedText = text.length > 2000 ? text.substring(0, 2000) : text;
  
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        inputs: trimmedText,
        parameters: {
          max_length: 150,
          min_length: 40,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    
    // Handle the response format
    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text;
    }
    
    return "Unable to generate a summary.";
  } catch (error) {
    console.error('Error summarizing text:', error);
    return 'Unable to generate summary. The service may be temporarily unavailable.';
  }
};
