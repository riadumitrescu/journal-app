import prompts from '../data/prompts.json';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'late_night';
type PromptHistory = { [key: string]: string }; // id -> timestamp

interface Prompt {
  id: string;
  text: string;
  tags: string[];
  voice: string;
  repeatInterval: number;
}

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'late_night';
}

export function getPrompt(timeOfDay: TimeOfDay, history: PromptHistory = {}): Prompt {
  const timePrompts = prompts[timeOfDay] as Prompt[];
  
  // Filter out prompts that were shown too recently
  const now = new Date();
  const validPrompts = timePrompts.filter(prompt => {
    const lastShown = history[prompt.id];
    if (!lastShown) return true;
    
    const daysSinceLastShown = (now.getTime() - new Date(lastShown).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastShown >= prompt.repeatInterval;
  });

  // If no valid prompts (all shown too recently), use all prompts
  const promptPool = validPrompts.length > 0 ? validPrompts : timePrompts;
  
  // Randomly select a prompt
  return promptPool[Math.floor(Math.random() * promptPool.length)];
}

// Load prompt history from localStorage
export function loadPromptHistory(): PromptHistory {
  if (typeof window === 'undefined') return {};
  const history = localStorage.getItem('promptHistory');
  return history ? JSON.parse(history) : {};
}

// Save prompt to history
export function savePromptToHistory(promptId: string): void {
  if (typeof window === 'undefined') return;
  const history = loadPromptHistory();
  history[promptId] = new Date().toISOString();
  localStorage.setItem('promptHistory', JSON.stringify(history));
} 