import { useQuery } from "@tanstack/react-query";
import { Seat } from "../api/types/seats";
import { getSeats } from "../api/services/seatService";

export const useSeats = () => {
  return useQuery<Seat[], Error>({
    queryKey: ["seats"],
    queryFn: getSeats,
  });
};
