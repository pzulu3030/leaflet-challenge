// Store the given API endpoint inside queryUrl
let earthquakeURL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicPlatesURL =
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
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.7,
      });
    },
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create  map layers

  let topmap = L.tileLayer(
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

  // Create tectonic layer
  let tectonicPlates = new L.LayerGroup();

  // Create overlay object to hold overlay layer
  let overlayMaps = {
    "Fault Lines": earthquakes,
    Earthquakes: tectonicPlates,
  };

  // Create base maps
  let baseMaps = {
    Satellite: lightMap,
    Grayscale: topmap,
    Outdoors: satellite,
  };

  // Create the map
  let myMap = L.map("mapid", {
    center: [39, -93],
    zoom: 5,
    layers: [lightMap, earthquakes, tectonicPlates],
  });

  // Add tectonic plates data
  d3.json(tectonicPlatesURL, function (tectonicData) {
    L.geoJson(tectonicData, {
      color: "orange",
      weight: 2,
    }).addTo(tectonicPlates);
  });

  //Create layer control to map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

  //Create legend

  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("mapid", "info legend"),
      magnitudes = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(magnitudes[i] + 1) +
        '"></i> ' +
        +magnitudes[i] +
        (magnitudes[i + 1] ? " - " + magnitudes[i + 1] + "<br>" : " + ");
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
  return magnitude * 23000;
}
