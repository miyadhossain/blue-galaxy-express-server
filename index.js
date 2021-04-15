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
  const bookingsCollection = client
    .db("logisticService")
    .collection("bookings");
  const reviewsCollection = client.db("logisticService").collection("reviews");

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

  // to read product by keys
  app.get("/book/:id", (req, res) => {
    servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  // order placed
  app.post("/addBookings", (req, res) => {
    const newBooking = req.body;
    bookingsCollection.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // user review
  app.post("/addReviews", (req, res) => {
    const newReview = req.body;
    reviewsCollection.insertOne(newReview).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // read or get reviews
  app.get("/reviews", (req, res) => {
    reviewsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  // get data by email query
  app.get("/bookings", (req, res) => {
    bookingsCollection
      .find({ email: req.query.email })
      .toArray((err, items) => {
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
