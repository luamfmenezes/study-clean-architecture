export interface AuthenticationParams {
  email: string;
  password: string;
}

export interface Authentication {
  auth(data: AuthenticationParams): Promise<string | undefined>;
}
