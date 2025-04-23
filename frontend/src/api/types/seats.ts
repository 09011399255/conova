export interface SeatBooking {
    id: number;
    user: number;
    seat: number;
    status: "confirmed" | "cancelled" | "pending";
    created_at: string;
    updated_at: string;
  }
  
  export interface Seat {
    id: number;
    floor: number;
    seat_no: string;
    is_available: boolean;
    x_coordinate: number;
    y_coordinate: number;
    seat_img: string;
    SeatBookings: SeatBooking[];
  }
  