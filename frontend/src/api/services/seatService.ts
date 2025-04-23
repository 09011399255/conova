import apiFetchWrapper from "../apiFetchWrapper";
import { Seat } from "../types/seatsTypes";

export const getSeats = () => apiFetchWrapper<Seat[]>('/seats/');

export const bookSeat = (seatId: string) =>
    apiFetchWrapper(`/seats/${seatId}/`, {
        method: "PATCH",
        body: { is_available: false },
    });
