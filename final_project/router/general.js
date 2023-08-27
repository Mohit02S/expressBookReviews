const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
       } else {
           return res.status(404).json({message: "User already exists!"});
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
function getBooks() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if(books) {
                resolve(books);
            } else {
                reject("Books Not Found!");
            }
        },3000);
    });
}
public_users.get('/',function (req, res) {
    getBooks()
    .then(books => {
        res.send(JSON.stringify(books,null,4));
    })
});

// Get book details based on ISBN
function getBooksIsbn(isbn) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if(books[isbn]){
                resolve(books[isbn]);
            } else {
                reject("Books Not Found!");
            }
        },3000);
    })
}
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    getBooksIsbn(isbn)
    .then(book => {
        res.send(JSON.stringify(book,null,4));
    })
 });
  
// Get book details based on author
function getBooksAuthor(author){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            const booksByAuthor = Object.values(books).filter(book => book.author === author);
            if(booksByAuthor.length === 0) {
                reject("Books Not Found!");
            } else {
                resolve(booksByAuthor);
            }
        },3000);
    })
}
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    getBooksAuthor(author)
    .then(booksByAuthor => {
        res.status(200).json({books: booksByAuthor});
    })
});

// Get all books based on title
function getBooksTitle(title){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            const booksWithTitle = Object.values(books).filter(book => book.title === title);
            if(booksWithTitle === 0) {
                reject("Books Not Found!");
            } else {
                resolve(booksWithTitle);
            }
        },3000);
    })
}
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    getBooksTitle(title)
    .then(booksWithTitle => {
        res.status(200).json({books: booksWithTitle});
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    const reviews = books[isbn].reviews || {};
    return res.status(200).json({ reviews });
});

module.exports.general = public_users;
