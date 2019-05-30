var usgs_quakes_api = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function set_color(magnitude) {
    var colors = [ 'lightgreen', 'darkgreen', 'yellow', 'orange', 'red', 'darkred' ]

    if (magnitude > 5) {
        return colors[5]
    } else {
        return colors[Math.floor(magnitude)]
    }
};

function create_map() {

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZmlvbmF3ZXN0b24iLCJhIjoiY2p3N2M0bzNlMmQwdzQ5cGcybmRsMHhsMyJ9.7K-klK4RUZAjI3JohmW80Q'
    });

    var mymap = L.map('mymap', {
        center: [40, -90],
        zoom: 3.0,
        layers: [streetMap, earthquakes]
    });

    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>";

        for (var i = 0; i <= 5; i++) {
            if (i > 4) { var tag = '+'; }
            else { var tag = '&ndash;' + (i + 1) }

            div.innerHTML += '<i style="background:' + set_color(i + 1) + '"></i> ' + i + tag + '<br>';
        }

        return div;
    };
    legend.addTo(mymap);
}

var earthquakes = new L.LayerGroup();

d3.json(usgs_quakes_api, function (geoJSON) {
    L.geoJSON(geoJSON.features, {
        pointToLayer: function (geoJSON_point, latlng) {
            return L.circleMarker(latlng, { radius: geoJSON_point.properties.mag * 2 });
        },

        style: function (geoJSON_feature) {
            return {
                fillColor: set_color(geoJSON_feature.properties.mag),
                fillOpacity: geoJSON_feature.properties.mag * 0.7,
                weight: 0.5
            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + feature.properties.title + "<br>" + new Date(feature.properties.time) + "</h4>");
        }
    }).addTo(earthquakes);
});

create_map();
