import authFetch from "../authFetch";
import { CheckInUserResponse } from "../types/checkInTypes";

export const fetchCheckInUser = (token: string) =>
    authFetch<CheckInUserResponse>(`/workspace-check-in/${token}/`);

export const postCheckInUser = (token: string) =>
    authFetch(`/workspace-check-in/${token}/`, {
        method: "POST",
    });