document.addEventListener('DOMContentLoaded', function () {
    const bookshelf = {
        books: [],

        addBook: function (title, author, year, isComplete) {
            const existingBook = this.books.find(book => book.title.toLowerCase() === title.toLowerCase());
        
            if (existingBook) {
                this.showPopup('Buku dengan judul yang sama sudah ada!');
                return;
            }
        
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

            this.showPopup('Buku berhasil ditambahkan!');
        },
        
        editBook: function (id) {
            const bookToEdit = this.books.find((book) => book.id === id);
          
            if (bookToEdit) {
                const editFormContainer = document.getElementById(`edit-form-${id}`);
        
                editFormContainer.innerHTML = '';
        
                const editForm = document.createElement('form');
                editForm.classList.add('edit-form');
        
                const editTitleInput = this.createInput('text', 'Enter new title:', bookToEdit.title, true);
                const editAuthorInput = this.createInput('text', 'Enter new author:', bookToEdit.author, true);
                const editYearInput = this.createInput('date', 'Enter new year:', bookToEdit.year);
        
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('edit-container');
        
                const saveEditButton = this.createButton('button', 'Save', function () {
                    bookshelf.saveEdit(id, editTitleInput.value, editAuthorInput.value, editYearInput.value);
                }, 'save-button');
        
                const cancelEditButton = this.createButton('button', 'Cancel', function () {
                    bookshelf.cancelEdit(id);
                }, 'cancel-button');
        
                buttonContainer.appendChild(saveEditButton);
                buttonContainer.appendChild(cancelEditButton);
        
                editForm.appendChild(editTitleInput);
                editForm.appendChild(editAuthorInput);
                editForm.appendChild(editYearInput);
                editForm.appendChild(buttonContainer);
                editFormContainer.appendChild(editForm);
            }
        },
        
    
        saveEdit: function (id, newTitle, newAuthor, newYear) {
            const editedBook = this.books.find((book) => book.id === id);
        
            if (editedBook) {
                editedBook.title = newTitle;
                editedBook.author = newAuthor;
                editedBook.year = newYear;
        
                this.renderBooks();
                this.saveToLocalStorage();
                this.showPopup('Buku berhasil diperbarui!');
            }
        
            this.cancelEdit(id);
        },

        cancelEdit: function (id) {
            const editFormContainer = document.getElementById(`edit-form-${id}`);
        
            if (editFormContainer) {
                editFormContainer.innerHTML = '';
            }
        },

        moveBook: function (id, isComplete) {
            const index = this.books.findIndex((book) => book.id === id);
            this.books[index].isComplete = isComplete;
            this.renderBooks();
            this.saveToLocalStorage();

            const action = isComplete ? 'Buku selesai dibaca!' : 'Buku belum selesai dibaca!';
            this.showPopup(action);
        },

        deleteBook: function (id) {
            const index = this.books.findIndex((book) => book.id === id);
            this.books.splice(index, 1);
            this.renderBooks();
            this.saveToLocalStorage();
            this.showPopup('Buku dihapus!');
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

                const isCompleteCheckbox = document.createElement('input');
                isCompleteCheckbox.type = 'checkbox';
                isCompleteCheckbox.checked = book.isComplete;
                isCompleteCheckbox.classList.add('complete-checkbox');
                isCompleteCheckbox.addEventListener('change', function () {
                    const isComplete = isCompleteCheckbox.checked;
                    bookshelf.moveBook(book.id, isComplete);
                });

                const editButton = this.createButton('button', 'Edit', function () {
                    bookshelf.editBook(book.id);
                });

                const deleteButton = this.createButton('button', 'Hapus', function () {
                    bookshelf.deleteBook(book.id);
                });

                const editFormContainer = document.createElement('div');
                editFormContainer.id = `edit-form-${book.id}`;

                bookContainer.appendChild(title);
                bookContainer.appendChild(author);
                bookContainer.appendChild(year);
                bookContainer.appendChild(isCompleteCheckbox);
                bookContainer.appendChild(editButton);
                bookContainer.appendChild(deleteButton);
                bookContainer.appendChild(editFormContainer);

                if (book.isComplete) {
                    completeShelf.appendChild(bookContainer);
                } else {
                    incompleteShelf.appendChild(bookContainer);
                }
            });
        },

        createInput: function (type, placeholder, value, required = false) {
            const input = document.createElement('input');
            input.type = type;
            input.placeholder = placeholder;
            input.value = value;
            input.required = required;
            return input;
        },

        createButton: function (type, text, clickHandler, className) {
            const button = document.createElement('button');
            button.type = type;
            button.textContent = text;
            button.addEventListener('click', clickHandler);

            if (className) {
                button.classList.add(className);
            }

            return button;
        },

        
        showPopup: function (message) {
            const popup = document.getElementById('popup');
            popup.textContent = message;
            popup.style.display = 'block';
            setTimeout(function () {
                popup.style.display = 'none';
            }, 1000);
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
            
            incompleteShelf.innerHTML = '';
            completeShelf.innerHTML = '';
        
            if (filteredBooks.length === 0) {
                this.showPopup('Tidak ada hasil yang ditemukan!');
            } else {
                filteredBooks.forEach((book) => {
                    const bookContainer = document.createElement('div');
                    bookContainer.classList.add('book-item');
        
                    const title = document.createElement('p');
                    title.textContent = book.title;
        
                    const author = document.createElement('p');
                    author.textContent = `Penulis: ${book.author}`;
        
                    const year = document.createElement('p');
                    year.textContent = `Tahun: ${book.year}`;
        
                    const actionButton = this.createButton('button', book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca', function () {
                        const isComplete = !book.isComplete;
                        bookshelf.moveBook(book.id, isComplete);
                    });
        
                    const deleteButton = this.createButton('button', 'Hapus', function () {
                        bookshelf.deleteBook(book.id);
                    });
        
                    const editFormContainer = document.createElement('div');
                    editFormContainer.id = `edit-form-${book.id}`;
        
                    bookContainer.appendChild(title);
                    bookContainer.appendChild(author);
                    bookContainer.appendChild(year);
                    bookContainer.appendChild(actionButton);
                    bookContainer.appendChild(deleteButton);
                    bookContainer.appendChild(editFormContainer);
        
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

        submitForm.reset();
    }.bind(bookshelf));

    const searchForm = document.getElementById('search-book');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchInput = document.getElementById('search-book_tittle').value.toLowerCase();
        const filteredBooks = bookshelf.books.filter(book => book.title.toLowerCase().includes(searchInput));

        bookshelf.renderFilteredBooks(filteredBooks);
    }.bind(bookshelf))

    bookshelf.loadFromLocalStorage();
});
