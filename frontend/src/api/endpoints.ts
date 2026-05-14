import type {
  Exercise,
  ExerciseSubmitRequest,
  ExerciseSubmitResponse,
  KnowledgeGraphData,
  KnowledgeMastery,
  KnowledgePoint,
  LearningStats,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  UserProgress,
} from "@/types";
import apiClient from "./client";

// ===== Auth =====
export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<User>("/auth/register", data),
  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>("/auth/login", data),
  me: () => apiClient.get<User>("/auth/me"),
  // 管理员端点（依赖：成员 C）
  listUsers: () => apiClient.get<User[]>("/auth/users"),
  updateUser: (id: string, data: Partial<User>) =>
    apiClient.put<User>(`/auth/users/${id}`, data),
};

// ===== Knowledge Graph =====
export const knowledgeGraphApi = {
  listNodes: (params?: { category?: string; page?: number }) =>
    apiClient.get<KnowledgePoint[]>("/knowledge-graph/nodes", { params }),
  getNode: (id: string) =>
    apiClient.get<KnowledgePoint>(`/knowledge-graph/nodes/${id}`),
  getGraph: (userId?: string) =>
    apiClient.get<KnowledgeGraphData>("/knowledge-graph/graph", {
      params: userId ? { user_id: userId } : {},
    }),
  recommend: (userId: string) =>
    apiClient.get<string[]>(`/knowledge-graph/recommend/${userId}`),
  findPath: (source: string, target: string) =>
    apiClient.post("/knowledge-graph/path", {
      source_node_id: source,
      target_node_id: target,
    }),
  // 管理员端点（依赖：成员 D）
  createNode: (data: Partial<KnowledgePoint>) =>
    apiClient.post<KnowledgePoint>("/knowledge-graph/nodes", data),
  updateNode: (id: string, data: Partial<KnowledgePoint>) =>
    apiClient.put<KnowledgePoint>(`/knowledge-graph/nodes/${id}`, data),
  deleteNode: (id: string) =>
    apiClient.delete(`/knowledge-graph/nodes/${id}`),
};

// ===== Exercises =====
export const exerciseApi = {
  list: (knowledgePointId?: string) =>
    apiClient.get<Exercise[]>("/exercises", {
      params: knowledgePointId ? { knowledge_point_id: knowledgePointId } : {},
    }),
  get: (id: string) => apiClient.get<Exercise>(`/exercises/${id}`),
  submit: (id: string, data: ExerciseSubmitRequest) =>
    apiClient.post<ExerciseSubmitResponse>(`/exercises/${id}/submit`, data),
  adaptive: (userId: string, limit = 5) =>
    apiClient.get<Exercise[]>(`/exercises/adaptive/${userId}`, {
      params: { limit },
    }),
  // 管理员端点（依赖：成员 A）
  create: (data: Partial<Exercise>) =>
    apiClient.post<Exercise>("/exercises", data),
  update: (id: string, data: Partial<Exercise>) =>
    apiClient.put<Exercise>(`/exercises/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/exercises/${id}`),
};

// ===== Progress =====
export const progressApi = {
  overview: (userId: string) =>
    apiClient.get<UserProgress>(`/progress/${userId}`),
  mastery: (userId: string) =>
    apiClient.get<KnowledgeMastery[]>(`/progress/${userId}/mastery`),
  stats: (userId: string) =>
    apiClient.get<LearningStats>(`/progress/${userId}/stats`),
};
