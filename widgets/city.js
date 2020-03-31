export function load(widgetDatas) {
    const crd = widgetDatas.coordinates;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${crd.latitude}&lon=${crd.longitude}&zoom=18&addressdetails=1`).then(r => r.json())
    .then(data => printCity(data))
    .catch(e => console.log("Booo"))
    function printCity(data) {
        const cityContainer = document.querySelector("#city");
        cityContainer.innerHTML += data.display_name;
    }
}