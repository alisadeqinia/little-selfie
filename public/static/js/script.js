function setup() {
    noCanvas();
    const video = createCapture(VIDEO);
    video.size(160, 120);

    let lat, lon;
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', sendData);
    
    async function sendData() {
        video.loadPixels();
        const image64 = video.canvas.toDataURL();
        const data = {latitude: lat, longitude: lon, image: image64};
        const option = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        };
        const response = await fetch('/selfie-api', option);
        const json = await response.json();
        console.log(json);
    }
    
    
    if ('geolocation' in navigator) {
        console.log('Geolocation is on!');
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
        })
    
    } else {
        console.log('Geolocation is off!');
    }
}




