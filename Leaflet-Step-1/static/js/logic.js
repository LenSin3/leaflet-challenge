// Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5,
  
});

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Function to customize radius
function getRadius (feature) {
  return feature.properties.mag * 3;
}

// Function to customize color intensity
function getDepth(d) {
  var d;
  if (d <= 10) {
      return "#d4e82b";
  }
  else if (d > 10 && d <= 30) {
      return "#e3ba1c";
  }
  else if (d > 30 && d <= 50) {
      return "#ed9c12";
  }
  else if (d > 50 && d <= 70) {
      return "#f5850a";
  }
  else if (d > 70 && d <= 90) {
      return " #fa7505";
  }
  else {
      return "#ff6600";
  }
       
}


// This will be run when L.geoJSON creates the point layer from the GeoJSON data.
function createCircleMarker( feature, latlng ){
  
  let options = {
    radius: getRadius(feature),
    fillColor: getDepth(feature.geometry.coordinates[2]),
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
  return L.circleMarker( latlng, options );
}


// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data) {
  console.log(data);
  // Create a GeoJSON layer with retrieved data
  L.geoJson(data, {
    pointToLayer: createCircleMarker,
    /*
    onEachFeature: function(feature, layer) {
        layer.bindPopup("Location: " + feature.properties.place + "<br>" +
        "Date: "  + moment(feature.properties.time).format("LL h:mm:ss") + "<br>" +
        "Magnitude: " + feature.properties.mag);
    }
    */
   onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" +
    "Magnitude: " + feature.properties.mag + "</p>");
}


  }).addTo(myMap);
})

// Create a legend to the rightbottom of the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depth = [-10, 10, 30, 50, 70, 90],
        labels = ['<strong>Earthquake Depth</strong>'];

    // loop through our depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        labels.push('<i style="background:' + getDepth(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+'));
            
    }
     div.innerHTML = labels.join('<br>');

    return div;
};

legend.addTo(myMap);