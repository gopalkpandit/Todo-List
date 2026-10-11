const Database = require('better-sqlite3')
const express = require('express')
const fs = require('fs')
const path = require('path')

const port = process.env.PORT || 3000
const ip = '127.0.0.1'

// Paths are resolved from this file's location, so the server runs correctly
// no matter which folder you start it from.
const backendDir = path.resolve(__dirname, '..')
const frontendDir = path.resolve(backendDir, '..', 'frontend')
const dbFile = path.join(backendDir, 'db', 'todos.db')


// Opening the database file and making sure the Tasks table exists.
// The db folder is created when missing, so a fresh clone just works.
function createDatabase(dbFile) {

  // Make sure the db folder exists before opening the database file
  fs.mkdirSync(path.dirname(dbFile), { recursive: true })

  // This will create a new Database File , if File doesn't exist
  const db = new Database(dbFile)

  // Creates the table only if it is missing. Safe to run on every start.
  db.exec(`
    CREATE TABLE IF NOT EXISTS Tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0
    );
  `)

  return db
}


// Every SQL query lives here so the routes stay thin, and so these can be
// tested on their own without going through HTTP.
function createTodoRepository(db) {

  // Getting all Rows in Database
  function listTodos() {
    return db.prepare("SELECT * FROM Tasks").all()
  }

  // Getting single Row by TaskID
  function getTodoById(taskID) {
    return db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskID)
  }

  // Inserting New Task into Database
  function createTodo(task) {
    const stmt = db.prepare("INSERT INTO Tasks (task, completed) VALUES (?, ?)")
    const info = stmt.run(`${task}`, 0)
    return info.lastInsertRowid
  }

  // Marking a Task as completed
  function setCompleted(taskID) {
    db.prepare("UPDATE tasks SET completed = ? WHERE id = ?").run(1, taskID)
  }

  // Deleting a Task by TaskID
  function deleteTodo(taskID) {
    db.prepare("DELETE FROM tasks WHERE id = ?").run(taskID)
  }

  return { listTodos, getTodoById, createTodo, setCompleted, deleteTodo }

}


// Builds the express app. No port is opened here, so tests can load the app
// without starting a real server.
function createApp(todoRepository) {

  const app = express()

  // Serving the frontend folder as static files (app.html, app.css, app.js)
  app.use(express.static(frontendDir))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDir, "app.html"));
  });


  // GET Request for Reading Data
  app.get('/todos', (req, res) => {
    res.send(todoRepository.listTodos());
  });


  // POST Request for writing new Data
  app.post('/todos',(req, res) => {

    // Getting Task as @String from Request Body
    const {task} = req.body

    // Inserting New Task into Database
    const newId = todoRepository.createTodo(task)

    // Returning TaskID in Response
    res.send(`New Record is Created with ID ${newId}`)

  });

  // PATCH Request for Updating Data
  app.patch('/todos/:id' , (req , res) => {

    // Getting TaskID from Request
    const taskID = Number(req.params.id)

    // Checking If ROW exits in taskID
    const row = todoRepository.getTodoById(taskID);

    if(row){
      // Running SQL Query with TaskID
      todoRepository.setCompleted(taskID);

      // Returning TaskID in Response
      res.send(`ID ${taskID} is set to true`);
    } else {
      // Returning TaskID in Response
      res.send(`ID ${taskID} is not Available`);
    }

  })


  // DELETE Request for Deleting Data
  app.delete('/todos/:id' , (req,res) => {

    // Getting TaskID from Request
    const taskID = Number(req.params.id)

    // Deleting the Row by TaskID
    todoRepository.deleteTodo(taskID);

    // Returning TaskID in Response
    res.send(`Deleted ID ${taskID}`);

  })

  return app

}

module.exports = { createDatabase, createTodoRepository, createApp }


// The server only starts when this file is run directly (node src/server.js).
// When the tests import it, the block below is skipped so no port is opened.
// istanbul ignore next: this bootstrap block opens a real port, so it cannot
// run inside a test without blocking the test process.
if (require.main === module) {

  const db = createDatabase(dbFile)
  const todoRepository = createTodoRepository(db)
  const app = createApp(todoRepository)

  app.listen(port,`${ip}`, () => {
    console.log(`Example app listening on port ${port} and ${ip}`)
  })

}