declare module "topojson-specification" {
  // Very small slice of the spec – enough for typing in UKSeatMap.tsx
  export type Objects<T> = Record<string, T>;
  export type GeometryCollection = {
    type: "GeometryCollection";
    geometries: Array<unknown>;
  };
  export type Topology = {
    type: "Topology";
    objects: Objects<unknown>;
    arcs?: unknown;
    transform?: unknown;
  };
}
