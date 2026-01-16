
export interface Question {
  id: string;
  name: string;
  link: string;
  topic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  addedDate: number; 
  nextReviewDate: number; 
  retryCount: number;
  status: 'active' | 'completed';
}

export type TabType = 'due' | 'upcoming' | 'completed';
