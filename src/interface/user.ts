export interface IUser {
  id?: number;
  username: string;
  password: string;
  created_at? : Date
  updated_at? : Date
}

export interface RegisterUserResponse {
  id: number,
  username: string
  created_at : Date
}