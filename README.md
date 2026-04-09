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
### Start the Server
```bash
node index.js
```
⚠️ **Warning:** Express 5.0 requires Node.js 18 or higher.

### Web UI
```
http://127.0.0.1:3000/
```

# How Data is Stored.

Currently we store our all tasks in `todos.db`.

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
```
    Integrated database (todos.db) to handle todo data with improved performance, structured storage, and scalability.
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


