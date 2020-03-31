export function load() {
  var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
  };
  function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  function success(pos) {
      let map = L.map("map").setView([47.5, 19], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    
      map.setView([pos.coords.latitude, pos.coords.longitude]);
      var marker = L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map);
      var popup = marker.bindPopup('<b>Itt Vagy!</b>');
      popup.openPopup();  
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
}