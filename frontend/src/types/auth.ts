 // src/types/auth.ts
export interface User {
  id: number;
  username: string;
  email: string;
  profilePicUrl?: string | null;
  chosenAlignment?: string | null;
}

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

 