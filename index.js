const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpvwzmp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function verifyJWT(req,res,next){
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).send('unauthorized access')
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded
        next();
    })
}
console.log(uri)
async function run() {
    try {
        const usersCollection = client.db('nexisTask').collection('users')


        //for save users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)

        })

        //applying jwt
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user=await usersCollection.findOne(query)
            if(user){
                const token=jwt.sign({email},process.env.ACCESS_TOKEN, {expiresIn: '7d'})
                return res.send({accessToken:token})
            }
            console.log(user)
            res.status(403).send({accessToken: ''})
        })

        //for get users
        app.get('/users', async (req, res) => {
            const query = { };
            const result = await usersCollection.find(query).toArray()
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

