import apiFetchWrapper from "../apiFetchWrapper";
import { Seat } from "../types/seats";

export const getSeats = () => apiFetchWrapper<Seat[]>('/seats/');