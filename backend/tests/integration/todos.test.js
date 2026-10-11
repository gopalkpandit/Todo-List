const fs = require('fs')
const os = require('os')
const path = require('path')
const request = require('supertest')
const { createDatabase, createTodoRepository, createApp } = require('../../src/server')

// Integration tests: real HTTP requests against the Express app.
// Each test builds its own throwaway database in a temp folder, so the real
// backend/db/todos.db is never read or written while testing.
describe('Todo API', () => {

  let tmpDir
  let db
  let app

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-api-test-'))
    db = createDatabase(path.join(tmpDir, 'todos.db'))
    app = createApp(createTodoRepository(db))
  })

  afterEach(() => {
    db.close()
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('serves the frontend page at /', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.text).toContain('My Todo List')
  })

  it('GET /todos returns an empty array when there are no tasks', async () => {
    const res = await request(app).get('/todos')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST /todos creates a task and stores it as not completed', async () => {
    const add = await request(app).post('/todos').send({ task: 'Clean my House' })
    expect(add.status).toBe(200)
    expect(add.text).toBe('New Record is Created with ID 1')

    const list = await request(app).get('/todos')
    expect(list.body).toEqual([{ id: 1, task: 'Clean my House', completed: 0 }])
  })

  it('POST /todos gives a new id to each task', async () => {
    await request(app).post('/todos').send({ task: 'First' })
    const second = await request(app).post('/todos').send({ task: 'Second' })
    expect(second.text).toContain('ID 2')
  })

  it('PATCH /todos/:id marks a task completed and saves it', async () => {
    await request(app).post('/todos').send({ task: 'Toggle me' })

    const res = await request(app).patch('/todos/1').send({})
    expect(res.status).toBe(200)
    expect(res.text).toBe('ID 1 is set to true')
    expect((await request(app).get('/todos')).body[0].completed).toBe(1)
  })

  it('PATCH /todos/:id reports an unknown id as not available', async () => {
    const res = await request(app).patch('/todos/999').send({})
    expect(res.status).toBe(200)
    expect(res.text).toBe('ID 999 is not Available')
  })

  it('DELETE /todos/:id removes the task and leaves the others', async () => {
    await request(app).post('/todos').send({ task: 'Keep this' })
    await request(app).post('/todos').send({ task: 'Delete this' })

    const res = await request(app).delete('/todos/2')
    expect(res.status).toBe(200)
    expect(res.text).toBe('Deleted ID 2')
    expect((await request(app).get('/todos')).body.map(t => t.task)).toEqual(['Keep this'])
  })
})