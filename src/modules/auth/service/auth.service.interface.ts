import { AuthResponse } from '../dto/auth-response.dto';
import { LoginRequest } from '../dto/login.dto';
import { RefreshSessionResponse } from '../dto/refresh-session-response.dto';
import { SignUpRequest } from '../dto/signup.dto';

export interface IAuthService {
  login(login: LoginRequest): Promise<AuthResponse>;
  signUp(signUp: SignUpRequest): Promise<AuthResponse>;
  refreshSession(refreshToken: string): Promise<RefreshSessionResponse>;
}
