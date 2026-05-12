// ===== User =====
export interface User {
  id: string;
  username: string;
  email: string;
  role: "student" | "admin";
  avatar_url: string | null;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ===== Knowledge Graph =====
export interface KnowledgePoint {
  id: string;
  neo4j_node_id: string;
  name: string;
  description: string | null;
  difficulty: number;
  category: string;
  order_index: number;
  created_at: string;
}

export interface KnowledgeGraphNode {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  user_mastery: number | null;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

// ===== Exercise =====
export interface Exercise {
  id: string;
  knowledge_point_id: string;
  type: "choice" | "fill" | "code" | "simulation";
  title: string;
  content: {
    question: string;
    options?: { key: string; text: string }[];
    code_template?: string;
    blanks?: string[];
  };
  difficulty: number;
  explanation: string | null;
  created_at: string;
}

export interface ExerciseSubmitRequest {
  answer: Record<string, unknown>;
}

export interface ExerciseSubmitResponse {
  is_correct: boolean;
  correct_answer: Record<string, unknown>;
  explanation: string | null;
  mastery_change: number;
}

// ===== Progress =====
export interface KnowledgeMastery {
  knowledge_point_id: string;
  knowledge_point_name: string;
  mastery_score: number;
  total_attempts: number;
  correct_attempts: number;
  last_practiced_at: string | null;
}

export interface UserProgress {
  total_knowledge_points: number;
  mastered_count: number;
  learning_count: number;
  average_mastery: number;
  total_practice_count: number;
  correct_rate: number;
}

export interface LearningStats {
  total_study_time_minutes: number;
  total_exercises_completed: number;
  total_correct: number;
  weekly_activity: number[];
  category_mastery: Record<string, number>;
}

// ===== Visualization =====
export interface VisualizationState {
  dsType: string;
  data: unknown;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
}
