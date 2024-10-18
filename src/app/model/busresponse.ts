export interface Busresponse {
  id:number,
  busNo: string;
  startPlace: string;
  destination: string;
  departureTime: string; 
  totalSeats: number;
  ticketPrice: number;
  driverName: string;
  conductorName: string;
  availableEveryDay: boolean;
  specificDays: string[];
}
