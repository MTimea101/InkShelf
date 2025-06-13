# InkShelf

**InkShelf** is a full-stack online library application where users can browse books, borrow them, write reviews, and manage their personal reading activity. The app includes user authentication, role-based access, and an admin dashboard.

---

## Features

- 🔍 Browse and search books by title or author
- 📥 Borrow and return books
- ✍️ Write reviews with star ratings
- ➕ Add books (for moderators)
- 🧑‍💼 Admin dashboard with statistics and book management
- 📝 User authentication and role system (admin / curator / user)
- 📌 Wishlist and "Want to Read" functionality
- 💬 Message current book holders if a copy is unavailable

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS templating, Tailwind CSS (or Bootstrap if used)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** express-session, bcrypt, and middleware-based access control

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MTimea101/InkShelf.git
   cd InkShelf
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
   PORT=3000
   ```

4. **Start the server:**

   ```bash
   node server.js
   ```

   or with `nodemon`:

   ```bash
   npx nodemon server.js
   ```

5. **Visit in browser:**

   ```
   http://localhost:3000
   ```

---

## Project Structure

```
InkShelf/
│
├── models/           # Mongoose models (User, Book, Borrow, Review, Message)
├── routes/           # Express routes (books, users, borrows, reviews)
├── controllers/      # Logic separated from route definitions
├── views/            # EJS templates for rendering UI
├── public/           # Static assets (CSS, JS, images)
├── .env              # Environment variables (not committed)
├── .gitignore        # Ignored files (node_modules, .env, etc.)
└── server.js         # Main entry point
```

---

## User Roles

| Role        | Permissions                                           |
| ----------- | ----------------------------------------------------- |
| **User**    | Borrow books, write reviews, add to wishlist          |
| **Curator** | Add new books to the library                          |
| **Admin**   | Manage users, assign roles, view site-wide statistics |

---

## 📊 Admin Dashboard Features

- Total number of users, books, borrows, reviews, and messages
- Top 5 most borrowed books
- List of books never borrowed
- Most frequently wishlisted books

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## Author

**Timea Majercsik**  
GitHub: [@MTimea101](https://github.com/MTimea101)
