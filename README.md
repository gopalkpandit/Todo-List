# Todo List 

This is a basic Todo List application built with Express.js. 
It provides simple REST APIs to get, add, update, and delete tasks. 
The project demonstrates how a backend CRUD API works using Node.js and Express, and it is implemented using CommonJS modules



# How to use 

### Git Clone this Repo
```bash
git clone https://github.com/gopalkpandit/Todo-List.git
```

### Go inside Todo List Directory
```bash
cd Todo-List 
```

### Go inside Backend Directory
```bash
cd backend
```
### Installation
To install all the required Node.js packages.
```bash
npm install
```

### Start the Server
```bash
npm start
```
Use `npm run dev` instead if you want the server to restart automatically on file changes.

⚠️ **Warning:** Express 5.0 requires Node.js 18 or higher.

### Project Structure

```
Todo-List/
├── backend/
│   ├── db/
│   │   └── todos.db        # SQLite database file
│   ├── src/
│   │   └── server.js       # Database setup, SQL queries, API routes, startup
│   ├── tests/
│   │   ├── unit/
│   │   │   └── todos.test.js       # Database and SQL query tests
│   │   └── integration/
│   │       └── todos.test.js       # API tests via Supertest
│   └── package.json
└── frontend/
    ├── app.css             # Styles
    ├── app.html            # Web UI markup
    └── app.js              # Fetches data from the API
```

The backend serves the `frontend/` folder as static files, so there is no separate
front-end build step and no second server to start. Just open the URL below.

### Web UI
```
http://127.0.0.1:3000/
```

# How Data is Stored.

Currently we store our all tasks in `backend/db/todos.db`.
The database file and its table are created automatically on first run, so you do
not need to set it up manually.

# Tests

The project uses Jest, with Supertest for the API integration tests.

```bash
cd backend
npm test                  # Run everything (16 tests)
npm run test:unit         # Database and SQL query tests (9)
npm run test:integration  # API tests (7)
```

**Unit tests** (`tests/unit/todos.test.js`) call the repository functions
directly, without HTTP. They cover the database setup and every SQL query.

**Integration tests** (`tests/integration/todos.test.js`) send real HTTP requests
to the Express app with Supertest and check the responses end to end, covering
the page at `/` plus all four endpoints.

Each test builds its own throwaway database in a temp folder, so running the
tests never touches `backend/db/todos.db`.

SQL Table Structure

```sql
CREATE TABLE Tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0
    );
```

# APIs

# 1. Show all Task

It Lists all the Task Available.

#### Example: 
```bash
curl -X GET http://127.0.0.1:3000/todos
```

#### Response:
```json
[
  {
    "id": 1,
    "task": "Clean my House",
    "completed": 0
  },
  {
    "id": 2,
    "task": "Complete my DSA Assignment",
    "completed": 1
  }
]
```

# 2. Add Task

We can add new Task. Make sure Task ID should be unique.
#### Example: 
```bash
curl -X POST http://127.0.0.1:3000/todos \
-H 'Content-Type: application/json' \
-d '{"task":"Complete my DBMS Homework"}'
```

#### Response:
```txt
New Record is Created with ID 3
```

# 3. Update Task
Currently It only update completed as : `true or false`
#### Example: 
```bash
curl -X PATCH http://127.0.0.1:3000/todos/3 \
-H 'Content-Type: application/json' \
-d '{}'
```

#### Response:
```txt
ID 3 is set to true
```

# 4. Delete Task
To Delete Task we need to pass Task ID in URL.
#### Example: 
```bash
curl -X DELETE http://127.0.0.1:3000/todos/3
```

#### Response:
```txt
Deleted ID 3
```


# Tech Stack

**Client:** HTML, CSS and JS

**Server:** Node, Express

## Authors

- [@Gopal](https://github.com/gopalkpandit)
- [@Manish](https://github.com/murmumanish)


