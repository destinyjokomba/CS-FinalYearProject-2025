// src/components/dashboard/UKSeatMap.tsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature as topojsonFeature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import { GeoPermissibleObjects } from "d3-geo";

// ----- Party type -----
export type Party = "lab" | "con" | "green" | "ld" | "reform" | "snp" | "other";

interface UKSeatMapProps {
  topoUrl: string;
  seatMap: Record<string, Party>;
  colors: Record<Party, string>;
  labels: Record<Party, string>;
}

// Utility: normalise constituency names for consistent matching
function normalizeName(name: string | undefined): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

const UKSeatMap: React.FC<UKSeatMapProps> = ({ topoUrl, seatMap, colors }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry> | null>(null);

  // Load TopoJSON → GeoJSON
  useEffect(() => {
    d3.json<Topology>(topoUrl)
      .then((topology) => {
        if (topology && topology.objects) {
          const firstKey = Object.keys(topology.objects)[0];
          const geojson = topojsonFeature(
            topology,
            topology.objects[firstKey] as GeometryCollection
          ) as FeatureCollection<Geometry>;

          console.log("✅ Features loaded:", geojson.features.length);
          console.log("🔑 Example properties:", geojson.features[0]?.properties);

          setGeoData(geojson);
        } else {
          console.error("❌ Invalid TopoJSON data");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load map data:", err);
      });
  }, [topoUrl]);

  // Draw map
  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = svgRef.current.getBoundingClientRect();
    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection);

    svg
      .selectAll<SVGPathElement, Feature<Geometry>>("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", (d) => path(d as GeoPermissibleObjects) || "")
      .attr("fill", (d) => {
        const props = d.properties as GeoJsonProperties;

        // Try common property keys for constituency names
        const rawName =
          (props?.PCON24NM as string) ||
          (props?.constituency as string) ||
          (props?.ConstituencyName as string) ||
          (props?.name as string);

        const key = normalizeName(rawName);
        const matchedParty = seatMap[key] ?? "other";

        return colors[matchedParty] || "#ddd";
      })
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5);
  }, [geoData, seatMap, colors]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <svg ref={svgRef} width="100%" height="100%" />
      {!geoData && <p style={{ textAlign: "center" }}>Loading constituencies…</p>}
    </div>
  );
};

export default UKSeatMap;
