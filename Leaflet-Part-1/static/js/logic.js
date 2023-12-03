/*** Script to display leftlet with showing USGS earthquake data for the past* 30 days magnitude 4.5 or above.* @author Nathan Stevens* @version 1.0*/// Store our API endpoint as queryUrl for all earth quakes 4.5 or greater for the last month.let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";// define the colors and limits for the legendconst colors = ['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'];const limits = [10, 30, 50, 70, 90];// Perform a GET request to the query URL.d3.json(queryUrl).then(function (data) {    console.log(data.features);    // Pass the features to a createFeatures() function:    createFeatures(data.features);});// called for each feature to add a popup that describes the place and time of the earthquake.function onEachFeature(feature, layer) {    // does this feature have a property named    if (feature.properties) {        let place = feature.properties.place;        let date = new Date(feature.properties.time);        let mag = feature.properties.mag;        let depth = feature.geometry.coordinates[2];                layer.bindPopup("<h3>" + place + "</h3><hr>" + date + "<br>Magnitude: " + mag + " / Depth: " + depth);    }}// function to get the colorfunction getColor(depth) {    let colorIndex = 0;        for(let i = 0; i < limits.length; i++) {        if(depth <= limits[i]) {            colorIndex = i;            break;        } else {            colorIndex = i;        }    }        // if we get here then just return last color index    return colors[colorIndex];}// return circle marker with size based on magnitude and color on depthfunction getCircle(feature, latlng) {    // set size by converting the log scale to linear scale then taking     // sqrt/divided 50    let size = Math.pow(10, feature.properties.mag);    size = Math.sqrt(size)/50;        let circle = new L.CircleMarker(latlng, {                radius: size,                 fillOpacity: 0.80,                 color: getColor(feature.geometry.coordinates[2])    });        return circle;}// create the earth datafunction createFeatures(earthquakeData) {        // Create a GeoJSON layer that contains the features array on the earthquakeData object.    // Run the onEachFeature function once for each piece of data in the array.    let earthquakes = L.geoJSON(earthquakeData, {        pointToLayer: getCircle,        onEachFeature: onEachFeature    });    // Send our earthquakes layer to a createMap() function.    createMap(earthquakes);}// 3.// createMap() takes the earthquake data and incorporates it into the visualization:function createMap(earthquakes) {    // Create the base layers.    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'    });    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'    });    // Create a baseMaps object.    let baseMaps = {      "Street Map": street,      "Topographic Map": topo    };    // Create an overlays object.    let overlayMaps = {        Earthquakes: earthquakes    };      // Create a new map.    // Edit the code to add the earthquake data to the layers.    let myMap = L.map("map", {      center: [        37.09, -95.71      ],      zoom: 5,      layers: [street, earthquakes]    });    // Create a layer control that contains our baseMaps.    // Be sure to add an overlay Layer that contains the earthquake GeoJSON.    L.control.layers(baseMaps, overlayMaps, {      collapsed: false    }).addTo(myMap);          // add the legend    let legend = L.control({ position: 'bottomright' });        legend.onAdd = function (map) {        var div = L.DomUtil.create('div', 'info legend');        var labels = ["<b>Depth (miles)</b>"];        var categories = ['0-10','11-30','31-50','51-70','91+'];                for (var i = 0; i < categories.length; i++) {            labels.push('<li class="circle" style="background:' + colors[i] + '"></li> ' + categories[i]);        }        div.innerHTML = '<ul>' + labels.join('<br>') + '</ul>';                return div    }        legend.addTo(myMap);}