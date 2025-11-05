export interface AuthCredentials {
  email: string;
  password?: string; // Password is optional for some contexts (e.g., after login)
}
