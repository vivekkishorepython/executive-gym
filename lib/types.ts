export const categories = [
  "Assertiveness",
  "Empathy",
  "Executive Presence",
  "Conflict Management",
  "Managing Your Boss",
  "Managing Your Team",
  "Peer Management",
  "Cross-Functional Management",
  "Self-Advocacy",
  "Power",
  "Influence",
] as const;
export type Category = (typeof categories)[number];
export type Card = {
  id: string;
  category: Category;
  front: string;
  back: string;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  display_order: number;
  published: boolean;
};
export type Progress = Record<string, "mastered" | "weak">;
