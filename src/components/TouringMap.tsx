"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const venues = [
  { id: 1, name: "The Electric Lounge", position: [47.6062, -122.3321], density: 8 },
  { id: 2, name: "Backstage Beer Garden", position: [45.5152, -122.6784], density: 12 },
  { id: 3, name: "Vibration Hall", position: [30.2672, -97.7431], density: 20 },
];

export default function TouringMap() {
  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
      <MapContainer 
        center={[39.8283, -98.5795] as any} 
        zoom={4} 
        style={{ height: "100%", width: "100%", background: "#09090b" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {venues.map((venue) => (
          <div key={venue.id}>
            <CircleMarker 
              center={venue.position as any} 
              radius={venue.density * 2}
              pathOptions={{ 
                fillColor: '#db2777', 
                color: '#db2777', 
                fillOpacity: 0.2,
                weight: 1
              }}
            />
            <Marker position={venue.position as any} icon={icon}>
              <Popup>
                <div className="bg-zinc-950 text-white p-2 rounded-lg border border-zinc-800">
                  <h3 className="font-black uppercase tracking-tight">{venue.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Venue Hotspot</p>
                  <button className="w-full mt-3 py-1 bg-pink-600 rounded text-[10px] font-black uppercase">View Profile</button>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
