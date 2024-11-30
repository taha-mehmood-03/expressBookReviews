// public_users.js
const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");

const public_users = express.Router();

// Task 1: Get the complete list of books
public_users.get('/', async (req, res) => {
  res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found!" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter(book => book.author.toLowerCase() === author);
  res.status(result.length ? 200 : 404).json(result.length ? result : { message: "No books found by this author!" });
});

// Task 4: Get book details based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter(book => book.title.toLowerCase() === title);
  res.status(result.length ? 200 : 404).json(result.length ? result : { message: "No books found with this title!" });
});

// Task 5: Get book reviews by ISBN
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book!" });
  }
});

//task10


// Task 10: Get all books
axios.get('http://localhost:5000/')
  .then(response => {
    console.log(response.data);  // Log the complete list of books
  })
  .catch(error => {
    console.error("Error fetching all books:", error);
  });


  //task 11
  // Task 11: Get book details based on ISBN
const isbn = '8';  // Replace with an actual ISBN
axios.get(`http://localhost:5000/isbn/${isbn}`)
  .then(response => {
    console.log(response.data);  // Log book details by ISBN
  })
  .catch(error => {
    console.error("Error fetching book by ISBN:", error);
  });


  // Task 12: Get book details based on Author
const author = 'SamuelBeckett';  // Replace with an actual author
axios.get(`http://localhost:5000/author/${author}`)
  .then(response => {
    console.log(response.data);  // Log book details by author
  })
  .catch(error => {
    console.error("Error fetching books by author:", error);
  });


  // Task 13: Get book details based on Title
const title = 'Fairy%20tales';  // Replace with an actual title
axios.get(`http://localhost:5000/title/${title}`)
  .then(response => {
    console.log(response.data);  // Log book details by title
  })
  .catch(error => {
    console.error("Error fetching books by title:", error);
  });


module.exports.general = public_users;
