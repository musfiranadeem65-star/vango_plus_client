"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RouteStop } from "@/types/route";

interface RouteStopsMapProps {
  stops: RouteStop[];
  className?: string;
}

/**
 * The stops of one route, drawn in order on a map.
 *
 * Leaflet with OpenStreetMap tiles, not Google Maps, because Google requires
 * an API key tied to a billing account. This needs no key and no account.
 *
 * Leaflet talks to the DOM directly, so it is driven here through a ref
 * inside an effect rather than rendered as React elements, and the whole
 * component is loaded with ssr: false by its parent because it reads
 * `window` as soon as it is imported.
 */
export default function RouteStopsMap({ stops, className }: RouteStopsMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Only stops that have been given a position can be drawn. A route where
  // nobody has filled the coordinates in yet is the normal case at first.
  const placed = useMemo(
    () =>
      [...stops]
        .filter(
          (stop) =>
            typeof stop.latitude === "number" &&
            typeof stop.longitude === "number"
        )
        .sort((a, b) => a.orderIndex - b.orderIndex),
    [stops]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      // Turbo-style long sessions and React strict mode both re-run effects,
      // and a Leaflet map left behind keeps its listeners and its canvas.
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (!placed.length) {
      // Centre on Lahore so the map is not a grey void while the stops have
      // no coordinates yet.
      map.setView([31.5204, 74.3587], 11);
      return;
    }

    const points: L.LatLngExpression[] = placed.map((stop) => [
      stop.latitude as number,
      stop.longitude as number,
    ]);

    placed.forEach((stop, index) => {
      L.marker(points[index], {
        icon: L.divIcon({
          className: "vango-stop-marker",
          html: `<span>${index + 1}</span>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
      })
        .addTo(layer)
        .bindPopup(
          `<strong>${escapeHtml(stop.stopName)}</strong>${
            stop.arrivalTime ? `<br/>${escapeHtml(stop.arrivalTime)}` : ""
          }`
        );
    });

    if (points.length > 1) {
      L.polyline(points, { color: "#0B5394", weight: 4, opacity: 0.7 }).addTo(layer);
      map.fitBounds(L.latLngBounds(points).pad(0.2));
    } else {
      map.setView(points[0], 15);
    }
  }, [placed]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        role="application"
        aria-label="Route stops map"
        className="h-full min-h-[280px] w-full rounded-2xl"
      />
      {!placed.length ? (
        <p className="mt-2 text-xs font-medium text-on-surface-variant">
          No stop on this route has a location yet. An administrator can add
          one by editing the route.
        </p>
      ) : null}
    </div>
  );
}

/**
 * A stop name comes from the database and is put into the popup as HTML, so
 * it is escaped here. Without this, a stop named with a tag would run as
 * markup in every parent's browser.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
