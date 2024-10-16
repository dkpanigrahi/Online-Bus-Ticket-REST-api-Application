export interface Bus {
    id: number;
    busNo: string;
    startPlace: string;
    destination: string;
    departureTime: string; // Use string for time in 'hh:mm a' format
    availableEveryDay: boolean;
    specificDays: string[]; // List of days, e.g., ["Monday", "Wednesday"]
    totalSeats: number;
    ticketPrice: number;
    driverId: number; // Store the Driver's ID
    conductorId: number; // Store the Conductor's ID
  }
  