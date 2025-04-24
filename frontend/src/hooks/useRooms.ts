import { useQuery } from "@tanstack/react-query";
import { Room } from "../api/types/roomsTypes";
import { getRooms } from "../api/services/roomService";

export const useRooms = () => {
  return useQuery<Room[], Error>({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
};
