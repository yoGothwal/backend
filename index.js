const express = require('express')
const app = express();
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const cors = require('cors')
app.use(cors())
app.use(express.json())
// const morgan = require('morgan');
// app.use(morgan('combined'));

const x = {name: "Yogendra", age : 24}
y = JSON.stringify(x, ["name"],2)
console.log(y)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
let notes = [
];
app.get('/notes', (req, res) => {
    res.json(notes);
});
app.post("/notes",(req, res)=>{
    const note = req.body
    notes = notes.concat(note);
    res.json(note)
})
app.delete("/notes/:id", (req, res)=>{
    const id = req.params.id;
    notes = notes.filter(note => note.id !== id);
    res.status(204).end()
})



app.get("/info", (req, res)=>{
    const requestTime = new Date().toLocaleString();
    const entryCount = persons.length
    res.json({
        message: `Phone bookhas ${entryCount} people`,
        time: requestTime
    })
    // res.send(
    //     `<div>
    //         <p>Phonebook has info for ${entryCount} people</p>
    //         <p>Request received at: ${requestTime}</p>
    //     </div>`
    // )
})
app.get("/persons",(req, res)=>{
    res.json(persons);
})
app.get("/persons/:id", (req, res)=>{
    const id = req.params.id;
    const person = persons.find(person=> person.id === id);
    if(person){
        res.json(person)
    }else{
        res.status(404).json({error: `person not found with id ${id}`})
    }
})
app.delete("/persons/:id" , (req, res)=>{
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id)
    res.status(204).end();
})
app.post("/api/persons",(req, res)=>{
    console.log(req.body)
    const id = persons.length > 0 ? Math.max(...persons.map(person => person.id)) + 1 : 1;
    const {name, number} = req.body;
    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }
    if(persons.some(p => p.number === number || p.name === name)){
        return res.status(400).json({ error: "Name or number are already taken" });
    }
    const person = {id, name, number}
    persons = persons.concat(person);
    res.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)