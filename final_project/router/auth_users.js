// auth_users.js
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

// Validate username
const isValid = (username) => users.some((user) => user.username === username);

// Authenticate user
const authenticatedUser = (username, password) =>
  users.some(
    (user) => user.username === username && user.password === password
  );

// Task 6: Register new user
regd_users.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully." });
});

// Task 7: Login as a registered user
regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
  res.status(200).json({ message: "Login successful", token });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(403).json({ message: "Access token is required." });

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user;
    next();
  });
};

// Task 8: Add/Modify book review
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;

  if (!books[isbn]) return res.status(404).json({ message: "Book not found!" });

  // Add or update the review
  books[isbn].reviews[username] = review;

  res
    .status(200)
    .json({
      message: "Review added/updated successfully.",
      reviews: books[isbn].reviews,
    });
});

// Task 9: Delete book review
regd_users.delete("/auth/review/:isbn", authenticateJWT, async (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]?.reviews?.[username])
    return res.status(404).json({ message: "Review not found!" });
  delete books[isbn].reviews[username];
  res
    .status(200)
    .json({ message: "Review deleted.", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
