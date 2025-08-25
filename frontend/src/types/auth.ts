 // src/types/auth.ts

export interface RegisterPayload {
  first_name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

 