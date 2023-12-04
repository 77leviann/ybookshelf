document.addEventListener('DOMContentLoaded', function () {
    const bookshelf = {
        books: [],
        addBook: function (title, author, year, isComplete) {
            const newBook = {
                id: +new Date(),
                title: title,
                author: author,
                year: year,
                isComplete: isComplete,
            };

            this.books.push(newBook);
            this.renderBooks();
            this.saveToLocalStorage();
        },
        moveBook: function (id, isComplete) {
            const index = this.books.findIndex((book) => book.id === id);
            this.books[index].isComplete = isComplete;
            this.renderBooks();
            this.saveToLocalStorage();
        },
        deleteBook: function (id) {
            const index = this.books.findIndex((book) => book.id === id);
            this.books.splice(index, 1);
            this.renderBooks();
            this.saveToLocalStorage();
        },
        renderBooks: function () {
            const incompleteShelf = document.getElementById('book-incomplete');
            const completeShelf = document.getElementById('book-complete');

            incompleteShelf.innerHTML = '';
            completeShelf.innerHTML = '';

            this.books.forEach((book) => {
                const bookContainer = document.createElement('div');
                bookContainer.classList.add('book-item');

                const title = document.createElement('p');
                title.textContent = book.title;

                const author = document.createElement('p');
                author.textContent = `Penulis: ${book.author}`;

                const year = document.createElement('p');
                year.textContent = `Tahun: ${book.year}`;

                const actionButton = document.createElement('button');
                actionButton.textContent = book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca';
                actionButton.id = book.isComplete ? 'button-incomplete' : 'button-complete';
                actionButton.addEventListener('click', function () {
                    const isComplete = !book.isComplete;
                    bookshelf.moveBook(book.id, isComplete);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Hapus';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', function () {
                    bookshelf.deleteBook(book.id);
                });

                bookContainer.appendChild(title);
                bookContainer.appendChild(author);
                bookContainer.appendChild(year);
                bookContainer.appendChild(actionButton);
                bookContainer.appendChild(deleteButton);

                if (book.isComplete) {
                    completeShelf.appendChild(bookContainer);
                } else {
                    incompleteShelf.appendChild(bookContainer);
                }
            });
        },
        saveToLocalStorage: function () {
            localStorage.setItem('bookshelf', JSON.stringify(this.books));
        },
        loadFromLocalStorage: function () {
            const storedBooks = localStorage.getItem('bookshelf');
            if (storedBooks) {
                this.books = JSON.parse(storedBooks);
                this.renderBooks();
            }
        },
        renderFilteredBooks: function (filteredBooks) {
            const incompleteShelf = document.getElementById('book-incomplete');
            const completeShelf = document.getElementById('book-complete');
            const noResultsPopup = document.getElementById('no-results-popup');

            incompleteShelf.innerHTML = '';
            completeShelf.innerHTML = '';

            if (filteredBooks.length === 0) {
                noResultsPopup.style.display = 'block';
                setTimeout(function () {
                    noResultsPopup.style.display = 'none';
                }, 1000);
            } else {
                noResultsPopup.style.display = 'none';

                filteredBooks.forEach((book) => {
                    const bookContainer = document.createElement('div');
                    bookContainer.classList.add('book-item');

                    const title = document.createElement('p');
                    title.textContent = book.title;

                    const author = document.createElement('p');
                    author.textContent = `Penulis: ${book.author}`;

                    const year = document.createElement('p');
                    year.textContent = `Tahun: ${book.year}`;

                    const actionButton = document.createElement('button');
                    actionButton.textContent = book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca';
                    actionButton.id = book.isComplete ? 'button-incomplete' : 'button-complete';
                    actionButton.addEventListener('click', function () {
                        const isComplete = !book.isComplete;
                        bookshelf.moveBook(book.id, isComplete);
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Hapus';
                    deleteButton.classList.add('delete-button');
                    deleteButton.addEventListener('click', function () {
                        bookshelf.deleteBook(book.id);
                    });

                    bookContainer.appendChild(title);
                    bookContainer.appendChild(author);
                    bookContainer.appendChild(year);
                    bookContainer.appendChild(actionButton);
                    bookContainer.appendChild(deleteButton);

                    if (book.isComplete) {
                        completeShelf.appendChild(bookContainer);
                    } else {
                        incompleteShelf.appendChild(bookContainer);
                    }
                });
            }
        },
    };

    const submitForm = document.querySelector('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('input-book__title').value;
        const author = document.getElementById('input-book__author').value;
        const year = document.getElementById('input-book__year').value;
        const isComplete = document.getElementById('input-checkbox__complete').checked;

        bookshelf.addBook(title, author, year, isComplete);

        // Reset form
        submitForm.reset();
    });

    const searchForm = document.getElementById('search-book');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchInput = document.getElementById('search-book_tittle').value.toLowerCase();
        const filteredBooks = bookshelf.books.filter(book => book.title.toLowerCase().includes(searchInput));

        bookshelf.renderFilteredBooks(filteredBooks);
    });

    // Load books from localStorage when the page loads
    bookshelf.loadFromLocalStorage();
});
