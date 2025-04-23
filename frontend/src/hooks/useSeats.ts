import { useQuery } from "@tanstack/react-query";
import { getSeats } from "../api/services/seatService";
import { Seat } from "../api/types/seatsTypes";

export const useSeats = () => {
  return useQuery<Seat[], Error>({
    queryKey: ["seats"],
    queryFn: getSeats,
  });
};
