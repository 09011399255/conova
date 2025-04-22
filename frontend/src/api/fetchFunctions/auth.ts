import apiFetchWrapper from "../apiFetchWrapper";
import { ActivateUserPayload, ActivateUserResponse, LoginPayload, LoginResponse, RegisterPayload, RegistrationResponse, RequestPasswordResetPayload, ResendOtpPayload, ResendOtpResponse, SubmitPasswordResetPayload, SubmitPasswordResetResponse, VerifyPayload, VerifyPayloadResponse } from "../types/authTypes";

export const registerUser = (userData: RegisterPayload) => 
    apiFetchWrapper<RegistrationResponse>('/auth/register/', { method: 'POST', body: userData });

export const loginUser = (userData:LoginPayload) => 
    apiFetchWrapper<LoginResponse>('/auth/login/', { method: 'POST', body: userData });



export const activateUser = (activateUserData: ActivateUserPayload) => 
    apiFetchWrapper<ActivateUserResponse>('/auth/activate-user/', { method: 'POST', body: activateUserData });
export const resendOtp = (resendOtpData: ResendOtpPayload) => apiFetchWrapper<ResendOtpResponse>('/auth/resend-otp/', {
    method: 'POST', body: resendOtpData
})


export const requestPasswordReset = (requestPasswordResetData:RequestPasswordResetPayload) => apiFetchWrapper<VerifyPayloadResponse>('/auth/reset-password/', {
    method: 'POST', body: requestPasswordResetData
});

export const verifyOtp = (verifyOtpData: VerifyPayload) => apiFetchWrapper<VerifyPayloadResponse>('/auth/verify-otp/', {
    method: 'POST', body: verifyOtpData
});

export const submitPasswordReset = (submitPasswordResetData: SubmitPasswordResetPayload) => apiFetchWrapper<SubmitPasswordResetResponse>('/auth/reset-password-confirm/', {
    method: 'POST', body: submitPasswordResetData
});


