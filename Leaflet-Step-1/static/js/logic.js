// Store the given API endpoint inside queryUrl
earthquakeURL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesURL =
  "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Get request for data
d3.json(earthquakeURL, function (data) {
  createFeatures(data.features);
});
// Define function to run "onEach" feature
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<h3>Magnitude: " +
          feature.properties.mag +
          "</h3><h3>Location: " +
          feature.properties.place +
          "</h3><hr><p>" +
          new Date(feature.properties.time) +
          "</p>"
      );
    },

    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng, {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.5,
        color: "black",
        stroke: true,
        weight: 0.8,
      });
    },
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create  map layers

  let airmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      accessToken: API_KEY,
    }
  );

  let satellite = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      accessToken: API_KEY,
    }
  );

  let lightMap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      accessToken: API_KEY,
    }
  );

  // Create base maps
  let baseMaps = {
    Satellite: lightMap,
    Grayscale: airmap,
    Outdoors: satellite,
  };

  // Create tectonic layer
  let tectonicPlates = new L.LayerGroup();

  // Create overlay object to hold overlay layer
  let overlayMaps = {
    "Fault Lines": earthquakes,
    Earthquakes: tectonicPlates,
  };

  // Create legend
  var legend = L.control({
    position: "bottomleft",
  });

  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

    // Create legend
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(grades[i] + 1) +
        '"></i> ' +
        grades[i] +
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
}

// Create color function
function getColor(magnitude) {
  if (magnitude > 5) {
    return "red";
  } else if (magnitude > 4) {
    return "lightred";
  } else if (magnitude > 3) {
    return "orange";
  } else if (magnitude > 2) {
    return "yellow";
  } else if (magnitude > 1) {
    return "green";
  } else {
    return "purple";
  }
}

//Create radius function
function getRadius(magnitude) {
  return magnitude * 15000;
}
