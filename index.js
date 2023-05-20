const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n0q8wig.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("wonderToysDB").collection("toys");

    // get the toys data
    app.get("/allToys", async (req, res) => {
      const result = await toyCollection.find().limit(20).toArray();
      res.send(result);
    });

    // get specific toy data
    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    // get specific toy category data
    app.get("/toysCategory/:category", async (req, res) => {
      const category = req.params.category;
      if (
        category === "Monster Truck" ||
        category === "Regular Car" ||
        category === "Ambulance Car" ||
        category === "Police Car"
      ) {
        const result = await toyCollection
          .find({ sub_category: category })
          .toArray();
        return res.send(result);
      }
    });

    // post a toy data
    app.post("/addToy", async (req, res) => {
      const toy = req.body;
      const result = await toyCollection.insertOne(toy);
      res.send(result);
    });

    // get user toy data
    app.get("/myToys", async (req, res) => {
      const email = req.query.email;
      const query = { seller_email: email };
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    // update toy data
    app.patch("/updateToy/:id",async(req,res)=>{
      const id = req.params.id;
      const 
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("WonderToys is running");
});

app.listen(port, () => {
  console.log(`Wonderful cars are running on port: ${port}`);
});
