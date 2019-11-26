import {get, post, put, del} from './requester.js';

function createHTMLElement(tag) {
    return document.createElement(tag);
}

const showBooks = {
    $loadBooksButton: () => document.getElementById('loadBooks'),
    $books: () => document.getElementById('books'),
};

async function loadBooks() {
    let books = await get('appdata', 'books');
    showBooks.$books().textContent = '';
    Object.values(books).forEach(b => {
        let {_id, title, author, isbn} = b;

        let tr = createHTMLElement('tr');
        tr.setAttribute('data-id', _id);
        let tdTitle = createHTMLElement('td');
        tdTitle.textContent = title;
        let tdAuthor = createHTMLElement('td');
        tdAuthor.textContent = author;
        let tdISBN = createHTMLElement('td');
        tdISBN.textContent = isbn;
        let editButton = createHTMLElement('button');
        editButton.textContent = 'Edit';
        let deleteButton = createHTMLElement('button');
        deleteButton.textContent = 'Delete';

        tr.append(tdTitle, tdAuthor, tdISBN, editButton, deleteButton);
        showBooks.$books().append(tr);

        editButton.addEventListener('click', function () {
            editForm.$editID().value = _id;
            editForm.$editTitle().value = tdTitle.textContent;
            editForm.$editAuthor().value = tdAuthor.textContent;
            editForm.$editIsbn().value = tdISBN.textContent;
        });

        deleteButton.addEventListener('click', function () {
            del('appdata', `books/${_id}`);
            tr.remove();
        })
    })
}

showBooks.$loadBooksButton().addEventListener('click', loadBooks);

const editForm = {
    $editID: () => document.getElementById('edit-id'),
    $editTitle: () => document.getElementById('edit-title'),
    $editAuthor: () => document.getElementById('edit-author'),
    $editIsbn: () => document.getElementById('edit-isbn'),
    $editBookButton: () => document.getElementById('edit-book'),
};

editForm.$editBookButton().addEventListener('click', async function (e) {
    e.preventDefault();
    let data = {
        "title": editForm.$editTitle().value,
        "author": editForm.$editAuthor().value,
        "isbn": editForm.$editIsbn().value
    };

    console.log(editForm.$editID().value);

    await put('appdata', `books/${editForm.$editID().value}`, data);
    await loadBooks();

    editForm.$editTitle().value = '';
    editForm.$editAuthor().value = '';
    editForm.$editIsbn().value = '';
});

const addForm = {
    $addTitle: () => document.getElementById('add-title'),
    $addAuthor: () => document.getElementById('add-author'),
    $addIsbn: () => document.getElementById('add-isbn'),
    $addBookButton: () => document.getElementById('add-book'),
};

addForm.$addBookButton().addEventListener('click', async function (e) {
    e.preventDefault();
    let data = {
        "title": addForm.$addTitle().value,
        "author": addForm.$addAuthor().value,
        "isbn": addForm.$addIsbn().value
    };

    await post('appdata', 'books', data);
    await loadBooks();

    addForm.$addTitle().value = '';
    addForm.$addAuthor().value = '';
    addForm.$addIsbn().value = '';
});

let asd = {"title": "123", "author": "bb111adadabbb", "isbn": "5151515151"};
//post('appdata', 'books', asd);
