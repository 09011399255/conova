import apiFetchWrapper from "../apiFetchWrapper";
import { Seat } from "../types/seatsTypes";

export const getSeats = () => apiFetchWrapper<Seat[]>('/seats/');