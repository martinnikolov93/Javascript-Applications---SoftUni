(function () {
    renderCatTemplate();

    async function renderCatTemplate() {
        const source = document.getElementById('cat-template').innerHTML;
        const template = Handlebars.compile(source);
        const cats = window.cats;
        const context = {cats};
        const catsHTML = template(context);

        let allCatsDiv = document.getElementById('allCats');
        allCatsDiv.innerHTML = catsHTML;
    }

})();

function showStatusCode(id) {
     let showButton = document.getElementById(`show-${id}`);
     let statusCodeDiv = document.getElementById(`${id}`);

     if (statusCodeDiv.style.display === 'inline') {
          showButton.textContent = 'Show status code';
          statusCodeDiv.style.display = 'none';
     } else {
          showButton.textContent = 'Hide status code';
          statusCodeDiv.style.display = 'inline';
     }
}