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
      console.log("Database connected successfully");
      const database = client.db("CarTrade");
      const carsCollection = database.collection("cars");
      const orderCollection = database.collection('orders')

      //get Cars api
      app.get("/cars", async (req, res) => {
        const cursor = carsCollection.find({});
        const cars = await cursor.toArray();
        res.send(cars);
      });

      //get single api
      app.get("/cars/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) };
        const singleCar = await carsCollection.findOne(query);
        res.send(singleCar);
      });

      // post car api
      app.post("/cars", async (req, res) => {
        const cursor = req.body;
        const result = await carsCollection.insertOne(cursor);
        res.json(result);
        console.log(result);
      })

      // Delete car api
      app.delete("/cars/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) };
        const order = await orderCollection.deleteOne(query);
        console.log(order);
        res.send(order);
      });

      //POST order API
      app.post("/orders", async (req, res) => {
        const cursor = req.body;
        const result = await orderCollection.insertOne(cursor);
        res.json(result);
      });
      //GET order API
      app.get("/orders", async (req, res) => {
        const cursor = orderCollection.find({});
        const order = await cursor.toArray(); 
        res.json(order);
      });

      // GET order API BY QUERY
      app.get("/orders/:email", async (req, res) => {
        const email = req.params.email;
        const query = { Email: email };
        const order = await orderCollection.find(query).toArray();
        res.json(order);
      });

      //DELETE order API
      app.delete("/orders/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) };
        const order = await orderCollection.deleteOne(query);
        console.log(order);
        res.send(order);
      });

      
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
