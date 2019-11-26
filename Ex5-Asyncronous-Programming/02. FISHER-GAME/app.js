function attachEvents() {
    let baseURL = 'https://fisher-game.firebaseio.com/catches';

    function get() {
        let url = `${baseURL}.json`;
        return fetch(url).then(r => r.json())
    }

    function post(data) {
        let headers = {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data),
        };
        let url = `${baseURL}.json`;
        return fetch(url, headers);
    }

    function update(id, data) {
        let headers = {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data),
        };
        let url = `${baseURL}/${id}.json`;
        return fetch(url, headers);
    }

    function del(id) {
        let headers = {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
        };
        let url = `${baseURL}/${id}.json`;
        return fetch(url, headers);
    }

    function dropDB() {
        let headers = {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
        };
        let url = `${baseURL}.json`;
        return fetch(url, headers);
    }

    function loadData(data){
        let catchesDiv = document.getElementById('catches');
        catchesDiv.textContent = '';
        Object.entries(data).forEach(fish => {
            let id = fish[0];
            let values = fish[1];
            let {angler, bait, captureTime, location, species, weight} = values;
            console.log(angler, bait, captureTime, location, species, weight);

            let catchDiv = createHTMLElement('div', 'catch');
            catchDiv.setAttribute('data-id', id);
            createTitleInputHrBlock('Angler', 'text', 'angler', angler, catchDiv);
            createTitleInputHrBlock('Weight', 'number', 'weight', weight, catchDiv);
            createTitleInputHrBlock('Species', 'text', 'species', species, catchDiv);
            createTitleInputHrBlock('Location', 'text', 'location', location, catchDiv);
            createTitleInputHrBlock('Bait', 'text', 'bait', bait, catchDiv);
            createTitleInputHrBlock('Capture Time', 'number', 'captureTime', captureTime, catchDiv);
            let updateButton = createHTMLElement('button', 'update', 'Update');
            let deleteButton = createHTMLElement('button', 'update', 'Delete');
            catchDiv.append(updateButton, deleteButton);
            catchesDiv.append(catchDiv);

            updateButton.addEventListener('click', async function () {
                await update(id, {}); //TODO: ne mi stigna vremeto
                let data = await get();
                loadData(data);
            });

            deleteButton.addEventListener('click', async function () {
                await del(id);
                let data = await get();
                loadData(data);
            })
        })
    }

    let loadButton = document.getElementsByClassName('load')[0];
    loadButton.addEventListener('click', async function () {
        let data = await get();
        loadData(data);
    });

    function createHTMLElement(tag, classes, content) {
        let element = document.createElement(tag);
        element.setAttribute('class', classes);
        element.textContent = content;
        return element;
    }

    function createLabel(text) {
        let element = document.createElement('label');
        element.textContent = text;
        return element;
    }

    function createInput(type, classes, value) {
        let element = document.createElement('input');
        element.setAttribute('type', type);
        element.setAttribute('class', classes);
        element.setAttribute('value', value);
        return element;
    }

    function createTitleInputHrBlock(labelText, type, classes, value, elementToAppendTo) {
        let label = createLabel(labelText);
        let input = createInput(type, classes, value);
        let hr = document.createElement('hr');

        elementToAppendTo.append(label, input, hr);
    }

    const addCatchEl = {
        $angler: document.querySelector("#addForm > input.angler"),
        $weight: document.querySelector("#addForm > input.weight"),
        $species: document.querySelector("#addForm > input.species"),
        $location: document.querySelector("#addForm > input.location"),
        $bait: document.querySelector("#addForm > input.bait"),
        $captureTime: document.querySelector("#addForm > input.captureTime"),
        $addButton: document.querySelector("#addForm > button"),
    };

    addCatchEl.$addButton.addEventListener('click', async function () {
        await post({
            angler: addCatchEl.$angler.value,
            weight: addCatchEl.$weight.value,
            species: addCatchEl.$species.value,
            location: addCatchEl.$location.value,
            bait: addCatchEl.$bait.value,
            captureTime: addCatchEl.$captureTime.value
        });

        let data = await get();
        loadData(data);
    })

    /*update('-Lu4c9dnBJI_wlj3sWCK', {
        angler: 'asd',
        weight: 'asd',
        species: 'asd',
        location: 'asd',
        bait: 'asd',
        captureTime: 'asd',
    })*/
}

attachEvents();

