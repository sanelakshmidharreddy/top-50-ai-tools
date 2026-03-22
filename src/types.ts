export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  hasPurchased: boolean;
  transactionId?: string;
  paymentStatus?: 'pending' | 'approved' | 'rejected';
  currentDeviceId?: string;
  lastLogin: number;
}

export interface BookPage {
  id: number;
  content: string;
  title: string;
  imageUrl?: string;
}

export const BOOK_CONTENT: BookPage[] = [
  { 
    id: 0, 
    title: "The Ultimate AI Handbook", 
    content: "Top 50 AI Tools for Engineers & Students",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=1200"
  },
  { id: 1, title: "Introduction to AI", content: "AI is transforming the world. In this handbook, we explore the top 50 tools that every engineer and student should know. From LLMs to image generation, we cover it all." },
  { id: 2, title: "Tool 1: ChatGPT", content: "ChatGPT is the pioneer of modern conversational AI. Learn how to use prompt engineering to get the best results for coding, writing, and analysis." },
  { id: 3, title: "Tool 2: Midjourney", content: "Midjourney creates stunning visuals from text prompts. We'll show you the secret parameters to get photorealistic images." },
  // Add more mock pages as needed
  { id: 4, title: "Tool 3: GitHub Copilot", content: "The AI pair programmer. Learn how to automate repetitive coding tasks and focus on architecture." },
  { id: 5, title: "Conclusion", content: "The future of AI is bright. Stay curious and keep exploring these tools to stay ahead in your career." }
];
