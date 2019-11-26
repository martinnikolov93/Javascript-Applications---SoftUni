(function f() {
    let loadTownsButton = document.getElementById('btnLoadTowns');
    loadTownsButton.addEventListener('click', async function (e) {
        e.preventDefault();
        const towns = document.getElementById('towns').value.split(', ');

        const source = document.getElementById('town-template').innerHTML;
        const template = Handlebars.compile(source);
        const context = { towns }; // !! Context must always be an object
        const townsHTML = template(context);

        let rootDiv = document.getElementById('root');
        rootDiv.innerHTML = townsHTML;
    })
})();