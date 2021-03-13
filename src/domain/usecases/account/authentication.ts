export interface AuthenticationModel {
  email: string;
  password: string;
}

export interface Authentication {
  auth(data: AuthenticationModel): Promise<string | undefined>;
}
