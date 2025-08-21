declare module "topojson-client" {
  import type { Feature, FeatureCollection, Geometry } from "geojson";
  // Minimal TopoJSON types we need
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

  // The function we actually use
  export function feature(
    topology: Topology,
    object: unknown
  ): FeatureCollection | Feature<Geometry>;
}
