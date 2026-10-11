const fs = require('fs')
const os = require('os')
const path = require('path')
const { createDatabase, createTodoRepository } = require('../../src/server')

// Unit tests for the database setup and the SQL queries in src/server.js.
// Every test gets its own throwaway database in a temp folder, so the real
// backend/db/todos.db is never read or written while testing.
describe('todo database', () => {

  let tmpDir
  let db
  let repo

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-test-'))
    db = createDatabase(path.join(tmpDir, 'todos.db'))
    repo = createTodoRepository(db)
  })

  afterEach(() => {
    db.close()
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('creates the Tasks table with the expected columns', () => {
    const columns = db.prepare('PRAGMA table_info(Tasks)').all().map(c => c.name)
    expect(columns).toEqual(['id', 'task', 'completed'])
  })

  it('can reopen an existing file and keep its rows', () => {
    repo.createTodo('Keep me')
    const file = path.join(tmpDir, 'reopen.db')
    const second = createDatabase(file)
    createTodoRepository(second).createTodo('Already here')
    second.close()

    // Reopening must not throw "table Tasks already exists"
    const reopened = createDatabase(file)
    expect(createTodoRepository(reopened).listTodos().map(t => t.task)).toEqual(['Already here'])
    reopened.close()
  })

  it('defaults completed to 0 and refuses a row with no task text', () => {
    repo.createTodo('Only task')
    expect(repo.getTodoById(1)).toMatchObject({ task: 'Only task', completed: 0 })
    expect(() => db.prepare('INSERT INTO Tasks (task) VALUES (?)').run(null)).toThrow()
  })

  it('gives each task its own id', () => {
    expect(repo.createTodo('First')).toBe(1)
    expect(repo.createTodo('Second')).toBe(2)
  })

  it('stores text exactly, including quotes and SQL keywords', () => {
    const text = `It's a "test"; DROP TABLE Tasks;--`
    expect(repo.getTodoById(repo.createTodo(text)).task).toBe(text)
  })

  it('lists every task, and nothing when empty', () => {
    expect(repo.listTodos()).toEqual([])
    repo.createTodo('One')
    repo.createTodo('Two')
    expect(repo.listTodos().map(t => t.task)).toEqual(['One', 'Two'])
  })

  it('marks a task as completed', () => {
    const id = repo.createTodo('Finish assignment')
    repo.setCompleted(id)
    expect(repo.getTodoById(id)).toMatchObject({ task: 'Finish assignment', completed: 1 })
  })

  it('removes only the given task', () => {
    repo.createTodo('Keep this')
    repo.deleteTodo(repo.createTodo('Remove this'))
    expect(repo.listTodos().map(t => t.task)).toEqual(['Keep this'])
  })

  it('ignores an unknown id without throwing', () => {
    repo.createTodo('Only task')
    expect(() => repo.setCompleted(999)).not.toThrow()
    expect(() => repo.deleteTodo(999)).not.toThrow()
    expect(repo.listTodos()).toHaveLength(1)
  })
})