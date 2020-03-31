export function load() {
  let map = L.map("map").setView([47.5, 19], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.setView([appDatas.coordinates.latitude, appDatas.coordinates.longitude]);
  var marker = L.marker([appDatas.coordinates.latitude, appDatas.coordinates.longitude]).addTo(map);
  var popup = marker.bindPopup('<b>Itt Vagy!</b>');
  popup.openPopup();  
}