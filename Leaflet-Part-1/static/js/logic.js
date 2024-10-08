// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add the tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to determine marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 4;
}

// Function to determine marker color based on depth
function getMarkerColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#91cf60' :
                        '#1a9850';
}

// Create a layer group for the earthquakes
var earthquakes = L.layerGroup().addTo(map);

// Fetch earthquake data and add markers
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getMarkerSize(feature.properties.mag),
                fillColor: getMarkerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
                             <p>Magnitude: ${feature.properties.mag}</p>
                             <p>Depth: ${feature.geometry.coordinates[2]} km</p>
                             <p>Time: ${new Date(feature.properties.time)}</p>`);
        }
    }).addTo(earthquakes);
});

// Create a legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

    div.innerHTML += '<h4>Depth</h4>';

    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getMarkerColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

legend.addTo(map);