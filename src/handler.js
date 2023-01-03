const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, isCompleted
  } = request.payload;

  const id = nanoid(16);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    isCompleted
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    messaage: 'Catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, isCompleted } = request.query;

  let filteredBooks = books;

  if (name) {
    const bookfilter = (book) => book.name.toLowerCase().includes(name.toLowerCase());
    filteredBooks = filteredBooks.filter(bookfilter);
  } else if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  } else if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

const getBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, isCompleted
  } = request.payload;
  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    isCompleted
  };

  response.code(200);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  books.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });

  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookHandler,
  editBookHandler,
  deleteBookHandler,
};
