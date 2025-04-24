export interface Room {
    id: number;
    floor: number;
    room_type: string;
    room_no: number;
    x_coordinate: number;
    room_img: string;
    room_capacity: number;
    is_restricted: boolean;
    is_required_approval: boolean;
    is_available: boolean;
    availability: {
      MON: {
        day: "MON";
        is_available: boolean;
        start_time: string;
        end_time: string;
      };
      TUE: {
        day: "TUE";
        is_available: boolean;
        start_time: string;
        end_time: string;
      };
      WED: {
        day: "WED";
        is_available: boolean;
        start_time: string;
        end_time: string;
      };
      THU: {
        day: "THU";
        is_available: boolean;
        start_time: string;
        end_time: string;
      };
      FRI: {
        day: "FRI";
        is_available: boolean;
        start_time: string;
        end_time: string;
      };
      SAT: {
        day: "SAT";
        is_available: boolean;
        start_time: string;
        end_time: string;
      };
      SUN: {
        day: "SUN";
        is_available: boolean;
        start_time: string;
        end_time: string;
      };
    };
  }
  