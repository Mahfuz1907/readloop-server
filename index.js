import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

// --------------------------------------------------define express and port-----------------------------------------------
const app = express();
const port = 5000;

// ----------------------------------------------------middleware----------------------------------------------------------
app.use(cors());
app.use(express.json());

// ----------------------------------------------------mongodb connections--------------------------------------------------
const client = new MongoClient(process.env.MONOGDB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const database = mongoClient.db("readloop");

// ------------------------------------------------------get the collections------------------------------------------------
const usersCollections = database.collection("user");

// ------------------------------------------------------home route---------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Welcome to ReadLoop api!");
});

// --------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------only admin can access----------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------
app.get("/users", async (req, res) => {
  const users = await usersCollections.find({}).toArray();
  res.send(users);
});

// -----------------------------------------------------------app listening--------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
