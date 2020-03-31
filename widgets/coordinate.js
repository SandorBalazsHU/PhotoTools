export function load(widgetDatas) {
    const coordinateContainer = document.querySelector("#coordinate");

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    var coordinateString = "";
    function success(pos) {
        const crd = pos.coords;
        widgetDatas.setCoordinates(crd);
        coordinateString = `Your current position is: Latitude: ${crd.latitude}`+
        ` Longitude: ${crd.longitude}`+
        ` More or less ${crd.accuracy} meters.`;
        coordinateContainer.innerHTML += coordinateString;
    }
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}