
// src/api/types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}




export interface RegistrationResponse {
  message: string;
  user: {
    id: number;
    full_name: string;
    role: string;
    email: string;
  };
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  re_password: string;

}

export interface LoginPayload {

  email: string;
  password: string;

}
export interface VerifyPayload {
  email: string;
  otp: string;
}

export interface ActivateUserPayload {
  email: string;
  otp: string;
}
export interface ActivateUserResponse {
  message: string;

}
export interface ResendOtpPayload {
  email: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

export interface SubmitPasswordResetPayload {
  email: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

export interface SubmitPasswordResetResponse {
  message: string;
}
export interface ResendOtpResponse {
  message: string;
}
export interface VerifyPayloadResponse {
  message: string;
  token: string;

}

export interface LoginResponse {

  message: string,
  role: string

}

export interface UserProfileResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
  qr_code_image: string;
}