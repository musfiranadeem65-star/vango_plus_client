/** Google Stitch project for VanGo Plus UI designs. */
export const STITCH_PROJECT_ID = "11955002942307840826";

export type StitchScreenRef = {
  title: string;
  screenId: string;
  route?: string;
};

/** Maps admin routes to Stitch screen IDs for step-by-step implementation. */
export const STITCH_ADMIN_SCREENS: Record<string, StitchScreenRef> = {
  dashboard: {
    title: "Admin Dashboard - VanGo Plus",
    screenId: "8d3f531dc3954937bddd4a683c37c6c2",
    route: "/admin/dashboard",
  },
  students: {
    title: "Students List - VanGo Plus",
    screenId: "ac2d755976ea4121a87aa9758c879712",
    route: "/admin/students",
  },
  drivers: {
    title: "Drivers Management - VanGo Plus",
    screenId: "04a23a77abf84993842058e0484b726f",
    route: "/admin/drivers",
  },
  routes: {
    title: "Routes Management - VanGo Plus",
    screenId: "ce8e93862d274dc1876ee9bdd6b81254",
    route: "/admin/routes",
  },
  guardians: {
    title: "Guardian Approvals - VanGo Plus",
    screenId: "9cbb6b83402a4d2eb34bf777f2ce5401",
    route: "/admin/guardians",
  },
  subscriptions: {
    title: "Subscriptions - VanGo Plus",
    screenId: "e3fa0c366671427fb196390289010ec4",
    route: "/admin/subscriptions",
  },
  settings: {
    title: "Settings - VanGo Plus",
    screenId: "c0f2f6c60ddd4483b06a284456c0c122",
    route: "/admin/settings",
  },
};

export function stitchScreenName(screenId: string) {
  return `projects/${STITCH_PROJECT_ID}/screens/${screenId}`;
}
