# AI Summarized News Dashboard

A Next.js application that fetches the latest news articles and uses AI to summarize their content.

## Setup Instructions

1. Clone the repository

2. Install dependencies:
npm install

3. Create a `.env.local` file in the root directory with:
NEXT_PUBLIC_NEWS_API_KEY=YOUR_NEWS_API_KEY
NEXT_PUBLIC_HUGGINGFACE_API_KEY=YOUR_HUGGINGFACE_TOKEN

4. Run the development server:
npm run dev

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Demo:

- https://youtu.be/X97L1CvsqiE

## Features

- Home page with a list of the 10 latest news articles
- Article detail page with full content and AI-generated summary
- Loading states and error handling
- Responsive design using Tailwind CSS
- State management with Zustand
