export interface CheckInUserResponse {
    is_checked: boolean;
    user: {
        full_name: string;
        email: string;
        profile_picture?: string;
    };
}