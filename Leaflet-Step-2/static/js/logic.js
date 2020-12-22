/*
return "rgb(240, 107, 107)" 
    } else {
        if (mag > 4) {
            return "rgb(240, 167, 107)"
        } else {
            if (mag > 3) {
                return "rgb(243, 186, 77)"
            } else {
                if (mag > 2) {
                    return "rgb(243, 219, 77)"
                } else {
                    if (mag > 1) {
                        return "rgb(226, 243, 77)"
                    } else {
                        return "rgb(183, 243, 77)"
*/





// Earthquakes
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

function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" +
    "Magnitude: " + feature.properties.mag + "</p>");
};

function createFeatures(tectonicPlatesData, earthQuakesData) {

    
    // Tectonic Plates
    
    var tectonicPlates = L.geoJson(tectonicPlatesData, {

        style: {
            color: "#FFA500",
            opacity: 0.6,
            fillColor: '#333333',
            fillOpacity: 0
        } 
    });
    

    
    // Earthquakes data
    var earthQuakes = L.geoJson(earthQuakesData, {
        pointToLayer: createCircleMarker,
        onEachFeature: onEachFeature

    })

    // Send geo data layers to createMaps function
    createMaps(tectonicPlates, earthQuakes);

};

function createMaps(tectonicPlates,earthQuakes) {

    // Create base layers
    // Satelite Layer
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });
    
    // Light Scale
    var lightScale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });
    
    // Outdoors Layer
    var outDoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    // Create a baseMaps object
    var baseMaps = {
        "Satellite": satellite,
        "Lightscale": lightScale,
        "Outdoors": outDoors
    };

    // Create an overlay object
    var overlayMaps = {
        "Tectonic Plate": tectonicPlates,
        "Earthquakes": earthQuakes
    };

    // Create a map object
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [satellite, tectonicPlates, earthQuakes]
   });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

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
}

// Tectonic Plates
var platesDataLink = "static/data/PB2002_plates.json";

// Earthquakes
quakesDataLink =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Send request to various links
d3.json(platesDataLink, function(tectonicPlatesData) {

    d3.json(quakesDataLink, function(earthQuakesData) {

        // Call create features to read the geoJSON data
        createFeatures(tectonicPlatesData.features, earthQuakesData.features);
    });
    
});





