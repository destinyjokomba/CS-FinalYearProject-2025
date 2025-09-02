import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/dashboard/UKSeatMap.tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature as topojsonFeature } from "topojson-client";
// Utility: normalise constituency names for consistent matching
function normalizeName(name) {
    if (!name)
        return "";
    return name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9 ]/g, "") // remove punctuation
        .replace(/\s+/g, " ") // collapse spaces
        .trim();
}
const UKSeatMap = ({ topoUrl, seatMap, colors }) => {
    const svgRef = useRef(null);
    const [geoData, setGeoData] = useState(null);
    // Load TopoJSON → GeoJSON
    useEffect(() => {
        d3.json(topoUrl)
            .then((topology) => {
            if (topology && topology.objects) {
                const firstKey = Object.keys(topology.objects)[0];
                const geojson = topojsonFeature(topology, topology.objects[firstKey]);
                console.log("✅ Features loaded:", geojson.features.length);
                console.log("🔑 Example properties:", geojson.features[0]?.properties);
                setGeoData(geojson);
            }
            else {
                console.error("❌ Invalid TopoJSON data");
            }
        })
            .catch((err) => {
            console.error("❌ Failed to load map data:", err);
        });
    }, [topoUrl]);
    // Draw map
    useEffect(() => {
        if (!geoData || !svgRef.current)
            return;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        const { width, height } = svgRef.current.getBoundingClientRect();
        const projection = d3.geoMercator().fitSize([width, height], geoData);
        const path = d3.geoPath().projection(projection);
        svg
            .selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", (d) => path(d) || "")
            .attr("fill", (d) => {
            const props = d.properties;
            // Try common property keys for constituency names
            const rawName = props?.PCON24NM ||
                props?.constituency ||
                props?.ConstituencyName ||
                props?.name;
            const key = normalizeName(rawName);
            const matchedParty = seatMap[key] ?? "other";
            return colors[matchedParty] || "#ddd";
        })
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5);
    }, [geoData, seatMap, colors]);
    return (_jsxs("div", { style: { width: "100%", height: "500px" }, children: [_jsx("svg", { ref: svgRef, width: "100%", height: "100%" }), !geoData && _jsx("p", { style: { textAlign: "center" }, children: "Loading constituencies\u2026" })] }));
};
export default UKSeatMap;
