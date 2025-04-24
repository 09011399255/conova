import authFetch from "../authFetch";
import { Seat } from "../types/seatsTypes";

export const getSeats = () => authFetch<Seat[]>('/seats/');

export const bookSeat = (seatId: string) =>
    authFetch(`/seat-bookings/`, {
        method: "POST",
        body: { seat: Number(seatId) },
    });
