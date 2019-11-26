const username = 'zanntux';
const password = '123456';

const baseURL = `https://baas.kinvey.com`;
const appKey = 'kid_r1Pn8XhsB';
const appSecret = '1863a9ec03cc47a99cf6d4912a7e6ff1';

function makeHeaders(httpMethod, data) {
    let headers = {
        method: httpMethod,
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-type': 'application/json',
        },
    };

    if (httpMethod === 'POST' || httpMethod === 'PUT') {
        headers.body = JSON.stringify(data);
    }

    return headers;
}

function handleError(e) {
    if (!e.ok) {
        throw new Error(e.statusText);
    }

    return e;
}

function serializeData(data) {
    return data.json();
}

function fetchData(kinveyModule, endpoint, headers) {
    const url = `${baseURL}/${kinveyModule}/${appKey}/${endpoint}`;
    return fetch(url, headers)
        .then(handleError)
        .then(serializeData)
}

export function get(kinveyModule, endpoint) {
    const headers = makeHeaders('GET');
    return fetchData(kinveyModule, endpoint, headers);
}

export function post(kinveyModule, endpoint, data) {
    const headers = makeHeaders('POST', data);
    return fetchData(kinveyModule, endpoint, headers);
}

export function put(kinveyModule, endpoint, data) {
    const headers = makeHeaders('PUT', data);
    return fetchData(kinveyModule, endpoint, headers);
}

export function del(kinveyModule, endpoint) {
    const headers = makeHeaders('DELETE');
    return fetchData(kinveyModule, endpoint, headers);
}


