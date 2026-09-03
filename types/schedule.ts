import type { RouteStop } from "@/types/route";

export interface StudentSchedule {
  routeId?: number;
  routeName?: string;
  driverId?: number;
  stops: RouteStop[];
}