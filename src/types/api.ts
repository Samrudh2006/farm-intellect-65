export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

export interface HealthResponse {
  status: 'OK';
  timestamp: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  role: string;
  phone?: string;
  location?: string;
}

export interface LoginResponse {
  token?: string;
  user?: AuthUser;
  message: string;
  requires2FA?: boolean;
}

export interface ChatMessageDto {
  id?: string;
  userId?: string;
  message: string;
  type?: 'USER' | 'AI_ASSISTANT';
  context?: string | null;
  createdAt?: string;
}

export interface RecommendationDto {
  id?: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  data?: string | null;
  isActive?: boolean;
  createdAt?: string;
}
