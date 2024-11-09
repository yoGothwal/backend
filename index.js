const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const password = process.env.DB_PASSWORD;

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? 3001 : 5000; // Development port 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const cors = require('cors');
app.use(cors());
app.use(express.json());

// MongoDB connection URL
const url = `mongodb+srv://gothwalyoge:${password}@cluster1.7euci.mongodb.net/imp4?retryWrites=true&w=majority&appName=Cluster1`;
mongoose.connect(url).then(() => {
  console.log("connected to MongoDB Atlas");
}).catch(err => {
  console.log('Connection Error:', err);
});

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);
const Note = mongoose.model('Note', noteSchema);

// Delete all notes and persons (if needed)
const deleteAll = async () => {
  try {
    await Note.deleteMany({});
    await Person.deleteMany({});
  } catch (error) {
    console.log(error);
  }
};

// API routes

// Get all notes
app.get('/notes', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

// Create a new note
app.post("/notes", async (req, res) => {
  const note = new Note(req.body);
  const savedNote = await note.save();
  res.json(savedNote);
});

// Delete a note by id
app.delete("/notes/:id", async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }
    try {
      const deletedNote = await Note.findByIdAndDelete(id);
      if (deletedNote) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: `Note not found with id ${id}` });
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "An error occurred while deleting the note" });
    }
  });

// Get information about the phone book (person count)
app.get("/info", async (req, res) => {
  const requestTime = new Date().toLocaleString();
  const entryCount = await Person.countDocuments({});
  res.json({
    message: `Phone book has ${entryCount} people`,
    time: requestTime
  });
});

// Get all persons
app.get("/persons", async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

// Get a person by id
app.get("/persons/:id", async (req, res) => {
  const id = req.params.id;
  const person = await Person.findById(id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: `Person not found with id ${id}` });
  }
});

// Delete a person by id
app.delete("/persons/:id", async (req, res) => {
    console.log("del r")
  const id = req.params.id; // MongoDB ObjectId
  try {
    const deletedPerson = await Person.findByIdAndDelete(id);
    if (deletedPerson) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: `Person not found with id ${id}` });
    }
  } catch (error) {
    console.error("Error deleting person:", error);
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Create a new person
app.post("/persons", async (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  // Check if name or number already exists
  const existingPerson = await Person.findOne({ $or: [{ name }, { number }] });
  if (existingPerson) {
    return res.status(400).json({ error: "Name or number already taken" });
  }

  const person = new Person({ name, number });
  const savedPerson = await person.save();
  res.json(savedPerson);
});

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
