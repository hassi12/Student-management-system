import React, { useState } from "react";

function Books() {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);

  const books = [
   {
  id: 1,
  title: "C++",
  author: "Your Book Author",
  category: "Programming",
  pdf: "/Books/c++.pdf",
},
    {
      id: 2,
      title: "Database Management Systems",
      author: "Raghu Ramakrishnan",
      category: "Database",
    },
    {
      id: 3,
      title: "Python Programming",
      author: "Mark Lutz",
      category: "Programming",
    },
    {
      id: 4,
      title: "Data Structures and Algorithms",
      author: "Thomas Cormen",
      category: "Algorithms",
    },
  ];

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="books-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Books</h1>
          <p>Explore books available in the library</p>
        </div>

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* BOOKS */}
      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div className="book-card" key={book.id}>

            <div className="book-icon">
              📚
            </div>

            <h3>{book.title}</h3>

            <p className="author">
              By {book.author}
            </p>

            <span className="category">
              {book.category}
            </span>

            <button onClick={() => setSelectedBook(book)}>
              View Book
            </button>

          </div>
        ))}
      </div>

      {/* BOOK DETAILS */}
      {selectedBook && (
        <div className="book-details">

          <div className="book-details-card">

            <button
              className="close-button"
              onClick={() => setSelectedBook(null)}
            >
              ✕
            </button>

            <div className="book-icon">
              📚
            </div>

            <h2>
              {selectedBook.title}
            </h2>

            <p>
              <strong>Author:</strong>{" "}
              {selectedBook.author}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {selectedBook.category}
            </p>

            <button
              className="read-button"
              onClick={() => {
                setReadingBook(selectedBook);
                setSelectedBook(null);
              }}
            >
              Read Book
            </button>

          </div>
        </div>
      )}

      {/* READING VIEW */}
      {readingBook && (
        <div className="book-details">

          <div className="book-details-card">

            <button
              className="close-button"
              onClick={() => setReadingBook(null)}
            >
              ✕
            </button>

            <div className="book-icon">
              📖
            </div>

            <h2>
              {readingBook.title}
            </h2>

            <p>
              <strong>Author:</strong>{" "}
              {readingBook.author}
            </p>

            <hr />

           <h3>Reading Book</h3>

<iframe
  src={readingBook.pdf}
  title={readingBook.title}
  width="100%"
  height="500px"
  style={{
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginTop: "15px",
  }}
/>

            <p>
              Welcome to the reading section of{" "}
              <strong>{readingBook.title}</strong>.
            </p>

            <p>
              This is where the actual book content
              or PDF reader will be displayed later.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

export default Books;