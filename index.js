const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());


//user: frontEnd
//password: iBWh69CwBj2kapEq


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpvwzmp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)
async function run() {
    try {
        const usersCollection = client.db('nexisTask').collection('users')
        

        //for save users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result=await usersCollection.insertOne(user)
            res.send(result)

        })

        //for get users
        app.get('/users',async (req,res)=>{
            const query={}
            const result=await usersCollection.find(query).toArray()
            res.send(result)
        })

    }
    finally {

    }
} run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Frontend server is running')
})

app.listen(port, () => {
    console.log(`Frontend server is running on port ${port}`)
})

