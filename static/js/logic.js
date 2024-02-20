// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Create a map centered around a specific location
    var map = L.map("map").setView([0, 0], 2);
  
    // Add the base tile layer to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
  
    // Read in earthquake data from data.json
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        // Loop through each earthquake data entry
        data.features.forEach(function (earthquake) {
          // Extract magnitude, depth, and coordinates
          var magnitude = earthquake.properties.mag;
          var depth = earthquake.geometry.coordinates[2];
          var coordinates = [
            earthquake.geometry.coordinates[1],
            earthquake.geometry.coordinates[0],
          ];
  
          // Calculate marker size based on magnitude
          var markerSize = magnitude * 5;
  
          // Calculate marker color based on depth
          var markerColor = getColor(depth);
  
          // Create a circle marker for each earthquake
          var marker = L.circleMarker(coordinates, {
            radius: markerSize,
            fillColor: markerColor,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map);
  
          // Create a popup with additional information
          var popupContent =
            "<b>Magnitude:</b> " +
            magnitude +
            "<br><b>Depth:</b> " +
            depth +
            " km";
          marker.bindPopup(popupContent);
        });
  
        // Create a legend
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function (map) {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML +=
            '<i style="background:' +
            getColor(0) +
            '"></i> 0 - 10 km<br>';
          div.innerHTML +=
            '<i style="background:' +
            getColor(10) +
            '"></i> 10 - 30 km<br>';
          div.innerHTML +=
            '<i style="background:' +
            getColor(30) +
            '"></i> 30 - 50 km<br>';
          div.innerHTML +=
            '<i style="background:' +
            getColor(50) +
            '"></i> 50 - 70 km<br>';
          div.innerHTML +=
            '<i style="background:' +
            getColor(70) +
            '"></i> 70+ km<br>';
          return div;
        };
        legend.addTo(map);
      });
  
    // Function to get marker color based on depth
    function getColor(depth) {
      return depth >= 70
        ? "#800026"
        : depth >= 50
        ? "#BD0026"
        : depth >= 30
        ? "#E31A1C"
        : depth >= 10
        ? "#FC4E2A"
        : "#FFEDA0";
    }
  });
  