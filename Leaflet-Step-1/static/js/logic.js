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
  // Define the map layers
  var airmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mfatih72/ck30s2f5b19ws1cpmmw6zfumm/tiles/256/{z}/{x}/{y}?" +
      "access_token=API_KEY"
  );

  var satellite = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mfatih72/ck30r72r818te1cruud5wk075/tiles/256/{z}/{x}/{y}?" +
      "access_token=API_KEY"
  );

  var lightMap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      accessToken: API_KEY,
    }
  );

  // Define base maps
  var baseMaps = {
    LightMap: lightMap,
    AirMap: airmap,
    Satellite: satellite,
  };

  