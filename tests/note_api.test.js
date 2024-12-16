//const { test, after, before, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const config = require('../utilis/config')
const Note = require('../models/note')
const helper = require('./helper_test')
const Blog = require('../models/blog')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { Console } = require('node:console')

const api = supertest(app)
//Connect to MongoDB before running tests

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(config.MONGODB_URI);
  }
  await Blog.deleteMany({});
  await Note.deleteMany({});
  await User.deleteMany({});
});

beforeEach(() => {
  console.log('Running a test...');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User testing', () => {
  let token;
  let noteID;
  let blogID;

  test('Adding a valid user', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'goty',
      name: 'Yogendra Gothwal',
      password: '1234',
    };
    const response = await api
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('Logging in with valid credentials', async () => {
    const response = await api
      .post('/login')
      .send({ username: 'goty', password: '1234' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = response.body.token;
    expect(token).toBeDefined();
    expect(response.body.username).toBe('goty');
  });

  test('Adding a user with username < 3 characters fails', async () => {
    const newUser = {
      username: 'yo',
      name: 'Yogendra Gothwal',
      password: '123',
    };
    const response = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe(
      'Username and password must be at least 3 characters long.'
    );
  });

  test('Adding a duplicate user fails', async () => {
    const newUser = {
      username: 'goty', // Duplicate username
      name: 'Yogendra Gothwal',
      password: '1234',
    };
    const response = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('expected `username` to be unique');
  });

  test('Adding a note to a user', async () => {
    const newNote = {
      content: 'Test content 1',
      important: false,
    };
    const response = await api
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.content).toBe(newNote.content);
    expect(response.body.important).toBe(newNote.important);

    noteID = response.body._id; // Save note ID for deletion test
  });

  test('Deleting a note from a user', async () => {
    await api
      .delete(`/notes/${noteID}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  test('Adding a blog to a user', async () => {
    const newBlog = {
      title: 'Learn how to read books',
      author: 'Yogendra',
      url: '',
      likes: "600",
    };
    const response = await api
      .post('/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.title).toBe(newBlog.title);
    expect(response.body.likes).toBe(newBlog.likes);
    blogID = response.body._id; // Save blog ID for deletion test
  });

  
  test('Modifying a blog', async()=>{
    const newBlog = {
      title: 'Learn how to read books',
      author: 'Yogendra',
      url: '',
      likes: "700",
    };
    const response = await api
      .put(`/blogs/${blogID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.likes).toBe(newBlog.likes);
  })
  test('Deleting a blog from a user', async () => {
    await api
      .delete(`/blogs/${blogID}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});


// before(async () => {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(config.MONGODB_URI)
    
//   }
//   await Blog.deleteMany({})
//   await Note.deleteMany({})
//   await User.deleteMany({})
// })
// beforeEach(async ()=>{
//   console.log("___________")
// })
// describe('User testing', async ()=>{
//   // const x = await User.find({})
//   // console.log("users before  x:", x)
//   let token;
//   let noteID;
//   let blogID;
//   test('Adding a valid user',async()=>{
//     const usersAtStart = await helper.usersInDb()
//     const newUser = {
//       username: "goty",
//       name: "Yogendra Gothwal",
//       password: "1234"
//     }
//     const response = await api
//       .post('/users')
//       .send(newUser)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)
//     const usersAtEnd = await helper.usersInDb()
//     assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
//     const usernames = usersAtEnd.map(u=> u.username)
//     assert(usernames.includes(newUser.username))
//     const x = await User.find({})
//     console.log("users now :", x)
//   })
//   test('logging in rohit 1234', async () => {
//     const response = await api
//       .post('/login')
//       .send({ username: "goty", password: "1234" })
//       .expect(200)
//       .expect('Content-Type', /application\/json/);

//       token =  response.body.token
//     console.log("Generated Token is: ", response.body.token)
//     assert(response.body.token !== undefined, 'Token should be defined');
//     assert.strictEqual(response.body.username, 'goty', 'Username should match');
//     const x = await User.find({})
//     console.log("users now :", x)
//   });
  
//   test('Can add a user < 3 letters',async()=>{
//     const usersAtStart = await helper.usersInDb()
//     const newUser = {
//       username: "yo",
//       name: "Yogendra Gothwal",
//       password: "123"
//     }
//     const response = await api
//       .post('/users')
//       .send(newUser)
//       .expect(400)
//       .expect('Content-Type', /application\/json/)
//     assert.strictEqual(response.body.error,'Username and password must be at least 3 characters long.' ) 
//   })
//   test('cant add the same user',async()=>{
//     const usersAtStart = await helper.usersInDb()
//     const newUser = {
//       username: "goty", //duplicate
//       name: "Yogendra Gothwal",
//       password: "1234"
//     }
//     const result = await api
//       .post('/users')
//       .send(newUser)
//       .expect(400)
//       .expect('Content-Type', /application\/json/)
//     assert.strictEqual(
//     result.body.error,
//       'expected `username` to be unique'
//     );  
//     const usersAtEnd = await helper.usersInDb()
//     assert(result.body.error.includes('expected `username` to be unique'))
//     assert.strictEqual(usersAtEnd.length, usersAtStart.length )
//   })

//   test('adding note1 in user', async () => {
//     const newNote = {
//       content: "Test content 1",
//       important: false,
//     };
//     const y = await User.find({})
//     console.log("users now before adding note1:", y)
//     const response = await api
//       .post('/notes')
//       .set('Authorization', `Bearer ${token}`)  
//       .send(newNote)
//       .expect('Content-Type', /application\/json/);  // Expecting JSON response
//     // Optionally, check the response body if needed
//     assert.strictEqual(response.body.content,newNote.content);
//     assert.strictEqual(response.body.important,newNote.important);
    
//     noteID = response.body._id //used in delet test
//     console.log("note1 id: ", noteID)
//     const x = await User.find({})
//     console.log("users now after adding note 1 :", x)
//   });
//   test('adding note2 in user', async () => {
//     const newNote = {
//       content: "Test content 2",
//       important: true,
//     };
//     const y = await User.find({})
//     console.log("users now :", y)
//     const response = await api
//       .post('/notes')
//       .set('Authorization', `Bearer ${token}`)  
//       .send(newNote)
//       .expect('Content-Type', /application\/json/);  // Expecting JSON response
//     // Optionally, check the response body if needed
//     assert.strictEqual(response.body.content,newNote.content);
//     assert.strictEqual(response.body.important,newNote.important);
//     const x = await User.find({})
//     console.log("users now :", x)
//   });

//   test('deleting note in user', async () => {
//     console.log(noteID)
//     const response = await api
//       .delete(`/notes/${noteID}`)
//       .set('Authorization', `Bearer ${token}`)
//       .expect(204)
    
//     const x = await User.find({})
//     console.log("users now after deleting note1:", x)
//   });

//   test('adding blog in user', async () => {
//     const newBlog = {
//       title: "Learn how to read book",
//       author: "Yogendra",
//       url: "",
//       likes:"600"
//     };
//     const response = await api
//       .post('/blogs')
//       .set('Authorization', `Bearer ${token}`)  
//       .send(newBlog)
//       .expect('Content-Type', /application\/json/);  // Expecting JSON response
//     // Optionally, check the response body if needed
//     blogID = response.body._id
//     assert.strictEqual(response.body.title,newBlog.title);
//     assert.strictEqual(response.body.likes,newBlog.likes);
//     const x = await User.find({})
//     console.log("users now :", x)
//   });
//   test('deleting blog in user', async () => {
//     console.log(blogID)
//     const response = await api
//       .delete(`/blogs/${blogID}`)
//       .set('Authorization', `Bearer ${token}`)
//       .expect(204)
    
//     const x = await User.find({})
//     console.log("users now after deleting blog:", x)
//   });
// })




// Clear and seed the database before each test
// beforeEach(async () => {
//   await Note.deleteMany({})
//   const notesArray = helper.initialNotes.map(note=> new Note(note))
//   const promiseArrayNotes = notesArray.map(note=> note.save())
  
//   await Blog.deleteMany({})
//   const blogsArray = helper.initialBlogs.map(blog=> new Blog(blog))
//   const promiseArrayBlogs = blogsArray.map(blog=> blog.save())
//   const results = await Promise.all(promiseArrayBlogs)
  
// })

//tests for blogs
// test('GET req on /blogs',async ()=>{
//   await api
//     .get('/blogs')
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
// })
// test('number of blogs', async()=>{
  
//   const data = await api.get('/blogs')
//   assert.strictEqual(data.body.length, helper.initialBlogs.length )
  
// })
// test('corrct id', async()=>{
//   const data = await api.get('/blogs')
//   const temp = data.body[0]
//   assert.strictEqual(temp.id, undefined)
//   assert.strictEqual(temp._id != undefined, true)
// })
// describe('Blog posting', ()=>{
//   test('POST req on /blogs', async()=>{
//     const newData = {
//       title: "Learn Civil Engineering",
//       author: "Ayoraman",
//       url: 'https://www.civileng.com/usr=1',
//     }
//     await api
//       .post('/blogs')
//       .send(newData)
//       .expect(200)
//     const response = await api.get('/blogs')
//     assert.strictEqual(helper.initialBlogs.length + 1, response.body.length)
//   })
//   test('cant post without title', async()=>{
//     const newData = {
//       author: "Ayoraman",
//       url: 'https://www.civileng.com/usr=1',
//     }
//     await api
//       .post('/blogs')
//       .send(newData)
//       .expect(400)
//     const response = await api.get('/blogs')
//     assert.strictEqual(helper.initialBlogs.length , response.body.length)
//   })
// })
// describe('deletion of blog', ()=>{
//   test('a single blog can be deleted', async ()=>{
//     const data = await helper.blogsInDb()
//     const id = data[0]._id
//     console.log(id)
//     await api
//       .delete(`/blogs/${id}`)
//       .expect(204)
//   })
// })
// describe('updation of blog', ()=>{
//   test('a single blog can be updated', async ()=>{
//     const data = await helper.blogsInDb()
//     const blog = data[0]
//     const id = blog._id
//     const newBlog = {
//       title: 'Indian People and land',
//       author: 'mukharje',
//       url: 'indiandiplomat.com',
//       likes: '23'
//     }
//     await api
//       .put(`/blogs/${id}`)
//       .send(newBlog).expect(200)

//     const updatedBlog = await api.get(`/blogs/${id}`);
//     (updatedBlog.body.title, newBlog.title)
//   })
// })

//for notes
// console.log(helper.initialNotes)
// // Test: notes are returned as JSON
// test('notes are returned as json', async () => {
//   await api.get('/notes').expect(200).expect('Content-Type', /application\/json/)
// })

// // Test: there are two notes
// test('there are two notes', async () => {
//   const response = await api.get('/notes')
//   assert.strictEqual(response.body.length, helper.initialNotes.length )
// })

// // Test: the first note content is correct
// test('the first note is about HTML', async () => {
//   const response = await api.get('/notes')
//   const contents = response.body.map(e => e.content)
//   assert(contents.includes('HTML is easy'))
// })
// test('printing data', async () => {
//   const response = await api.get('/notes')
//   const contents = response.body.map(e => e.content)
//   console.log(contents)
  
// })
// test('a valid note can be added ', async () => {
//   const newNote = {
//     content: 'async/await simplifies making async calls',
//     important: true,
//   }
//   await api
//     .post('/notes')
//     .send(newNote)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)
//   const response = await api.get('/notes')
//   const contents = response.body.map(r => r.content)
//   assert.strictEqual(response.body.length, helper.initialNotes.length +1 )
//   assert(contents.includes('async/await simplifies making async calls'))
// })
// test('a note can be accessed', async () => {
//   const data = await helper.notesInDb() 
//   const startingNote = data[0] 
//   const id = startingNote._id
//   console.log(id)
//   const result = await api
//     .get(`/notes/${id}`)  // Access the note by its id
//     .expect(200)  // Expect a 200 OK response
//     .expect('Content-Type', /application\/json/)

//   // Ensure the content of the note matches
//   assert.deepStrictEqual(result.body.content, startingNote.content)
// })
// test('a note can be deleted', async ()=>{
//   const data = await helper.notesInDb()
//   const firstNote = data[0]
//   const id = firstNote._id
//   await api
//     .delete(`/notes/${id}`)
//     .expect(204)
// })
// test('note without content is not added', async () => {
//   const newNote = {
//     important: true,
//   }

//   await api
//     .post('/notes')
//     .send(newNote)
//     .expect(400)

//   const notesAtEnd = await helper.notesInDb()

//   assert.strictEqual(notesAtEnd.length, helper.initialNotes.length )
// })



// Close the database connection after all tests

