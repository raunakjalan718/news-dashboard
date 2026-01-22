import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

export const summarizeText = async (text: string) => {
  // FIX: Check if API Key exists to prevent runtime crashes
  if (!API_KEY) {
    console.warn("Missing NEXT_PUBLIC_HUGGINGFACE_API_KEY environment variable");
    return "Summary unavailable: API configuration missing.";
  }

  // For texts that are too long, we'll trim them
  const trimmedText = text.length > 2000 ? text.substring(0, 2000) : text;
  
  // Helper function to handle retries for "Model Loading" (503) errors
  const fetchSummary = async (retryCount = 0): Promise<string> => {
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
    } catch (error: any) {
      // FIX: Handle "Model is loading" (503) error specifically
      // This is very common with the free Hugging Face API tier
      if (error.response?.status === 503 && error.response?.data?.error?.includes("loading")) {
        if (retryCount < 2) {
          const waitTime = error.response?.data?.estimated_time 
            ? Math.ceil(error.response.data.estimated_time * 1000) 
            : 10000; // Default to 10s if no estimate provided
            
          console.log(`AI Model is waking up. Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return fetchSummary(retryCount + 1);
        }
      }

      console.error('Error summarizing text:', error.response?.data || error.message);
      return 'Unable to generate summary. The service may be temporarily unavailable.';
    }
  };

  return fetchSummary();
};
