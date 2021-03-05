const express = require('express');
const cors = require('cors');
// https://guarded-meadow-19744.herokuapp.com
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const { json } = require('body-parser');
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj2jz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const stripe = require("stripe")(process.env.DB_STRIPE);

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const homePageDataCollections = client.db("power-x_gym").collection("homePageAllData");
  const classSchedule = client.db("power-x_gym").collection("classSchedule");
  const coursesList = client.db("power-x_gym").collection("coursesList");
  const chooseCourseAndPricing = client.db("power-x_gym").collection("chooseCourseAndPricing");
  const usersRegistrationData = client.db("power-x_gym").collection("usersRegistrationData");
  // Post Home Page All Data
  app.post('/homePageData', (req, res) => {
    const homeData = req.body;
    homePageDataCollections.insertMany(homeData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
      .catch(function (err) {
        res.send({ message: err.message });
      });
  });
  // get Home Page All Data
  app.get('/homePageAllData', (req, res) => {
    homePageDataCollections.find({})
      .toArray((err, document) => {
        res.send(document)
      });
  });

  // Post Courses List all Data 
  app.post('/coursesList', (req, res) => {
    const coursesListData = req.body;
    coursesList.insertMany(coursesListData)
      .then(result => res.send(result.insertedCount > 0))
      .catch(function (err) {
        res.send({ message: err.message })
      })
  });

  // get Courses List all Data
  app.get('/coursesByData', (req, res) => {
    coursesList.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })

  // Post ClassSchedule Data  
  app.post('/classScheduleDetail', (req, res) => {
    const trainingDetail = req.body;
    classSchedule.insertMany(trainingDetail)
      .then(result => res.send(result.insertedCount > 0))
      .catch(function (err) {
        res.send({ message: err.message })
      })

  });
  // get ClassSchedule specific Data 
  app.get('/checkout:id', (req, res) => {
    const id = req.params.id;
    let specificId = parseFloat(id);
    classSchedule.find({ "id": specificId })
      .toArray((err, document) => {
        res.send(document);
      })

  });

  // get ClassSchedule specific Data
  app.get('/classScheduleSpecificData', (req, res) => {
    classSchedule.find({ "id": "1000876_9" })
      .toArray((err, document) => {
        res.send(document);
      })
  });

  //Choose Course And Pricing Plans
  app.post('/pricingPlans', (req, res) => {
    const chooseCourse = req.body;
    chooseCourseAndPricing.insertMany(chooseCourse)
      .then(result => res.send(result.insertedCount > 0))
      .catch(function (err) {
        res.send({ message: err.message })
      })
  });

  //get Choose Course And Pricing Plans
  app.get('/chooseCourseData', (req, res) => {
    chooseCourseAndPricing.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  });

  // Post users Registration Data 
  app.post('/personalDetail', (req, res) => {
    const userData = req.body;
    usersRegistrationData.insertOne(userData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

});

// stripe payment gateWay==========================>
app.post("/stripe/charge", cors(), async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "project Name: Power-x-gym",
      payment_method: id,
      confirm: true,
    });
    res.json({
      confirm: "Payment Successful",
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message,
      success: false,
    });
  }
});

app.get('/', (req, res) => {
  res.send('hello world mongodb working')
})

app.listen(process.env.PORT || port);
