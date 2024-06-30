// Using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   
// create an instence of express
const app = express();

// add middleware using Json data
app.use(express.json())
app.use(cors());

// Sample in-memory storage  for todo items
// let todos = [];


// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Define a route 
app.get('/', (req, res) => {
    res.send('Hell World')
})

// connecting MongoDB
mongoose.connect('mongodb+srv://yadu:Task1234todo@clustera.okp5qio.mongodb.net/?retryWrites=true&w=majority&appName=Mern')
    .then(() => {
        console.log(`DB connected!`);
    })
    .catch((err) => {
        console.log('Failed to connect to DB',err);
    })

// Create Schema (setup DB) 
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

// Creating Model
const todoModel = mongoose.model('Todo', todoSchema);


// create a new todo Item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;

    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);

    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }


})

// Get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }


})


// Update a todo item
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found!" });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})


// Delete a todo Item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})



// start the server

const port = 8000;
app.listen(port, () => {
    console.log('server listing to port' + port);
})