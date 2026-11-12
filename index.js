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
const categoriesCollections = database.collection("categories");
const booksCollections = database.collection("books");

// ------------------------------------------------------home route---------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Welcome to ReadLoop api!");
});

// --------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------only admin can access----------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------

// get all users
app.get("/users", async (req, res) => {
  const users = await usersCollections.find({}).toArray();
  res.send(users);
});

// delete user
app.delete("/users/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await usersCollections.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// get users by role
app.get("/users/role/:role", async (req, res) => {
  const { role } = req.params;
  const users = await usersCollections.find({ role: role }).toArray();
  res.send(users);
});

// add category
app.post("/add-category", async (req, res) => {
  const category = req.body;
  const result = await categoriesCollections.insertOne(category);
  res.send(result);
});

// get category
app.get("/categories", async (req, res) => {
  const categories = await categoriesCollections.find({}).toArray();
  res.send(categories);
});

// edit category
app.put("/categories/edit/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updateDoc = {
    $set: updatedData,
  };
  const result = await categoriesCollections.updateOne(
    { _id: new ObjectId(id) },
    updateDoc,
  );
  res.send(result);
});

// delete category
app.delete("/categories/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await categoriesCollections.deleteOne({
    _id: new ObjectId(id),
  });
  res.send(result);
});

// add book
app.post("/add-book", async (req, res) => {
  const book = req.body;
  const result = await booksCollections.insertOne(book);
  res.send(result);
});

// --------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------only reader can access---------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------both can access----------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------

// get user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await usersCollections.findOne({ _id: new ObjectId(id) });
  res.send(user);
});

// get all books
app.get("/books", async (req, res) => {
  const result = await booksCollections.find({}).toArray();
  res.send(result);
});

// get featured books
app.get("/featured-books", async (req, res) => {
  const result = await booksCollections.find({}).limit(6).toArray();
  res.send(result);
});

// -----------------------------------------------------------app listening--------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
