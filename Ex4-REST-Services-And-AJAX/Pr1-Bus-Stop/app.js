function getInfo() {
    let stopId = document.getElementById('stopId');
    let url = `https://judgetests.firebaseio.com/businfo/${stopId.value}.json`;

    let elements = {
      $stopNameDiv: () => document.getElementById('stopName'),
      $busesUl: () => document.getElementById('buses'),
    };

    fetch(url)
        .then(r => r.json())
        .then(r => {
            const { buses, name} = r;
            elements.$stopNameDiv().textContent = name;
            elements.$busesUl().textContent = '';
            Object.entries(buses).forEach(([busNumber, time]) => {
                let li = document.createElement('li');
                li.textContent = `Bus ${busNumber} arrives in ${time}`;
                elements.$busesUl().appendChild(li);
            })
        })
        .catch(e => {
            elements.$stopNameDiv().textContent = 'Error';
        })
}