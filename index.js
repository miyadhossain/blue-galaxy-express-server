const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 9090;

// monogDB connection
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ube8o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const servicesCollection = client
    .db("logisticService")
    .collection("services");

  // post database
  app.post("/addService", (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService).then((result) => {
      console.log("Data insert", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  // read or get database
  app.get("/services", (req, res) => {
    servicesCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  console.log("MongoDB connect successfully");
});

app.get("/", (req, res) => {
  res.send("Welcome Express JS!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
