var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
});

var myMap = L.map("map", {
    center: [
    45.52, -95.07
            ],
    zoom: 3,   
})

streetmap.addTo(myMap);
// Store API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Perform get request and send data to features fuction
d3.json(queryUrl, function(data) {
    //Create markers and layers
    function mapStyle(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: mapColor(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: mapRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }

    function mapColor(coordinates) {
        switch (true) {
          case coordinates < 10:
            return "#ea2c2c";
          case coordinates > 10:
            return "#eaa92c";
          case coordinates > 30:
            return "#d5ea2c";
          case coordinates > 50:
            return "#92ea2c";
          case coordinates > 70:
            return "#2ceabf";
          default:
            return "#2c99ea";
        }
    }

    function mapRadius(mag) {
        if (mag === 0) {
          return 1;
        }
    
        return mag * 4;
    }

    L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
    
        style: mapStyle,
    
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    
        }
    }).addTo(myMap);
    
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
    
        var grades = [10, 30, 50, 70, 90];
        var colors = ["#2c99ea", "#2ceabf", "#92ea2c", "#d5ea2c","#eaa92c"];

        for (var i = 0; i<grades.length; i++) {
            div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
          return div;
      
    };
      
    legend.addTo(myMap)
});