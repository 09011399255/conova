import authFetch from "../authFetch";
import { Room } from "../types/roomsTypes";

export const getRooms = () => authFetch<Room[]>('/rooms/');
