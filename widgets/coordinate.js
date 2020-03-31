export function load(widgetDatas) {
    const coordinateContainer = document.querySelector("#coordinate");
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
        const coordinateString = `Szélesség: ${crd.latitude}`+
        ` Hosszúság: ${crd.longitude}`+
        ` Pontosság: ${crd.accuracy} m.`;
        coordinateContainer.innerHTML += coordinateString;
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}