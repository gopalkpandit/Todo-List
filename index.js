const Database = require('better-sqlite3')
const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const port = 3000
const ip = '127.0.0.1'

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// Checking If Database File Exist (return true or false)
const dbExists = fs.existsSync('todos.db');

// This will create a new Database File , if File doesn't exist
const db = new Database('todos.db');

// This is run only if File doesn't exist 
if (!dbExists) {
  db.exec(`
    CREATE TABLE Tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0
    );
  `);
}
	

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/public/app.html");
  	});


// GET Request for Reading Data
app.get('/todos', (req, res) => {
	// Getting all Rows in Database
	const result = db.prepare("SELECT * FROM Tasks").all();

	// Converting Rows to JSON
	const data = JSON.stringify(result,null,2);

	// Returning JSON Data to Response
	res.send(JSON.parse(data));
});


// POST Request for writing new Data
app.post('/todos',(req, res) => {
	
	// Getting Task as @String from Request Body
	const {task} = req.body

	// Inserting New Task into Database
	const stmt = db.prepare("INSERT INTO Tasks (task, completed) VALUES (?, ?)");
	const info = stmt.run(`${task}`, 0);

	// Returning TaskID in Response
	res.send(`New Record is Created with ID ${info.lastInsertRowid}`)

});

// PATCH Request for Updating Data
app.patch('/todos/:id' , (req , res) => {
  
	// Getting TaskID from Request
	const taskID = Number(req.params.id)

	// Checking If ROW exits in taskID
	const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskID);

	if(row){
		// Running SQL Query with TaskID
  		db.prepare("UPDATE tasks SET completed = ? WHERE id = ?").run(1,taskID);

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

	// Running SQL Query with TaskID
  	db.prepare("DELETE FROM tasks WHERE id = ?").run(taskID);

	// Returning TaskID in Response
  	res.send(`Deleted ID ${taskID}`);

})

app.listen(port,`${ip}`, () => {
	console.log(`Example app listening on port ${port} and ${ip}`)
})