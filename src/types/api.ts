export interface AuthCredentials {
  boardId: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
