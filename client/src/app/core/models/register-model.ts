
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  messgae?: string;
  data?: unknown;
}
