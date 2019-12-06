
const appKey = 'kid_r1Pn8XhsB';
const appSecret = '1863a9ec03cc47a99cf6d4912a7e6ff1';
const baseUrl = 'https://baas.kinvey.com';

function createAuthorization(type) {
    return type === 'Basic'
        ? `Basic ${btoa(`${appKey}:${appSecret}`)}`
        : `Kinvey ${sessionStorage.getItem('authtoken')}`
}

function createHeader(type, httpMethod, data) {

    const headers = {
        method: httpMethod,
        headers: {
            'Authorization': createAuthorization(type),
            'Content-Type': 'application/json'
        }
    };

    if (httpMethod === 'POST' || httpMethod === 'PUT') {
        headers.body = JSON.stringify(data)
    }
    return headers;
}

function serializeData(x) {
    /*if (x.status !== 204){
        return x;
    }*/
    console.log('data serialized')
    return x.json();
}

function handleError(e) {
    if (!e.ok) {
        console.log(e);
        throw new Error(e.statusText);
    }
    return e;
}

function fetchData(kinveyModule, endpoint, headers) {
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`;

    return fetch(url, headers)
        .then(handleError)
        .then(serializeData)
}

export function get(kinveyModule, endpoint, type) {
    const headers = createHeader(type,'GET');
    return fetchData(kinveyModule, endpoint, headers)
}

export function post(kinveyModule, endpoint, data, type) {
    const headers = createHeader(type, 'POST', data);
    return fetchData(kinveyModule, endpoint, headers)
}

export function put(kinveyModule, endpoint, data, type) {
    const headers = createHeader(type, 'PUT', data);
    return fetchData(kinveyModule, endpoint, headers)
}

export function del(kinveyModule, endpoint, type) {
    const headers = createHeader(type, 'DELETE');
    return fetchData(kinveyModule, endpoint, headers)
}