export interface Bus {
  id?:number,
  busNo: string;
  startPlace: string;
  destination: string;
  departureTime: string; 
  totalSeats: number;
  ticketPrice: number;
  coach:string;
  driverId: number;
  conductorId: number;
  availableEveryDay: boolean;
  specificDays: string[];
}
