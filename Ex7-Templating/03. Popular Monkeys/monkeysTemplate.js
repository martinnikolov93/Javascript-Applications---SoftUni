import { monkeys } from './monkeys.js';

let source = document.getElementById('monkey-template').innerHTML;

function init() {
    const template = Handlebars.compile(source);
    const monkeysHtml = template( {monkeys} );
    let monkeysDiv = document.getElementsByClassName('monkeys')[0];
    monkeysDiv.innerHTML = monkeysHtml;
}

init();