const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

//mongodb initialize

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rh6ekch.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// mongodb start 
async function run(){
    try{
        const todolistCollection = client.db('toDoList').collection('toDoData');

        app.get('/listdata', async (req, res) => {
            const query = {};
            const cursor = todolistCollection.find(query);
            const data = await cursor.toArray();
            res.send(data);
        });

        app.get('/listdata/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = todolistCollection.find(query);
            res.send(cursor);
        });

        app.post('/listdata', async (req, res) => {
            const data = req.body;
            const result = await todolistCollection.insertOne(data);
            res.send(result)
        })

        app.delete('/listdata/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await todolistCollection.deleteOne(filter);
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(error => console.log(error));
// mongodb end 

app.get('/', async (req, res) => {
    res.send('todo list server running');
})

app.listen(port, () => {
    console.log(`server running on ${port}`);
});