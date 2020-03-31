export function load(widgetDatas) {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    function success(pos) {
        const crd = pos.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${crd.latitude}&lon=${crd.longitude}&zoom=18&addressdetails=1`).then(r => r.json())
        .then(data => printCity(data))
        .catch(e => console.log("ERROR"))
        function printCity(data) {
            const cityContainer = document.querySelector("#city");
            cityContainer.innerHTML += data.display_name;
        }
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}