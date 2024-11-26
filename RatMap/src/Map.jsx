import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import data from "./ratSightings";
import L from "leaflet";

console.log(data);
// Coordinates for boroughs
const boroughs = {
  All: [40.7128, -73.906], // Center point covering all boroughs
  Manhattan: [40.7831, -73.9712],
  Brooklyn: [40.6782, -73.9442],
  Queens: [40.7282, -73.7949],
  Bronx: [40.8448, -73.8648],
  StatenIsland: [40.5795, -74.1502],
};

const icons = {
  low: L.divIcon({
    className: "leaflet-div-icon",
    html: `
    <div style="position: relative; width: 12px; height: 24px;">
      <!-- Narrow Circle -->
      <div style="
        background-color: green; 
   width: 9px; 
        height: 9px; 
        border-radius: 50%; 
        position: absolute; 
        top: 0; 
        left: 0; 
        box-shadow: 0px 0px 0px 2px black;

      "></div>
 
    </div>
  `,
    iconSize: [18, 18],
    iconAnchor: [9, 9], // Centers the icon
  }),
  med: L.divIcon({
    className: "leaflet-div-icon",
    html: `
    <div style="position: relative; width: 12px; height: 24px;">
      <!-- Narrow Circle -->
      <div style="
        background-color: yellow; 
    width: 9px; 
        height: 9px; 
        border-radius: 50%; 
        position: absolute; 
        top: 0; 
        left: 0; 
        box-shadow: 0px 0px 0px 2px black;

      "></div>
 
    </div>
  `,
    iconSize: [18, 18],
    iconAnchor: [9, 9], // Centers the icon
  }),
  high: L.divIcon({
    className: "leaflet-div-icon",
    html: `
    <div style="position: relative; width: 12px; height: 24px;">
      <!-- Narrow Circle -->
      <div style="
        background-color: red; 
         width: 9px; 
        height: 9px; 
        border-radius: 50%; 
        position: absolute; 
        top: 0; 
        left: 0; 
        box-shadow: 0px 0px 0px 2px black;

      "></div>
 
    </div>
  `,
    iconSize: [18, 18],
    iconAnchor: [9, 9], // Centers the icon
  }),
};

// Component to programmatically change the map view
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const Map = () => {
  const [selectedBorough, setSelectedBorough] = useState("All");
  const [selectedYearRange, setSelectedYearRange] = useState("All");

  // Filter data based on borough and year range
  const filteredData = data.filter((sighting) => {
    const isBoroughMatch =
      selectedBorough === "All" ||
      sighting.Borough.replace(/\s+/g, "").toLowerCase() ===
        selectedBorough.replace(/\s+/g, "").toLowerCase();

    const isYearMatch =
      selectedYearRange === "All" ||
      (sighting?.Year && sighting?.Year.toString() === selectedYearRange);

    return isBoroughMatch && isYearMatch;
  });

  return (
    <div className="relative h-screen w-screen p-10">
      {/* Dropdown overlay positioned on the top-right corner */}
      <div className="absolute top-12 right-12 z-[1000] bg-stone-800 border border-stone-800  shadow-md p-2 text-white">
        <select
          value={selectedBorough}
          onChange={(e) => setSelectedBorough(e.target.value)}
          className="p-2 w-full bg-stone-800"
        >
          {Object.keys(boroughs).map((borough) => (
            <option key={borough} value={borough}>
              {borough}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown for Year Range */}
      <div className="absolute top-12 right-52 z-[1000] bg-stone-800 border border-stone-800 shadow-md p-2 text-white">
        <select
          value={selectedYearRange}
          onChange={(e) => setSelectedYearRange(e.target.value)}
          className="p-2 w-full bg-stone-800"
        >
          <option value="All">All Years</option>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
        </select>
      </div>

      {/* Map */}
      <MapContainer
        center={boroughs[selectedBorough]}
        zoom={selectedBorough === "All" ? 11 : 12}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView
          center={boroughs[selectedBorough]}
          zoom={selectedBorough === "All" ? 11 : 12}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Add markers for all boroughs if "All" is selected */}
        {filteredData.map((sighting, index) => (
          <Marker
            key={index}
            position={[sighting.Latitude, sighting.Longitude]}
            icon={icons[sighting.Rat_Sighting_Chances.toLowerCase()]}
          ></Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
