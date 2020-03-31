export function load(appDatas) {
  var centerlat = appDatas.coordinates.latitude;
  var centerlon =  appDatas.coordinates.longitude;
  
  // set default zoom level
  var zoomLevel = 2;
  
  // initialize map
  var map = L.map('map').setView([centerlat, centerlon], zoomLevel);
  
  // Set up the OSM layer
  var background = L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
      {maxZoom: 18, opacity: 0.5}).addTo(map);
  
  function onEachDot(feature, layer) {
      layer.bindPopup('<table style="width:180px"><tbody><tr><td><div><b>name:</b></div></td><td><div>' + feature.properties.popup + '</div></td></tr><tr class><td><div><b>time:</b></div></td><td><div>' + feature.properties.time + '</div></td></tr></tbody></table>');
  }
  
  //create data and add it to the map
  var spiralsteps = 60;
  var spiral = make_spiral_json(spiralsteps, [centerlat, centerlon], 0, 1, 0.3, 0.97, 0.1, 0.1);
  
  var spiralLayer = L.geoJson(spiral, {
      onEachFeature: onEachDot
  });
  
  var spiralBounds = spiralLayer.getBounds();
  map.fitBounds(spiralBounds);
  spiralLayer.addTo(map);
  
  function connectTheDots(data){
      var c = [];
      for(var i in data._layers) {
          var x = data._layers[i]._latlng.lat;
          var y = data._layers[i]._latlng.lng;
          c.push([x, y]);
      }
      return c;
  }
  
  var spiralCoords = connectTheDots(spiralLayer);
  var spiralLine = L.polyline(spiralCoords).addTo(map)
  
  /////////////////////////////////////////////////////////////////////////////////////////////
  //functions for creating synthetic GeoJSON data//
  /////////////////////////////////////////////////////////////////////////////////////////////
  
  //cheapo normrand function
  function normish(mean, range) {
      var num_out = ((Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2) * range + mean;
      return num_out;
  }
  
  //zero padding for time stamps
  function zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
  }
  
  function make_spiral_json(steps, init_pt, init_angle, init_dist, turn, persistence, wobble, lurch) {
  
      var spiral = {
          type: "FeatureCollection",
          features: []
      };
  
      var x = init_pt[1];
      var y = init_pt[0];
      var c = [
          [x, y]
      ];
      var angle = init_angle;
      var dist = init_dist;
  
      for (var i = 0; i < steps; ++i) {
  
          var hour = 2 + Math.floor(i / 60);
          var min = zeroPad(i % 60, 2);
  
          var g = {
              "type": "Point",
                  "coordinates": [x, y]
          };
          var p = {
              "id": i,
                  "popup": "ping_" + i,
                  "time": hour + ':' + min
          };
          spiral.features.push({
              "geometry": g,
                  "type": "Feature",
                  "properties": p
          });
  
          x = x + dist * Math.sin(angle) *1.5;
          y = y + dist * Math.cos(angle);
          //        c.push([x, y]);
          dist = dist * (persistence + lurch * normish(0, 1));
          angle = angle + turn + wobble * normish(0, 1);
      }
      return spiral;
  }
}
