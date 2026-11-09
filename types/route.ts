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

  // Null for a stop recorded before coordinates existed, and for one whose
  // place on the map has not been set yet. The map simply leaves those out.
  latitude?: number | null;
  longitude?: number | null;
}
