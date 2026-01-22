import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

export const summarizeText = async (text: string) => {
  if (!API_KEY) {
    console.warn("Missing NEXT_PUBLIC_HUGGINGFACE_API_KEY environment variable");
    return "Summary unavailable: API configuration missing.";
  }

  const trimmedText = text.length > 2000 ? text.substring(0, 2000) : text;
  
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
      
      if (response.data && response.data[0] && response.data[0].summary_text) {
        return response.data[0].summary_text;
      }
      
      return "Unable to generate a summary.";
    } catch (error: unknown) {
      // FIX: Cast error safely or disable linting for explicit any if needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      
      if (err.response?.status === 503 && err.response?.data?.error?.includes("loading")) {
        if (retryCount < 2) {
          const waitTime = err.response?.data?.estimated_time 
            ? Math.ceil(err.response.data.estimated_time * 1000) 
            : 10000;
            
          console.log(`AI Model is waking up. Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return fetchSummary(retryCount + 1);
        }
      }

      console.error('Error summarizing text:', err.response?.data || err.message);
      return 'Unable to generate summary. The service may be temporarily unavailable.';
    }
  };

  return fetchSummary();
};
