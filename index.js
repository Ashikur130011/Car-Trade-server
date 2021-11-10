const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 7000;
require("dotenv").config();

//middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tv45h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
    try{
        await client.connect();
        console.log('Database connected successfully');
        const database = client.db('CarTrade');
        const carsCollection = database.collection('cars')
        

        //get Cars api
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars)
            
            
        })
    }
    finally{
        //await client.close()
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome CarTrade");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
