const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/**
 * TASK 6: Register a new user
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

/**
 * TASK 1 & TASK 10:
 * Get the list of books available in the shop
 * USING PROMISE / ASYNC-AWAIT
 */
public_users.get("/", async (req, res) => {
  try {
    const getBooks = () =>
      new Promise((resolve) => {
        resolve(books);
      });

    const bookList = await getBooks();
    return res.status(200).json(bookList);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

/**
 * TASK 2 & TASK 11:
 * Get book details based on ISBN
 * USING PROMISE / ASYNC-AWAIT
 */
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const getBookByISBN = (isbn) =>
      new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
      });

    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

/**
 * TASK 3 & TASK 12:
 * Get book details based on Author
 * USING PROMISE / ASYNC-AWAIT
 */
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const getBooksByAuthor = (author) =>
      new Promise((resolve) => {
        const result = Object.values(books).filter(
          (book) => book.author === author
        );
        resolve(result);
      });

    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

/**
 * TASK 4 & TASK 13:
 * Get book details based on Title
 * USING PROMISE / ASYNC-AWAIT
 */
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const getBooksByTitle = (title) =>
      new Promise((resolve) => {
        const result = Object.values(books).filter(
          (book) => book.title === title
        );
        resolve(result);
      });

    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

/**
 * TASK 5:
 * Get book reviews based on ISBN
 */
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;