export interface Route {
  id: number;
  name: string;
  status: "Active" | "Inactive" | "Maintenance";
  driverId: number;
  description?: string;
  routeStops?: RouteStop[];
}

export interface RouteStop {
  id: number;
  routeId: number;
  stopName: string;
  arrivalTime: string;
  orderIndex: number;
}
