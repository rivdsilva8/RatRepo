import React from "react";

// Colors for the different sighting levels
const icons = {
  low: "#28a745", // green
  med: "#ffc107", // yellow
  high: "#dc3545", // red
};

// Create a circle element to represent sighting severity
const SightingCircle = ({ sightingLevel }) => {
  const color = icons[sightingLevel?.toLowerCase()] || "#6c757d"; // Default to gray if unknown
  return (
    <div
      style={{
        width: "20px", // Set a fixed width
        height: "20px", // Set a fixed height
        borderRadius: "50%",
        backgroundColor: color,
        border: "2px solid #000", // 2px black border around the circle
        margin: "0 auto", // Center the circle in the cell
      }}
    ></div>
  );
};

const Table = ({ filteredData }) => {
  // Get the unique zip codes and years
  const zipCodes = [
    ...new Set(filteredData?.map((sighting) => sighting["Incident Zip"])),
  ];
  const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

  // Create a helper function to get the sighting level for a specific year and zip code
  const getSightingLevel = (zipCode, year) => {
    const sighting = filteredData?.find(
      (s) => s["Incident Zip"] === zipCode && s.Year === year
    );
    return sighting ? sighting.Rat_Sighting_Chances : "None"; // Return "None" if no data for that year/zip code
  };

  // Helper function to determine if sightings increased, decreased, or stayed the same
  const getSightingsTrend = (zipCode) => {
    const sightingsPerYear = years.map((year) =>
      getSightingLevel(zipCode, year)
    );
    let trend = "Unchanged";

    for (let i = 1; i < sightingsPerYear.length; i++) {
      if (
        sightingsPerYear[i] !== "None" &&
        sightingsPerYear[i - 1] !== "None"
      ) {
        if (sightingsPerYear[i] > sightingsPerYear[i - 1]) {
          trend = "Increased";
        } else if (sightingsPerYear[i] < sightingsPerYear[i - 1]) {
          trend = "Decreased";
        }
      }
    }

    return trend;
  };

  return (
    <div className="overflow-x-auto mt-12 bg-stone-800 p-4 rounded-lg">
      <table className="min-w-full table-auto border-collapse text-sm text-white border border-stone-700">
        <thead className="bg-stone-600">
          <tr>
            <th className=" py-2 border-r border-stone-600">Zip Code</th>
            {years.map((year) => (
              <th key={year} className=" py-2 border-r border-stone-600">
                {year}
              </th>
            ))}
            <th className=" py-2">Trend</th> {/* Column for Situation */}
          </tr>
        </thead>
        <tbody>
          {zipCodes.map((zipCode) => (
            <tr key={zipCode} className="border-b border-stone-600">
              <td className=" py-2 text-center border-r border-stone-600">
                {zipCode}
              </td>
              {years.map((year) => (
                <td
                  key={year}
                  className=" py-2 text-center border-r border-stone-600"
                >
                  <SightingCircle
                    sightingLevel={getSightingLevel(zipCode, year)}
                  />
                </td>
              ))}
              <td
                className={` py-2 text-center font-bold ${
                  getSightingsTrend(zipCode) === "Increased"
                    ? "text-red-500"
                    : getSightingsTrend(zipCode) === "Decreased"
                    ? "text-green-500"
                    : "text-white"
                }`}
              >
                {getSightingsTrend(zipCode)}
              </td>{" "}
              {/* Trend for Situation */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
